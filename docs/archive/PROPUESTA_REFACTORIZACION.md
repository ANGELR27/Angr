# 🔧 PROPUESTA DE REFACTORIZACIÓN - CÓDIGO ESPECÍFICO

**Complemento de**: ANALISIS_MEJORAS_OPTIMIZACION.md  
**Objetivo**: Ejemplos concretos de código para implementar mejoras

---

## 1️⃣ CONSOLIDAR ESTADOS CON HOOKS PERSONALIZADOS

### Hook: useModals

**Archivo**: `src/hooks/useModals.js`

```javascript
import { useState, useCallback } from 'react';

/**
 * Hook centralizado para gestionar todos los modales/paneles
 * Reemplaza 13+ estados individuales de show/hide
 */
export function useModals() {
  const [openModals, setOpenModals] = useState(new Set());

  const openModal = useCallback((modalName) => {
    setOpenModals(prev => new Set(prev).add(modalName));
  }, []);

  const closeModal = useCallback((modalName) => {
    setOpenModals(prev => {
      const next = new Set(prev);
      next.delete(modalName);
      return next;
    });
  }, []);

  const toggleModal = useCallback((modalName) => {
    setOpenModals(prev => {
      const next = new Set(prev);
      if (next.has(modalName)) {
        next.delete(modalName);
      } else {
        next.add(modalName);
      }
      return next;
    });
  }, []);

  const isOpen = useCallback((modalName) => {
    return openModals.has(modalName);
  }, [openModals]);

  const closeAll = useCallback(() => {
    setOpenModals(new Set());
  }, []);

  return {
    openModal,
    closeModal,
    toggleModal,
    isOpen,
    closeAll,
    openModals: Array.from(openModals), // Para debugging
  };
}

// USO EN APP.JSX
// ANTES (13+ líneas):
// const [showImageManager, setShowImageManager] = useState(false);
// const [showThemeSelector, setShowThemeSelector] = useState(false);
// const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
// ... 10 más ...

// DESPUÉS (1 línea):
const { openModal, closeModal, isOpen } = useModals();

// En el código:
openModal('imageManager');
closeModal('themeSelector');
isOpen('gitPanel'); // true/false
```

---

### Hook: useLayout

**Archivo**: `src/hooks/useLayout.js`

