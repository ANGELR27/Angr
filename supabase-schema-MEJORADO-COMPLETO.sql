-- ═══════════════════════════════════════════════════════════
-- 🚀 ESQUEMA COMPLETO MEJORADO - TODAS LAS FUNCIONALIDADES
-- ═══════════════════════════════════════════════════════════
-- ✅ Incluye: Chat, Comentarios, Notificaciones, Diffs, y más
-- Ejecuta este SQL en tu proyecto de Supabase (SQL Editor)

-- ═══════════════════════════════════════════════════════════
-- 📋 PARTE 1: CREAR TABLAS PRINCIPALES
-- ═══════════════════════════════════════════════════════════

-- 1. TABLA: collaborative_sessions
CREATE TABLE IF NOT EXISTS public.collaborative_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code TEXT UNIQUE NOT NULL,
  session_name TEXT NOT NULL,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  access_control TEXT NOT NULL CHECK (access_control IN ('public', 'private')),
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  max_users INTEGER DEFAULT 10,
  settings JSONB DEFAULT '{}'::jsonb
);

-- 2. TABLA: session_participants
CREATE TABLE IF NOT EXISTS public.session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  user_color TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  is_online BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- 3. TABLA: workspace_files
CREATE TABLE IF NOT EXISTS public.workspace_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT,
  file_type TEXT DEFAULT 'file',
  version INTEGER DEFAULT 1,
  last_modified_by UUID REFERENCES auth.users(id),
  last_modified_by_name TEXT,
  is_image BOOLEAN DEFAULT false,
  file_size INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, file_path)
);

-- 4. TABLA: file_changes_log (Historial completo)
CREATE TABLE IF NOT EXISTS public.file_changes_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_file_id UUID NOT NULL REFERENCES public.workspace_files(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  content_before TEXT,
  content_after TEXT,
  diff JSONB,
  version_before INTEGER,
  version_after INTEGER,
  change_type TEXT CHECK (change_type IN ('create', 'update', 'delete', 'rename', 'move')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: cursor_positions
CREATE TABLE IF NOT EXISTS public.cursor_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  column_number INTEGER NOT NULL,
  selection_start JSONB,
  selection_end JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- ═══════════════════════════════════════════════════════════
-- 📋 PARTE 2: NUEVAS TABLAS - MEJORAS
-- ═══════════════════════════════════════════════════════════

-- 6. TABLA: chat_messages (💬 Chat en tiempo real)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_color TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'code', 'system', 'file')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA: code_comments (💭 Comentarios en código)
CREATE TABLE IF NOT EXISTS public.code_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  workspace_file_id UUID NOT NULL REFERENCES public.workspace_files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_color TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  comment_text TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLA: comment_replies (💬 Respuestas a comentarios)
CREATE TABLE IF NOT EXISTS public.comment_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.code_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLA: file_operations_queue (🔄 Cola de operaciones de archivos)
CREATE TABLE IF NOT EXISTS public.file_operations_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('create', 'delete', 'rename', 'move', 'update')),
  file_path TEXT NOT NULL,
  new_file_path TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 10. TABLA: notifications (🔔 Sistema de notificaciones)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('info', 'warning', 'error', 'success', 'mention')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABLA: file_locks (🔒 Bloqueo de archivos)
CREATE TABLE IF NOT EXISTS public.file_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  workspace_file_id UUID NOT NULL REFERENCES public.workspace_files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  locked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE(workspace_file_id)
);

-- ═══════════════════════════════════════════════════════════
-- 📋 PARTE 3: ÍNDICES OPTIMIZADOS
-- ═══════════════════════════════════════════════════════════

