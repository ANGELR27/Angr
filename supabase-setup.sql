-- Script SQL para configurar Supabase para colaboración en tiempo real
-- Ejecuta esto en tu panel de Supabase: SQL Editor

-- Crear tabla para sesiones de colaboración
CREATE TABLE IF NOT EXISTS collaboration_sessions (
  id BIGSERIAL PRIMARY KEY,
  session_id VARCHAR(50) UNIQUE NOT NULL,
  owner_id UUID NOT NULL,
  project_state JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda rápida por session_id
CREATE INDEX IF NOT EXISTS idx_session_id ON collaboration_sessions(session_id);

-- Habilitar Row Level Security
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer sesiones (para colaboración pública)
CREATE POLICY "Anyone can read sessions"
  ON collaboration_sessions
  FOR SELECT
  USING (true);

-- Política: Cualquiera puede insertar sesiones (para crear nuevas)
CREATE POLICY "Anyone can insert sessions"
  ON collaboration_sessions
  FOR INSERT
  WITH CHECK (true);

-- Política: Solo el owner puede actualizar su sesión
CREATE POLICY "Owner can update their session"
  ON collaboration_sessions
  FOR UPDATE
  USING (owner_id::text = auth.uid()::text OR true); -- Permitir a todos mientras desarrollamos

-- Política: Solo el owner puede eliminar su sesión
CREATE POLICY "Owner can delete their session"
  ON collaboration_sessions
  FOR DELETE
  USING (owner_id::text = auth.uid()::text OR true); -- Permitir a todos mientras desarrollamos

-- Función para limpiar sesiones antiguas (más de 24 horas)
CREATE OR REPLACE FUNCTION clean_old_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM collaboration_sessions
  WHERE updated_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- NOTA: Para producción, deberías configurar un cron job para ejecutar clean_old_sessions() periódicamente
-- O ejecutar manualmente: SELECT clean_old_sessions();

-- Verificar que todo se creó correctamente
SELECT 'Tabla collaboration_sessions creada exitosamente' AS status;
SELECT COUNT(*) AS total_sessions FROM collaboration_sessions;