```javascript
import { useReducer, useCallback } from 'react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

// Estado inicial con valores de localStorage
const initialState = {
  showPreview: loadFromStorage(STORAGE_KEYS.SHOW_PREVIEW, true),
  showTerminal: loadFromStorage(STORAGE_KEYS.SHOW_TERMINAL, false),
  showSidebar: true,
  isTerminalMaximized: false,
  splitViewEnabled: false,
  sidebarWidth: loadFromStorage(STORAGE_KEYS.SIDEBAR_WIDTH, 220),
  previewWidth: loadFromStorage(STORAGE_KEYS.PREVIEW_WIDTH, 50),
  terminalHeight: loadFromStorage(STORAGE_KEYS.TERMINAL_HEIGHT, 250),
};

// Reducer para manejar cambios de layout
function layoutReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_PREVIEW':
      return { ...state, showPreview: !state.showPreview };
    
    case 'TOGGLE_TERMINAL':
      return { ...state, showTerminal: !state.showTerminal };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, showSidebar: !state.showSidebar };
    
    case 'MAXIMIZE_TERMINAL':
      return { 
        ...state, 
        isTerminalMaximized: true,
        showPreview: false,
        showSidebar: false,
      };
    
    case 'RESTORE_TERMINAL':
      return { 
        ...state, 
        isTerminalMaximized: false,
        showSidebar: true,
      };
    
    case 'TOGGLE_SPLIT_VIEW':
      return { ...state, splitViewEnabled: !state.splitViewEnabled };
    
    case 'SET_SIDEBAR_WIDTH':
      return { ...state, sidebarWidth: action.payload };
    
    case 'SET_PREVIEW_WIDTH':
      return { ...state, previewWidth: action.payload };
    
    case 'SET_TERMINAL_HEIGHT':
      return { ...state, terminalHeight: action.payload };
    
    case 'RESET_LAYOUT':
      return initialState;
    
    default:
      return state;
  }
}

export function useLayout() {
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  // Auto-guardar en localStorage cuando cambia el estado
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SHOW_PREVIEW, state.showPreview);
    saveToStorage(STORAGE_KEYS.SHOW_TERMINAL, state.showTerminal);
    saveToStorage(STORAGE_KEYS.SIDEBAR_WIDTH, state.sidebarWidth);
    saveToStorage(STORAGE_KEYS.PREVIEW_WIDTH, state.previewWidth);
    saveToStorage(STORAGE_KEYS.TERMINAL_HEIGHT, state.terminalHeight);
  }, [state]);

  // Acciones con useCallback para estabilidad
  const togglePreview = useCallback(() => dispatch({ type: 'TOGGLE_PREVIEW' }), []);
  const toggleTerminal = useCallback(() => dispatch({ type: 'TOGGLE_TERMINAL' }), []);
  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const maximizeTerminal = useCallback(() => dispatch({ type: 'MAXIMIZE_TERMINAL' }), []);
  const restoreTerminal = useCallback(() => dispatch({ type: 'RESTORE_TERMINAL' }), []);
  const toggleSplitView = useCallback(() => dispatch({ type: 'TOGGLE_SPLIT_VIEW' }), []);
  
  const setSidebarWidth = useCallback((width) => {
    dispatch({ type: 'SET_SIDEBAR_WIDTH', payload: width });
  }, []);
  
  const setPreviewWidth = useCallback((width) => {
    dispatch({ type: 'SET_PREVIEW_WIDTH', payload: width });
  }, []);
  
  const setTerminalHeight = useCallback((height) => {
    dispatch({ type: 'SET_TERMINAL_HEIGHT', payload: height });
  }, []);
  
  const resetLayout = useCallback(() => dispatch({ type: 'RESET_LAYOUT' }), []);

  return {
    // Estado
    ...state,
    
    // Acciones
    togglePreview,
    toggleTerminal,
    toggleSidebar,
    maximizeTerminal,
    restoreTerminal,
    toggleSplitView,
    setSidebarWidth,
    setPreviewWidth,
    setTerminalHeight,
    resetLayout,
  };
}

// USO EN APP.JSX
// ANTES (9+ estados):
// const [showPreview, setShowPreview] = useState(true);
// const [showTerminal, setShowTerminal] = useState(false);
// const [showSidebar, setShowSidebar] = useState(true);
// const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
// const [splitViewEnabled, setSplitViewEnabled] = useState(false);
// const [sidebarWidth, setSidebarWidth] = useState(220);
// const [previewWidth, setPreviewWidth] = useState(50);
// const [terminalHeight, setTerminalHeight] = useState(250);

// DESPUÉS (1 línea):
const layout = useLayout();

// Acceso:
layout.showPreview      // Leer estado
layout.togglePreview()  // Cambiar estado
layout.maximizeTerminal() // Cambio complejo en un solo dispatch
```

---

## 2️⃣ CONTEXT API PARA COMPARTIR ESTADO

### ModalsContext

**Archivo**: `src/contexts/ModalsContext.jsx`

```javascript
import { createContext, useContext } from 'react';
import { useModals } from '../hooks/useModals';

const ModalsContext = createContext(null);

export function ModalsProvider({ children }) {
  const modals = useModals();
  return (
    <ModalsContext.Provider value={modals}>
      {children}
    </ModalsContext.Provider>
  );
}

export function useModalsContext() {
  const context = useContext(ModalsContext);
  if (!context) {
    throw new Error('useModalsContext debe usarse dentro de ModalsProvider');
  }
  return context;
}

// USO EN APP.JSX:
function App() {
  return (
    <ModalsProvider>
      <LayoutProvider>
        {/* Tu app */}
      </LayoutProvider>
    </ModalsProvider>
  );
}

// USO EN CUALQUIER COMPONENTE:
function TopBar() {
  const { openModal } = useModalsContext();
  
  return (
    <button onClick={() => openModal('themeSelector')}>
      Abrir temas
    </button>
  );
}
```

