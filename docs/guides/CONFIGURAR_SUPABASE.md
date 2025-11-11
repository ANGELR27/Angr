# 🚀 Configurar Supabase para Colaboración en Tiempo Real

## ¿Por qué Supabase?

✅ **Sin límite de tamaño** - localStorage solo permite 5-10MB  
✅ **Persistencia real** - Los proyectos se guardan en la nube  
✅ **Acceso desde cualquier lugar** - No depende del navegador del owner  
✅ **Sincronización perfecta** - Todos ven exactamente lo mismo  
✅ **Gratis para siempre** - Plan gratuito muy generoso  

---

## 📋 Paso 1: Crear Cuenta en Supabase

1. Ve a: **https://supabase.com**
2. Click en **"Start your project"**
3. Inicia sesión con GitHub (recomendado)

---

## 🏗️ Paso 2: Crear Proyecto

1. Click en **"New Project"**
2. Configura:
   - **Name:** `angr-editor` (o el nombre que quieras)
   - **Database Password:** (genera una fuerte y guárdala)
   - **Region:** `South America (São Paulo)` (más cercano a ti)
   - **Pricing Plan:** `Free` (gratis para siempre)
3. Click en **"Create new project"**
4. Espera 2-3 minutos mientras se crea

---

## 🔑 Paso 3: Obtener Credenciales

1. En el dashboard de Supabase, ve a **Settings** (⚙️ abajo a la izquierda)
2. Click en **API**
3. Copia estos valores:

### **Project URL**
```
https://xxxxxxxxxxxxx.supabase.co
```

### **anon/public key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Paso 4: Configurar Variables de Entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Pega tus credenciales:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Guarda el archivo**

---

## 🗄️ Paso 5: Crear la Tabla

1. En Supabase, ve a **SQL Editor** (📝 menú izquierdo)
2. Click en **"New Query"**
3. Copia **TODO** el contenido de `supabase-setup.sql`
4. Pégalo en el editor
5. Click en **"Run"** ▶️
6. Deberías ver: ✅ **"Success. No rows returned"**

---

## ✅ Paso 6: Verificar Configuración

### En Supabase:
1. Ve a **Table Editor**
2. Deberías ver la tabla: `collaboration_sessions`
3. Columnas: `id`, `session_id`, `owner_id`, `project_state`, `created_at`, `updated_at`

### En tu App:
1. Abre la consola del navegador (F12)
2. Recarga la página
3. Busca: `✅ Conectado a Supabase` (en consola)

---

## 🧪 Paso 7: Probar

### **Como Owner:**
1. Crea una sesión de colaboración
2. Agrega archivos e imágenes
3. En la consola deberías ver:
   ```
   ☁️ Proyecto guardado en Supabase
   ```

### **Como Invitado:**
1. Únete con el enlace
2. En la consola deberías ver:
   ```
   ☁️ Estado del proyecto cargado desde Supabase
   📦 Aplicando estado desde Supabase directamente
   ✅ Archivos sincronizados: ['index.html', 'styles.css', ...]
   ```

---

## 🔍 Ver Datos en Supabase

1. Ve a **Table Editor**
2. Click en `collaboration_sessions`
3. Verás todas las sesiones activas
4. Click en una fila para ver el `project_state` (archivos e imágenes)

---

## 🛠️ Solución de Problemas

### ❌ Error: "Failed to fetch"
**Causa:** Variables de entorno incorrectas  
**Solución:** 
1. Verifica que copiaste bien la URL y KEY
2. Asegúrate que NO haya espacios al inicio/final
3. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

### ❌ Error: "relation does not exist"
**Causa:** No ejecutaste el SQL  
**Solución:**
1. Ve a SQL Editor en Supabase
2. Ejecuta `supabase-setup.sql` completo

### ❌ Error: "Row Level Security"
**Causa:** Políticas muy restrictivas  
**Solución:**
1. Ve a **Authentication** > **Policies**
2. Asegúrate que las políticas permitan `SELECT`, `INSERT`, `UPDATE`

### ⚠️ Advertencia: "Supabase no disponible, usando localStorage"
**Esto es normal si:**
- Estás en desarrollo sin configurar Supabase
- La app usa localStorage como fallback automáticamente
- Para producción, configura Supabase para mejor experiencia

---

## 📊 Límites del Plan Gratuito

| Recurso | Límite Gratis | Suficiente Para |
|---------|---------------|-----------------|
| **Storage DB** | 500 MB | ✅ Miles de proyectos |
| **Bandwidth** | 5 GB/mes | ✅ Uso normal |
| **Realtime** | Ilimitado | ✅ Sí |
| **API Requests** | Ilimitado | ✅ Sí |

---

## 🔒 Seguridad

### Producción:
1. **Habilita RLS** (Row Level Security) - Ya configurado ✅
2. **API Keys públicas** - Es seguro, solo permite operaciones permitidas
3. **No expongas** el `service_role` key - Solo usa `anon` key

### Variables de Entorno:
```bash
# ✅ CORRECTO - Variables de entorno
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# ❌ INCORRECTO - Nunca hardcodear
const SUPABASE_URL = 'https://...'
```

---

## 🚀 Ventajas Finales

### **Antes (localStorage):**
```
❌ Límite: 5-10 MB
❌ Solo en ese navegador
❌ Se pierde si borras caché
❌ No funciona entre dispositivos
```

### **Ahora (Supabase):**
```
✅ Límite: 500 MB (gratis)
✅ Accesible desde cualquier lugar
✅ Persistencia real en la nube
✅ Funciona entre dispositivos
✅ Backup automático
✅ Sincronización perfecta
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica las credenciales en `.env`
3. Asegúrate que ejecutaste `supabase-setup.sql`
4. Revisa los logs en Supabase: **Logs** > **Postgres Logs**

---

**¡Listo! Ahora tienes colaboración en tiempo real profesional con almacenamiento en la nube!** ☁️✨
