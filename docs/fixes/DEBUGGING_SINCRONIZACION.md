# 🔍 Debugging: Problema de Sincronización

## Síntomas
- ✅ Autenticación funciona
- ✅ Detecta 2 usuarios en línea
- ✅ Cursores remotos visibles ("ANA")
- ❌ El contenido NO se sincroniza
- ❌ Solo aparecen algunas letras
- ❌ El usuario que se une no ve los cambios del admin

## Diagnóstico

### Lo que Funciona ✅
1. **Conexión a Supabase Realtime** - Los cursores se ven
2. **Detección de usuarios** - Muestra "2 usuarios en línea"
3. **Canal de comunicación** - Los broadcasts llegan

### Lo que NO Funciona ❌
1. **Sincronización de contenido completo**
2. **Broadcasting bidireccional** (solo admin → visitante falla)

## Posibles Causas

### 1. Control de Versiones Rechaza Cambios
```javascript
// En useCollaboration.js, línea 146-154
const currentVersion = fileVersionsRef.current[payload.filePath] || 0;
if (typeof payload.version === 'number') {
  if (payload.version <= currentVersion) {
    console.log('⏸️ Versión antigua - ignorar');  // ← PROBLEMA
    return;
  }
}
```

**Problema**: Si las versiones no se sincronizan correctamente, los cambios se rechazan.

### 2. Debounce Demasiado Corto
```javascript
// En CodeEditor.jsx, línea 382
setTimeout(() => {
  onRealtimeChange({ ... });
}, 100); // ← 100ms puede truncar cambios rápidos
```

**Problema**: Si escribes rápido, solo se envía el último estado, no el contenido completo.

### 3. Buffer Offline
```javascript
// En collaborationService.js
if (!this.channel || this.connectionStatus !== 'connected') {
  console.warn('⚠️ Sin conexión - agregando al buffer');
  this.offlineBuffer.push(message);
  return; // ← No se envía
}
```

**Problema**: Si la conexión no está marcada como "connected", los mensajes van al buffer y no se envían.

## Logs Para Verificar

Abre **F12 → Console** y busca:

### En Usuario Admin (Quien Crea):
```
✅ Debería ver:
📝 handleEditorChange: { isCollaborating: true, ... }
📡 ENVIANDO cambio en tiempo real: { contentLength: X }
📤 Enviando a Supabase Realtime
✅ Mensaje enviado exitosamente a Supabase

❌ Si ves:
⚠️ Sin conexión - agregando al buffer
→ La conexión no está establecida

⚠️ NO se enviará cambio: { isCollaborating: false }
→ El estado de colaboración es false
```

### En Usuario Visitante (Quien Se Une):
```
✅ Debería ver:
🎯 Supabase broadcast recibido: { event: 'file-change', ... }
📥 MENSAJE RECIBIDO de Supabase: { filePath, contentLength }
✅ Aplicando cambio remoto al estado
🎉 Cambio aplicado exitosamente

❌ Si ves:
⏸️ Es mi propio mensaje - ignorar
→ El userId no se diferencia correctamente

⏸️ Versión antigua - ignorar
→ El control de versiones rechaza el cambio

⏸️ Timestamp antiguo - ignorar
→ El timestamp no es más reciente
```

## Solución Propuesta

### 1. Deshabilitar Control de Versiones Temporalmente
Para debuggear, comentar las líneas 146-163 en `useCollaboration.js`

### 2. Aumentar Debounce a 300ms
En `CodeEditor.jsx` línea 382:
```javascript
}, 300); // Aumentar de 100ms a 300ms
```

### 3. Verificar Estado de Conexión
Agregar log en `collaborationService.js` línea 572:
```javascript
console.log('🔌 connectionStatus:', this.connectionStatus);
```

### 4. Sincronización Inicial Completa
Cuando un usuario se une, enviar TODO el workspace, no solo nuevos cambios.

## Cómo Debuggear

### Paso 1: Verificar en Admin
1. Abre http://localhost:3001 en Navegador 1
2. Login
3. Crear sesión
4. F12 → Console
5. Escribe algo en el editor
6. Busca estos logs:
   - `📝 handleEditorChange`
   - `📡 ENVIANDO cambio`
   - `✅ Mensaje enviado exitosamente`

### Paso 2: Verificar en Visitante
1. Abre http://localhost:3001?session=SESSION_ID en Navegador 2 (Incógnito)
2. Login con otra cuenta
3. Unirse a sesión
4. F12 → Console
5. Busca:
   - `🎯 Supabase broadcast recibido`
   - `📥 MENSAJE RECIBIDO`
   - `✅ Aplicando cambio remoto`

### Paso 3: Verificar Supabase
1. Abre Dashboard de Supabase
2. Ve a "Realtime Inspector"
3. Deberías ver eventos `file-change` pasando

## Fix Rápido

Si el problema es el control de versiones, agregar este fix:

```javascript
// En useCollaboration.js, línea 146
// COMENTAR TODO EL BLOQUE DE VERSIONES:

/*
const currentVersion = fileVersionsRef.current[payload.filePath] || 0;
if (typeof payload.version === 'number') {
  if (payload.version <= currentVersion) {
    console.log('⏸️ Versión antigua - ignorar');
    return;
  }
  fileVersionsRef.current[payload.filePath] = payload.version;
}
*/

// Y reemplazar con:
console.log('✅ Aceptando todos los cambios (debug mode)');
```

Esto deshabilitará el control de versiones y permitirá ver si ese es el problema.

## Resultado Esperado

Después del fix:
```
Usuario Admin escribe: "Hola mundo"
Console Admin: ✅ Mensaje enviado
Console Visitante: 📥 MENSAJE RECIBIDO: "Hola mundo"
Editor Visitante: "Hola mundo" aparece en tiempo real
```

## Próximo Paso

Implementar el fix y probar.
