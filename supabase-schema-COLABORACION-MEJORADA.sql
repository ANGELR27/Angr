-- =========================================
-- SCHEMA PARA COLABORACIÓN EN TIEMPO REAL
-- =========================================
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Proyecto: ncomvnldhsclwxktegsx.supabase.co

-- Limpiar si existe (solo para desarrollo)
DROP TABLE IF EXISTS collaboration_sessions CASCADE;

-- =========================================
-- TABLA PRINCIPAL: collaboration_sessions
-- =========================================
CREATE TABLE collaboration_sessions (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code TEXT UNIQUE NOT NULL,
  
  -- Información de la sesión
  session_name TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  
  -- Control de acceso
  access_control TEXT DEFAULT 'public' CHECK (access_control IN ('public', 'private', 'invite-only')),
  password_hash TEXT,
  
  -- Estado del proyecto (archivos, imágenes, etc.)
  project_state JSONB DEFAULT '{}'::jsonb,
  
  -- Metadatos
  is_active BOOLEAN DEFAULT true,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Estadísticas
  total_users INTEGER DEFAULT 1,
  total_edits INTEGER DEFAULT 0
);

-- =========================================
-- ÍNDICES PARA BÚSQUEDA RÁPIDA
-- =========================================
CREATE INDEX idx_session_code ON collaboration_sessions(session_code);
CREATE INDEX idx_owner_user ON collaboration_sessions(owner_user_id);
CREATE INDEX idx_is_active ON collaboration_sessions(is_active);
CREATE INDEX idx_last_activity ON collaboration_sessions(last_activity_at DESC);

-- =========================================
-- FUNCIÓN: Actualizar timestamp automáticamente
-- =========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- TRIGGER: Auto-actualizar updated_at
-- =========================================
CREATE TRIGGER update_collaboration_sessions_updated_at
BEFORE UPDATE ON collaboration_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- FUNCIÓN: Actualizar last_activity_at
-- =========================================
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- TRIGGER: Auto-actualizar actividad
-- =========================================
CREATE TRIGGER update_session_activity_trigger
BEFORE UPDATE ON collaboration_sessions
FOR EACH ROW
WHEN (OLD.project_state IS DISTINCT FROM NEW.project_state)
EXECUTE FUNCTION update_session_activity();

-- =========================================
-- FUNCIÓN: Limpiar sesiones inactivas (>7 días)
-- =========================================
CREATE OR REPLACE FUNCTION cleanup_inactive_sessions()
RETURNS void AS $$
BEGIN
    UPDATE collaboration_sessions
    SET is_active = false
    WHERE last_activity_at < now() - INTERVAL '7 days'
      AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- HABILITAR REALTIME (CRÍTICO)
-- =========================================
-- Esto permite escuchar cambios en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_sessions;

-- =========================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =========================================
-- Habilitar Row Level Security
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer sesiones públicas
CREATE POLICY "Lectura pública de sesiones públicas"
ON collaboration_sessions
FOR SELECT
USING (access_control = 'public' OR access_control = 'invite-only');

-- Política: Cualquiera puede crear sesiones
CREATE POLICY "Crear sesión"
ON collaboration_sessions
FOR INSERT
WITH CHECK (true);

-- Política: Solo el owner puede actualizar
CREATE POLICY "Actualizar sesión (owner)"
ON collaboration_sessions
FOR UPDATE
USING (true) -- Por ahora permitimos a todos (sin auth)
WITH CHECK (true);

-- Política: Solo el owner puede eliminar
CREATE POLICY "Eliminar sesión (owner)"
ON collaboration_sessions
FOR DELETE
USING (true); -- Por ahora permitimos a todos

-- =========================================
-- DATOS DE PRUEBA (OPCIONAL)
-- =========================================
-- Insertar sesión de ejemplo para testing
INSERT INTO collaboration_sessions (
  session_code,
  session_name,
  owner_user_id,
  owner_name,
  access_control,
  project_state
) VALUES (
  'test1',
  'Sesión de Prueba',
  'user-test-123',
  'Usuario de Prueba',
  'public',
  '{"files": {"index.html": {"type": "file", "content": "<!DOCTYPE html>", "language": "html"}}, "images": []}'::jsonb
) ON CONFLICT (session_code) DO NOTHING;

-- =========================================
-- VERIFICACIÓN
-- =========================================
-- Verificar que la tabla fue creada
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'collaboration_sessions'
ORDER BY ordinal_position;

-- Verificar políticas de seguridad
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'collaboration_sessions';

-- =========================================
-- INSTRUCCIONES
-- =========================================
-- 1. Copia este archivo completo
-- 2. Ve a Supabase Dashboard: https://supabase.com/dashboard
-- 3. Selecciona tu proyecto: ncomvnldhsclwxktegsx
-- 4. Ve a SQL Editor (en el menú lateral)
-- 5. Pega todo este código
-- 6. Haz click en "Run" o Ctrl+Enter
-- 7. Verifica que se ejecutó sin errores
-- 8. ¡Listo! La tabla está creada y Realtime habilitado

-- =========================================
-- TROUBLESHOOTING
-- =========================================
-- Si hay errores de permisos:
-- GRANT ALL ON collaboration_sessions TO postgres;
-- GRANT ALL ON collaboration_sessions TO anon;
-- GRANT ALL ON collaboration_sessions TO authenticated;

-- Si Realtime no funciona:
-- ALTER PUBLICATION supabase_realtime DROP TABLE collaboration_sessions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_sessions;
