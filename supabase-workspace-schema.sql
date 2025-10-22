-- ═══════════════════════════════════════════════════════════
-- 🚀 ESQUEMA COMPLETO PARA WORKSPACE COLABORATIVO REMOTO
-- ═══════════════════════════════════════════════════════════
-- Ejecuta este SQL en tu proyecto de Supabase (SQL Editor)

-- 1. TABLA: collaborative_sessions
-- Almacena las sesiones colaborativas activas
CREATE TABLE IF NOT EXISTS public.collaborative_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code TEXT UNIQUE NOT NULL, -- Código corto para compartir (ej: "76ec5")
  session_name TEXT NOT NULL,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  access_control TEXT NOT NULL CHECK (access_control IN ('public', 'private')),
  password_hash TEXT, -- Hash de contraseña si es privada
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Sesión expira después de X tiempo
  max_users INTEGER DEFAULT 10, -- Límite de usuarios simultáneos
  
  -- Índices para búsquedas rápidas
  INDEX idx_session_code (session_code),
  INDEX idx_owner (owner_user_id),
  INDEX idx_active (is_active)
);

-- 2. TABLA: session_participants
-- Usuarios conectados a cada sesión
CREATE TABLE IF NOT EXISTS public.session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  user_color TEXT NOT NULL, -- Color del cursor/selección
  role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  is_online BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Un usuario puede estar en múltiples sesiones pero no duplicado en la misma
  UNIQUE(session_id, user_id),
  
  INDEX idx_session_participants (session_id),
  INDEX idx_online_users (session_id, is_online)
);

-- 3. TABLA: workspace_files (🔥 SINGLE SOURCE OF TRUTH)
-- Archivos del proyecto - TODOS editan aquí
CREATE TABLE IF NOT EXISTS public.workspace_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL, -- Ruta completa: "index.html", "components/header.jsx"
  content TEXT NOT NULL, -- Contenido del archivo
  language TEXT, -- html, css, javascript, etc.
  file_type TEXT DEFAULT 'file', -- file, directory
  version INTEGER DEFAULT 1, -- Versionado optimista
  last_modified_by UUID REFERENCES auth.users(id),
  last_modified_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Un archivo por sesión (único)
  UNIQUE(session_id, file_path),
  
  INDEX idx_session_files (session_id),
  INDEX idx_file_path (file_path),
  INDEX idx_version (version)
);

-- 4. TABLA: file_changes_log (Historial de cambios)
-- Para auditoría y posible "undo/redo"
CREATE TABLE IF NOT EXISTS public.file_changes_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_file_id UUID NOT NULL REFERENCES public.workspace_files(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  content_before TEXT,
  content_after TEXT,
  version_before INTEGER,
  version_after INTEGER,
  change_type TEXT CHECK (change_type IN ('create', 'update', 'delete')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_file_history (workspace_file_id),
  INDEX idx_session_history (session_id),
  INDEX idx_recent_changes (created_at DESC)
);

-- 5. TABLA: cursor_positions (Posiciones de cursores en tiempo real)
-- Para mostrar dónde está cada usuario
CREATE TABLE IF NOT EXISTS public.cursor_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  column INTEGER NOT NULL,
  selection_start JSONB, -- {line: 1, column: 5}
  selection_end JSONB, -- {line: 3, column: 10}
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Un cursor por usuario por sesión
  UNIQUE(session_id, user_id),
  
  INDEX idx_session_cursors (session_id)
);

-- ═══════════════════════════════════════════════════════════
-- 🔒 ROW LEVEL SECURITY (RLS) - Seguridad a nivel de fila
-- ═══════════════════════════════════════════════════════════

-- Habilitar RLS en todas las tablas
ALTER TABLE public.collaborative_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_changes_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursor_positions ENABLE ROW LEVEL SECURITY;

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

-- Políticas para cursor_positions
CREATE POLICY "Participants can view cursors"
  ON public.cursor_positions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = cursor_positions.session_id
      AND sp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their cursor"
  ON public.cursor_positions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their cursor position"
  ON public.cursor_positions FOR UPDATE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- 🔄 TRIGGERS Y FUNCIONES
-- ═══════════════════════════════════════════════════════════

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para workspace_files
CREATE TRIGGER update_workspace_files_updated_at
  BEFORE UPDATE ON public.workspace_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para collaborative_sessions
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.collaborative_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para registrar cambios automáticamente
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

-- Trigger para log automático
CREATE TRIGGER log_workspace_file_changes
  AFTER INSERT OR UPDATE ON public.workspace_files
  FOR EACH ROW
  EXECUTE FUNCTION log_file_changes();

-- Función para limpiar sesiones expiradas (ejecutar periódicamente)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.collaborative_sessions
  WHERE expires_at < NOW() AND is_active = false;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════
-- 🎯 FUNCIONES HELPER PARA LA APLICACIÓN
-- ═══════════════════════════════════════════════════════════

-- Función para obtener sesión con participantes
CREATE OR REPLACE FUNCTION get_session_with_participants(session_code_param TEXT)
RETURNS TABLE (
  session_id UUID,
  session_name TEXT,
  owner_name TEXT,
  access_control TEXT,
  participant_count BIGINT,
  participants JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id AS session_id,
    s.session_name,
    s.owner_name,
    s.access_control,
    COUNT(p.id) AS participant_count,
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'id', p.user_id,
        'name', p.user_name,
        'role', p.role,
        'color', p.user_color,
        'is_online', p.is_online
      )
    ) AS participants
  FROM public.collaborative_sessions s
  LEFT JOIN public.session_participants p ON s.id = p.session_id
  WHERE s.session_code = session_code_param
  GROUP BY s.id;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════
-- 📊 ÍNDICES ADICIONALES PARA PERFORMANCE
-- ═══════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_files_updated ON public.workspace_files(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_changes_recent ON public.file_changes_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_participants_active ON public.session_participants(is_online, last_seen_at);

-- ═══════════════════════════════════════════════════════════
-- ✅ SCHEMA CREADO EXITOSAMENTE
-- ═══════════════════════════════════════════════════════════

-- Verificación de tablas creadas
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
    'cursor_positions'
  )
ORDER BY table_name;
