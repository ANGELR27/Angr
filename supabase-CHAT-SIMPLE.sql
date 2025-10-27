-- ═══════════════════════════════════════════════════════════
-- 💬 CHAT MESSAGES - VERSIÓN SIMPLE SIN FOREIGN KEYS
-- ═══════════════════════════════════════════════════════════

-- 1. CREAR TABLA (sin foreign key para evitar conflictos)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL,  -- ID de la sesión (sin FK)
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_color TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ÍNDICES para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id 
  ON public.chat_messages(session_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at 
  ON public.chat_messages(created_at DESC);

-- 3. HABILITAR RLS (Row Level Security)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura a todos
CREATE POLICY "chat_read_policy" ON public.chat_messages
  FOR SELECT USING (true);

-- Política: Permitir inserción a todos
CREATE POLICY "chat_insert_policy" ON public.chat_messages
  FOR INSERT WITH CHECK (true);

-- 4. HABILITAR REALTIME (esto es lo más importante)
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- ═══════════════════════════════════════════════════════════
-- ✅ VERIFICAR que funcionó
-- ═══════════════════════════════════════════════════════════

-- Ver la tabla creada
\d chat_messages;

-- Verificar Realtime
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
  AND tablename = 'chat_messages';