---

## 3️⃣ COMPONENTE UNIFICADO DE NOTIFICACIONES

### NotificationSystem (único)

**Archivo**: `src/components/NotificationSystem.jsx` (mejorado)

```javascript
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

const NOTIFICATION_TYPES = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    textColor: 'text-green-50',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500',
    textColor: 'text-red-50',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-50',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-50',
  },
  'user-joined': {
    icon: CheckCircle,
    bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
    textColor: 'text-white',
  },
  'user-left': {
    icon: AlertCircle,
    bgColor: 'bg-gradient-to-r from-gray-600 to-gray-700',
    textColor: 'text-gray-100',
  },
};

export default function NotificationSystem({ 
  notifications = [], 
  onRemove,
  position = 'top-right', // top-left, top-right, bottom-left, bottom-right
  maxNotifications = 5,
}) {
  // Auto-remover notificaciones después de 5 segundos
  useEffect(() => {
    const timers = notifications.map(notification => {
      if (notification.autoDismiss !== false) {
        return setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration || 5000);
      }
      return null;
    });

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer));
    };
  }, [notifications, onRemove]);

  const positionClasses = {
    'top-right': 'top-20 right-6',
    'top-left': 'top-20 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  // Limitar cantidad de notificaciones visibles
  const visibleNotifications = notifications.slice(0, maxNotifications);

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-[9999] space-y-3 pointer-events-none`}
      style={{ maxWidth: '400px' }}
    >
      {visibleNotifications.map((notification, index) => {
        const config = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.info;
        const Icon = config.icon;

        return (
          <div
            key={notification.id}
            className={`
              ${config.bgColor} ${config.textColor}
              rounded-lg shadow-2xl p-4 flex items-start gap-3
              pointer-events-auto
              transform transition-all duration-300
              ${index === 0 ? 'animate-slideInRight' : ''}
            `}
            style={{
              animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Icono */}
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            
            {/* Contenido */}
            <div className="flex-1 min-w-0">
              {notification.title && (
                <div className="font-semibold text-sm mb-1">
                  {notification.title}
                </div>
              )}
              <div className="text-sm opacity-95">
                {notification.userName && (
                  <span className="font-medium">{notification.userName}</span>
                )}
                {notification.userName && ' '}
                {notification.message}
              </div>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => onRemove(notification.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Hook para usar notificaciones
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
}

// ELIMINAR ESTOS ARCHIVOS:
// ❌ CollaborationNotification.jsx
// ❌ CollaborationNotifications.jsx
// ❌ NotificationCenter.jsx
```

---

## 4️⃣ MEJORAR UX - REEMPLAZAR ALERTS

### ANTES ❌
```javascript
// En TopBar.jsx y otros lugares
if (openTabs.length === 1) {
  alert('Necesitas al menos 2 archivos abiertos para usar Split View');
  return;
}
```

### DESPUÉS ✅
```javascript
import { useNotifications } from '../hooks/useNotifications';

function TopBar() {
  const { addNotification } = useNotifications();
  
  const handleToggleSplitView = () => {
    if (openTabs.length === 1) {
      addNotification({
        type: 'warning',
        title: 'Split View',
        message: 'Necesitas al menos 2 archivos abiertos',
        duration: 3000,
      });
      return;
    }
    // ... continuar
  };
}
```

---

## 5️⃣ CONSOLIDAR COMPONENTES DUPLICADOS

### Chat: Unificar en ChatPanel.jsx

```javascript
// ELIMINAR: CollaborativeChat.jsx
// MANTENER Y MEJORAR: ChatPanel.jsx

// Si CollaborativeChat tiene características únicas, migrarlas:
// 1. Revisar qué hace CollaborativeChat que ChatPanel no
// 2. Copiar esa funcionalidad a ChatPanel
// 3. Testear exhaustivamente
// 4. Eliminar CollaborativeChat.jsx
// 5. Actualizar todos los imports
```

**Script de migración**:
```bash
# Buscar todos los usos de CollaborativeChat
grep -r "CollaborativeChat" src/

# Reemplazar imports
# De: import CollaborativeChat from './CollaborativeChat'
# A:  import ChatPanel from './ChatPanel'
```

---

## 6️⃣ REORGANIZAR ESTRUCTURA DE CARPETAS

### Estructura ANTES
```
src/
  components/
    - 48 archivos mezclados
    - Difícil encontrar componentes relacionados
```

### Estructura DESPUÉS
```
src/
  components/
    collaboration/
      - CollaborationPanel.jsx
      - CollaborationBanner.jsx
      - SessionManager.jsx
      - ChatPanel.jsx (antes CollaborativeChat + ChatPanel)
      
    editor/
      - CodeEditor.jsx
      - Preview.jsx
      - TabBar.jsx
      - SearchWidget.jsx
      - CommandPalette.jsx
      
    panels/
      - GitPanel.jsx
      - SnippetManager.jsx
      - ImageManager.jsx
      - FileExplorer.jsx
      
    ui/
      - NotificationSystem.jsx (único sistema de notificaciones)
      - LoadingScreen.jsx
      - ErrorBoundary.jsx
      - Modal.jsx (componente base)
      
    layout/
      - TopBar.jsx
      - Terminal.jsx
      - Sidebar.jsx
      
    modals/
      - ThemeSelector.jsx
      - BackgroundSelector.jsx
      - ShortcutsHelp.jsx
      - AuthModal.jsx
```

---

## 7️⃣ ERROR BOUNDARIES PARA LAZY LOADING

```javascript
// src/components/ui/ErrorBoundary.jsx
import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900/20 p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
              Error al cargar componente
            </h3>
            <p className="text-sm text-red-600 dark:text-red-500 mb-4">
              {this.state.error?.message || 'Ocurrió un error inesperado'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// USO EN APP.JSX con Suspense + ErrorBoundary
<ErrorBoundary>
  <Suspense fallback={<LoadingSpinner />}>
    <ImageManager />
  </Suspense>
</ErrorBoundary>
```

---

## 8️⃣ REFACTOR APP.JSX - ANTES/DESPUÉS

### ANTES (fragmento)
```javascript
function App() {
  // 44+ estados individuales
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
  
  const [showPreview, setShowPreview] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [splitViewEnabled, setSplitViewEnabled] = useState(false);
  // ... y más ...
  
  return (
    <>
      {showImageManager && <ImageManager onClose={() => setShowImageManager(false)} />}
      {showThemeSelector && <ThemeSelector onClose={() => setShowThemeSelector(false)} />}
      {/* ... 10+ modales más ... */}
    </>
  );
}
```

### DESPUÉS (refactorizado)
```javascript
function App() {
  // 3 hooks principales
  const modals = useModals();
  const layout = useLayout();
  const { notifications, addNotification, removeNotification } = useNotifications();
  
  // Estados esenciales (~10 en lugar de 44)
  const [files, setFiles] = useState(() => loadFromStorage(STORAGE_KEYS.FILES, initialFiles));
  const [openTabs, setOpenTabs] = useState(() => loadFromStorage(STORAGE_KEYS.OPEN_TABS, ['index.html']));
  const [activeTab, setActiveTab] = useState(() => loadFromStorage(STORAGE_KEYS.ACTIVE_TAB, 'index.html'));
  const [currentTheme, setCurrentTheme] = useState(() => loadFromStorage(STORAGE_KEYS.THEME, 'neon-cyan'));
  const [images, setImages] = useState(() => loadFromStorage(STORAGE_KEYS.IMAGES, []));
  // ... solo estados esenciales ...
  
  return (
    <ModalsProvider>
      <LayoutProvider>
        <NotificationsProvider>
          {/* Sistema unificado de notificaciones */}
          <NotificationSystem 
            notifications={notifications}
            onRemove={removeNotification}
          />
          
          {/* Modales con renderizado condicional limpio */}
          <ModalManager modals={modals} />
          
          {/* Contenido principal */}
          <MainLayout layout={layout}>
            {/* ... */}
          </MainLayout>
        </NotificationsProvider>
      </LayoutProvider>
    </ModalsProvider>
  );
}

// Componente auxiliar para gestionar modales
function ModalManager({ modals }) {
  return (
    <>
      {modals.isOpen('imageManager') && (
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <ImageManager onClose={() => modals.closeModal('imageManager')} />
          </Suspense>
        </ErrorBoundary>
      )}
      
      {modals.isOpen('themeSelector') && (
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <ThemeSelector onClose={() => modals.closeModal('themeSelector')} />
          </Suspense>
        </ErrorBoundary>
      )}
      
      {/* ... otros modales ... */}
    </>
  );
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### ✅ Paso 1: Crear hooks
- [ ] Crear `src/hooks/useModals.js`
- [ ] Crear `src/hooks/useLayout.js`
- [ ] Crear `src/hooks/useNotifications.js`
- [ ] Testear cada hook independientemente

### ✅ Paso 2: Crear contexts
- [ ] Crear `src/contexts/ModalsContext.jsx`
- [ ] Crear `src/contexts/LayoutContext.jsx`
- [ ] Crear `src/contexts/NotificationsContext.jsx`

### ✅ Paso 3: Consolidar notificaciones
- [ ] Mejorar `NotificationSystem.jsx`
- [ ] Migrar funcionalidad de otros componentes
- [ ] Eliminar archivos duplicados
- [ ] Actualizar imports

### ✅ Paso 4: Consolidar chat
- [ ] Revisar diferencias entre ChatPanel y CollaborativeChat
- [ ] Unificar en ChatPanel.jsx
- [ ] Eliminar CollaborativeChat.jsx
- [ ] Actualizar imports

### ✅ Paso 5: Refactorizar App.jsx
- [ ] Reemplazar estados por hooks
- [ ] Implementar contexts
- [ ] Testear funcionalidad
- [ ] Verificar que nada se rompió

### ✅ Paso 6: Reorganizar carpetas
- [ ] Crear nueva estructura
- [ ] Mover archivos gradualmente
- [ ] Actualizar imports
- [ ] Verificar builds

### ✅ Paso 7: Mejorar UX
- [ ] Reemplazar alerts con notificaciones
- [ ] Añadir error boundaries
- [ ] Mejorar mensajes de error
- [ ] Testear flujos de usuario

---

## 🎯 RESULTADO FINAL ESPERADO

```javascript
// App.jsx después de todas las mejoras
function App() {
  // Solo 10-15 estados esenciales
  const [files, setFiles] = useState(initialFiles);
  const [openTabs, setOpenTabs] = useState(['index.html']);
  const [activeTab, setActiveTab] = useState('index.html');
  const [currentTheme, setCurrentTheme] = useState('neon-cyan');
  const [images, setImages] = useState([]);
  
  // Hooks personalizados (encapsulan lógica compleja)
  const modals = useModals();
  const layout = useLayout();
  const notifications = useNotifications();
  const collaboration = useCollaboration(files, setFiles);
  const auth = useAuth();
  
  // Código limpio, fácil de leer y mantener
  return (
    <AppProviders>
      <NotificationSystem {...notifications} />
      <ModalManager {...modals} />
      <MainLayout {...layout}>
        <TopBar />
        <Workspace />
      </MainLayout>
    </AppProviders>
  );
}

// ✅ Beneficios:
// - 70% menos líneas en App.jsx
// - Lógica organizada y reutilizable
// - Más fácil de testear
// - Mejor rendimiento
// - Código mantenible a largo plazo
```

---

**Nota final**: Implementar estos cambios gradualmente, en pequeños PRs, testeando cada cambio antes de continuar.
