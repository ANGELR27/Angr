# ⚡ ACCIONES INMEDIATAS - QUICK WINS

**Para empezar HOY**: Cambios con alto impacto y bajo riesgo

---

## 🔴 URGENTE: ELIMINAR ARCHIVOS DUPLICADOS (5 minutos)

### 1. Sistema de Notificaciones - Mantener SOLO 1

```bash
# ELIMINAR estos 3 archivos:
rm src/components/CollaborationNotification.jsx
rm src/components/CollaborationNotifications.jsx
rm src/components/NotificationCenter.jsx

# MANTENER SOLO:
# ✅ src/components/NotificationSystem.jsx
```

**Después de eliminar**:
```bash
# Buscar y corregir imports rotos
grep -r "CollaborationNotification" src/
grep -r "NotificationCenter" src/

# Reemplazar todos por:
# import NotificationSystem from './NotificationSystem'
```

---

### 2. Sistema de Chat - Consolidar en 1

```bash
# Primero REVISAR qué hace cada uno:
code src/components/ChatPanel.jsx
code src/components/CollaborativeChat.jsx

# Después ELIMINAR el menos completo:
rm src/components/CollaborativeChat.jsx  # (o ChatPanel, según tu análisis)

# MANTENER el más completo y actualizar imports
```

---

## 🟡 HOY: CREAR HOOKS BÁSICOS (30 minutos)

### Hook 1: useModals (15 min)

**Crear archivo**: `src/hooks/useModals.js`

```javascript
import { useState, useCallback } from 'react';

export function useModals() {
  const [modals, setModals] = useState({});

  const openModal = useCallback((name) => {
    setModals(prev => ({ ...prev, [name]: true }));
  }, []);

  const closeModal = useCallback((name) => {
    setModals(prev => ({ ...prev, [name]: false }));
  }, []);

  const isOpen = useCallback((name) => !!modals[name], [modals]);

  return { openModal, closeModal, isOpen };
}
```

**Usar en App.jsx**:
```javascript
// ANTES:
// const [showImageManager, setShowImageManager] = useState(false);
// const [showThemeSelector, setShowThemeSelector] = useState(false);
// ... 11 más ...

// DESPUÉS:
const { openModal, closeModal, isOpen } = useModals();

// Reemplazar:
setShowImageManager(true) → openModal('imageManager')
setShowImageManager(false) → closeModal('imageManager')  
showImageManager → isOpen('imageManager')
```

---

### Hook 2: useNotifications (15 min)

**Crear archivo**: `src/hooks/useNotifications.js`

```javascript
import { useState, useCallback } from 'react';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, addNotification, removeNotification };
}
```

**Usar en App.jsx**:
```javascript
const { notifications, addNotification, removeNotification } = useNotifications();

// Reemplazar alerts:
// ANTES: alert('Error al crear archivo');
// DESPUÉS:
addNotification({
  type: 'error',
  message: 'Error al crear archivo'
});
```

---

## 🟢 ESTA SEMANA: REFACTORIZAR APP.JSX (2-3 horas)

### Día 1: Reemplazar estados de modales (1 hora)

```javascript
// En App.jsx, BUSCAR y REEMPLAZAR:

// ❌ ELIMINAR (13 líneas):
const [showImageManager, setShowImageManager] = useState(false);
const [showThemeSelector, setShowThemeSelector] = useState(false);
const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
const [showResetModal, setShowResetModal] = useState(false);
const [showSessionManager, setShowSessionManager] = useState(false);
const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
const [showSnippetManager, setShowSnippetManager] = useState(false);
const [showGitPanel, setShowGitPanel] = useState(false);
const [showChat, setShowChat] = useState(false);
const [showDevToolsMenu, setShowDevToolsMenu] = useState(false);
const [showFloatingTerminal, setShowFloatingTerminal] = useState(false);
const [isChatMinimized, setIsChatMinimized] = useState(false);

// ✅ AGREGAR (1 línea):
const { openModal, closeModal, isOpen } = useModals();

// ✅ BUSCAR Y REEMPLAZAR en todo el archivo:
// setShowImageManager(true) → openModal('imageManager')
// setShowImageManager(false) → closeModal('imageManager')
// showImageManager → isOpen('imageManager')
// ... repetir para todos los modales ...
```

**Comando para buscar y reemplazar**:
```bash
# Contar cuántas veces aparece cada set function
grep -o "setShowImageManager" src/App.jsx | wc -l
grep -o "showImageManager" src/App.jsx | wc -l

# Ver todas las ocurrencias para reemplazar manualmente
grep -n "showImageManager" src/App.jsx
```

---

### Día 2: Reemplazar alerts (30 min)

```javascript
// BUSCAR en todo el proyecto:
grep -r "alert(" src/

// REEMPLAZAR cada uno por:
addNotification({
  type: 'warning', // o 'error', 'success', 'info'
  title: 'Título opcional',
  message: 'Mensaje descriptivo'
});

// EJEMPLO:
// ❌ ANTES:
if (openTabs.length === 1) {
  alert('Necesitas al menos 2 archivos para Split View');
  return;
}

// ✅ DESPUÉS:
if (openTabs.length === 1) {
  addNotification({
    type: 'warning',
    title: 'Split View',
    message: 'Necesitas al menos 2 archivos abiertos'
  });
  return;
}
```

---

