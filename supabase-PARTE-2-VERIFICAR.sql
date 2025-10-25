-- =========================================
-- PARTE 2: VERIFICAR QUE TODO FUNCIONA
-- =========================================
-- Ejecutar DESPUÉS de PARTE-1-CREAR.sql

-- Verificar tabla
SELECT 
  'TABLA' as tipo,
  table_name,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'collaboration_sessions') as columnas
FROM information_schema.tables 
WHERE table_name = 'collaboration_sessions';

-- Verificar índices
SELECT 
  'ÍNDICE' as tipo,
  indexname
FROM pg_indexes 
WHERE tablename = 'collaboration_sessions';

-- Verificar funciones
SELECT 
  'FUNCIÓN' as tipo,
  proname as nombre
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND (
    proname = 'update_updated_at_column' OR
    proname = 'update_session_activity' OR
    proname = 'cleanup_inactive_sessions'
  );

-- Verificar triggers
SELECT 
  'TRIGGER' as tipo,
  trigger_name
FROM information_schema.triggers
WHERE event_object_table = 'collaboration_sessions';

-- Verificar políticas RLS
SELECT 
  'POLÍTICA' as tipo,
  policyname
FROM pg_policies
WHERE tablename = 'collaboration_sessions';

-- Verificar datos de prueba
SELECT 
  'DATOS' as tipo,
  session_code,
  session_name,
  owner_name
FROM collaboration_sessions;

-- =========================================
-- RESULTADO ESPERADO:
-- =========================================
-- TABLA: collaboration_sessions (11 columnas)
-- ÍNDICES: 4 índices
-- FUNCIONES: 3 funciones
-- TRIGGERS: 2 triggers
-- POLÍTICAS: 4 políticas
-- DATOS: 1 sesión de prueba (TEST1)
-- =========================================
