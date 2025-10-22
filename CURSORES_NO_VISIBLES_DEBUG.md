# 🔍 DEBUG: Cursores y Escritura NO Visibles

## 🎯 Problema

- ✅ 2 usuarios en línea detectados
- ❌ Cursores remotos NO visibles
- ❌ Escritura en tiempo real NO visible

---

## 🧪 Logs Agregados para Debug

Hemos agregado logs MUY VISIBLES en todo el flujo:

### 1. En CodeEditor.jsx (Renderizado de Cursores)

```javascript
🎨🎨🎨 useEffect de cursores remotos ejecutado
📍 Cursores en archivo actual
⚠️ Saltando renderizado de cursores
```

### 2. En CodeEditor.jsx (Listener de Cursor)

```javascript
✅✅✅ REGISTRANDO LISTENER DE CURSOR
📍 Enviando posición de cursor
⚠️⚠️⚠️ Listener de cursor NO registrado
```

### 3. En useCollaboration.js

```javascript
📍 Hook recibió cursor remoto
✅ Actualizando estado de remoteCursors
```

### 4. En collaborationService.js

```javascript
📍 Cursor remoto recibido
✅ Procesando cursor remoto de [nombre]
⏸️ Ignorando mi propio cursor
```

---

## 🧪 Pasos para Debuggear

### 1. Reinicia el Servidor

```bash
npm run dev
```

### 2. Abre 2 Navegadores

- **Navegador 1**: Admin (propietario)
- **Navegador 2**: Invitado (incógnito)

### 3. F12 → Console en AMBOS

Mantén las consolas abiertas y visibles

### 4. Admin: Crear Sesión

En Console del Admin, debes ver:

```
✅ Conectado a la sesión colaborativa
💓 Heartbeat REFORZADO iniciado
```

### 5. Invitado: Unirse

En Console del Invitado, debes ver:

```
🔗 Link compartido detectado
🔐 Link compartido - EXIGIENDO autenticación
```

Después de login:

```
✅ Conectado a la sesión colaborativa
👋 Anunciando mi llegada
📢 Solicitando lista de usuarios (intento 1/3)
📥 Respuesta de usuario recibida: { userName: "Admin" }
✅ Usuario agregado. Nueva lista: ["Invitado", "Admin"]
```

### 6. Verificar Cursores

#### En Admin (mueve cursor):

```
✅✅✅ REGISTRANDO LISTENER DE CURSOR para colaboración
📍 Enviando posición de cursor: { filePath: 'index.html', lineNumber: 10, column: 15 }
```

#### En Invitado (debe recibir):

```
📍 Cursor remoto recibido: { userName: "Admin", filePath: "index.html" }
✅ Procesando cursor remoto de Admin
📍 Hook recibió cursor remoto: { userName: "Admin" }
✅ Actualizando estado de remoteCursors
🎨🎨🎨 useEffect de cursores remotos ejecutado: { totalRemoteCursors: 1 }
📍 Cursores en archivo actual: { totalCursors: 1, cursors: [...] }
```

---

## ❌ Problemas Comunes

### Problema 1: NO ve "✅✅✅ REGISTRANDO LISTENER"

**Causa**: onCursorMove no está definido o isCollaborating es false

**Logs a buscar**:
```
⚠️⚠️⚠️ Listener de cursor NO registrado: {
  hasEditor: true/false,
  isCollaborating: true/false,
  hasOnCursorMove: true/false
}
```

**Solución**:
- Si `isCollaborating: false` → La sesión no se estableció correctamente
- Si `hasOnCursorMove: false` → `broadcastCursorMove` no se pasó como prop

---

### Problema 2: Envía cursor pero NO recibe

**Admin envía**:
```
✅ 📍 Enviando posición de cursor
```

**Invitado NO recibe**:
```
❌ NO APARECE: 📍 Cursor remoto recibido
```

**Causa**: El broadcast no llega

**Verificar**:
1. En Supabase Dashboard → Realtime Inspector
2. Debe ver eventos `cursor-move` pasando
3. Si no → Problema de Supabase Realtime

**Solución**:
- Verifica credenciales de Supabase en `.env`
- Verifica que Realtime está habilitado en Supabase

---

### Problema 3: Recibe cursor pero NO renderiza

**Invitado recibe**:
```
✅ 📍 Cursor remoto recibido
✅ 📍 Hook recibió cursor remoto
✅ Actualizando estado de remoteCursors
```

**Pero NO renderiza**:
```
❌ NO APARECE: 🎨🎨🎨 useEffect de cursores remotos ejecutado
```

**Causa**: useEffect de renderizado no se está ejecutando

**Verificar**:
```javascript
// En Console del invitado:
console.log('remoteCursors:', remoteCursors);
// Debe mostrar: { "user-123": { userName: "Admin", ... } }
```

