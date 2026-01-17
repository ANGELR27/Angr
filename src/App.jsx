import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
// Componentes críticos - carga inmediata
import FileExplorer from './components/FileExplorer'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'
import TopBar from './components/TopBar'
import Terminal from './components/Terminal'
import AutoSaveIndicator from './components/AutoSaveIndicator'
import CollaborationBanner from './components/CollaborationBanner'
import CollaborationNotification from './components/CollaborationNotification'
import ExecutionPulse from './components/ExecutionPulse'
import Breadcrumbs from './components/Breadcrumbs'
import KeyboardShortcutIndicator from './components/KeyboardShortcutIndicator'
import GlobalSearch from './components/GlobalSearch'
import CodeParticles from './components/CodeParticles'

// Componentes secundarios - lazy loading optimizado para mejor performance
// Solo componentes grandes (>5KB) que no se usan al inicio
const ImageManager = lazy(() => import('./components/ImageManager'))
const ThemeSelector = lazy(() => import('./components/ThemeSelector'))
const BackgroundSelector = lazy(() => import('./components/BackgroundSelector'))
const TypographySelector = lazy(() => import('./components/TypographySelector'))
const ShortcutsHelp = lazy(() => import('./components/ShortcutsHelp'))
const SessionManager = lazy(() => import('./components/SessionManager'))
const CollaborationPanel = lazy(() => import('./components/CollaborationPanel'))
const ChatPanel = lazy(() => import('./components/ChatPanel'))
const AuthModal = lazy(() => import('./components/AuthModal'))
const SnippetManager = lazy(() => import('./components/SnippetManager'))
const GitPanel = lazy(() => import('./components/GitPanel'))
const DevToolsMenu = lazy(() => import('./components/DevToolsMenu'))
const FloatingTerminal = lazy(() => import('./components/FloatingTerminal'))

// Componente de carga simple para Suspense
const LoadingFallback = () => <div style={{ display: 'none' }} />;

import databaseService from './services/databaseService'
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './utils/storage'
import { applyGlobalTheme } from './utils/globalThemes'
import { useDebouncedSaveMultiple } from './hooks/useDebouncedSave'
import { useCollaboration } from './hooks/useCollaboration'
import { useAuth } from './hooks/useAuth'
import { useModals } from './hooks/useModals'
import { buildPreview } from './utils/previewBuilder'
import { runPython } from './services/pythonRuntime';

