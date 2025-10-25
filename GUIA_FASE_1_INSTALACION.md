# 🚀 FASE 1: Instalación y Prueba

## ✅ Archivos Creados

1. **`supabase-schema-COLABORACION-MEJORADA.sql`** - Schema de base de datos
2. **`src/services/collaborationServiceV2.js`** - Servicio mejorado con Presence
3. **`src/components/ShareModal.jsx`** - Modal para compartir con QR
4. **`PLAN_MEJORAS_COLABORACION.md`** - Plan completo de mejoras

---

## 📋 PASO 1: Ejecutar SQL en Supabase

### **Opción A: Dashboard Web (Recomendado)**

1. **Abre Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/ncomvnldhsclwxktegsx
   ```

2. **Ve a SQL Editor:**
   - Menú lateral izquierdo → **SQL Editor**
   - Click en **"New query"**

3. **Copia el contenido completo de:**
   ```
   supabase-schema-COLABORACION-MEJORADA.sql
   ```

4. **Pega y ejecuta:**
   - Pega todo el código en el editor
   - Click en **"Run"** (o `Ctrl+Enter`)
   - Espera el mensaje: `Success. No rows returned`

5. **Verifica la tabla:**
   - Menú lateral → **Table Editor**
   - Busca: `collaboration_sessions`
   - Deberías ver las columnas: `id`, `session_code`, `session_name`, etc.

6. **Verifica Realtime:**
   - Menú lateral → **Database** → **Publications**
   - Verifica que `supabase_realtime` incluya `collaboration_sessions`

---

## 🧪 PASO 2: Probar el Servicio V2

### **Prueba Rápida en Console**

Abre DevTools (F12) en tu navegador y ejecuta:

```javascript
// Importar el servicio (si ya está en tu app)
import collaborationServiceV2 from './src/services/collaborationServiceV2.js';

// Verificar configuración
console.log('¿Configurado?', collaborationServiceV2.isConfigured());

// Crear sesión de prueba
const session = await collaborationServiceV2.createSession({
  userName: 'Test User',
  sessionName: 'Sesión de Prueba',
  files: {}
});

console.log('✅ Sesión creada:', session);
console.log('📋 Link para compartir:', session.fullLink);
console.log('📱 QR Code:', session.qrCode);
```

---

## 🔗 PASO 3: Integrar en tu App

### **Opción A: Reemplazar servicio antiguo (Recomendado después de probar)**

```javascript
// En src/hooks/useCollaboration.js
// ANTES:
import collaborationService from "../services/collaborationService";

// DESPUÉS:
import collaborationService from "../services/collaborationServiceV2";
```

### **Opción B: Usar ambos (para testing)**

```javascript
// En src/App.jsx o donde uses colaboración
import collaborationServiceV1 from "./services/collaborationService";
import collaborationServiceV2 from "./services/collaborationServiceV2";

// Usar V2 para nuevas sesiones
const useV2 = true;
const service = useV2 ? collaborationServiceV2 : collaborationServiceV1;
```

---

## 🎨 PASO 4: Integrar ShareModal

### **En SessionManager.jsx (después de crear sesión):**

```javascript
import ShareModal from './ShareModal';

// En tu componente
const [showShareModal, setShowShareModal] = useState(false);
const [shareData, setShareData] = useState(null);

// Al crear sesión exitosamente
const handleCreateSession = async () => {
  try {
    const result = await collaborationServiceV2.createSession({
      userName,
      sessionName,
      files
    });
    
    // Mostrar modal de compartir
    setShareData(result);
    setShowShareModal(true);
    
    // También notificar al usuario
    console.log('✅ Sesión creada!');
    
  } catch (error) {
    console.error('Error:', error);
  }
};

// En el render
return (
  <>
    {/* Tu modal existente */}
    
    {/* Nuevo modal de compartir */}
    <ShareModal
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
      shareData={shareData}
      theme={theme}
    />
  </>
);
```

---

## 🧪 PASO 5: Prueba Completa

### **Test 1: Crear Sesión**

1. Abre tu app: `http://localhost:3000`
2. Click en **"Colaborar"**
3. Click en **"Crear Sesión"**
4. Ingresa tu nombre: "Usuario 1"
5. Ingresa nombre de sesión: "Test FASE 1"
6. Click en **"Crear"**

**✅ Esperado:**
- Se crea la sesión
- Aparece modal de compartir
- Ves código de 5 caracteres (ej: `A7F3K`)
- Ves link completo
- Puedes copiar al portapapeles
- Ves QR code

### **Test 2: Unirse a Sesión**

1. Abre otra pestaña/navegador: `http://localhost:3000`
2. Click en **"Colaborar"**
3. Click en **"Unirse a Sesión"**
4. Ingresa código: (el de arriba, ej: `A7F3K`)
5. Ingresa tu nombre: "Usuario 2"
6. Click en **"Unirse"**

