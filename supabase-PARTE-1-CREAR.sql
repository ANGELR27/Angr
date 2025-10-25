-- =========================================
-- PARTE 1: CREAR TODO (Sin verificaciones)
-- =========================================
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- =========================================
-- LIMPIEZA
-- =========================================

DROP TABLE IF EXISTS collaboration_sessions CASCADE;
DROP INDEX IF EXISTS idx_session_code CASCADE;
DROP INDEX IF EXISTS idx_owner_user CASCADE;
DROP INDEX IF EXISTS idx_is_active CASCADE;
DROP INDEX IF EXISTS idx_last_activity CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_session_activity() CASCADE;
DROP FUNCTION IF EXISTS cleanup_inactive_sessions() CASCADE;

-- =========================================
-- CREAR TABLA
-- =========================================

CREATE TABLE collaboration_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code TEXT UNIQUE NOT NULL,
  session_name TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  access_control TEXT DEFAULT 'public',
  password_hash TEXT,
  project_state JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  total_users INTEGER DEFAULT 1,
  total_edits INTEGER DEFAULT 0
);

-- =========================================
-- CREAR ÍNDICES
-- =========================================

CREATE INDEX idx_session_code ON collaboration_sessions(session_code);
CREATE INDEX idx_owner_user ON collaboration_sessions(owner_user_id);
CREATE INDEX idx_is_active ON collaboration_sessions(is_active);
CREATE INDEX idx_last_activity ON collaboration_sessions(last_activity_at DESC);

-- =========================================
-- CREAR FUNCIONES
-- =========================================

CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION cleanup_inactive_sessions()
RETURNS void AS $$
BEGIN
    UPDATE collaboration_sessions
    SET is_active = false
    WHERE last_activity_at < now() - INTERVAL '7 days'
      AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- CREAR TRIGGERS
-- =========================================

CREATE TRIGGER update_collaboration_sessions_updated_at
BEFORE UPDATE ON collaboration_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_activity_trigger
BEFORE UPDATE ON collaboration_sessions
FOR EACH ROW
WHEN (OLD.project_state IS DISTINCT FROM NEW.project_state)
EXECUTE FUNCTION update_session_activity();

-- =========================================
-- HABILITAR REALTIME
-- =========================================

ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_sessions;

-- =========================================
-- POLÍTICAS RLS
-- =========================================

ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_policy" ON collaboration_sessions
FOR SELECT USING (true);

CREATE POLICY "insert_policy" ON collaboration_sessions
FOR INSERT WITH CHECK (true);

CREATE POLICY "update_policy" ON collaboration_sessions
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "delete_policy" ON collaboration_sessions
FOR DELETE USING (true);

-- =========================================
-- INSERTAR DATOS DE PRUEBA
-- =========================================

INSERT INTO collaboration_sessions (
  session_code,
  session_name,
  owner_user_id,
  owner_name,
  project_state
) VALUES (
  'TEST1',
  'Sesión de Prueba',
  'user-test-123',
  'Usuario de Prueba',
  '{"files": {}, "images": []}'::jsonb
);

-- =========================================
-- FIN - Ahora ejecuta PARTE-2-VERIFICAR.sql
-- =========================================