// Archivos de ejemplo iniciales
const initialFiles = {
  'index.html': {
    name: 'index.html',
    type: 'file',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Proyecto Web</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>¡Hola Mundo!</h1>
        <p class="subtitle">Bienvenido al editor de código</p>
        <button onclick="saludar()">Haz clic aquí</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`
  },
  'styles.css': {
    name: 'styles.css',
    type: 'file',
    language: 'css',
    content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    text-align: center;
    max-width: 500px;
}

h1 {
    color: #667eea;
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: fadeIn 1s ease-in;
}

.subtitle {
    color: #666;
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.3s ease;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`
  },
  'script.js': {
    name: 'script.js',
    type: 'file',
    language: 'javascript',
    content: `// JavaScript interactivo
function saludar() {
    const nombres = ['👋 ¡Hola!', '🎉 ¡Excelente!', '✨ ¡Fantástico!', '🚀 ¡Increíble!'];
    const randomNombre = nombres[Math.floor(Math.random() * nombres.length)];
    
    alert(randomNombre + ' Estás usando el editor de código.');
    
    console.log('Botón clickeado a las:', new Date().toLocaleTimeString());
}

// Efecto de consola
console.log('%c¡Editor de Código Iniciado!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cEdita el código y mira los cambios en tiempo real', 'color: #764ba2; font-size: 14px;');

// Animación adicional al cargar
window.addEventListener('load', () => {
    console.log('✅ Página cargada completamente');
});`
  },
  'components': {
    name: 'components',
    type: 'folder',
    children: {
      'header.html': {
        name: 'header.html',
        type: 'file',
        language: 'html',
        content: `<!-- Componente Header -->\n<header>\n    <nav>\n        <h1>Mi Sitio</h1>\n    </nav>\n</header>`
      }
    }
  },
  'examples': {
    name: 'examples',
    type: 'folder',
    children: {
      'example.js': {
        name: 'example.js',
        type: 'file',
        language: 'javascript',
        content: `// Ejemplo de código JavaScript\nconst ejemplo = () => {\n    console.log("Este es un ejemplo");\n};\n\nejemplo();`
      },
      'App.jsx': {
        name: 'App.jsx',
        type: 'file',
        language: 'javascriptreact',
        content: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="app">
      <h1>Contador React</h1>
      <p>Has hecho clic {count} veces</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      <button onClick={() => setCount(0)}>
        Resetear
      </button>
    </div>
  );
}

export default App;`
      },
      'script.py': {
        name: 'script.py',
        type: 'file',
        language: 'python',
        content: `# Ejemplo de código Python
def saludar(nombre):
    """
    Función que saluda a una persona
    """
    return f"¡Hola, {nombre}!"

def calcular_factorial(n):
    """
    Calcula el factorial de un número
    """
    if n <= 1:
        return 1
    return n * calcular_factorial(n - 1)

# Código principal
if __name__ == "__main__":
    print(saludar("Mundo"))
    print(f"Factorial de 5: {calcular_factorial(5)}")
    
    # Lista de números
    numeros = [1, 2, 3, 4, 5]
    cuadrados = [n**2 for n in numeros]
    print(f"Cuadrados: {cuadrados}")`
      }
    }
  }
};

function App() {
  // Cargar estado inicial desde localStorage
  const [files, setFiles] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.FILES, initialFiles);
  });

  const [openTabs, setOpenTabs] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.OPEN_TABS, ['index.html']);
  });
  const [activeTab, setActiveTab] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.ACTIVE_TAB, 'index.html');
  });
  const [showPreview, setShowPreview] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.SHOW_PREVIEW, true);
  });
  const [showTerminal, setShowTerminal] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.SHOW_TERMINAL, false);
  });
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  // ✅ MIGRADO A useModals: showImageManager, showThemeSelector, showShortcutsHelp
  // const [showImageManager, setShowImageManager] = useState(false);
  // const [showThemeSelector, setShowThemeSelector] = useState(false);
  // const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  // ✅ MIGRADO A useModals: showResetModal, showSessionManager, showCollaborationPanel,
  //    showBackgroundSelector, showSnippetManager, showGitPanel
  // const [showResetModal, setShowResetModal] = useState(false);
  // const [showSessionManager, setShowSessionManager] = useState(false);
  // const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  // const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  // const [showSnippetManager, setShowSnippetManager] = useState(false);
  // const [showGitPanel, setShowGitPanel] = useState(false);
  const [editorBackground, setEditorBackground] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.EDITOR_BACKGROUND, { id: 'none', image: null, opacity: 0.15, blur: 0 });
  });
  // 🎯 NUEVO: Estado para modo práctica (sin autocompletado)
  const [practiceModeEnabled, setPracticeModeEnabled] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.PRACTICE_MODE, false);
  });

  const [appFont, setAppFont] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.APP_FONT, { id: 'theme-default', value: 'var(--theme-font-family)' });
    if (typeof stored === 'string') {
      return { id: 'custom', value: stored };
    }
    return stored;
  });

  const [codeFont, setCodeFont] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEYS.CODE_FONT, { id: 'consolas', value: "'Consolas', 'Courier New', monospace" });
    if (typeof stored === 'string') {
      return { id: 'custom', value: stored };
    }
    return stored;
  });
  // 📂 NUEVO: Estado para Split View
  const [splitViewEnabled, setSplitViewEnabled] = useState(false);
  const [secondPanelTab, setSecondPanelTab] = useState(null);
  // 🔥 NUEVO: Estados para chat
  // ✅ MIGRADO A useModals: showChat
  // const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  // ✨ NUEVO: Estado para menú de herramientas dev
  // ✅ MIGRADO A useModals: showDevToolsMenu
  // const [showDevToolsMenu, setShowDevToolsMenu] = useState(false);
  // ✨ Nuevo: Animación de intercambio editor/terminal en Fade
  const [swapAnim, setSwapAnim] = useState('none'); // 'none' | 'toTerminal' | 'toEditor'
  const swapTimerRef = useRef(null);
  // 🚀 NUEVO: Terminal flotante con glassmorphism
  // ✅ MIGRADO A useModals: showFloatingTerminal
  // const [showFloatingTerminal, setShowFloatingTerminal] = useState(false);
  const [floatingTerminalOutput, setFloatingTerminalOutput] = useState('');
  const [floatingTerminalError, setFloatingTerminalError] = useState(false);
  
  // 🎯 NUEVO: Preview arrastrable en modo Fade
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const previewDragRef = useRef(null);
  
  // 🎨 Efectos modo Fade
  const [dayNightMode, setDayNightMode] = useState(() => loadFromStorage('DAY_NIGHT_MODE', 'auto')); // 'auto' | 'disabled'
  const [executionPulse, setExecutionPulse] = useState({ show: false, isError: false });
  
  const [currentTheme, setCurrentTheme] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.THEME, 'neon-cyan');
  });
  const [images, setImages] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.IMAGES, []);
  });
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.SIDEBAR_WIDTH, 220);
  });
  const [previewWidth, setPreviewWidth] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.PREVIEW_WIDTH, 50);
  });
  const [terminalHeight, setTerminalHeight] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.TERMINAL_HEIGHT, 250);
  });
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error
  const terminalRef = useRef(null);
  const isResizingSidebar = useRef(false);
  const isResizingPreview = useRef(false);
  const isResizingTerminal = useRef(false);
  const prevThemeRef = useRef('vs-dark');

  // Callback para actualizar estado de guardado
  const handleSaveStatusChange = useCallback((status) => {
    setSaveStatus(status);
  }, []);

  // Guardado optimizado con debounce centralizado
  // Todos los datos se guardan con un solo debounce de 1000ms
  useDebouncedSaveMultiple({
    [STORAGE_KEYS.FILES]: files,
    [STORAGE_KEYS.OPEN_TABS]: openTabs,
    [STORAGE_KEYS.ACTIVE_TAB]: activeTab,
    [STORAGE_KEYS.THEME]: currentTheme,
    [STORAGE_KEYS.IMAGES]: images,
    [STORAGE_KEYS.SHOW_PREVIEW]: showPreview,
    [STORAGE_KEYS.SHOW_TERMINAL]: showTerminal,
    [STORAGE_KEYS.SIDEBAR_WIDTH]: sidebarWidth,
    [STORAGE_KEYS.PREVIEW_WIDTH]: previewWidth,
    [STORAGE_KEYS.TERMINAL_HEIGHT]: terminalHeight,
    [STORAGE_KEYS.PRACTICE_MODE]: practiceModeEnabled,
    [STORAGE_KEYS.APP_FONT]: appFont,
    [STORAGE_KEYS.CODE_FONT]: codeFont,
  }, 1000, handleSaveStatusChange);

  // Hook de colaboración en tiempo real
  const {
    isCollaborating,
    activeUsers,
    currentSession,
    currentUser,
    remoteCursors,
    isConfigured: isCollaborationConfigured,
    createSession,
    joinSession,
    broadcastFileChange,
    broadcastCursorMove,
    changeUserPermissions,
    leaveSession,
    notifications,
    typingUsers,
    removeNotification,
  } = useCollaboration(files, setFiles);

  // 🔐 Hook de autenticación
  const {
    user,
    loading: authLoading,
    isAuthenticated,
    isConfigured: isAuthConfigured,
    login,
    signup,
    loginWithProvider,
    logout,
    getDisplayName
  } = useAuth();

  // 🎛️ Hook de gestión de modales centralizado
  const { openModal, closeModal, toggleModal, isOpen } = useModals();

  // Estado para AuthModal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPendingAction, setAuthPendingAction] = useState(null); // 'create' o 'join'

  // Aplicar tema cuando cambia (incluye montaje inicial)
  useEffect(() => {
    applyGlobalTheme(currentTheme);
  }, [currentTheme]);

  const ensureGoogleFontLoaded = useCallback((googleSpec) => {
    if (!googleSpec || typeof document === 'undefined') return;
    const id = `google-font-${googleSpec.replace(/[^a-z0-9_-]/gi, '_')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${googleSpec}&display=swap`;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const family = appFont?.value || 'var(--theme-font-family)';
    root.style.setProperty('--app-font-family', family);
    if (appFont?.google) {
      ensureGoogleFontLoaded(appFont.google);
    }
  }, [appFont, ensureGoogleFontLoaded]);

  useEffect(() => {
    const root = document.documentElement;
    const family = codeFont?.value || "'Consolas', 'Courier New', monospace";
    root.style.setProperty('--code-font-family', family);
    if (codeFont?.google) {
      ensureGoogleFontLoaded(codeFont.google);
    }
  }, [codeFont, ensureGoogleFontLoaded]);

  // Ocultar efectos de fondo del body cuando hay imagen personalizada
  useEffect(() => {
    if (editorBackground.image) {
      document.body.classList.add('has-custom-background');
    } else {
      document.body.classList.remove('has-custom-background');
    }
  }, [editorBackground.image]);

  // Toggle modo lite conservando el tema previo
  const handleToggleLite = () => {
    if (currentTheme === 'lite') {
      setCurrentTheme(prevThemeRef.current || 'vs-dark');
    } else {
      prevThemeRef.current = currentTheme;
      setCurrentTheme('lite');
    }
  };

  // Toggle modo feel conservando el tema previo
  const handleToggleFeel = () => {
    if (currentTheme === 'feel') {
      setCurrentTheme(prevThemeRef.current || 'vs-dark');
    } else {
      prevThemeRef.current = currentTheme;
      setCurrentTheme('feel');
    }
  };

  // Toggle modo fade conservando el tema previo
  const handleToggleFade = () => {
    if (currentTheme === 'fade') {
      setCurrentTheme(prevThemeRef.current || 'vs-dark');
      setShowSidebar(true);
      setShowPreview(false);
    } else {
      prevThemeRef.current = currentTheme;
      setCurrentTheme('fade');
      // En modo Fade: ocultar sidebar pero mantener preview disponible
      setShowSidebar(false);
      // Resetear posición del preview al activar fade mode
      setPreviewPosition({ x: 0, y: 0 });
    }
  };

  const handleToggleEclipse = () => {
    if (currentTheme === 'eclipse') {
      setCurrentTheme(prevThemeRef.current || 'vs-dark');
      setShowSidebar(true);
    } else {
      prevThemeRef.current = currentTheme;
      setCurrentTheme('eclipse');
      setShowSidebar(true);
    }
  };

  // Estado para indicador de atajos
  const [shortcutIndicator, setShortcutIndicator] = useState(null);
  
  // Estado para búsqueda global
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  const showShortcut = useCallback((shortcut, action) => {
    setShortcutIndicator({ shortcut, action });
  }, []);

  // ⚡ Listener mejorado para atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + B: Toggle Sidebar
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setShowSidebar(prev => {
          showShortcut('Ctrl+B', prev ? 'Mostrar Sidebar' : 'Ocultar Sidebar');
          return !prev;
        });
      }
      
      // Ctrl + J: Toggle Terminal
      if (e.ctrlKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setShowTerminal(prev => {
          showShortcut('Ctrl+J', prev ? 'Mostrar Terminal' : 'Ocultar Terminal');
          return !prev;
        });
      }
      
      // Ctrl + \\: Toggle Split View
      if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        if (openTabs.length < 2) {
          showShortcut('Ctrl+\\', 'Necesitas 2+ archivos para Split View');
          return;
        }
        setSplitViewEnabled(prev => {
          const newValue = !prev;
          if (newValue && !secondPanelTab) {
            const otherTab = openTabs.find(t => t !== activeTab);
            setSecondPanelTab(otherTab);
          }
          showShortcut('Ctrl+\\', newValue ? 'Split View Activado' : 'Split View Desactivado');
          return newValue;
        });
      }
      
      // Ctrl + Shift + T: Toggle Theme Selector
      if ((e.metaKey && e.key.toLowerCase() === 't') || 
          (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't')) {
        e.preventDefault();
        toggleModal('themeSelector');
        showShortcut('Ctrl+Shift+T', 'Selector de Temas');
      }
      
      // Ctrl + Shift + F: Búsqueda Global
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setShowGlobalSearch(true);
        showShortcut('Ctrl+Shift+F', 'Búsqueda Global en Archivos');
      }
      
      // Ctrl + Shift + P: Command Palette
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        // TODO: Implementar command palette en siguiente mejora
        showShortcut('Ctrl+Shift+P', 'Command Palette (Próximamente)');
      }
      
      // ? o F1: Mostrar ayuda de atajos
      if (e.key === '?' || e.key === 'F1') {
        e.preventDefault();
        toggleModal('shortcuts');
        showShortcut('F1', 'Ayuda de Atajos');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openTabs, activeTab, secondPanelTab, showShortcut, toggleModal]);

  const getFileByPath = useCallback((path) => {
    const parts = path.split('/');
    let currentLevel = files;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const entry = currentLevel ? currentLevel[part] : undefined;
      if (!entry) return null;

      // Si es la última parte, devolver el elemento encontrado
      if (i === parts.length - 1) {
        return entry;
      }

      // Si es carpeta, bajar a sus children, si no, el path es inválido
      if (entry.type === 'folder' && entry.children) {
        currentLevel = entry.children;
      } else {
        return null;
      }
    }

    return null;
  }, [files]);

  const handleFileSelect = useCallback((filePath) => {
    const file = getFileByPath(filePath);
    
    if (file && file.type === 'file') {
      if (!openTabs.includes(filePath)) {
        setOpenTabs([...openTabs, filePath]);
      }
      setActiveTab(filePath);
    }
  }, [getFileByPath, openTabs]);

  const handleTabClose = useCallback((tabPath) => {
    const newTabs = openTabs.filter(tab => tab !== tabPath);
    setOpenTabs(newTabs);
    
    if (activeTab === tabPath && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1]);
    }
  }, [openTabs, activeTab]);

  const handleCodeChange = useCallback((value) => {
    const parts = activeTab.split('/');
    
    const updateNestedFile = (obj, path, newContent) => {
      if (path.length === 1) {
        return {
          ...obj,
          [path[0]]: {
            ...obj[path[0]],
            content: newContent
          }
        };
      }
      
      const [first, ...rest] = path;
      return {
        ...obj,
        [first]: {
          ...obj[first],
          children: updateNestedFile(obj[first].children, rest, newContent)
        }
      };
    };
    
    setFiles(updateNestedFile(files, parts, value));
  }, [activeTab, files]);

  // Handler para insertar snippets en el editor
  const handleInsertSnippet = useCallback((snippetCode) => {
    const activeFile = getFileByPath(activeTab);
    if (!activeFile) return;

    // Insertar snippet al final del contenido actual
    const currentContent = activeFile.content || '';
    const newContent = currentContent + '\n\n' + snippetCode;
    handleCodeChange(newContent);
  }, [getFileByPath, activeTab, handleCodeChange]);

  // Handler para activar/desactivar Split View
  const handleToggleSplitView = () => {
    if (!splitViewEnabled && openTabs.length > 1) {
      // Activar split view: usar el segundo tab como segundo panel
      setSplitViewEnabled(true);
      setSecondPanelTab(openTabs[1]);
    } else if (!splitViewEnabled && openTabs.length === 1) {
      alert('Necesitas al menos 2 archivos abiertos para usar Split View');
    } else {
      // Desactivar split view
      setSplitViewEnabled(false);
      setSecondPanelTab(null);
    }
  };

  // Handler para cambiar archivo del segundo panel
  const handleSecondPanelChange = (filePath) => {
    setSecondPanelTab(filePath);
  };

  // Handler para cambios en tiempo real (con debounce ya aplicado desde CodeEditor)
  const handleRealtimeChange = useCallback(({ filePath, content, cursorPosition }) => {
    console.log('🔄 handleRealtimeChange recibido:', {
      isCollaborating,
      filePath,
      contentLength: content?.length,
      hasBroadcastFunction: !!broadcastFileChange
    });
    
    if (!isCollaborating) {
      console.warn('⚠️ NO colaborando - cambio ignorado');
      return;
    }
    
    console.log('📤 Llamando a broadcastFileChange...');
    // Transmitir el cambio inmediatamente
    broadcastFileChange(filePath, content, cursorPosition);
    console.log('✅ broadcastFileChange ejecutado');
  }, [isCollaborating, broadcastFileChange]);

  const handleConsoleLog = (method, args) => {
    if (terminalRef.current) {
      terminalRef.current.addLog(method, args);
      // Auto-abrir terminal si llega un console.log
      if (!showTerminal) {
        setShowTerminal(true);
      }
    }
  };

  const handleAddImage = (image) => {
    setImages([...images, image]);
  };

  const handleAddImageFile = (imageData, parentPath = null) => {
    // Agregar imagen al gestor
    const newImage = {
      id: `img-${Date.now()}`,
      name: imageData.name,
      data: imageData.data,
      size: imageData.size
    };
    setImages([...images, newImage]);

    // Crear archivo de imagen en el sidebar
    const newFile = {
      name: imageData.name,
      type: 'file',
      language: 'plaintext',
      content: imageData.data,
      isImage: true
    };

    if (!parentPath) {
      setFiles({
        ...files,
        [imageData.name]: newFile
      });
    } else {
      const parts = parentPath.split('/');
      const updateNested = (obj, path) => {
        if (path.length === 1) {
          return {
            ...obj,
            [path[0]]: {
              ...obj[path[0]],
              children: {
                ...obj[path[0]].children,
                [imageData.name]: newFile
              }
            }
          };
        }
        const [first, ...rest] = path;
        return {
          ...obj,
          [first]: {
            ...obj[first],
            children: updateNested(obj[first].children, rest)
          }
        };
      };
      setFiles(updateNested(files, parts));
    }

    // Abrir el archivo
    const createdPath = parentPath ? `${parentPath}/${imageData.name}` : imageData.name;
    if (!openTabs.includes(createdPath)) {
      setOpenTabs([...openTabs, createdPath]);
    }
    setActiveTab(createdPath);
  };

  const handleMoveItem = (sourcePath, targetFolderPath) => {
    if (!sourcePath || sourcePath === targetFolderPath) return;

    const pathParts = sourcePath.split('/');
    const itemName = pathParts[pathParts.length - 1];

    // Extraer el item
    const extractItem = (obj, path) => {
      if (path.length === 1) {
        const newObj = { ...obj };
        const item = newObj[path[0]];
        delete newObj[path[0]];
        return { newTree: newObj, item };
      }
      const [first, ...rest] = path;
      const { newTree, item } = extractItem(obj[first].children, rest);
      return {
        newTree: {
          ...obj,
          [first]: { ...obj[first], children: newTree }
        },
        item
      };
    };

    const insertItem = (obj, targetPath, item) => {
      if (targetPath.length === 1) {
        return {
          ...obj,
          [targetPath[0]]: {
            ...obj[targetPath[0]],
            children: {
              ...obj[targetPath[0]].children,
              [item.name]: item
            }
          }
        };
      }
      const [first, ...rest] = targetPath;
      return {
        ...obj,
        [first]: {
          ...obj[first],
          children: insertItem(obj[first].children, rest, item)
        }
      };
    };

    // No permitir mover carpeta dentro de sí misma
    if (targetFolderPath && targetFolderPath.startsWith(sourcePath)) return;

    const { newTree, item } = extractItem(files, pathParts);
    
    // Si targetFolderPath es null, mover a la raíz
    if (targetFolderPath === null || targetFolderPath === undefined) {
      const updated = {
        ...newTree,
        [item.name]: item
      };
      setFiles(updated);
      
      // Actualizar tabs y pestaña activa
      const newPath = item.name;
      if (openTabs.includes(sourcePath)) {
        setOpenTabs(openTabs.map(t => (t === sourcePath ? newPath : t)));
      }
      if (activeTab === sourcePath) setActiveTab(newPath);
    } else {
      // Mover a una carpeta específica
      const targetParts = targetFolderPath.split('/');
      const updated = insertItem(newTree, targetParts, item);
      setFiles(updated);

      // Actualizar tabs y pestaña activa si cambió el path
      const newPath = `${targetFolderPath}/${itemName}`;
      if (openTabs.includes(sourcePath)) {
        setOpenTabs(openTabs.map(t => (t === sourcePath ? newPath : t)));
      }
      if (activeTab === sourcePath) setActiveTab(newPath);
    }
  };

  const handleRemoveImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  // Exportar proyecto como ZIP con toda la estructura (HTML, CSS, JS, imágenes)
  const handleExport = async () => {
    try {
      // Cargar JSZip dinámicamente (global UMD o ESM como fallback)
      const ensureJSZip = async () => {
        // 1) Global ya presente
        if (typeof window.JSZip === 'function') return window.JSZip;
        // 2) Intentar inyectar script UMD y esperar
        await new Promise((resolve) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
          s.onload = resolve;
          s.onerror = resolve; // seguimos con fallback ESM si falla
          document.body.appendChild(s);
        });
        if (typeof window.JSZip === 'function') return window.JSZip;
        // 3) Fallback ESM desde jsdelivr +esm
        try {
          const m = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm');
          if (m && (typeof m.default === 'function' || typeof m.JSZip === 'function')) {
            return m.default || m.JSZip;
          }
        } catch {}
        // 4) Fallback ESM desde skypack
        try {
          const m2 = await import('https://cdn.skypack.dev/jszip@3.10.1');
          if (m2 && (typeof m2.default === 'function' || typeof m2.JSZip === 'function')) {
            return m2.default || m2.JSZip;
          }
        } catch {}
        throw new Error('No se pudo cargar JSZip');
      };

      const ZipCtor = await ensureJSZip();
      if (typeof ZipCtor !== 'function') throw new Error('JSZip no está disponible');
      const zip = new ZipCtor();

      // Helper: convertir DataURL a Uint8Array
      const dataURLToUint8 = (dataURL) => {
        const [meta, data] = dataURL.split(',');
        const isBase64 = /;base64$/i.test(meta) || /;base64;/i.test(meta);
        const byteString = isBase64 ? atob(data) : decodeURIComponent(data);
        const buf = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) buf[i] = byteString.charCodeAt(i);
        return buf;
      };

      // Recorrer estructura y agregar al ZIP conservando rutas
      const addTreeToZip = (folder, tree) => {
        Object.entries(tree || {}).forEach(([key, item]) => {
          if (item.type === 'folder') {
            const sub = folder.folder(key);
            addTreeToZip(sub, item.children);
          } else if (item.type === 'file') {
            // Determinar si es imagen por bandera isImage o por extensión
            const isImg = !!item.isImage || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(item.name);
            if (isImg && item.content && item.content.startsWith('data:')) {
              folder.file(key, dataURLToUint8(item.content), { binary: true });
            } else {
              folder.file(key, item.content || '');
            }
          }
        });
      };

      addTreeToZip(zip, files);

      // Generar y descargar ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      if (terminalRef.current) {
        terminalRef.current.addLog('error', ['Export ZIP error:', String(e)]);
        setShowTerminal(true);
      }
    }
  };

  const performReset = () => {
    // Limpiar localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    // Resetear estados
    setFiles(initialFiles);
    setOpenTabs(['index.html']);
    setActiveTab('index.html');
    setCurrentTheme('vs-dark');
    setImages([]);
    setShowPreview(true);
    setShowTerminal(false);
    setAppFont({ id: 'theme-default', value: 'var(--theme-font-family)' });
    setCodeFont({ id: 'consolas', value: "'Consolas', 'Courier New', monospace" });

    closeModal('reset');

    // Toast visual
    const notification = document.createElement('div');
    notification.textContent = '✅ Editor reseteado. Archivos de ejemplo restaurados';
    notification.style.cssText = `
      position: fixed; top: 80px; right: 20px; background: rgba(59,130,246,0.9);
      color: white; padding: 12px 16px; border-radius: 8px; font-weight: 600;
      box-shadow: 0 10px 30px rgba(59,130,246,0.4); z-index: 9999; animation: slideIn .25s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  const handleResetAll = () => openModal('reset');

  // Handler de fondo personalizado
  const handleBackgroundChange = (bgId, bgImage, opacity, blur = 0) => {
    const newBackground = { id: bgId, image: bgImage, opacity, blur };
    setEditorBackground(newBackground);
    saveToStorage(STORAGE_KEYS.EDITOR_BACKGROUND, newBackground);
    localStorage.setItem('background-opacity', opacity);
    localStorage.setItem('background-blur', blur);
  };

  // Handlers de colaboración
  const handleCreateSession = async (sessionData) => {
    const result = await createSession(sessionData);
    openModal('collaborationPanel');
    return result;
  };

  const handleJoinSession = async (sessionId, userData) => {
    const result = await joinSession(sessionId, userData);
    openModal('collaborationPanel');
    
    // Limpiar el parámetro de la URL después de unirse exitosamente
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('session')) {
      urlParams.delete('session');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState({}, '', newUrl);
      console.log('🧹 Parámetro de URL limpiado después de unirse');
    }
    
    return result;
  };

  const handleLeaveSession = async () => {
    await leaveSession();
    closeModal('collaborationPanel');
    closeModal('chat');
    setChatMessages([]);
  };

  // 🔥 NUEVO: Handler para enviar mensajes de chat
  const handleSendChatMessage = useCallback(async (messageData) => {
    if (!isCollaborating || !currentUser) return;

    const newMessage = {
      id: Date.now(),
      userId: currentUser?.id,
      userName: currentUser?.name,
      userColor: currentUser?.color,
      message: messageData.message,
      messageType: messageData.messageType || 'text',
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
    };

    // Agregar mensaje local inmediatamente (optimistic update)
    setChatMessages(prev => [...prev, newMessage]);

    // Guardar en BD si está disponible (se sincronizará vía subscription)
    if (databaseService.isConfigured && currentSession?.dbId) {
      try {
        await databaseService.sendChatMessage({
          sessionId: currentSession.dbId,
          userId: currentUser.id,
          userName: currentUser.name,
          userColor: currentUser.color,
          message: messageData.message,
          messageType: messageData.messageType,
        });
        console.log('✅ Mensaje de chat enviado a BD');
      } catch (error) {
        console.error('❌ Error guardando mensaje:', error);
      }
    }
  }, [isCollaborating, currentSession, currentUser]);

  // 🔥 NUEVO: Suscribirse a mensajes de chat en tiempo real
  useEffect(() => {
    if (!isCollaborating || !currentSession?.dbId || !databaseService.isConfigured) {
      return;
    }

    console.log('🔔 Suscribiéndose a mensajes de chat para sesión:', currentSession.dbId);

    // Cargar mensajes existentes
    const loadMessages = async () => {
      try {
        const messages = await databaseService.getChatMessages(currentSession.dbId);
        console.log(`📥 Cargados ${messages.length} mensajes de chat`);
        
        // Mapear snake_case a camelCase para compatibilidad con ChatPanel
        const mappedMessages = messages.map(msg => {
          console.log('📋 Mapeando mensaje de BD:', msg);
          
          const mapped = {
            id: msg.id,
            userId: msg.user_id,
            userName: msg.user_name,
            userColor: msg.user_color,
            message: msg.message,
            messageType: msg.message_type,
            createdAt: msg.created_at,
            timestamp: new Date(msg.created_at).getTime(),
          };
          
          console.log('✅ Mensaje mapeado:', mapped);
          return mapped;
        });
        
        setChatMessages(mappedMessages);
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      }
    };

    loadMessages();

    // Suscribirse a nuevos mensajes
    const subscription = databaseService.subscribeToChatMessages(
      currentSession.dbId,
      (rawMessage) => {
        console.log('📨 Nuevo mensaje de chat recibido (raw):', rawMessage);
        
        // Mapear snake_case a camelCase
        const newMessage = {
          id: rawMessage.id,
          userId: rawMessage.user_id,
          userName: rawMessage.user_name,
          userColor: rawMessage.user_color,
          message: rawMessage.message,
          messageType: rawMessage.message_type,
          createdAt: rawMessage.created_at,
          timestamp: new Date(rawMessage.created_at).getTime(),
        };
        
        console.log('🔄 Mensaje mapeado para agregar:', newMessage);
        console.log('   - timestamp:', newMessage.timestamp, 'es válido?', !isNaN(newMessage.timestamp));
        console.log('   - createdAt:', newMessage.createdAt);
        
        // Solo agregar si no es nuestro propio mensaje (optimistic update ya lo agregó)
        setChatMessages(prev => {
          console.log('📊 Mensajes actuales:', prev.length);
          
          const exists = prev.some(msg => 
            msg.id === newMessage.id || 
            (msg.userId === newMessage.userId && 
             msg.createdAt === newMessage.createdAt &&
             msg.message === newMessage.message)
          );
          
          if (exists) {
            console.log('⏸️ Mensaje ya existe (optimistic update) - NO agregar');
            return prev;
          }
          
          console.log('✅ Agregando nuevo mensaje remoto - Total será:', prev.length + 1);
          return [...prev, newMessage];
        });
      }
    );

    // Cleanup: desuscribirse al desmontar
    return () => {
      console.log('🧹 Limpiando suscripción de chat');
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [isCollaborating, currentSession?.dbId]);

  // 🔐 Handler para abrir modal de colaboración (con verificación de autenticación)
  const handleOpenCollaboration = () => {
    if (isCollaborating) {
      openModal('collaborationPanel');
    } else {
      // Si no está configurado Supabase o no está autenticado, mostrar AuthModal
      if (isAuthConfigured && !isAuthenticated) {
        // Guardar acción pendiente para después de la autenticación
        setAuthPendingAction('create');
        setShowAuthModal(true);
      } else {
        // Si ya está autenticado o no está configurado Auth, abrir SessionManager directamente
        openModal('sessionManager');
      }
    }
  };

  // 🔐 Handler para resultado de autenticación
  const handleAuthSuccess = async (authData) => {
    try {
      if (authData.mode === 'login') {
        await login(authData.email, authData.password);
      } else if (authData.mode === 'signup') {
        await signup(authData.email, authData.password, authData.displayName);
      } else if (authData.mode === 'social') {
        await loginWithProvider(authData.provider);
      }

      // Cerrar AuthModal
      setShowAuthModal(false);

      // Abrir SessionManager después de autenticarse
      if (authPendingAction) {
        openModal('sessionManager');
        setAuthPendingAction(null);
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
      throw error; // El error se manejará en AuthModal
    }
  };

  // 🔐 Detectar link compartido y FORZAR autenticación
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (!sessionId) return; // No hay sessionId en URL, salir
    
    console.log('🔗 Link compartido detectado, sessionId:', sessionId);
    
    // Verificar si ya hay una sesión restaurada
    const storedSession = localStorage.getItem('collaboration_session');
    
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        // Si la sesión guardada coincide con la URL, NO abrir modal (se restaurará automáticamente)
        if (sessionData.session?.id === sessionId) {
          console.log('✅ Sesión coincide con URL - restaurando automáticamente');
          return; // Salir, la restauración automática se encarga
        }
        // Si NO coincide, limpiar sesión antigua y mostrar modal para unirse a la nueva
        console.log('⚠️ Sesión diferente - solicitando nueva unión');
        localStorage.removeItem('collaboration_session');
        localStorage.removeItem('collaboration_project_files');
      } catch (e) {
        console.error('Error al parsear sesión guardada:', e);
      }
    }
    
    // Delay para dar tiempo a que useCollaboration intente restaurar
    const timer = setTimeout(() => {
      // 🔥 FORZAR AUTENTICACIÓN PRIMERO si Supabase está configurado
      if (!isCollaborating) {
        if (isAuthConfigured && !isAuthenticated && !authLoading) {
          console.log('🔐 Link compartido - EXIGIENDO autenticación');
          setAuthPendingAction('join');
          setShowAuthModal(true);
        } else {
          // Ya está autenticado o no requiere auth
          openModal('sessionManager');
        }
      }
    }, 1000); // 1 segundo para dar tiempo a cargar auth
    
    return () => clearTimeout(timer);
  }, [isCollaborating, isAuthConfigured, isAuthenticated, authLoading]);

  const handleExecuteCode = () => {
    const activeFile = getFileByPath(activeTab);
    
    if (!activeFile) {
      if (terminalRef.current) {
        terminalRef.current.addLog('error', ['No hay archivo abierto']);
      }
      return;
    }

    // Determinar tipo de archivo
    const fileName = activeFile.name.toLowerCase();
    
    if (fileName.endsWith('.js')) {
      // Ejecutar JavaScript
      if (!showTerminal) setShowTerminal(true);
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.executeJS(activeFile.content);
        }
      }, showTerminal ? 0 : 100);
    } else if (fileName.endsWith('.py')) {
      // Ejecutar Python
      if (!showTerminal) setShowTerminal(true);
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.executePython(activeFile.content);
        }
      }, showTerminal ? 0 : 100);
    } else if (fileName.endsWith('.java')) {
      // Ejecutar Java
      if (!showTerminal) setShowTerminal(true);
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.executeJava(activeFile.content);
        }
      }, showTerminal ? 0 : 100);
    } else {
      if (terminalRef.current) {
        terminalRef.current.addLog('error', [`No se puede ejecutar archivos .${fileName.split('.').pop()}`, 'Soportados: JavaScript (.js), Python (.py), Java (.java)']);
      }
    }
  };

  // Ejecutar JavaScript en terminal flotante
  const executeJavaScriptFloating = useCallback((code) => {
    if (!code || code.trim() === '') {
      setFloatingTerminalOutput('⚠️ No hay código para ejecutar');
      setFloatingTerminalError(true);
      openModal('floatingTerminal');
      return;
    }

    try {
      const logs = [];
      const customConsole = {
        log: (...args) => {
          const text = args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
              try {
                return JSON.stringify(arg, null, 2);
              } catch (e) {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ');
          logs.push(text);
        },
        error: (...args) => {
          const text = args.map(arg => String(arg)).join(' ');
          logs.push(`❌ ${text}`);
        },
        warn: (...args) => {
          const text = args.map(arg => String(arg)).join(' ');
          logs.push(`⚠️ ${text}`);
        },
        info: (...args) => {
          const text = args.map(arg => String(arg)).join(' ');
          logs.push(`ℹ️ ${text}`);
        }
      };

      const wrappedCode = `
        (function() {
          'use strict';
          const console = customConsole;
          ${code}
        })();
      `;
      
      const func = new Function('customConsole', wrappedCode);
      func(customConsole);
      
      if (logs.length > 0) {
        setFloatingTerminalOutput(logs.join('\n'));
        setFloatingTerminalError(false);
      } else {
        setFloatingTerminalOutput('✅ Código ejecutado correctamente (sin salida)');
        setFloatingTerminalError(false);
      }
      openModal('floatingTerminal');
      // ⚡ Activar pulso de éxito
      setExecutionPulse({ show: true, isError: false });
      setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
    } catch (error) {
      setFloatingTerminalOutput(`❌ ${error.name}: ${error.message}`);
      setFloatingTerminalError(true);
      openModal('floatingTerminal');
      // ⚡ Activar pulso de error
      setExecutionPulse({ show: true, isError: true });
      setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
    }
  }, []);

  // 🚀 Ejecutar código en terminal flotante (Ctrl + Alt + S)
  const handleExecuteCodeFloating = useCallback(async () => {
    const activeFile = getFileByPath(activeTab);
    
    if (!activeFile) {
      setFloatingTerminalOutput('❌ No hay archivo abierto');
      setFloatingTerminalError(true);
      openModal('floatingTerminal');
      // ⚡ Activar pulso de error
      setExecutionPulse({ show: true, isError: true });
      setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
      return;
    }

    const fileName = activeFile.name.toLowerCase();
    const code = activeFile.content;
    
    if (fileName.endsWith('.js')) {
      // Ejecutar JavaScript
      executeJavaScriptFloating(code);
    } else if (fileName.endsWith('.py')) {
      try {
        setFloatingTerminalOutput('⏳ Cargando runtime de Python (Pyodide)...');
        setFloatingTerminalError(false);
        openModal('floatingTerminal');

        if (terminalRef.current) {
          terminalRef.current.addLog('▸ Ejecutando código Python...', 'info');
          if (!showTerminal) setShowTerminal(true);
        }

        const result = await runPython(code);
        const stdout = result?.stdout || '';
        const stderr = result?.stderr || '';

        if (terminalRef.current) {
          if (stdout.trim()) {
            stdout
              .replace(/\r\n/g, '\n')
              .split('\n')
              .filter((l) => l !== '')
              .forEach((line) => terminalRef.current.addLog(line, 'console'));
          }
          if (stderr.trim()) {
            stderr
              .replace(/\r\n/g, '\n')
              .split('\n')
              .filter((l) => l !== '')
              .forEach((line) => terminalRef.current.addLog(line, 'error'));
          }
          if (!stdout.trim() && !stderr.trim()) {
            terminalRef.current.addLog('✓ Código ejecutado correctamente (sin salida)', 'success');
          } else if (!stderr.trim()) {
            terminalRef.current.addLog('✓ Ejecución completada', 'success');
          }
        }

        if (stderr.trim()) {
          setFloatingTerminalOutput(stderr.trim());
          setFloatingTerminalError(true);
          openModal('floatingTerminal');
          setExecutionPulse({ show: true, isError: true });
          setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
        } else if (stdout.trim()) {
          setFloatingTerminalOutput(stdout.trim());
          setFloatingTerminalError(false);
          openModal('floatingTerminal');
          setExecutionPulse({ show: true, isError: false });
          setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
        } else {
          setFloatingTerminalOutput('✅ Código ejecutado correctamente (sin salida)');
          setFloatingTerminalError(false);
          openModal('floatingTerminal');
          setExecutionPulse({ show: true, isError: false });
          setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
        }
      } catch (error) {
        const msg = `❌ Error ejecutando Python: ${error?.message || 'Error desconocido'}`;
        setFloatingTerminalOutput(msg);
        setFloatingTerminalError(true);
        openModal('floatingTerminal');
        if (terminalRef.current) {
          terminalRef.current.addLog(msg, 'error');
          if (!showTerminal) setShowTerminal(true);
        }
        setExecutionPulse({ show: true, isError: true });
        setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
      }
    } else if (fileName.endsWith('.java')) {
      // Java simulado
      setFloatingTerminalOutput(`⚠️ Java requiere compilación, usa la terminal principal (Ctrl+Alt+R)`);
      setFloatingTerminalError(true);
      openModal('floatingTerminal');
      // ⚡ Activar pulso de error
      setExecutionPulse({ show: true, isError: true });
      setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
    } else {
      setFloatingTerminalOutput(`❌ No se puede ejecutar archivos .${fileName.split('.').pop()}\n\nSoportados: JavaScript (.js), Python (.py)`);
      setFloatingTerminalError(true);
      openModal('floatingTerminal');
      // ⚡ Activar pulso de error
      setExecutionPulse({ show: true, isError: true });
      setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
    }
  }, [activeTab, getFileByPath, executeJavaScriptFloating, openModal, showTerminal]);

  const handleDeleteFile = useCallback((filePath) => {
    const parts = filePath.split('/');
    
    const deleteNestedFile = (obj, path) => {
      if (path.length === 1) {
        const newObj = { ...obj };
        delete newObj[path[0]];
        return newObj;
      }
      
      const [first, ...rest] = path;
      return {
        ...obj,
        [first]: {
          ...obj[first],
          children: deleteNestedFile(obj[first].children, rest)
        }
      };
    };
    
    setFiles(deleteNestedFile(files, parts));
    
    // Cerrar la pestaña si el archivo eliminado está abierto
    if (openTabs.includes(filePath)) {
      handleTabClose(filePath);
    }
  }, [files, openTabs, handleTabClose]);

  const handleRenameFile = useCallback((oldPath, newName) => {
    const parts = oldPath.split('/');
    const parentPath = parts.slice(0, -1);
    const oldName = parts[parts.length - 1];
    
    const renameNestedFile = (obj, path, newName) => {
      if (path.length === 0) {
        // Renombrar en el nivel actual
        const newObj = { ...obj };
        const item = newObj[oldName];
        delete newObj[oldName];
        newObj[newName] = {
          ...item,
          name: newName
        };
        return newObj;
      }
      
      const [first, ...rest] = path;
      return {
        ...obj,
        [first]: {
          ...obj[first],
          children: renameNestedFile(obj[first].children, rest, newName)
        }
      };
    };
    
    setFiles(renameNestedFile(files, parentPath, newName));
    
    // Actualizar tabs si el archivo está abierto
    const newPath = parentPath.length > 0 ? `${parentPath.join('/')}/${newName}` : newName;
    
    if (openTabs.includes(oldPath)) {
      setOpenTabs(openTabs.map(tab => tab === oldPath ? newPath : tab));
      
      if (activeTab === oldPath) {
        setActiveTab(newPath);
      }
    }
  }, [files, openTabs, activeTab]);

  const handleNewFile = (fileName, parentPath = null, initialContent = '') => {
    const language = fileName.endsWith('.html') ? 'html' :
                    fileName.endsWith('.css') ? 'css' :
                    fileName.endsWith('.js') ? 'javascript' :
                    fileName.endsWith('.jsx') ? 'javascriptreact' :
                    fileName.endsWith('.ts') ? 'typescript' :
                    fileName.endsWith('.tsx') ? 'typescriptreact' :
                    fileName.endsWith('.json') ? 'json' :
                    fileName.endsWith('.md') ? 'markdown' :
                    fileName.endsWith('.py') ? 'python' :
                    fileName.endsWith('.java') ? 'java' :
                    fileName.endsWith('.cpp') || fileName.endsWith('.cc') || fileName.endsWith('.cxx') ? 'cpp' :
                    fileName.endsWith('.c') ? 'c' :
                    fileName.endsWith('.cs') ? 'csharp' :
                    fileName.endsWith('.php') ? 'php' :
                    fileName.endsWith('.rb') ? 'ruby' :
                    fileName.endsWith('.go') ? 'go' :
                    fileName.endsWith('.rs') ? 'rust' :
                    fileName.endsWith('.swift') ? 'swift' :
                    fileName.endsWith('.kt') ? 'kotlin' :
                    fileName.endsWith('.xml') ? 'xml' :
                    fileName.endsWith('.yaml') || fileName.endsWith('.yml') ? 'yaml' :
                    fileName.endsWith('.sql') ? 'sql' :
                    fileName.endsWith('.sh') ? 'shell' :
                    fileName.endsWith('.bat') ? 'bat' :
                    fileName.endsWith('.ps1') ? 'powershell' : 'plaintext';
    
    // Plantilla automática para archivos Java
    let autoContent = initialContent;
    if (fileName.endsWith('.java') && !initialContent) {
      const className = fileName.replace('.java', '');
      autoContent = `public class ${className} {
    
    // Constructor
    public ${className}() {
        
    }
    
    // Método main (punto de entrada)
    public static void main(String[] args) {
        System.out.println("Hola desde ${className}");
    }
    
}`;
    }
    
    const newFile = {
      name: fileName,
      type: 'file',
      language,
      content: autoContent
    };

    if (!parentPath) {
      setFiles({ ...files, [fileName]: newFile });
    } else {
      // Implementar lógica para carpetas anidadas
      const parts = parentPath.split('/');
      const updateNested = (obj, path) => {
        if (path.length === 1) {
          return {
            ...obj,
            [path[0]]: {
              ...obj[path[0]],
              children: {
                ...obj[path[0]].children,
                [fileName]: newFile
              }
            }
          };
        }
        const [first, ...rest] = path;
        return {
          ...obj,
          [first]: {
            ...obj[first],
            children: updateNested(obj[first].children, rest)
          }
        };
      };
      setFiles(updateNested(files, parts));
    }
  };

  const handleNewFolder = (folderName, parentPath = null) => {
    const newFolder = {
      name: folderName,
      type: 'folder',
      children: {}
    };

    if (!parentPath) {
      setFiles({ ...files, [folderName]: newFolder });
    } else {
      const parts = parentPath.split('/');
      const updateNested = (obj, path) => {
        if (path.length === 1) {
          return {
            ...obj,
            [path[0]]: {
              ...obj[path[0]],
              children: {
                ...obj[path[0]].children,
                [folderName]: newFolder
              }
            }
          };
        }
        const [first, ...rest] = path;
        return {
          ...obj,
          [first]: {
            ...obj[first],
            children: updateNested(obj[first].children, rest)
          }
        };
      };
      setFiles(updateNested(files, parts));
    }
  };

  // 🔥 PREVIEW DINÁMICO MEJORADO - Detecta archivos automáticamente
  const getPreviewContent = useCallback(() => {
    // Construir preview basado en archivo activo o cualquier HTML disponible
    return buildPreview(files, activeTab);
  }, [files, activeTab]);

  // Handlers para redimensionar paneles
  const handleSidebarResize = (e) => {
    if (!isResizingSidebar.current) return;
    e.preventDefault();
    e.stopPropagation();
    
    // Usar la posición absoluta del mouse, limitando entre 180px y 400px
    const newWidth = Math.max(180, Math.min(400, e.clientX));
    setSidebarWidth(newWidth);
  };

  const handlePreviewResize = (e) => {
    if (!isResizingPreview.current) return;
    e.preventDefault();
    e.stopPropagation();
    
    const container = document.querySelector('.editor-preview-container');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    
    // Calcular posición del mouse relativa al contenedor
    const mouseX = Math.max(0, Math.min(containerRect.width, e.clientX - containerRect.left));
    
    // Calcular porcentaje del preview (desde el mouse hasta el final)
    const newPreviewWidth = ((containerRect.width - mouseX) / containerRect.width) * 100;
    
    // Aplicar límites más suaves
    setPreviewWidth(Math.max(15, Math.min(85, newPreviewWidth)));
  };

  const handleTerminalResize = (e) => {
    if (!isResizingTerminal.current) return;
    e.preventDefault();
    e.stopPropagation();
    
    const container = document.querySelector('.main-content-area');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    
    // Calcular altura desde la posición del mouse hasta el borde inferior
    const mouseY = Math.max(containerRect.top, Math.min(containerRect.bottom, e.clientY));
    const newHeight = containerRect.bottom - mouseY;
    
    // Aplicar límites
    setTerminalHeight(Math.max(100, Math.min(600, newHeight)));
  };

  const handleMouseUp = () => {
    if (isResizingSidebar.current || isResizingPreview.current || isResizingTerminal.current) {
      isResizingSidebar.current = false;
      isResizingPreview.current = false;
      isResizingTerminal.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
  };

  // Toggle sidebar al hacer clic en el editor
  const handleToggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  // Handler combinado de mousemove para mejor performance
  const handleMouseMove = (e) => {
    handleSidebarResize(e);
    handlePreviewResize(e);
    handleTerminalResize(e);
  };

  // 🔥 FIX: Agregar dependencias que las funciones de resize usan
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [sidebarWidth, previewWidth, terminalHeight]); // Dependencias necesarias para el resize

  const activeFile = getFileByPath(activeTab);
  const isFadeMode = currentTheme === 'fade';
  const isEclipseMode = currentTheme === 'eclipse';

  // ⌨️ Atajos: Ctrl + Alt + R (Terminal), Ctrl + Alt + P (Preview) y Ctrl + Alt + S (Terminal Flotante)
  useEffect(() => {
    const onKeyDown = (e) => {
      // 🚀 Atajo para Terminal Flotante: Ctrl + Alt + S (funciona en TODOS los modos)
      const isCtrlAltS = (e.ctrlKey || e.metaKey) && e.altKey && (e.key === 's' || e.key === 'S');
      if (isCtrlAltS) {
        e.preventDefault();
        handleExecuteCodeFloating();
        return;
      }

      // Atajo para Terminal: Ctrl + Alt + R
      const isCtrlAltR = (e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'r' || e.key === 'R');
      if (isCtrlAltR) {
        e.preventDefault();
        if (!isFadeMode) {
          setShowTerminal((v) => !v);
          return;
        }
        // Limpiar timers previos
        if (swapTimerRef.current) {
          clearTimeout(swapTimerRef.current);
          swapTimerRef.current = null;
        }
        if (!showTerminal) {
          // Editor -> Terminal
          setSwapAnim('toTerminal');
          setShowPreview(false); // Ocultar preview en modo Fade
          setShowTerminal(true);
          swapTimerRef.current = setTimeout(() => setSwapAnim('none'), 650);
        } else {
          // Terminal -> Editor
          setSwapAnim('toEditor');
          // mantener terminal montada hasta fin de animación
          swapTimerRef.current = setTimeout(() => {
            setShowTerminal(false);
            setSwapAnim('none');
          }, 650);
        }
        return;
      }

      // Atajo para Preview: Ctrl + Alt + P
      const isCtrlAltP = (e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'p' || e.key === 'P');
      if (isCtrlAltP) {
        e.preventDefault();
        if (!isFadeMode) {
          setShowPreview((v) => !v);
          return;
        }
        // Limpiar timers previos
        if (swapTimerRef.current) {
          clearTimeout(swapTimerRef.current);
          swapTimerRef.current = null;
        }
        // En modo fade, toggle preview sin ocultar otros paneles
        setShowPreview((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    };
  }, [isFadeMode, showTerminal, showPreview, handleExecuteCodeFloating]);


  // 🎯 Drag handlers para preview en modo Fade
  useEffect(() => {
    if (!isFadeMode) return;

    const handleMouseMove = (e) => {
      if (!isDraggingPreview) return;
      
      // Calcular nueva posición
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      setPreviewPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDraggingPreview) {
        setIsDraggingPreview(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    if (isDraggingPreview) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPreview, dragOffset, isFadeMode]);

  // Handler para iniciar drag del preview
  const handlePreviewDragStart = (e) => {
    if (!isFadeMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    const rect = previewDragRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Si ya tiene posición personalizada, usar esas coordenadas
    // Si no, el preview está centrado
    const currentX = previewPosition.x || rect.left;
    const currentY = previewPosition.y || rect.top;
    
    setIsDraggingPreview(true);
    setDragOffset({
      x: e.clientX - currentX,
      y: e.clientY - currentY
    });
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  // 🌓 Efecto de día/noche automático
  useEffect(() => {
    if (!isFadeMode || dayNightMode !== 'auto') return;

    const updateTimeBasedColors = () => {
      const hour = new Date().getHours();
      const overlay = document.querySelector('.fade-grid-overlay');
      if (!overlay) return;

      // Día: 6am - 6pm, Noche: 6pm - 6am
      const isDay = hour >= 6 && hour < 18;
      
      if (isDay) {
        // Colores brillantes y cálidos para el día
        overlay.style.background = `
          radial-gradient(circle 520px at 18% 18%, color-mix(in srgb, var(--theme-primary) 40%, transparent) 0%, transparent 62%),
          radial-gradient(circle 420px at 82% 16%, color-mix(in srgb, var(--theme-secondary) 32%, transparent) 0%, transparent 60%),
          radial-gradient(circle 560px at 52% 64%, color-mix(in srgb, var(--theme-accent) 30%, transparent) 0%, transparent 65%)
        `;
      } else {
        // Colores sutiles y fríos para la noche
        overlay.style.background = `
          radial-gradient(circle 520px at 18% 18%, color-mix(in srgb, var(--theme-primary) 28%, transparent) 0%, transparent 62%),
          radial-gradient(circle 420px at 82% 16%, color-mix(in srgb, var(--theme-secondary) 20%, transparent) 0%, transparent 60%),
          radial-gradient(circle 560px at 52% 64%, color-mix(in srgb, var(--theme-accent) 18%, transparent) 0%, transparent 65%)
        `;
      }
    };

    // Actualizar inmediatamente
    updateTimeBasedColors();

    // Actualizar cada hora
    const interval = setInterval(updateTimeBasedColors, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isFadeMode, dayNightMode]);

  // Guardar preferencia de día/noche
  useEffect(() => {
    saveToStorage('DAY_NIGHT_MODE', dayNightMode);
  }, [dayNightMode]);

  return (
    <div className={`h-screen flex flex-col text-white relative overflow-hidden ${isFadeMode ? 'fade-grid-bg' : isEclipseMode ? 'eclipse-bg' : !editorBackground.image ? 'bg-editor-bg' : ''}`} style={{ backgroundColor: editorBackground.image ? 'transparent' : undefined }}>
      {/* Grid overlay para modo Fade con parallax */}
      {isFadeMode && <div className="fade-grid-overlay" />}
      {isEclipseMode && <div className="eclipse-overlay" />}
      {editorBackground.image && (
        <style>{`
          /* Hacer transparente el fondo del editor Monaco cuando hay imagen de fondo */
          .monaco-editor, .monaco-editor .margin, .monaco-editor-background, .monaco-editor .overflow-guard, .monaco-editor .monaco-scrollable-element {
            background: transparent !important;
          }
        `}</style>
      )}
      {/* Fondo personalizado del editor */}
      {editorBackground.image && (
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${editorBackground.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: editorBackground.opacity || 0.15,
            filter: editorBackground.blur ? `blur(${editorBackground.blur}px)` : 'none',
          }}
        />
      )}
      
      {/* Efectos de esquinas con glow azul y amarillo - ocultos cuando hay fondo personalizado */}
      {!editorBackground.image && !isEclipseMode && (
        <>
          <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none z-0" style={{
            background: 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'pulseBlueGlow 4s ease-in-out infinite'
          }}></div>
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none z-0" style={{
            background: 'radial-gradient(circle at top right, rgba(234, 179, 8, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'pulseYellowGlow 4s ease-in-out infinite 2s'
          }}></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none z-0" style={{
            background: 'radial-gradient(circle at bottom center, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'pulseMixedGlow 5s ease-in-out infinite 1s'
          }}></div>
        </>
      )}
      <TopBar className="relative z-10" 
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        showTerminal={showTerminal}
        setShowTerminal={setShowTerminal}
        onOpenImageManager={() => openModal('imageManager')}
        onAddImageFile={handleAddImageFile}
        onResetAll={handleResetAll}
        onOpenShortcuts={() => openModal('shortcuts')}
        onExport={handleExport}
        currentTheme={currentTheme}
        onToggleLite={handleToggleLite}
        onToggleFeel={handleToggleFeel}
        onToggleFade={handleToggleFade}
        onToggleEclipse={handleToggleEclipse}
        tabs={openTabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
        onTabClose={handleTabClose}
        onOpenCollaboration={handleOpenCollaboration}
        isCollaborating={isCollaborating}
        collaborationUsers={activeUsers.length}
        showChat={isOpen('chat')}
        onToggleChat={() => toggleModal('chat')}
        chatMessagesCount={chatMessages.length}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        onOpenBackground={() => openModal('backgroundSelector')}
        onOpenTypography={() => openModal('typographySelector')}
        practiceModeEnabled={practiceModeEnabled}
        onTogglePracticeMode={() => setPracticeModeEnabled(!practiceModeEnabled)}
        onOpenSnippets={() => openModal('snippetManager')}
        splitViewEnabled={splitViewEnabled}
        onToggleSplitView={handleToggleSplitView}
        onOpenGit={() => openModal('gitPanel')}
        onOpenDevTools={() => openModal('devTools')}
        dayNightMode={dayNightMode}
        onToggleDayNightMode={() => setDayNightMode(dayNightMode === 'auto' ? 'disabled' : 'auto')}
        isFadeMode={isFadeMode}
      />

      {/* Indicador de guardado automático */}
      <div className="fixed top-16 right-4 z-50">
        <AutoSaveIndicator status={saveStatus} currentTheme={currentTheme} />
      </div>

      {/* Banner de colaboración */}
      <CollaborationBanner
        isCollaborating={isCollaborating}
        activeUsers={activeUsers}
        currentUser={currentUser}
        onOpenPanel={() => openModal('collaborationPanel')}
      />

      {/* Notificaciones de colaboración */}
      {notifications.map((notification) => (
        <CollaborationNotification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
      
      <Suspense fallback={<LoadingFallback />}>
        <ImageManager
          isOpen={isOpen('imageManager')}
          onClose={() => closeModal('imageManager')}
          images={images}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
        />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ThemeSelector
          isOpen={isOpen('themeSelector')}
          onClose={() => closeModal('themeSelector')}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
        />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <BackgroundSelector
          isOpen={isOpen('backgroundSelector')}
          onClose={() => closeModal('backgroundSelector')}
          currentBackground={editorBackground.id}
          onBackgroundChange={handleBackgroundChange}
        />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <TypographySelector
          isOpen={isOpen('typographySelector')}
          onClose={() => closeModal('typographySelector')}
          appFont={appFont}
          codeFont={codeFont}
          onChangeAppFont={setAppFont}
          onChangeCodeFont={setCodeFont}
        />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ShortcutsHelp
          isOpen={isOpen('shortcuts')}
          onClose={() => closeModal('shortcuts')}
        />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <SnippetManager
          isOpen={isOpen('snippetManager')}
          onClose={() => closeModal('snippetManager')}
          onInsertSnippet={handleInsertSnippet}
          currentTheme={currentTheme}
        />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <GitPanel
          isOpen={isOpen('gitPanel')}
          onClose={() => closeModal('gitPanel')}
          files={files}
          currentTheme={currentTheme}
        />
      </Suspense>

      {/* Menú de herramientas de desarrollador */}
      {isOpen('devTools') && (
        <Suspense fallback={<LoadingFallback />}>
          <DevToolsMenu onClose={() => closeModal('devTools')} />
        </Suspense>
      )}

      <Suspense fallback={<LoadingFallback />}>
        <SessionManager
          isOpen={isOpen('sessionManager')}
          onClose={() => closeModal('sessionManager')}
          onCreateSession={handleCreateSession}
          onJoinSession={handleJoinSession}
          isConfigured={isCollaborationConfigured}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <CollaborationPanel
          isOpen={isOpen('collaborationPanel')}
          onClose={() => closeModal('collaborationPanel')}
          currentUser={currentUser}
          activeUsers={activeUsers}
          currentSession={currentSession}
          onChangePermissions={changeUserPermissions}
          onLeaveSession={handleLeaveSession}
          remoteCursors={remoteCursors}
          typingUsers={typingUsers}
          activeFile={activeTab}
        />
      </Suspense>

      {/* 🔥 NUEVO: Chat Panel */}
      {isCollaborating && (
        <Suspense fallback={<LoadingFallback />}>
          <ChatPanel
            isOpen={isOpen('chat')}
            onClose={() => closeModal('chat')}
            messages={chatMessages}
            currentUser={currentUser}
            onSendMessage={handleSendChatMessage}
            isMinimized={isChatMinimized}
            onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
          />
        </Suspense>
      )}

      {/* 🔐 Modal de Autenticación */}
      <Suspense fallback={<LoadingFallback />}>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          authMode="login"
        />
      </Suspense>

      {/* Modal Reset */}
      {isOpen('reset') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.6)'}} onClick={()=>closeModal('reset')}>
          <div className="w-[520px] rounded-lg p-5" style={{backgroundColor:'var(--theme-background-secondary)', border:'1px solid var(--theme-border)'}} onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-3" style={{color:'var(--theme-text)'}}>Resetear todo</h3>
            <p className="text-sm mb-4" style={{color:'var(--theme-text-secondary)'}}>
              Esto eliminará:
              <br/>• Archivos y carpetas creados
              <br/>• Imágenes cargadas
              <br/>• Tema seleccionado y pestañas abiertas
              <br/>
              <span className="font-medium" style={{color:'var(--theme-primary)'}}>Se restaurarán los archivos de ejemplo.</span>
            </p>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1.5 rounded border" style={{borderColor:'var(--theme-border)', color:'var(--theme-text)'}} onClick={()=>closeModal('reset')}>Cancelar</button>
              <button className="px-3 py-1.5 rounded" style={{backgroundColor:'#ef4444', color:'#fff'}} onClick={performReset}>Resetear</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex overflow-hidden relative z-10" style={isEclipseMode ? { padding: '12px', gap: '12px' } : undefined}>
        {/* Sidebar con FileExplorer */}
        {showSidebar && (
          <>
            <div 
              className={`flex-shrink-0 relative ${isEclipseMode ? 'eclipse-glass-panel' : ''} ${!editorBackground.image && !isFadeMode && !isEclipseMode ? 'shadow-blue-glow' : ''}`}
              style={isEclipseMode ? {
                width: `${sidebarWidth}px`,
                minWidth: '180px',
                maxWidth: '400px',
                borderRadius: '14px',
                overflow: 'hidden',
                backgroundColor: 'var(--theme-background-secondary)',
                border: '1px solid var(--theme-border)',
                backdropFilter: 'blur(12px)'
              } : { width: `${sidebarWidth}px`, minWidth: '180px', maxWidth: '400px' }}
            >
              <FileExplorer 
                files={files} 
                onFileSelect={handleFileSelect}
                activeFile={activeTab}
                onDeleteFile={handleDeleteFile}
                onAddImageFile={handleAddImageFile}
                onRenameFile={handleRenameFile}
                onMoveItem={handleMoveItem}
                onCreateFile={handleNewFile}
                onCreateFolder={handleNewFolder}
                currentTheme={currentTheme}
                onToggleSidebar={() => setShowSidebar(false)}
              />
            </div>
            
            {/* Resize handle para sidebar */}
            <div
              className="w-px bg-border-color cursor-col-resize resize-handle transition-colors"
              style={{
                background: 'rgba(59, 130, 246, 0.15)'
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                isResizingSidebar.current = true;
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
              }}
            />
          </>
        )}

        {/* Área sensible en el borde izquierdo para mostrar el sidebar con doble clic cuando esté oculto */}
        {!showSidebar && (
          <div
            className="absolute left-0 top-0 h-full"
            style={{ 
              width: '20px', 
              cursor: 'pointer',
              zIndex: 999,
              backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)',
              transition: 'background-color 200ms ease'
            }}
            onDoubleClick={() => setShowSidebar(true)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 18%, transparent)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 8%, transparent)'}
            title="Doble clic para mostrar el explorador"
          />
        )}
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={isEclipseMode ? { borderRadius: '14px' } : undefined}>
          <div className={`flex-1 flex flex-col overflow-hidden main-content-area ${isFadeMode ? 'items-center justify-center' : ''}`} style={isFadeMode ? { padding: '2rem 1rem', perspective: '1200px', perspectiveOrigin: 'center center', position: 'relative' } : {}}>
            <div 
              className="flex overflow-hidden editor-preview-container"
              style={{ 
                height: showTerminal && !isFadeMode ? `calc(100% - ${terminalHeight}px - 4px)` : '100%',
                ...(isFadeMode ? { 
                  width: '100%', 
                  height: '100%',
                  position: 'relative'
                } : {})
              }}
            >
              <div 
                style={{ 
                  width: showPreview && !isFadeMode ? `${100 - previewWidth}%` : '100%',
                  ...(isEclipseMode ? {
                    borderRadius: '14px',
                    backgroundColor: 'var(--theme-background-secondary)',
                    border: '1px solid var(--theme-border)',
                    backdropFilter: 'blur(10px)'
                  } : {}),
                  ...(isFadeMode ? { 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    maxWidth: '850px',
                    maxHeight: '550px',
                    width: '90%',
                    height: '550px',
                    borderRadius: '16px', 
                    backgroundColor: 'var(--theme-background-secondary)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid var(--theme-border)',
                    boxShadow: `
                      0 20px 60px rgba(0, 0, 0, 0.58),
                      0 0 60px color-mix(in srgb, var(--theme-secondary) 10%, transparent),
                      0 0 80px color-mix(in srgb, var(--theme-accent) 9%, transparent),
                      0 0 55px color-mix(in srgb, var(--theme-primary) 7%, transparent)
                    `,
                    overflow: 'hidden',
                    transition: 'all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: showTerminal 
                      ? 'translate(-50%, calc(-50% - 30px)) scale(0.92) rotateX(5deg)' 
                      : 'translate(-50%, -50%) scale(1) rotateX(0deg)',
                    opacity: showTerminal ? 0 : 1,
                    zIndex: showTerminal ? 1 : 3,
                    filter: showTerminal ? 'blur(2px) brightness(0.7)' : 'blur(0px) brightness(1)',
                    transformOrigin: 'center center',
                    perspective: '1000px',
                    pointerEvents: showTerminal ? 'none' : 'auto'
                  } : {})
                }}
                className={`flex-shrink-0 overflow-hidden relative ${isFadeMode ? 'fade-glass-panel' : isEclipseMode ? 'eclipse-glass-panel' : ''} ${!editorBackground.image && !isFadeMode && !isEclipseMode ? 'shadow-blue-glow' : ''}`}
              >
                {/* Botón toggle sidebar */}
                {!showSidebar && !isFadeMode && (
                  <button
                    onClick={handleToggleSidebar}
                    className="absolute top-2 left-2 z-50 p-2 rounded-md transition-all hover:scale-110"
                    style={{
                      backgroundColor: 'var(--theme-background-secondary)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-primary)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                    title="Mostrar sidebar (Ctrl+B)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                  </button>
                )}
                
                {/* Split View: 2 editores lado a lado */}
                {splitViewEnabled && secondPanelTab ? (
                  <div className="flex h-full">
                    {/* Editor Panel 1 */}
                    <div className="flex-1 relative" style={{ borderRight: '1px solid var(--theme-border)' }}>
                      <div className="absolute top-1 right-1 z-10 px-2 py-1 rounded text-xs font-medium" style={{ 
                        backgroundColor: 'var(--theme-background-secondary)',
                        color: 'var(--theme-text-secondary)',
                        border: '1px solid var(--theme-border)'
                      }}>
                        {activeTab.split('/').pop()}
                      </div>
                      <CodeEditor
                        value={activeFile?.content || ''}
                        language={activeFile?.language || 'plaintext'}
                        onChange={handleCodeChange}
                        projectFiles={files}
                        projectImages={images}
                        currentTheme={currentTheme}
                        isImage={activeFile?.isImage || false}
                        codeFontFamily={codeFont?.value}
                        activePath={activeTab}
                        onAddImageFile={handleAddImageFile}
                        hasCustomBackground={!!editorBackground.image}
                        onRealtimeChange={handleRealtimeChange}
                        isCollaborating={isCollaborating}
                        remoteCursors={remoteCursors}
                        onCursorMove={broadcastCursorMove}
                        currentUser={currentUser}
                        activeFile={activeFile}
                        typingUsers={typingUsers}
                        onExecuteCode={handleExecuteCode}
                        practiceModeEnabled={practiceModeEnabled}
                      />
                    </div>
                    
                    {/* Editor Panel 2 */}
                    <div className="flex-1 relative">
                      <div className="absolute top-1 right-1 z-10 flex gap-1">
                        {/* Selector de archivo para panel 2 */}
                        <select
                          value={secondPanelTab}
                          onChange={(e) => handleSecondPanelChange(e.target.value)}
                          className="px-2 py-1 rounded text-xs font-medium cursor-pointer"
                          style={{ 
                            backgroundColor: 'var(--theme-background-secondary)',
                            color: 'var(--theme-text)',
                            border: '1px solid var(--theme-border)'
                          }}
                        >
                          {openTabs.filter(tab => tab !== activeTab).map(tab => (
                            <option key={tab} value={tab}>
                              {tab.split('/').pop()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <CodeEditor
                        value={getFileByPath(secondPanelTab)?.content || ''}
                        language={getFileByPath(secondPanelTab)?.language || 'plaintext'}
                        onChange={(value) => {
                          const parts = secondPanelTab.split('/');
                          const updateNestedFile = (obj, path, newContent) => {
                            if (path.length === 1) {
                              return {
                                ...obj,
                                [path[0]]: {
                                  ...obj[path[0]],
                                  content: newContent
                                }
                              };
                            }
                            const [first, ...rest] = path;
                            return {
                              ...obj,
                              [first]: {
                                ...obj[first],
                                children: updateNestedFile(obj[first].children, rest, newContent)
                              }
                            };
                          };
                          setFiles(updateNestedFile(files, parts, value));
                        }}
                        projectFiles={files}
                        projectImages={images}
                        currentTheme={currentTheme}
                        isImage={getFileByPath(secondPanelTab)?.isImage || false}
                        codeFontFamily={codeFont?.value}
                        activePath={secondPanelTab}
                        onAddImageFile={handleAddImageFile}
                        hasCustomBackground={!!editorBackground.image}
                        onRealtimeChange={handleRealtimeChange}
                        isCollaborating={isCollaborating}
                        remoteCursors={remoteCursors}
                        onCursorMove={broadcastCursorMove}
                        currentUser={currentUser}
                        activeFile={getFileByPath(secondPanelTab)}
                        typingUsers={typingUsers}
                        onExecuteCode={handleExecuteCode}
                        practiceModeEnabled={practiceModeEnabled}
                      />
                    </div>
                  </div>
                ) : (
                  /* Vista normal: 1 solo editor */
                  <div className="flex flex-col h-full">
                    <Breadcrumbs 
                      activeFile={activeTab}
                      files={files}
                      onNavigate={handleFileSelect}
                    />
                    <div className="flex-1 overflow-hidden">
                      <CodeEditor
                        value={activeFile?.content || ''}
                        language={activeFile?.language || 'plaintext'}
                        onChange={handleCodeChange}
                        projectFiles={files}
                        projectImages={images}
                        currentTheme={currentTheme}
                        isImage={activeFile?.isImage || false}
                        codeFontFamily={codeFont?.value}
                        activePath={activeTab}
                        onAddImageFile={handleAddImageFile}
                        hasCustomBackground={!!editorBackground.image}
                        onRealtimeChange={handleRealtimeChange}
                        isCollaborating={isCollaborating}
                        remoteCursors={remoteCursors}
                        onCursorMove={broadcastCursorMove}
                        currentUser={currentUser}
                        activeFile={activeFile}
                        typingUsers={typingUsers}
                        onExecuteCode={handleExecuteCode}
                        practiceModeEnabled={practiceModeEnabled}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {(showPreview || (isFadeMode && swapAnim !== 'none')) && (
                <>
                  {/* Resize handle para preview - oculto en modo Fade */}
                  {!isFadeMode && (
                    <div
                      className="w-px cursor-col-resize resize-handle transition-colors flex-shrink-0"
                      style={{
                        background: 'rgba(234, 179, 8, 0.15)'
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        isResizingPreview.current = true;
                        document.body.style.cursor = 'col-resize';
                        document.body.style.userSelect = 'none';
                      }}
                    />
                  )}
                  <div 
                    ref={isFadeMode ? previewDragRef : null}
                    style={{ 
                      width: isFadeMode ? '850px' : `${previewWidth}%`,
                      ...(isEclipseMode ? {
                        borderRadius: '14px',
                        backgroundColor: 'var(--theme-background-secondary)',
                        border: '1px solid var(--theme-border)',
                        backdropFilter: 'blur(10px)'
                      } : {}),
                      ...(isFadeMode ? {
                        position: 'absolute',
                        top: previewPosition.y || '50%',
                        left: previewPosition.x || '50%',
                        maxWidth: '850px',
                        maxHeight: '550px',
                        height: '550px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--theme-background-secondary)',
                        backdropFilter: 'blur(14px)',
                        border: '1px solid var(--theme-border)',
                        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.55), 0 0 110px color-mix(in srgb, var(--theme-secondary) 14%, transparent)',
                        overflow: 'hidden',
                        transition: isDraggingPreview ? 'none' : 'opacity 300ms ease, filter 300ms ease',
                        transform: (previewPosition.x !== 0 || previewPosition.y !== 0) 
                          ? 'translate(0, 0)' 
                          : showPreview 
                            ? 'translate(-50%, -50%)' 
                            : 'translate(calc(-50% + 30px), -50%)',
                        opacity: showPreview ? 1 : 0,
                        zIndex: showPreview ? 40 : 1,
                        filter: showPreview ? 'blur(0px) brightness(1)' : 'blur(2px) brightness(0.7)',
                        transformOrigin: 'center center',
                        perspective: '1000px',
                        pointerEvents: showPreview ? 'auto' : 'none',
                        cursor: isDraggingPreview ? 'grabbing' : 'default'
                      } : {})
                    }}
                    className={`flex-shrink-0 overflow-hidden ${isFadeMode ? 'fade-glass-panel' : isEclipseMode ? 'eclipse-glass-panel' : ''} ${!editorBackground.image && !isFadeMode && !isEclipseMode ? 'shadow-yellow-glow' : ''}`}
                  >
                    {/* Barra de título para arrastrar - solo en modo fade */}
                    {isFadeMode && showPreview && (
                      <div 
                        onMouseDown={handlePreviewDragStart}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '32px',
                          background: 'linear-gradient(180deg, color-mix(in srgb, var(--theme-secondary) 18%, transparent) 0%, color-mix(in srgb, var(--theme-secondary) 6%, transparent) 100%)',
                          borderBottom: '1px solid color-mix(in srgb, var(--theme-border) 85%, transparent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'grab',
                          zIndex: 50,
                          backdropFilter: 'blur(10px)',
                          userSelect: 'none'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          gap: '4px',
                          opacity: 0.5
                        }}>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--theme-secondary)' }}></div>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--theme-secondary)' }}></div>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--theme-secondary)' }}></div>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--theme-secondary)' }}></div>
                        </div>
                      </div>
                    )}
                    <div style={{ height: isFadeMode && showPreview ? 'calc(100% - 32px)' : '100%', marginTop: isFadeMode && showPreview ? '32px' : '0' }}>
                      <Preview 
                        content={getPreviewContent()}
                        projectFiles={files}
                        projectImages={images}
                        currentTheme={currentTheme}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {(showTerminal || (isFadeMode && swapAnim !== 'none')) && (
              <>
                {/* Resize handle para terminal - oculto en modo Fade */}
                {!isFadeMode && (
                  <div
                    className="h-px cursor-row-resize resize-handle transition-colors flex-shrink-0"
                    style={{
                      background: 'rgba(59, 130, 246, 0.15)'
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      isResizingTerminal.current = true;
                      document.body.style.cursor = 'row-resize';
                      document.body.style.userSelect = 'none';
                    }}
                  />
                )}
                <div 
                  style={{ 
                    height: isFadeMode ? '100%' : `${terminalHeight}px`,
                    ...(isEclipseMode ? {
                      borderRadius: '14px',
                      backgroundColor: 'var(--theme-background-secondary)',
                      border: '1px solid var(--theme-border)',
                      backdropFilter: 'blur(10px)'
                    } : {}),
                    ...(isFadeMode ? {
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      maxWidth: '850px',
                      maxHeight: '550px',
                      width: '90%',
                      height: '550px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--theme-background-secondary)',
                      backdropFilter: 'blur(14px)',
                      border: '1px solid var(--theme-border)',
                      overflow: 'hidden',
                      boxShadow: '0 24px 80px rgba(0, 0, 0, 0.55), 0 0 110px color-mix(in srgb, var(--theme-accent) 14%, transparent)',
                      transition: 'all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: showTerminal 
                        ? 'translate(-50%, -50%) scale(1) rotateX(0deg)' 
                        : 'translate(-50%, calc(-50% + 30px)) scale(0.92) rotateX(-5deg)',
                      opacity: showTerminal ? 1 : 0,
                      zIndex: showTerminal ? 4 : 1,
                      filter: showTerminal ? 'blur(0px) brightness(1)' : 'blur(2px) brightness(0.7)',
                      transformOrigin: 'center center',
                      perspective: '1000px',
                      pointerEvents: showTerminal ? 'auto' : 'none'
                    } : {})
                  }} 
                  className={`flex-shrink-0 ${isFadeMode ? 'fade-glass-panel' : isEclipseMode ? 'eclipse-glass-panel' : ''} ${!editorBackground.image && !isFadeMode && !isEclipseMode ? 'shadow-blue-glow-strong' : ''}`}
                >
                  <Terminal 
                    ref={terminalRef}
                    isOpen={showTerminal}
                    onClose={() => setShowTerminal(false)}
                    onToggleSize={() => setIsTerminalMaximized(v => !v)}
                    isMaximized={isTerminalMaximized}
                    onExecuteCode={handleExecuteCode}
                    onOpenThemes={() => openModal('themeSelector')}
                    backgroundActive={!!editorBackground.image}
                    currentTheme={currentTheme}
                    projectFiles={files}
                    onFileSelect={handleFileSelect}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 Terminal Flotante con Glassmorphism (Ctrl + Alt + S) */}
      <Suspense fallback={<LoadingFallback />}>
        <FloatingTerminal
          isVisible={isOpen('floatingTerminal')}
          output={floatingTerminalOutput}
          isError={floatingTerminalError}
          onClose={() => closeModal('floatingTerminal')}
        />
      </Suspense>

      {/* 🎨 Efectos del modo Fade */}
      {isFadeMode && (
        <>
          {/* Partículas de código flotantes */}
          <CodeParticles />
          
          {/* Efecto de pulso al ejecutar código */}
          <ExecutionPulse show={executionPulse.show} isError={executionPulse.isError} />
        </>
      )}

      {/* ⚡ Indicador visual de atajos de teclado */}
      {shortcutIndicator && (
        <KeyboardShortcutIndicator
          shortcut={shortcutIndicator.shortcut}
          action={shortcutIndicator.action}
          onComplete={() => setShortcutIndicator(null)}
        />
      )}

      {/* 🔍 Búsqueda Global en todos los archivos */}
      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        files={files}
        onNavigate={(filePath, lineNumber) => {
          handleFileSelect(filePath);
          // TODO: Navegar a línea específica en el editor
        }}
      />
    </div>
  );
}

export default App;