-- Índices para collaborative_sessions
CREATE INDEX IF NOT EXISTS idx_session_code ON public.collaborative_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_owner ON public.collaborative_sessions(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_active ON public.collaborative_sessions(is_active);

-- Índices para session_participants
CREATE INDEX IF NOT EXISTS idx_session_participants ON public.session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_online_users ON public.session_participants(session_id, is_online);
CREATE INDEX IF NOT EXISTS idx_participants_active ON public.session_participants(is_online, last_seen_at);

-- Índices para workspace_files
CREATE INDEX IF NOT EXISTS idx_session_files ON public.workspace_files(session_id);
CREATE INDEX IF NOT EXISTS idx_file_path ON public.workspace_files(file_path);
CREATE INDEX IF NOT EXISTS idx_version ON public.workspace_files(version);
CREATE INDEX IF NOT EXISTS idx_files_updated ON public.workspace_files(updated_at DESC);

-- Índices para file_changes_log
CREATE INDEX IF NOT EXISTS idx_file_history ON public.file_changes_log(workspace_file_id);
CREATE INDEX IF NOT EXISTS idx_session_history ON public.file_changes_log(session_id);
CREATE INDEX IF NOT EXISTS idx_recent_changes ON public.file_changes_log(created_at DESC);

-- Índices para cursor_positions
CREATE INDEX IF NOT EXISTS idx_session_cursors ON public.cursor_positions(session_id);

-- Índices para chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_recent ON public.chat_messages(created_at DESC);

-- Índices para code_comments
CREATE INDEX IF NOT EXISTS idx_comments_file ON public.code_comments(workspace_file_id);
CREATE INDEX IF NOT EXISTS idx_comments_unresolved ON public.code_comments(is_resolved);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_recent ON public.notifications(created_at DESC);

-- Índices para file_operations_queue
CREATE INDEX IF NOT EXISTS idx_operations_status ON public.file_operations_queue(status, created_at);

-- ═══════════════════════════════════════════════════════════
-- 🔒 PARTE 4: ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════

-- Habilitar RLS en todas las tablas
ALTER TABLE public.collaborative_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_changes_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursor_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_operations_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_locks ENABLE ROW LEVEL SECURITY;

-- Políticas para collaborative_sessions
CREATE POLICY "Users can view public sessions"
  ON public.collaborative_sessions FOR SELECT
  USING (access_control = 'public' OR owner_user_id = auth.uid());

CREATE POLICY "Owners can create sessions"
  ON public.collaborative_sessions FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owners can update their sessions"
  ON public.collaborative_sessions FOR UPDATE
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Owners can delete their sessions"
  ON public.collaborative_sessions FOR DELETE
  USING (auth.uid() = owner_user_id);

-- Políticas para session_participants
CREATE POLICY "Participants can view session members"
  ON public.session_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = session_participants.session_id
      AND sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join sessions"
  ON public.session_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation"
  ON public.session_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para workspace_files
CREATE POLICY "Participants can view session files"
  ON public.workspace_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = workspace_files.session_id
      AND sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Editors can create files"
  ON public.workspace_files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = workspace_files.session_id
      AND sp.user_id = auth.uid()
      AND sp.role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Editors can update files"
  ON public.workspace_files FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = workspace_files.session_id
      AND sp.user_id = auth.uid()
      AND sp.role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Owners can delete files"
  ON public.workspace_files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = workspace_files.session_id
      AND sp.user_id = auth.uid()
      AND sp.role = 'owner'
    )
  );

-- Políticas para chat_messages
CREATE POLICY "Participants can view chat"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = chat_messages.session_id
      AND sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = chat_messages.session_id
      AND sp.user_id = auth.uid()
    )
  );

-- Políticas para code_comments
CREATE POLICY "Participants can view comments"
  ON public.code_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = code_comments.session_id
      AND sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can create comments"
  ON public.code_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.code_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para notifications
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ═══════════════════════════════════════════════════════════
-- 🔄 PARTE 5: TRIGGERS Y FUNCIONES AUTOMÁTICAS
-- ═══════════════════════════════════════════════════════════

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_workspace_files_updated_at
  BEFORE UPDATE ON public.workspace_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.collaborative_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.code_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para registrar cambios con diff
