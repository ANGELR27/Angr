# 🚀 Migración de Supabase a Appwrite

## ✅ Lo que Necesitas

### 1️⃣ Cuenta y Proyecto en Appwrite

1. **Crear cuenta**: https://cloud.appwrite.io/
2. **Crear proyecto nuevo**: "Editor Colaborativo"
3. **Anotar credenciales**:
   ```
   Endpoint: https://cloud.appwrite.io/v1
   Project ID: [tu-project-id]
   API Key: [crear en API Keys]
   ```

---

### 2️⃣ Configurar Database

#### Base de datos
- Nombre: `collaboration`
- Database ID: `collaboration` (puedes usar uno custom)

#### Colección: `sessions`
- Collection ID: `sessions`

#### Atributos:
| Atributo | Tipo | Tamaño | Requerido | Default |
|----------|------|--------|-----------|---------|
| `sessionCode` | string | 10 | ✅ | - |
| `sessionName` | string | 200 | ✅ | - |
| `ownerUserId` | string | 50 | ✅ | - |
| `ownerName` | string | 100 | ✅ | - |
| `accessControl` | string | 20 | ❌ | "public" |
| `projectState` | string | 1000000 | ❌ | "{}" |
| `isActive` | boolean | - | ❌ | true |

#### Permisos de Colección:
```
Create: Any
Read: Any  
Update: Any
Delete: Any
```

---

### 3️⃣ Instalar SDK

```bash
npm install appwrite
```

---

### 4️⃣ Variables de Entorno

Agregar a `.env`:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=tu-project-id-aqui
VITE_APPWRITE_DATABASE_ID=collaboration
VITE_APPWRITE_COLLECTION_ID=sessions
```

---

## 🔄 Diferencias Clave: Supabase vs Appwrite

| Característica | Supabase | Appwrite |
|----------------|----------|----------|
| **Realtime** | `channel.send()` | `client.subscribe()` |
| **Broadcasting** | Broadcast events | Realtime channels |
| **Database** | PostgreSQL | NoSQL Documents |
| **SDK** | `@supabase/supabase-js` | `appwrite` |

---

## 📦 Archivos a Crear/Modificar

### ✅ Nuevos Archivos
1. `src/services/collaborationServiceAppwrite.js` - Servicio de Appwrite
2. `MIGRACION_APPWRITE.md` - Esta guía

### 🔧 Archivos a Modificar
1. `src/hooks/useCollaboration.js` - Cambiar import del servicio
2. `.env` - Agregar credenciales de Appwrite
3. `package.json` - Agregar dependencia `appwrite`

### 🗑️ Archivos Obsoletos (NO borrar aún)
1. `src/services/collaborationService.js` - Mantener como backup

---

## 🧪 Plan de Prueba

1. ✅ Verificar que Appwrite esté configurado
2. ✅ Crear sesión de prueba
3. ✅ Unirse desde otra ventana/navegador
4. ✅ Verificar sincronización de código en tiempo real
5. ✅ Verificar cursores remotos
6. ✅ Verificar indicadores de "escribiendo..."

---

## 🛠️ Comandos Útiles

```bash
# Instalar dependencia
npm install appwrite

# Iniciar en desarrollo
npm run dev

# Ver logs de Appwrite
https://cloud.appwrite.io/console
```

---

## ⚠️ Notas Importantes

- **No borrar código de Supabase** hasta confirmar que Appwrite funciona 100%
- **Probar primero en local** antes de desplegar
- **Mantener backup** de archivos modificados
- **Verificar límites** del plan gratuito de Appwrite:
  - Realtime: 100 conexiones simultáneas
  - Database: 75,000 documentos
  - Bandwidth: 10GB/mes

---

## 🎯 Próximos Pasos

1. ✅ Crear cuenta en Appwrite
2. ✅ Configurar proyecto y database
3. ✅ Instalar SDK: `npm install appwrite`
4. ✅ Agregar credenciales a `.env`
5. ✅ Crear `collaborationServiceAppwrite.js`
6. ✅ Actualizar `useCollaboration.js`
7. ✅ Probar funcionalidad
8. ✅ Borrar código de Supabase (opcional)
