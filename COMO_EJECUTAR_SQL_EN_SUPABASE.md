# 🚀 Cómo Ejecutar el SQL en Supabase

## ❌ Error Anterior

El archivo `supabase-workspace-schema.sql` tenía errores de sintaxis porque los índices estaban mal definidos dentro de CREATE TABLE.

## ✅ Solución

Usa el archivo **CORREGIDO**: `supabase-schema-CORREGIDO.sql`

---

## 📋 Pasos para Ejecutar

### Paso 1: Abrir SQL Editor en Supabase

1. Ve a tu proyecto en Supabase
2. Menú lateral → **SQL Editor**
3. Clic en **"New query"**

### Paso 2: Copiar el SQL Corregido

1. Abre el archivo: `supabase-schema-CORREGIDO.sql`
2. **Selecciona TODO** (Ctrl + A)
3. **Copia** (Ctrl + C)

### Paso 3: Pegar y Ejecutar

1. En el SQL Editor de Supabase
2. **Pega** el código (Ctrl + V)
3. Clic en **"Run"** o presiona `Ctrl + Enter`

### Paso 4: Verificar Éxito

Deberías ver en la parte inferior:

```
Success. No rows returned
```

Y una tabla con:
```
table_name                | column_count
--------------------------+-------------
collaborative_sessions    | 11
cursor_positions          | 9
file_changes_log          | 11
session_participants      | 10
workspace_files           | 11
```

---

## 🔧 Si Aún Sale Error

### Opción A: Ejecutar en Partes

Si el SQL completo da error, ejecuta en **5 partes separadas**:

#### Parte 1: Crear Tablas (Líneas 1-104)
```sql
-- Solo las 5 tablas sin índices ni políticas
CREATE TABLE IF NOT EXISTS public.collaborative_sessions (...);
CREATE TABLE IF NOT EXISTS public.session_participants (...);
CREATE TABLE IF NOT EXISTS public.workspace_files (...);
CREATE TABLE IF NOT EXISTS public.file_changes_log (...);
CREATE TABLE IF NOT EXISTS public.cursor_positions (...);
```

Ejecuta → Verifica que no haya errores

#### Parte 2: Crear Índices (Líneas 105-130)
```sql
CREATE INDEX IF NOT EXISTS idx_session_code ON ...
CREATE INDEX IF NOT EXISTS idx_owner ON ...
-- ... todos los índices
```

Ejecuta → Verifica

#### Parte 3: Habilitar RLS (Líneas 131-140)
```sql
ALTER TABLE public.collaborative_sessions ENABLE ROW LEVEL SECURITY;
-- ...
```

Ejecuta → Verifica

#### Parte 4: Crear Políticas (Líneas 141-250)
```sql
CREATE POLICY "Users can view public sessions" ...
-- ... todas las políticas
```

Ejecuta → Verifica

#### Parte 5: Triggers y Funciones (Líneas 251-fin)
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column() ...
-- ... funciones y triggers
```

Ejecuta → Verifica

---

## ✅ Verificación Final

### En SQL Editor, ejecuta:

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver las 5 tablas:
- ✅ `collaborative_sessions`
- ✅ `cursor_positions`
- ✅ `file_changes_log`
- ✅ `session_participants`
- ✅ `workspace_files`

### Ver índices creados:

```sql
-- Ver índices
SELECT 
  tablename, 
  indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Ver políticas RLS:

```sql
-- Ver políticas
SELECT 
  tablename, 
  policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 🎯 Diferencias Entre Archivos

### ❌ `supabase-workspace-schema.sql` (VIEJO - CON ERRORES)
```sql
CREATE TABLE file_changes_log (
  ...
  INDEX idx_recent_changes (created_at DESC)  -- ❌ ERROR: Sintaxis incorrecta
);
```

### ✅ `supabase-schema-CORREGIDO.sql` (NUEVO - SIN ERRORES)
```sql
CREATE TABLE file_changes_log (
  ...
  -- Sin índices aquí
);

-- Índices creados DESPUÉS
CREATE INDEX idx_recent_changes ON file_changes_log(created_at DESC); -- ✅ CORRECTO
```

---

## 🆘 Si Sigues Teniendo Problemas

1. **Captura de pantalla del error completo**
2. **Copia el mensaje de error**
3. **Dime en qué línea falla**

Y te ayudo a resolverlo.

---

## 📁 Archivos en tu Proyecto

- ❌ `supabase-workspace-schema.sql` - **NO USAR** (tiene errores)
- ✅ `supabase-schema-CORREGIDO.sql` - **USAR ESTE** (sin errores)
- 📖 `COMO_EJECUTAR_SQL_EN_SUPABASE.md` - Esta guía

---

**✅ Usa el archivo CORREGIDO y debería funcionar sin errores** 🚀
