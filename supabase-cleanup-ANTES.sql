-- =========================================
-- LIMPIEZA COMPLETA ANTES DE INSTALAR
-- =========================================
-- Ejecutar PRIMERO en Supabase SQL Editor

-- Eliminar tabla y todo lo relacionado
DROP TABLE IF EXISTS collaboration_sessions CASCADE;

-- Eliminar índices huérfanos (si existen)
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

-- Eliminar de Realtime (por si estaba)
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS collaboration_sessions;

-- Verificar que todo fue eliminado
SELECT 
  'Tablas restantes:' as tipo,
  tablename 
FROM pg_tables 
WHERE tablename LIKE '%collaboration%';

SELECT 
  'Índices restantes:' as tipo,
  indexname 
FROM pg_indexes 
WHERE indexname LIKE '%session%';

-- Si aparece vacío = TODO LIMPIO ✅