**Si está vacío** `{}`:
- El estado no se está actualizando
- Problema en `setRemoteCursors`

**Si tiene datos pero NO renderiza**:
- Problema en las dependencias del useEffect
- Verificar: `[remoteCursors, activePath, isCollaborating]`

---

### Problema 4: Renderiza pero NO visible

**Invitado logs**:
```
✅ 🎨🎨🎨 useEffect de cursores remotos ejecutado
✅ 📍 Cursores en archivo actual: { totalCursors: 1 }
```

**Pero NO ve cursores en pantalla**

**Causa**: Problema de estilos CSS o z-index

**Verificar**:
1. Inspeccionar elemento (F12 → Elements)
2. Buscar: `.remote-cursor-line-`
3. Debe existir en el DOM

**Si NO existe**:
- Monaco Editor no aplicó las decoraciones
- Verificar que `editor.deltaDecorations` se ejecutó

**Si existe pero NO visible**:
- z-index muy bajo
- Estilos CSS no aplicados
- Buscar `<style id="remote-cursor-styles">` en `<head>`

---

## 🎯 Checklist de Verificación

### En AMBOS usuarios:

- [ ] Console muestra "✅ Conectado a la sesión colaborativa"
- [ ] Console muestra "✅✅✅ REGISTRANDO LISTENER DE CURSOR"
- [ ] Al mover cursor, ve: "📍 Enviando posición de cursor"

### En Usuario que RECIBE:

- [ ] Console muestra: "📍 Cursor remoto recibido"
- [ ] Console muestra: "📍 Hook recibió cursor remoto"
- [ ] Console muestra: "🎨🎨🎨 useEffect de cursores remotos ejecutado"
- [ ] Console muestra: "📍 Cursores en archivo actual: { totalCursors: 1 }"

### En Pantalla:

- [ ] Cursor remoto VISIBLE (línea vertical con color)
- [ ] Etiqueta con nombre de usuario VISIBLE arriba del cursor
- [ ] Al escribir, el texto aparece en tiempo real en el otro usuario

---

## 🚀 Comandos de Debug

### Ver Estado de remoteCursors

```javascript
// En Console:
setInterval(() => {
  console.log('📊 Estado remoteCursors:', {
    count: Object.keys(remoteCursors || {}).length,
    cursors: remoteCursors
  });
}, 3000);
```

### Ver si Listener está Registrado

```javascript
// Ejecutar después de unirse:
console.log('Listener registrado:', {
  hasEditor: !!editorRef.current,
  isCollaborating,
  hasOnCursorMove: !!onCursorMove
});
```

### Forzar Envío de Cursor

```javascript
// En Admin, ejecutar manualmente:
broadcastCursorMove('index.html', { lineNumber: 10, column: 5 }, null);
```

---

## 📸 Screenshot de Logs Correctos

### Admin (moviendo cursor):
```
✅ Conectado a la sesión colaborativa
✅✅✅ REGISTRANDO LISTENER DE CURSOR para colaboración
📍 Enviando posición de cursor: { filePath: "index.html", lineNumber: 10 }
```

### Invitado (recibiendo):
```
✅ Conectado a la sesión colaborativa
✅✅✅ REGISTRANDO LISTENER DE CURSOR para colaboración
📍 Cursor remoto recibido: { userName: "Admin" }
✅ Procesando cursor remoto de Admin
📍 Hook recibió cursor remoto: { userName: "Admin" }
✅ Actualizando estado de remoteCursors
🎨🎨🎨 useEffect de cursores remotos ejecutado: { totalRemoteCursors: 1 }
📍 Cursores en archivo actual: { totalCursors: 1 }
```

---

## 📞 Si Sigue Sin Funcionar

Necesito ver:

1. **Screenshot de Console del Admin** (con TODOS los logs)
2. **Screenshot de Console del Invitado** (con TODOS los logs)
3. **Screenshot de F12 → Elements** del invitado buscando `.remote-cursor-line-`
4. **¿Qué log específico NO aparece?**

Con esa info puedo identificar exactamente en qué paso falla.

---

## ✅ Resultado Esperado

Después de estos logs:

1. ✅ Admin mueve cursor → "📍 Enviando posición"
2. ✅ Invitado recibe → "📍 Cursor remoto recibido"
3. ✅ Invitado renderiza → "🎨🎨🎨 useEffect ejecutado"
4. ✅ Invitado VE cursor remoto en pantalla
5. ✅ Admin escribe → Invitado ve texto en tiempo real

---

**🔥 Logs Agregados + Guía de Debug Completa**

Ahora podemos identificar EXACTAMENTE dónde falla el flujo.
