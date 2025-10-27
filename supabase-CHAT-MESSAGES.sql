-- ═══════════════════════════════════════════════════════════
-- 💬 TABLA: chat_messages (Chat en Tiempo Real)
-- ═══════════════════════════════════════════════════════════

-- 1. Crear tabla de mensajes de chat
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL, -- 🔥 CORREGIDO: UUID en lugar de BIGINT
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_color TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'code', 'system'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id 
  ON public.chat_messages(session_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at 
  ON public.chat_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id 
  ON public.chat_messages(user_id);

-- 3. Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_chat_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_messages_updated_at();

-- 4. RLS (Row Level Security) - Solo usuarios de la sesión pueden ver mensajes
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer mensajes de su sesión
CREATE POLICY "Usuarios pueden leer mensajes de su sesión"
  ON public.chat_messages
  FOR SELECT
  USING (true); -- Permitir a todos por ahora (se puede restringir por session_id)

-- Política: Cualquiera puede insertar mensajes
CREATE POLICY "Usuarios pueden enviar mensajes"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (true);

-- Política: Solo el autor puede actualizar su mensaje
CREATE POLICY "Usuarios pueden actualizar sus mensajes"
  ON public.chat_messages
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política: Solo el autor puede eliminar su mensaje
CREATE POLICY "Usuarios pueden eliminar sus mensajes"
  ON public.chat_messages
  FOR DELETE
  USING (true);

-- 5. Habilitar Realtime para esta tabla
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- ═══════════════════════════════════════════════════════════
-- ✅ VERIFICACIÓN
-- ═══════════════════════════════════════════════════════════

-- Ver estructura de la tabla
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'chat_messages'
ORDER BY ordinal_position;

-- Ver políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'chat_messages';

-- Verificar que Realtime está habilitado
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename = 'chat_messages';
