# 🧪 Cómo Probar la Sincronización de Archivos

## 🎯 Objetivo
Verificar que cuando alguien se une a una sesión, recibe **todos los archivos del proyecto**.

---

## 📝 Pasos para Probar

### **1. Preparar Dos Navegadores**
```
Navegador 1: Chrome normal
Navegador 2: Chrome Incógnito (o Firefox)
```

### **2. Owner (Navegador 1) - Crear Sesión**

1. Abre: `http://localhost:3000`
2. Abre **DevTools** (F12)
3. Ve a la pestaña **Console**
4. Click en botón 👥 **Colaboración**
5. Click en **"Crear Nueva Sesión"**
6. Ingresa tu nombre: `Angel`
7. Click en **"Crear Sesión"**

**En consola deberías ver:**
```
✅ Sesión restaurada correctamente
💾 Proyecto inicial guardado con archivos: ["index.html", "styles.css", ...]
☁️ Proyecto guardado en Supabase
```

8. **Copia el enlace** que aparece (ej: `http://localhost:3000?session=abc12`)

---

### **3. Invitado (Navegador 2) - Unirse**

1. Pega el enlace en modo incógnito
2. Abre **DevTools** (F12)
3. Ve a la pestaña **Console**
4. Ingresa tu nombre: `María`
5. Click en **"Unirse"**

**En consola deberías ver:**
```
🔍 Buscando archivos del proyecto...
📡 Solicitud de archivos #1
```

---

### **4. Owner (Navegador 1) - Responder**

**En consola del owner deberías ver:**
```
📤 Owner enviando estado del proyecto a: [userId]
📡 Enviando estado del proyecto: {
  archivos: ['index.html', 'styles.css', ...],
  cantidadArchivos: 5
}
```

---

### **5. Invitado (Navegador 2) - Recibir**

**En consola del invitado deberías ver:**
```
📦 RECIBIENDO ESTADO DEL PROYECTO
   - Archivos recibidos: ["index.html", "styles.css", ...]
   - Total archivos: 5
   - De usuario: [ownerId]
✅ APLICANDO ARCHIVOS AL PROYECTO...
💾 Archivos guardados localmente
🎉 SINCRONIZACIÓN COMPLETA
```

---

## ✅ Verificaciones

### **Verificación 1: Archivos Visibles**
- En Navegador 2, mira el **File Explorer** (panel izquierdo)
- Deberías ver **todos los archivos** del proyecto
- ✅ index.html
- ✅ styles.css
- ✅ script.js
- ✅ carpetas completas

### **Verificación 2: Contenido Correcto**
- Click en `index.html` en Navegador 2
- Debería mostrar el **mismo contenido** que en Navegador 1

### **Verificación 3: Preview**
- En Navegador 2, abre el **Preview**
- Debería verse **exactamente igual** que en Navegador 1

---

## ❌ Problemas Comunes

### **Problema 1: "No se recibieron archivos o está vacío"**

**Consola del invitado:**
```
⚠️ No se recibieron archivos o está vacío
```

**Causa:** El owner no está enviando los archivos  
**Solución:**
1. Verifica que el owner vea en consola: `📤 Owner enviando...`
2. Si no aparece, el owner no está conectado correctamente
3. Ambos deben estar en la misma sesión (mismo `session=abc12`)

---

### **Problema 2: "Solicitud de archivos" pero sin respuesta**

**Consola del invitado:**
```
📡 Solicitud de archivos #1
📡 Solicitud de archivos #2
📡 Solicitud de archivos #3
```

**Sin ningún "RECIBIENDO ESTADO"**

**Causa:** El owner no está escuchando las solicitudes  
**Solución:**
1. Verifica que el owner esté en la pestaña activa (no en otra pestaña)
2. Recarga la página del owner
3. El sistema reintentará automáticamente 3 veces

---

### **Problema 3: Error de Supabase**

**Consola:**
```
⚠️ Error al guardar en Supabase: relation "collaboration_sessions" does not exist
```

**Causa:** No ejecutaste el script SQL en Supabase  
**Solución:**
1. Lee: `CONFIGURAR_SUPABASE.md`
2. Ejecuta: `supabase-setup.sql` en Supabase SQL Editor
3. La app usará localStorage como fallback mientras

---

### **Problema 4: Owner ve archivos, invitado no**

**Causa:** Los archivos no se están transmitiendo  
**Solución:**
1. En consola del owner, busca: `💾 Proyecto inicial guardado`
2. Si no aparece, los archivos no se guardaron
3. Verifica que `files` tenga contenido al crear la sesión

---

## 🔍 Logs Detallados

### **Owner - Logs Esperados:**
```
1. Crear sesión
   ✅ Sesión restaurada correctamente
   💾 Proyecto inicial guardado con archivos: [...]
   ☁️ Proyecto guardado en Supabase (o localStorage fallback)

2. Invitado se une
   📤 Owner enviando estado del proyecto a: [userId]
   📡 Enviando estado del proyecto: {...}
```

### **Invitado - Logs Esperados:**
```
1. Unirse
   🔍 Buscando archivos del proyecto...
   📡 Solicitud de archivos #1
   
2. Recibir archivos
   📦 RECIBIENDO ESTADO DEL PROYECTO
   ✅ APLICANDO ARCHIVOS AL PROYECTO...
   🎉 SINCRONIZACIÓN COMPLETA
```

---

## 📊 Tabla de Verificación

| Paso | Owner (Nav 1) | Invitado (Nav 2) | Estado |
|------|---------------|------------------|--------|
| **1. Crear sesión** | ✅ Sesión creada | - | ⏳ |
| **2. Guardar archivos** | ✅ Proyecto guardado | - | ⏳ |
| **3. Unirse** | - | ✅ Conectado | ⏳ |
| **4. Solicitar archivos** | - | ✅ 3 solicitudes | ⏳ |
| **5. Enviar archivos** | ✅ Estado enviado | - | ⏳ |
| **6. Recibir archivos** | - | ✅ Archivos recibidos | ✅ |
| **7. Ver archivos** | ✅ Todos visibles | ✅ Todos visibles | ✅ |

---

## 🎉 Éxito

Si ves esto en la consola del invitado:

```
🎉 SINCRONIZACIÓN COMPLETA
```

Y además:
- ✅ File Explorer muestra todos los archivos
- ✅ Al abrir archivos, tienen el contenido correcto
- ✅ Preview muestra el proyecto funcionando

**¡La sincronización funciona perfectamente!** 🚀

---

## 🔄 Prueba de Edición en Tiempo Real

Después de sincronizar los archivos:

### **Owner (Nav 1):**
1. Abre `index.html`
2. Escribe algo: `<h1>Hola</h1>`

### **Invitado (Nav 2):**
1. Debería ver aparecer `<h1>Hola</h1>` en tiempo real
2. Espera máximo 150ms

---

**Si todo funciona, estás listo para colaborar!** ✨