### Día 3: Testear y ajustar (1 hora)

```bash
# Correr el servidor
npm run dev

# Checklist de pruebas:
✅ Abrir cada modal desde el menú
✅ Cerrar cada modal con X
✅ Verificar notificaciones funcionan
✅ Probar colaboración (si aplica)
✅ Verificar que no hay errores en consola
✅ Probar en diferentes temas (lite, fade, normal)
```

---

## 📊 MÉTRICAS RÁPIDAS

### Antes de empezar:
```bash
# Contar líneas en App.jsx
wc -l src/App.jsx
# Resultado esperado: ~2394 líneas

# Contar archivos en components/
ls -1 src/components/*.jsx | wc -l
# Resultado esperado: ~48 archivos

# Contar useState en App.jsx
grep -c "useState" src/App.jsx
# Resultado esperado: ~44
```

### Después de acciones inmediatas:
```bash
# Líneas en App.jsx
wc -l src/App.jsx
# Objetivo: ~2200 líneas (-8%)

# Archivos en components/
ls -1 src/components/*.jsx | wc -l
# Objetivo: ~44 archivos (-4 archivos)

# useState en App.jsx
grep -c "useState" src/App.jsx
# Objetivo: ~30 (-32%)
```

---

## ✅ CHECKLIST DIARIO

### DÍA 1 (Hoy - 30 min)
- [ ] Leer ANALISIS_MEJORAS_OPTIMIZACION.md
- [ ] Eliminar CollaborationNotification.jsx
- [ ] Eliminar CollaborationNotifications.jsx
- [ ] Eliminar NotificationCenter.jsx
- [ ] Corregir imports rotos
- [ ] Testear que nada se rompió

### DÍA 2 (Mañana - 1 hora)
- [ ] Crear useModals.js
- [ ] Crear useNotifications.js
- [ ] Integrar hooks en App.jsx (primeras 3 modales)
- [ ] Testear funcionalidad

### DÍA 3 (2 horas)
- [ ] Terminar migración de todos los modales a useModals
- [ ] Reemplazar primeros 5 alerts con notificaciones
- [ ] Testear exhaustivamente
- [ ] Commit y push

### DÍA 4 (1 hora)
- [ ] Eliminar CollaborativeChat.jsx o ChatPanel.jsx (el duplicado)
- [ ] Corregir imports
- [ ] Testear chat colaborativo
- [ ] Commit

### DÍA 5 (1 hora)
- [ ] Reemplazar alerts restantes
- [ ] Limpiar código comentado/no usado
- [ ] Documentar cambios en CHANGELOG.md
- [ ] Commit final

---

## 🎯 OBJETIVO SEMANAL

**Meta**: Reducir complejidad de App.jsx en 30%

**Resultados medibles**:
- ✅ De 44 estados a ~30 estados (-32%)
- ✅ De 48 componentes a ~44 (-8%)
- ✅ 0 archivos duplicados
- ✅ 0 alerts en el código
- ✅ Mejor organización del código

**Próxima semana**: 
- Implementar useLayout hook
- Crear contexts (Modals, Layout)
- Reorganizar estructura de carpetas

---

## 🚨 COSAS QUE NO TOCAR (de momento)

❌ **NO TOCAR**:
- CodeEditor.jsx (componente complejo y crítico)
- useCollaboration.js (sistema estable)
- Terminal.jsx (funcionalidad compleja)
- Preview.jsx (renderizado delicado)
- FileExplorer.jsx (lógica de árbol compleja)

✅ **SEGURO TOCAR**:
- App.jsx (refactorizar estados)
- TopBar.jsx (mejorar UX)
- Componentes de notificaciones (consolidar)
- Componentes duplicados (eliminar)

---

## 💡 CONSEJOS

1. **Haz cambios incrementales**: Commit después de cada cambio exitoso
2. **Testea constantemente**: Abre el navegador después de cada cambio
3. **Usa git branches**: `git checkout -b refactor/consolidate-notifications`
4. **Lee los errores**: Si algo se rompe, la consola te dirá exactamente qué
5. **Pide ayuda**: Si algo no funciona, pregunta antes de seguir

---

## 🔧 COMANDOS ÚTILES

```bash
# Buscar todos los usos de un componente
grep -r "ComponentName" src/

# Buscar archivos que importan algo específico
grep -l "import.*CollaborationNotification" src/**/*.{js,jsx}

# Ver tamaño de archivos
du -h src/components/*.jsx | sort -h

# Contar líneas de código
cloc src/

# Buscar TODOs y FIXMEs
grep -r "TODO\|FIXME" src/

# Ver git log de un archivo
git log --oneline src/App.jsx
```

---

## 📞 PRÓXIMOS PASOS

Después de completar estas acciones inmediatas:

1. ✅ Revisar PROPUESTA_REFACTORIZACION.md para cambios más profundos
2. ✅ Planificar implementación de Contexts
3. ✅ Considerar useReducer para estados complejos
4. ✅ Reorganizar estructura de carpetas

**Documentos de referencia**:
- 📄 ANALISIS_MEJORAS_OPTIMIZACION.md - Análisis completo
- 📄 PROPUESTA_REFACTORIZACION.md - Código específico de ejemplo
- 📄 ACCIONES_INMEDIATAS.md - Este documento (quick wins)

---

**¡Éxito! 🚀** Cada pequeña mejora cuenta.
