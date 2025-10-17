# 🔍 Diagnóstico de Sincronización en Tiempo Real

## 🎯 Sistema de Logs Implementado

He agregado **logs detallados en cada paso** del flujo de sincronización para identificar exactamente dónde se está bloqueando.

---

## 📋 INSTRUCCIONES DE DIAGNÓSTICO

### **PASO 1: Preparar el Ambiente**

1. ✅ **Reiniciar el servidor:**
   ```bash
   # Ctrl + C para detener
   npm run dev
   ```

2. ✅ **Abrir 2 ventanas del navegador:**
   - **Ventana A**: Chrome normal
   - **Ventana B**: Chrome incógnito (o Firefox)

3. ✅ **En AMBAS ventanas, abrir DevTools:**
   - Presiona **F12**
   - Ve a la pestaña **Console**
   - Click en el botón ⚙️ (settings)
   - Activar: **"Preserve log"** (para no perder mensajes)

---

### **PASO 2: Crear Sesión (Ventana A)**

1. ✅ Abrir: `http://localhost:3000` o `http://localhost:3001`
2. ✅ Click en **👥 Colaboración**
3. ✅ **"Crear Nueva Sesión"**
4. ✅ Nombre: `Usuario A`
5. ✅ **Copiar el enlace** que aparece

**En Console verás:**
```
✅ Conectado a la sesión colaborativa
```

---

### **PASO 3: Unirse (Ventana B)**

1. ✅ Pegar el enlace en Ventana B
2. ✅ Nombre: `Usuario B`
3. ✅ Click **"Unirse"**

**En Console de AMBAS ventanas verás:**
```
Usuarios en línea: {...}
```

---

### **PASO 4: Probar Sincronización**

**Ventana A:**
1. ✅ Abrir archivo `styles.css`
2. ✅ **Escribir algo** (ej: agregar una línea)
3. ✅ **OBSERVAR LA CONSOLE**

**Ventana B:**
1. ✅ Abrir **EL MISMO archivo** `styles.css`
2. ✅ **OBSERVAR LA CONSOLE**

---

## 🔬 LOGS ESPERADOS

### **En Ventana A (quien escribe):**

Deberías ver esta secuencia cuando escribas:

```javascript
// 1. CodeEditor detecta el cambio
📝 handleEditorChange: {
  isCollaborating: true,
  hasOnRealtimeChange: true,
  activePath: "styles.css",
  contentLength: 234
}

// 2. Después de 150ms...
📡 ENVIANDO cambio en tiempo real: {
  filePath: "styles.css",
  contentLength: 234,
  position: { lineNumber: 15, column: 8 }
}

// 3. App.jsx procesa
🔄 handleRealtimeChange recibido: {
  isCollaborating: true,
  filePath: "styles.css",
  contentLength: 234
}

📤 Llamando a broadcastFileChange...

// 4. Servicio envía a Supabase
📡 broadcastFileChange llamado: {
  hasChannel: true,
  hasUser: true,
  filePath: "styles.css",
  contentLength: 234
}

📤 Enviando a Supabase Realtime: {...}

✅ Mensaje enviado exitosamente a Supabase

✅ broadcastFileChange ejecutado

// 5. Supabase devuelve el mensaje (self: true)
🎯 Supabase broadcast recibido: {
  event: 'file-change',
  fromUserId: "abc-123",
  currentUserId: "abc-123",
  isSameUser: true
}

⏸️ Es mi propio mensaje - ignorar
```

### **En Ventana B (quien recibe):**

Deberías ver:

```javascript
// 1. Supabase envía el mensaje
🎯 Supabase broadcast recibido: {
  event: 'file-change',
  fromUserId: "abc-123",
  currentUserId: "def-456",
  isSameUser: false,
  filePath: "styles.css"
}

📞 Llamando callback onFileChange...

// 2. Hook de colaboración procesa
📥 MENSAJE RECIBIDO de Supabase: {
  filePath: "styles.css",
  contentLength: 234,
  fromUser: "Usuario A",
  timestamp: 1234567890
}

✅ Aplicando cambio remoto al estado...

🎉 Cambio aplicado exitosamente

// 3. CodeEditor aplica el cambio
⏸️ Cambio remoto - no propagar
```

---

## ❌ DIAGNÓSTICO DE PROBLEMAS

### **PROBLEMA 1: No se envía nada**

**Síntoma en Ventana A:**
```
⚠️ NO se enviará cambio: {
  isCollaborating: false,
  hasCallback: true
}
```

**Causa:** `isCollaborating` está en `false`

**Solución:**
1. Verificar que el botón 👥 muestre "X usuarios en línea"
2. Verificar en Console:
   ```javascript
   // Ejecutar en Console:
   window.__reactDevTools ? "Instala React DevTools" : "OK"
   ```
3. Cerrar sesión y volver a crear/unirse

---

### **PROBLEMA 2: Se envía pero no llega a Supabase**

**Síntoma en Ventana A:**
```
📤 Enviando a Supabase Realtime: {...}
❌ Error al enviar mensaje: [error]
```

