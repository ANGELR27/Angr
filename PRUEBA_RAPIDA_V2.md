# 🧪 PRUEBA RÁPIDA - Colaboración V2

## ✅ **Lo que Acabamos de Hacer:**

1. ✅ Tabla en Supabase creada
2. ✅ Realtime habilitado
3. ✅ Hook actualizado para usar V2
4. ✅ Presence automático implementado

---

## 🚀 **PRUEBA 1: Verificar que Compila**

### **Paso 1: Iniciar servidor**

```bash
npm run dev
```

### **✅ Esperado:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Si ves errores:**
- Verifica que `collaborationServiceV2.js` existe
- Verifica que no haya errores de sintaxis

---

## 🧪 **PRUEBA 2: Crear Sesión**

### **Paso 1: Abrir app**
```
http://localhost:5173
```

### **Paso 2: Abrir Console (F12)**
Mantén la consola abierta para ver los logs

### **Paso 3: Crear sesión**
1. Click en botón **"Colaborar"** (arriba derecha)
2. Click en **"Crear Sesión"**
3. Ingresa nombre: `Test User 1`
4. Ingresa sesión: `Prueba V2`
5. Click **"Crear"**

### **✅ Esperado en Console:**
```
✅ Supabase V2 inicializado
✅ Sesión creada en BD: {...}
🔌 Conectando al canal: [código-5-chars]
📡 Estado de suscripción: SUBSCRIBED
✅ Canal suscrito - anunciando presencia
✅ Presencia anunciada: Test User 1
👥 Usuarios en línea (sync): 1 ["Test User 1"]
```

### **✅ Esperado en UI:**
- Modal se cierra
- Banner de colaboración aparece: "Sesión activa: Prueba V2"
- Panel lateral muestra: **1 usuario online**
- Código de sesión visible (5 caracteres)

---

## 🧪 **PRUEBA 3: Unirse desde Otra Pestaña**

### **Paso 1: Copiar código de sesión**
Del banner o panel, copia el código (ej: `A7F3K`)

### **Paso 2: Abrir nueva pestaña**
```
http://localhost:5173
```

### **Paso 3: Unirse**
1. Click **"Colaborar"**
2. Click **"Unirse a Sesión"**
3. Pega el código: `A7F3K`
4. Ingresa nombre: `Test User 2`
5. Click **"Unirse"**

### **✅ Esperado en Pestaña 2 (Console):**
```
✅ Sesión creada en BD
🔌 Conectando al canal: A7F3K
📡 Estado de suscripción: SUBSCRIBED
✅ Presencia anunciada: Test User 2
👥 Usuarios en línea (sync): 2 ["Test User 1", "Test User 2"]
```

### **✅ Esperado en Pestaña 1:**
```
👥 Lista de usuarios actualizada (Presence):
  totalUsers: 2
  userNames: ["Test User 1", "Test User 2"]
```

### **✅ Esperado en AMBAS UI:**
- Panel lateral muestra: **2 usuarios online**
- Cada usuario ve al otro con su nombre y color
- Notificación: "Test User 2 se ha unido a la sesión"

---

## 🧪 **PRUEBA 4: Edición en Tiempo Real**

### **En Pestaña 1:**
1. Abre un archivo (o crea uno nuevo: `test.js`)
2. Escribe: `console.log("Hola desde Usuario 1");`

### **✅ Esperado en Pestaña 2:**
- El texto aparece automáticamente
- Cursor del Usuario 1 visible
- Etiqueta con nombre "Test User 1"

### **En Pestaña 2:**
1. Escribe debajo: `console.log("Hola desde Usuario 2");`

### **✅ Esperado en Pestaña 1:**
- El texto aparece automáticamente
- Cursor del Usuario 2 visible
- Ambos textos sin conflictos

---

## 🧪 **PRUEBA 5: Presence Automático**

### **Cerrar Pestaña 2**
1. Cierra completamente la pestaña/navegador del Usuario 2

### **✅ Esperado en Pestaña 1 (después de ~10-15s):**
```
👥 Lista de usuarios actualizada (Presence):
  totalUsers: 1
  userNames: ["Test User 1"]
```

### **✅ Esperado en UI:**
- Panel lateral muestra: **1 usuario online**
- Notificación: "Test User 2 ha salido de la sesión"
- Cursor remoto desaparece

**Esto confirma que Presence funciona automáticamente** ✅

---

## 🐛 **Troubleshooting**

### **Error: "Supabase no está configurado"**

**Solución:**
1. Verifica que existe archivo `.env` en la raíz
2. Debe contener:
```env
VITE_SUPABASE_URL=https://ncomvnldhsclwxktegsx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```
3. Reinicia el servidor: `Ctrl+C` y `npm run dev`

---

### **Error: "Cannot read property 'presenceState'"**

**Solución:**
1. Verifica que `collaborationServiceV2.js` existe
2. Verifica que el import en `useCollaboration.js` apunta a V2

---

### **Los usuarios NO se detectan automáticamente**

**Verifica en Console:**
```
✅ Presencia anunciada: [nombre]
```

Si NO ves ese mensaje:
1. Verifica que el canal está SUBSCRIBED
2. Verifica que `channel.track()` se está ejecutando

---

### **Cambios NO se sincronizan**

**Verifica en Console:**
```
📤 Enviando a Supabase Realtime: {...}
✅ Mensaje enviado exitosamente
```

Si NO ves esos mensajes:
1. Verifica que `broadcastFileChange` se está llamando
2. Verifica que `connectionStatus === 'connected'`

---

## 📋 **Checklist de Éxito**

Marca cada uno cuando funcione:

- [ ] Servidor inicia sin errores
- [ ] Puedes crear una sesión
- [ ] Se guarda en Supabase (ver Table Editor)
- [ ] Console muestra "Presencia anunciada"
- [ ] Otro usuario puede unirse
- [ ] Ambos se ven en panel de usuarios
- [ ] Ediciones aparecen en tiempo real
- [ ] Cursores remotos visibles
- [ ] Al cerrar pestaña, usuario desaparece automáticamente

---

## 🎉 **Si TODO funciona:**

¡FASE 1 COMPLETADA! 🚀

Próximos pasos:
1. Integrar ShareModal (con QR codes)
2. Implementar Yjs CRDT (FASE 2)
3. Agregar compression
4. Analytics de sesión

---

## 💡 **Consejos:**

- Mantén la console abierta (F12) durante las pruebas
- Si algo falla, recarga AMBAS pestañas
- Verifica que ambas pestañas estén en el MISMO código de sesión
- El primer usuario en crear la sesión es el "owner"
