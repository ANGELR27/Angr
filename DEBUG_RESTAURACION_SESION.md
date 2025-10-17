# Guía de Debug: Restauración de Sesión

## 🔍 Pasos para Diagnosticar el Problema

### 1. **Abrir la Consola del Navegador**
- Presiona `F12` o `Ctrl+Shift+I`
- Ve a la pestaña "Console"

### 2. **Unirse a una Sesión**

Cuando alguien se une por link, deberías ver estos mensajes en consola:

```
💾 Guardando sesión en localStorage: {sessionId: "abc123", userName: "Juan", userRole: "viewer"}
✅ Sesión guardada en localStorage
✅ Conectado a la sesión colaborativa
```

### 3. **Actualizar la Página (F5)**

Al actualizar, deberías ver esta secuencia completa:

```
🚀 useCollaboration: Inicializando...
⚙️ Supabase configurado: true
🔄 Iniciando proceso de restauración de sesión...
🔍 Intentando restaurar sesión desde localStorage...
📦 Datos de sesión encontrados: {sessionId: "abc123", userName: "Juan", userRole: "viewer", timestamp: "..."}
⏱️ Sesión válida (edad: X minutos)
✅ Estado de sesión y usuario restaurado
📁 Archivos del proyecto restaurados (owner) [o mensaje para viewer]
🔌 Reconectando al canal de Supabase...
✅ Canal reconectado
📢 Anunciando regreso a la sesión...
✅ Anuncio enviado
🎉 SESIÓN RESTAURADA COMPLETAMENTE
✅ Sesión restaurada con éxito: {sessionId: "abc123", userName: "Juan", userRole: "viewer"}
📝 Actualizando estados de React...
✅ Estados de React actualizados
🎉 PROCESO DE RESTAURACIÓN COMPLETADO
```

## ❌ Posibles Errores y Soluciones

### Error 1: "⚠️ Supabase no está configurado"

**Causa:** Las variables de entorno no están configuradas

**Solución:**
1. Verifica que existe el archivo `.env`
2. Debe contener:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```
3. Reinicia el servidor: `npm run dev`

### Error 2: "ℹ️ No hay sesión guardada en localStorage"

**Causa:** La sesión no se guardó al unirse

**Verificación:**
1. En la consola del navegador, ve a la pestaña "Application"
2. En el menú izquierdo: Storage > Local Storage > http://localhost:3001
3. Busca la clave: `collaboration_session`
4. Debería tener un valor JSON

**Solución:**
- Si no existe, el problema está al guardar
- Revisa que veas el mensaje `✅ Sesión guardada en localStorage` al unirte

### Error 3: "⏰ Sesión expirada (más de 24 horas)"

**Causa:** La sesión tiene más de 24 horas

**Solución:**
- Únete nuevamente a la sesión
- La sesión se limpiará y creará una nueva

### Error 4: "❌ ERROR al restaurar sesión"

**Causa:** Error al parsear los datos o al reconectar

**Verificación:**
1. Mira el stack trace completo en la consola
2. Verifica que el JSON en localStorage sea válido
3. Revisa que Supabase esté accesible

**Solución:**
- Limpia localStorage manualmente y vuelve a unirte:
```javascript
// En la consola del navegador:
localStorage.removeItem('collaboration_session');
localStorage.removeItem('collaboration_project_files');
```

### Error 5: Estados de React no se Actualizan

**Síntomas:**
- La consola dice "✅ SESIÓN RESTAURADA COMPLETAMENTE"
- Pero no ves el banner de colaboración
- No apareces en la lista de usuarios activos

**Verificación:**
```javascript
// En la consola del navegador después de restaurar:
console.log('isCollaborating:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
```

**Causa Posible:**
- El componente `CollaborationBanner` no se está renderizando
- El estado de React no se propagó correctamente

## 🧪 Script de Verificación Manual

Copia y pega esto en la consola del navegador **DESPUÉS de actualizar**:

```javascript
// Verificar estado de localStorage
console.log('=== VERIFICACIÓN DE ESTADO ===');

const session = localStorage.getItem('collaboration_session');
const files = localStorage.getItem('collaboration_project_files');

console.log('1. Sesión guardada:', session ? 'SÍ ✅' : 'NO ❌');
if (session) {
  try {
    const data = JSON.parse(session);
    console.log('   - Session ID:', data.session?.id);
    console.log('   - User Name:', data.user?.name);
    console.log('   - User Role:', data.user?.role);
    console.log('   - Timestamp:', new Date(data.timestamp).toLocaleString());
    console.log('   - Edad:', Math.round((Date.now() - data.timestamp) / 1000 / 60), 'minutos');
  } catch (e) {
    console.error('   - ERROR al parsear:', e);
  }
}

console.log('2. Archivos guardados:', files ? 'SÍ ✅' : 'NO ❌');
if (files) {
  try {
    const parsed = JSON.parse(files);
    console.log('   - Total archivos:', Object.keys(parsed).length);
  } catch (e) {
    console.error('   - ERROR al parsear:', e);
  }
}

// Verificar variables de entorno
console.log('3. Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'CONFIGURADA ✅' : 'NO CONFIGURADA ❌');
console.log('4. Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'CONFIGURADA ✅' : 'NO CONFIGURADA ❌');

console.log('=== FIN VERIFICACIÓN ===');
```

## 📊 Flujo Visual de Restauración

```
PÁGINA SE CARGA
      ↓
useCollaboration se inicializa
      ↓
¿Supabase configurado? → NO → ⚠️ Error: Configurar Supabase
      ↓ SÍ
Buscar en localStorage
      ↓
¿Sesión encontrada? → NO → ℹ️ No hay sesión
      ↓ SÍ
¿Sesión válida? → NO → 🗑️ Limpiar sesión expirada
      ↓ SÍ
Restaurar estado interno
      ↓
Reconectar al canal Supabase
      ↓
Anunciar regreso (broadcast)
      ↓
Actualizar estados de React
      ↓
🎉 SESIÓN RESTAURADA
```

## 🔧 Solución Rápida

Si después de seguir todos los pasos aún no funciona:

1. **Limpia completamente localStorage:**
```javascript
localStorage.clear();
```

2. **Recarga la página (F5)**

3. **Vuelve a unirte a la sesión mediante el link**

4. **Verifica que veas todos los mensajes de consola al unirte**

5. **Actualiza (F5) y verifica que veas todos los mensajes de restauración**

## 📝 Checklist de Verificación

Antes de reportar un bug, verifica:

- [ ] Archivo `.env` existe y tiene las credenciales correctas
- [ ] Servidor reiniciado después de crear `.env`
- [ ] Consola muestra `⚙️ Supabase configurado: true`
- [ ] Al unirte, ves `✅ Sesión guardada en localStorage`
- [ ] En Application > Local Storage existe `collaboration_session`
- [ ] Al actualizar, ves `🔍 Intentando restaurar sesión desde localStorage...`
- [ ] No hay errores en rojo en la consola
- [ ] La sesión tiene menos de 24 horas

## 🆘 Información para Reportar

Si el problema persiste, incluye:

1. **Captura de pantalla de la consola completa**
2. **Contenido de localStorage** (Application > Local Storage)
3. **Archivo `.env`** (sin mostrar las claves reales)
4. **Pasos exactos para reproducir**
5. **Sistema operativo y navegador**