**✅ Esperado:**
- Te unes exitosamente
- Ves los archivos del proyecto
- Usuario 1 ve notificación: "Usuario 2 se unió"

### **Test 3: Presencia Automática**

**En pestaña Usuario 1:**
- Abre Panel de Colaboración (lateral derecho)
- Deberías ver: **2 usuarios online**
- Usuario 1 (tú) - con tu color
- Usuario 2 - con otro color

**En pestaña Usuario 2:**
- También deberías ver **2 usuarios online**

**✅ Esperado:**
- Usuarios se detectan automáticamente
- No necesitas enviar eventos manuales
- Si cierras una pestaña, el otro ve: "Usuario X salió"

### **Test 4: Edición en Tiempo Real**

**En pestaña Usuario 1:**
1. Abre un archivo (ej: `index.html`)
2. Escribe: `<h1>Hola desde Usuario 1</h1>`

**En pestaña Usuario 2:**
1. **Sin hacer nada**, deberías ver el texto aparecer automáticamente
2. Escribe: `<p>Respuesta de Usuario 2</p>`

**En pestaña Usuario 1:**
- Deberías ver el párrafo aparecer

**✅ Esperado:**
- Cambios aparecen en ~50-200ms
- No hay conflictos
- Cursores de cada usuario visibles

---

## 🐛 Troubleshooting

### **Error: "Sesión no encontrada"**

**Causa:** Tabla no creada o Realtime no habilitado

**Solución:**
```sql
-- Ejecutar en Supabase SQL Editor
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_sessions;
```

### **Error: "Presence no funciona"**

**Causa:** Canal sin configuración de presence

**Verifica en DevTools Console:**
```javascript
// Deberías ver estos logs:
// ✅ Canal suscrito - anunciando presencia
// ✅ Presencia anunciada: [tu nombre]
// 👥 Usuarios en línea (sync): 1 ["Usuario 1"]
```

**Si no ves esos logs:**
```javascript
// Verifica que el canal esté correctamente configurado
channel.presenceState(); // Debería devolver usuarios
```

### **Error: "No se puede copiar al portapapeles"**

**Causa:** HTTPS requerido para Clipboard API

**Soluciones:**
1. Usa `localhost` (ya funciona)
2. O el fallback ya maneja esto automáticamente

### **Usuarios no se detectan automáticamente**

**Verifica:**
1. Ambos usuarios están en la **misma sesión** (mismo código)
2. Ambos están **SUBSCRIBED** (ver console logs)
3. Presence está **habilitado** en config del canal

---

## 📊 Comparativa: V1 vs V2

| Característica | V1 (Antiguo) | V2 (Nuevo) |
|----------------|--------------|------------|
| **Presencia** | Manual (eventos broadcast) | ✅ Nativa automática |
| **Usuarios online** | Lista manual con timeouts | ✅ Sync automático |
| **Links** | Largos, dependen de ngrok | ✅ Cortos (5 chars) |
| **QR Codes** | ❌ No | ✅ Sí |
| **Copiar link** | Manual | ✅ Un click |
| **Base de datos** | Intenta pero falla | ✅ Funciona |
| **Batching cursores** | ❌ No | ✅ 100ms batch |
| **Código** | 1194 líneas | 686 líneas |

---

## 🎯 Próximos Pasos (FASE 2)

Una vez que FASE 1 funcione 100%:

1. **Integrar Yjs CRDT** para conflictos
2. **Compression** de payloads grandes
3. **Analytics** de sesión
4. **Modo embed** para iframes

---

## 📝 Checklist de Verificación

Antes de continuar a FASE 2, verifica:

- [ ] ✅ Tabla `collaboration_sessions` creada en Supabase
- [ ] ✅ Realtime habilitado en la tabla
- [ ] ✅ Puedes crear una sesión
- [ ] ✅ Puedes unirte a sesión con código corto
- [ ] ✅ Presence funciona (ves usuarios automáticamente)
- [ ] ✅ Modal de compartir funciona
- [ ] ✅ QR code se genera
- [ ] ✅ Copiar al portapapeles funciona
- [ ] ✅ Edición en tiempo real funciona
- [ ] ✅ Cursores remotos visibles

---

## 🚨 IMPORTANTE

**NO borres el servicio antiguo (`collaborationService.js`) todavía.**

Primero prueba que V2 funciona al 100%. Una vez confirmado, puedes:

```bash
# Renombrar el antiguo como backup
mv src/services/collaborationService.js src/services/collaborationService.OLD.js

# Renombrar V2 como principal
mv src/services/collaborationServiceV2.js src/services/collaborationService.js
```

---

## 💬 ¿Preguntas?

Si algo no funciona:
1. Abre DevTools Console (F12)
2. Busca mensajes de error
3. Verifica que los logs de Presence aparezcan
4. Revisa que la tabla existe en Supabase

¡Listo para probar! 🚀