**Causa:** Problema con la conexión de Supabase

**Solución:**
1. Verificar archivo `.env`:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```
2. Verificar que las credenciales sean correctas
3. Abrir https://supabase.com y verificar que el proyecto esté activo

---

### **PROBLEMA 3: Llega a Supabase pero no se recibe**

**Síntoma:**
- Ventana A: ✅ Mensaje enviado exitosamente
- Ventana B: No aparece ningún log

**Causa:** Los usuarios NO están en el mismo canal

**Solución:**
1. Verificar que ambos usaron el mismo enlace
2. En Console de ambas ventanas ejecutar:
   ```javascript
   // Debería mostrar el mismo session ID
   localStorage.getItem('collaboration_session')
   ```
3. Si son diferentes, una ventana usó un enlace incorrecto

---

### **PROBLEMA 4: Se recibe pero no se aplica**

**Síntoma en Ventana B:**
```
📥 MENSAJE RECIBIDO de Supabase: {...}
⏸️ Aplicando cambio remoto - ignorar
```

**Causa:** El flag `isApplyingRemoteChange` está bloqueado

**Solución:**
1. Este es un bug de timing
2. Recargar la Ventana B
3. Esperar 2-3 segundos antes de escribir

---

### **PROBLEMA 5: Archivos diferentes abiertos**

**Síntoma:**
- Se envían mensajes
- Se reciben mensajes
- Pero NO se ve el cambio en el editor

**Causa:** Ventana A y B tienen archivos **diferentes** abiertos

**Solución:**
1. ✅ **AMBAS ventanas deben tener EL MISMO archivo abierto**
2. Si Ventana A tiene `styles.css`, Ventana B también debe tener `styles.css`
3. Los cambios solo se sincronizan en el archivo actualmente abierto

---

## 🎯 FLUJO COMPLETO (IDEAL)

```
VENTANA A: Escribir código
    ↓
📝 handleEditorChange (CodeEditor)
    ↓ (150ms)
📡 ENVIANDO cambio en tiempo real
    ↓
🔄 handleRealtimeChange (App)
    ↓
📤 broadcastFileChange (Service)
    ↓
☁️ Supabase Realtime
    ↓
🎯 Broadcast recibido (ambas ventanas)
    ↓
VENTANA A: ⏸️ Es mi mensaje - ignorar
VENTANA B: 📥 Aplicar cambio ✅
    ↓
🎉 Código actualizado en VENTANA B
```

---

## 📊 CHECKLIST DE VERIFICACIÓN

Antes de reportar un problema, verifica:

- [ ] Ambas ventanas tienen **DevTools abierto** (F12)
- [ ] **"Preserve log"** está activado en Console
- [ ] Ambas ventanas están en la **misma sesión** (mismo enlace)
- [ ] Ambas ventanas tienen el **mismo archivo abierto**
- [ ] El botón 👥 muestra "2 usuarios en línea" o más
- [ ] No hay errores rojos en Console
- [ ] El archivo `.env` tiene las credenciales correctas
- [ ] El servidor está corriendo (`npm run dev`)

---

## 🐛 REPORTAR PROBLEMA

Si después de revisar todo sigue sin funcionar:

### **Información a compartir:**

1. **Logs de Ventana A** (quien escribe):
   - Copia todos los logs desde que escribiste
   - Especialmente busca mensajes que comiencen con:
     - 📝 handleEditorChange
     - 📡 ENVIANDO
     - ✅ Mensaje enviado

2. **Logs de Ventana B** (quien recibe):
   - Copia todos los logs
   - Busca:
     - 🎯 Supabase broadcast recibido
     - 📥 MENSAJE RECIBIDO
     - ✅ Aplicando cambio

3. **Estado de Supabase:**
   - ¿Tienes proyecto creado?
   - ¿Ejecutaste `supabase-setup.sql`?
   - ¿Las credenciales están en `.env`?

4. **Capturas de pantalla:**
   - Console de Ventana A
   - Console de Ventana B
   - Botón 👥 mostrando usuarios conectados

---

## 🔧 SOLUCIÓN RÁPIDA (Si todo falla)

Si después de todo esto sigue sin funcionar:

### **Opción 1: Limpiar caché**

```javascript
// En Console de ambas ventanas:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### **Opción 2: Verificar broadcast está habilitado**

En `collaborationService.js` línea 169:
```javascript
broadcast: { self: true }  // ✅ Debe estar en true
```

### **Opción 3: Reducir debounce**

En `CodeEditor.jsx` línea 235:
```javascript
setTimeout(() => {
  onRealtimeChange({...});
}, 50);  // Cambiar de 150 a 50ms
```

---

## ✅ SIGUIENTE PASO

**Ejecuta estos pasos y comparte los logs de Console de ambas ventanas.**

Con esos logs podré identificar exactamente dónde se está bloqueando la sincronización.

---

**Archivo actualizado:** Todos los componentes ahora tienen logs de diagnóstico  
**Estado:** Listo para probar y diagnosticar  
**Fecha:** Octubre 2024
