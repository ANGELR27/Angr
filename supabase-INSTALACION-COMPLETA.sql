-- =========================================
-- INSTALACIÓN COMPLETA - TODO EN UNO
-- =========================================
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Proyecto: ncomvnldhsclwxktegsx.supabase.co

-- =========================================
-- PASO 1: LIMPIEZA COMPLETA
-- =========================================

-- Eliminar tabla y todo lo relacionado
DROP TABLE IF EXISTS collaboration_sessions CASCADE;

-- Eliminar índices huérfanos
DROP INDEX IF EXISTS idx_session_code;
DROP INDEX IF EXISTS idx_owner_user;
DROP INDEX IF EXISTS idx_is_active;
DROP INDEX IF EXISTS idx_last_activity;

-- Eliminar funciones
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_session_activity() CASCADE;
DROP FUNCTION IF EXISTS cleanup_inactive_sessions() CASCADE;

-- Eliminar triggers
DROP TRIGGER IF EXISTS update_collaboration_sessions_updated_at ON collaboration_sessions;
DROP TRIGGER IF EXISTS update_session_activity_trigger ON collaboration_sessions;

-- Eliminar de Realtime
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS collaboration_sessions;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- =========================================
-- PASO 2: CREAR TABLA
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
-- PASO 3: CREAR ÍNDICES
-- =========================================

CREATE INDEX idx_session_code ON collaboration_sessions(session_code);
CREATE INDEX idx_owner_user ON collaboration_sessions(owner_user_id);
CREATE INDEX idx_is_active ON collaboration_sessions(is_active);
CREATE INDEX idx_last_activity ON collaboration_sessions(last_activity_at DESC);

-- =========================================
-- PASO 4: FUNCIONES Y TRIGGERS
-- =========================================

-- Función: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-actualizar updated_at
CREATE TRIGGER update_collaboration_sessions_updated_at
BEFORE UPDATE ON collaboration_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Función: Actualizar last_activity_at
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-actualizar actividad
CREATE TRIGGER update_session_activity_trigger
BEFORE UPDATE ON collaboration_sessions
FOR EACH ROW
WHEN (OLD.project_state IS DISTINCT FROM NEW.project_state)
EXECUTE FUNCTION update_session_activity();

-- Función: Limpiar sesiones inactivas (>7 días)
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
-- PASO 5: HABILITAR REALTIME (CRÍTICO)
-- =========================================

ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_sessions;

-- =========================================
-- PASO 6: POLÍTICAS DE SEGURIDAD (RLS)
-- =========================================

-- Habilitar Row Level Security
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública de sesiones públicas
CREATE POLICY "Lectura pública de sesiones públicas"
ON collaboration_sessions
FOR SELECT
USING (access_control = 'public' OR access_control = 'invite-only');

-- Política: Cualquiera puede crear sesiones
CREATE POLICY "Crear sesión"
ON collaboration_sessions
FOR INSERT
WITH CHECK (true);

-- Política: Actualizar sesión
CREATE POLICY "Actualizar sesión"
ON collaboration_sessions
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Política: Eliminar sesión
CREATE POLICY "Eliminar sesión"
ON collaboration_sessions
FOR DELETE
USING (true);

-- =========================================
-- PASO 7: DATOS DE PRUEBA
-- =========================================

INSERT INTO collaboration_sessions (
  session_code,
  session_name,
  owner_user_id,
  owner_name,
  access_control,
  project_state
) VALUES (
  'TEST1',
  'Sesión de Prueba',
  'user-test-123',
  'Usuario de Prueba',
  'public',
  '{"files": {"index.html": {"type": "file", "content": "<!DOCTYPE html><html><body><h1>Test</h1></body></html>", "language": "html"}}, "images": []}'::jsonb
) ON CONFLICT (session_code) DO NOTHING;

-- =========================================
-- PASO 8: VERIFICACIÓN FINAL
-- =========================================

-- Verificar tabla
SELECT 
  '✅ TABLA CREADA' as status,
  count(*) as total_columns 
FROM information_schema.columns 
WHERE table_name = 'collaboration_sessions';

-- Verificar índices
SELECT 
  '✅ ÍNDICES CREADOS' as status,
  count(*) as total_indices
FROM pg_indexes 
WHERE tablename = 'collaboration_sessions';

-- Verificar funciones
SELECT 
  '✅ FUNCIONES CREADAS' as status,
  count(*) as total_functions
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname LIKE '%session%';

-- Verificar políticas RLS
SELECT 
  '✅ POLÍTICAS RLS CREADAS' as status,
  count(*) as total_policies
FROM pg_policies
WHERE tablename = 'collaboration_sessions';

-- Verificar sesión de prueba
SELECT 
  '✅ SESIÓN DE PRUEBA' as status,
  session_code,
  session_name
FROM collaboration_sessions
WHERE session_code = 'TEST1';

-- =========================================
-- ✅ INSTALACIÓN COMPLETA
-- =========================================
-- Si ves todos los ✅ arriba, TODO ESTÁ LISTO!
-- 
-- Próximos pasos:
-- 1. Ve a Table Editor y verifica que existe "collaboration_sessions"
-- 2. Prueba crear una sesión desde tu app
-- 3. Verifica que Realtime funciona
-- 
-- ¡Listo para colaborar! 🚀