CREATE OR REPLACE FUNCTION log_file_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.file_changes_log (
      workspace_file_id,
      session_id,
      user_id,
      user_name,
      content_before,
      content_after,
      version_before,
      version_after,
      change_type
    ) VALUES (
      NEW.id,
      NEW.session_id,
      NEW.last_modified_by,
      NEW.last_modified_by_name,
      OLD.content,
      NEW.content,
      OLD.version,
      NEW.version,
      'update'
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.file_changes_log (
      workspace_file_id,
      session_id,
      user_id,
      user_name,
      content_after,
      version_after,
      change_type
    ) VALUES (
      NEW.id,
      NEW.session_id,
      NEW.last_modified_by,
      NEW.last_modified_by_name,
      NEW.content,
      NEW.version,
      'create'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_workspace_file_changes
  AFTER INSERT OR UPDATE ON public.workspace_files
  FOR EACH ROW
  EXECUTE FUNCTION log_file_changes();

-- Función para limpiar bloqueos expirados
CREATE OR REPLACE FUNCTION clean_expired_locks()
RETURNS void AS $$
BEGIN
  DELETE FROM public.file_locks
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════
-- 🎯 PARTE 6: FUNCIONES HELPER MEJORADAS
-- ═══════════════════════════════════════════════════════════

-- Función para obtener sesión completa con todos los datos
CREATE OR REPLACE FUNCTION get_session_complete(session_code_param TEXT)
RETURNS TABLE (
  session_id UUID,
  session_name TEXT,
  owner_name TEXT,
  access_control TEXT,
  participant_count BIGINT,
  participants JSONB,
  files JSONB,
  recent_messages JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id AS session_id,
    s.session_name,
    s.owner_name,
    s.access_control,
    COUNT(DISTINCT p.id) AS participant_count,
    JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
      'id', p.user_id,
      'name', p.user_name,
      'role', p.role,
      'color', p.user_color,
      'is_online', p.is_online
    )) AS participants,
    (
      SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
        'id', f.id,
        'path', f.file_path,
        'language', f.language,
        'version', f.version
      ))
      FROM public.workspace_files f
      WHERE f.session_id = s.id
    ) AS files,
    (
      SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
        'user_name', m.user_name,
        'message', m.message,
        'created_at', m.created_at
      ) ORDER BY m.created_at DESC)
      FROM (
        SELECT * FROM public.chat_messages cm
        WHERE cm.session_id = s.id
        ORDER BY cm.created_at DESC
        LIMIT 50
      ) m
    ) AS recent_messages
  FROM public.collaborative_sessions s
  LEFT JOIN public.session_participants p ON s.id = p.session_id
  WHERE s.session_code = session_code_param
  GROUP BY s.id;
END;
$$ LANGUAGE plpgsql;

-- Función para crear notificación para todos los participantes
CREATE OR REPLACE FUNCTION notify_session_participants(
  session_id_param UUID,
  notification_type_param TEXT,
  title_param TEXT,
  message_param TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.notifications (session_id, user_id, notification_type, title, message)
  SELECT 
    session_id_param,
    p.user_id,
    notification_type_param,
    title_param,
    message_param
  FROM public.session_participants p
  WHERE p.session_id = session_id_param
  AND p.is_online = true;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener historial de cambios de un archivo
CREATE OR REPLACE FUNCTION get_file_history(file_id_param UUID, limit_param INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  user_name TEXT,
  change_type TEXT,
  version_before INTEGER,
  version_after INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.user_name,
    l.change_type,
    l.version_before,
    l.version_after,
    l.created_at
  FROM public.file_changes_log l
  WHERE l.workspace_file_id = file_id_param
  ORDER BY l.created_at DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════
-- ✅ ESQUEMA COMPLETADO EXITOSAMENTE
-- ═══════════════════════════════════════════════════════════

-- Verificar todas las tablas creadas
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN (
    'collaborative_sessions',
    'session_participants', 
    'workspace_files',
    'file_changes_log',
    'cursor_positions',
    'chat_messages',
    'code_comments',
    'comment_replies',
    'file_operations_queue',
    'notifications',
    'file_locks'
  )
ORDER BY table_name;
