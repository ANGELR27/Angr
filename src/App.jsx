import { useState, useEffect, useRef, useCallback } from 'react'
import FileExplorer from './components/FileExplorer'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'
import TopBar from './components/TopBar'
import Terminal from './components/Terminal'
import ImageManager from './components/ImageManager'
import ThemeSelector from './components/ThemeSelector'
import BackgroundSelector from './components/BackgroundSelector'
import ShortcutsHelp from './components/ShortcutsHelp'
import AutoSaveIndicator from './components/AutoSaveIndicator'
import SessionManager from './components/SessionManager'
import CollaborationPanel from './components/CollaborationPanel'
import CollaborationBanner from './components/CollaborationBanner'
import CollaborationNotification from './components/CollaborationNotification'
import ChatPanel from './components/ChatPanel'
import AuthModal from './components/AuthModal'
import SnippetManager from './components/SnippetManager'
import GitPanel from './components/GitPanel'
import DevToolsMenu from './components/DevToolsMenu'
import FloatingTerminal from './components/FloatingTerminal'
import CodeParticles from './components/CodeParticles'
import ExecutionPulse from './components/ExecutionPulse'
import databaseService from './services/databaseService'
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './utils/storage'
import { applyGlobalTheme } from './utils/globalThemes'
import { useDebouncedSaveMultiple } from './hooks/useDebouncedSave'
import { useCollaboration } from './hooks/useCollaboration'
import { useAuth } from './hooks/useAuth'
import { buildPreview } from './utils/previewBuilder'

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
  const [showImageManager, setShowImageManager] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSessionManager, setShowSessionManager] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [showSnippetManager, setShowSnippetManager] = useState(false);
  const [showGitPanel, setShowGitPanel] = useState(false);
  const [editorBackground, setEditorBackground] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.EDITOR_BACKGROUND, { id: 'none', image: null, opacity: 0.15, blur: 0 });
  });
  // 🎯 NUEVO: Estado para modo práctica (sin autocompletado)
  const [practiceModeEnabled, setPracticeModeEnabled] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.PRACTICE_MODE, false);
  });
  // 📂 NUEVO: Estado para Split View
  const [splitViewEnabled, setSplitViewEnabled] = useState(false);
  const [secondPanelTab, setSecondPanelTab] = useState(null);
  // 🔥 NUEVO: Estados para chat
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  // ✨ NUEVO: Estado para menú de herramientas dev
  const [showDevToolsMenu, setShowDevToolsMenu] = useState(false);
  // ✨ Nuevo: Animación de intercambio editor/terminal en Fade
  const [swapAnim, setSwapAnim] = useState('none'); // 'none' | 'toTerminal' | 'toEditor'
  const swapTimerRef = useRef(null);
  // 🚀 NUEVO: Terminal flotante con glassmorphism
  const [showFloatingTerminal, setShowFloatingTerminal] = useState(false);
  const [floatingTerminalOutput, setFloatingTerminalOutput] = useState('');
  const [floatingTerminalError, setFloatingTerminalError] = useState(false);
  
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

  // Estado para AuthModal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPendingAction, setAuthPendingAction] = useState(null); // 'create' o 'join'

  // Aplicar tema cuando cambia
  useEffect(() => {
    applyGlobalTheme(currentTheme);
  }, [currentTheme]);

  // Aplicar tema al cargar la aplicación
  useEffect(() => {
    applyGlobalTheme(currentTheme);
  }, []);

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
      // En modo Fade: ocultar sidebar y preview
      setShowSidebar(false);
      setShowPreview(false);
    }
  };

  // Listener para atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + B: Toggle Sidebar
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      }
      
      // Ctrl + Shift + T: Toggle Theme Selector
      if ((e.metaKey && e.key.toLowerCase() === 't') || 
          (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't')) {
        e.preventDefault();
        setShowThemeSelector(prev => !prev);
      }
      
      // ? o F1: Mostrar ayuda de atajos
      if (e.key === '?' || e.key === 'F1') {
        e.preventDefault();
        setShowShortcutsHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getFileByPath = (path) => {
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
  };

  const handleFileSelect = (filePath) => {
    const file = getFileByPath(filePath);
    
    if (file && file.type === 'file') {
      if (!openTabs.includes(filePath)) {
        setOpenTabs([...openTabs, filePath]);
      }
      setActiveTab(filePath);
    }
  };

  const handleTabClose = (tabPath) => {
    const newTabs = openTabs.filter(tab => tab !== tabPath);
    setOpenTabs(newTabs);
    
    if (activeTab === tabPath && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1]);
    }
  };

  const handleCodeChange = (value) => {
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
  };

  // Handler para insertar snippets en el editor
  const handleInsertSnippet = (snippetCode) => {
    const activeFile = getFileByPath(activeTab);
    if (!activeFile) return;

    // Insertar snippet al final del contenido actual
    const currentContent = activeFile.content || '';
    const newContent = currentContent + '\n\n' + snippetCode;
    handleCodeChange(newContent);
  };

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

    setShowResetModal(false);

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

  const handleResetAll = () => setShowResetModal(true);

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
    setShowCollaborationPanel(true);
    return result;
  };

  const handleJoinSession = async (sessionId, userData) => {
    const result = await joinSession(sessionId, userData);
    setShowCollaborationPanel(true);
    
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
    setShowCollaborationPanel(false);
    setShowChat(false);
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
      setShowCollaborationPanel(true);
    } else {
      // Si no está configurado Supabase o no está autenticado, mostrar AuthModal
      if (isAuthConfigured && !isAuthenticated) {
        console.log('🔐 Se requiere autenticación - Mostrando AuthModal');
        setAuthPendingAction('menu');
        setShowAuthModal(true);
      } else {
        // Si ya está autenticado o no está configurado Auth, abrir SessionManager directamente
        setShowSessionManager(true);
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
        setShowSessionManager(true);
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
          setShowSessionManager(true);
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
      setShowFloatingTerminal(true);
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
      setShowFloatingTerminal(true);
      // ⚡ Activar pulso de éxito
      setExecutionPulse({ show: true, isError: false });
      setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
    } catch (error) {
      setFloatingTerminalOutput(`❌ ${error.name}: ${error.message}`);
      setFloatingTerminalError(true);
      setShowFloatingTerminal(true);
      // ⚡ Activar pulso de error
      setExecutionPulse({ show: true, isError: true });
      setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
    }
  }, []);

  // 🚀 Ejecutar código en terminal flotante (Ctrl + Alt + S)
  const handleExecuteCodeFloating = useCallback(() => {
    const activeFile = getFileByPath(activeTab);
    
    if (!activeFile) {
      setFloatingTerminalOutput('❌ No hay archivo abierto');
      setFloatingTerminalError(true);
      setShowFloatingTerminal(true);
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
      // Python no soportado
      setFloatingTerminalOutput(`⚠️ Python no está disponible en el navegador\n\n💡 Tip: Usa https://replit.com o instala Python localmente\n\n📝 Código:\n${code}`);
      setFloatingTerminalError(true);
      setShowFloatingTerminal(true);
      // ⚡ Activar pulso de error
      setExecutionPulse({ show: true, isError: true });
      setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
    } else if (fileName.endsWith('.java')) {
      // Java simulado
      setFloatingTerminalOutput(`⚠️ Java requiere compilación, usa la terminal principal (Ctrl+Alt+R)`);
      setFloatingTerminalError(true);
      setShowFloatingTerminal(true);
      // ⚡ Activar pulso de error
      setExecutionPulse({ show: true, isError: true });
      setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
    } else {
      setFloatingTerminalOutput(`❌ No se puede ejecutar archivos .${fileName.split('.').pop()}\n\nSoportados: JavaScript (.js)`);
      setFloatingTerminalError(true);
      setShowFloatingTerminal(true);
      // ⚡ Activar pulso de error
      setExecutionPulse({ show: true, isError: true });
      setTimeout(() => setExecutionPulse({ show: false, isError: false }), 1500);
    }
  }, [activeTab, files, executeJavaScriptFloating]);

  const handleDeleteFile = (filePath) => {
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
  };

  const handleRenameFile = (oldPath, newName) => {
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
  };

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
    
    const newFile = {
      name: fileName,
      type: 'file',
      language,
      content: initialContent
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
        if (!showPreview) {
          // Editor -> Preview
          setSwapAnim('toPreview');
          setShowTerminal(false); // Ocultar terminal en modo Fade
          setShowPreview(true);
          swapTimerRef.current = setTimeout(() => setSwapAnim('none'), 650);
        } else {
          // Preview -> Editor
          setSwapAnim('toEditor');
          // mantener preview montada hasta fin de animación
          swapTimerRef.current = setTimeout(() => {
            setShowPreview(false);
            setSwapAnim('none');
          }, 650);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    };
  }, [isFadeMode, showTerminal, showPreview, handleExecuteCodeFloating]);


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
          radial-gradient(circle 450px at 15% 20%, rgba(59, 130, 246, 0.32) 0%, rgba(59, 130, 246, 0.22) 35%, rgba(59, 130, 246, 0.12) 60%, transparent 100%),
          radial-gradient(circle 550px at 85% 85%, rgba(255, 220, 80, 0.35) 0%, rgba(251, 191, 36, 0.25) 35%, rgba(245, 158, 11, 0.15) 60%, transparent 100%),
          radial-gradient(circle 400px at 50% 50%, rgba(168, 85, 247, 0.28) 0%, rgba(139, 92, 246, 0.20) 35%, rgba(124, 58, 237, 0.12) 60%, transparent 100%)
        `;
      } else {
        // Colores sutiles y fríos para la noche
        overlay.style.background = `
          radial-gradient(circle 450px at 15% 20%, rgba(59, 130, 246, 0.28) 0%, rgba(59, 130, 246, 0.18) 35%, rgba(59, 130, 246, 0.10) 60%, transparent 100%),
          radial-gradient(circle 550px at 85% 85%, rgba(255, 220, 80, 0.30) 0%, rgba(251, 191, 36, 0.20) 35%, rgba(245, 158, 11, 0.12) 60%, transparent 100%),
          radial-gradient(circle 400px at 50% 50%, rgba(168, 85, 247, 0.22) 0%, rgba(139, 92, 246, 0.15) 35%, rgba(124, 58, 237, 0.08) 60%, transparent 100%)
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
    <div className={`h-screen flex flex-col text-white relative overflow-hidden ${isFadeMode ? 'fade-grid-bg' : !editorBackground.image ? 'bg-editor-bg' : ''}`} style={{ backgroundColor: editorBackground.image ? 'transparent' : undefined }}>
      {/* Grid overlay para modo Fade con parallax */}
      {isFadeMode && <div className="fade-grid-overlay" />}
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
      {!editorBackground.image && (
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
        onOpenImageManager={() => setShowImageManager(true)}
        onAddImageFile={handleAddImageFile}
        onResetAll={handleResetAll}
        onOpenShortcuts={() => setShowShortcutsHelp(true)}
        onExport={handleExport}
        currentTheme={currentTheme}
        onToggleLite={handleToggleLite}
        onToggleFeel={handleToggleFeel}
        onToggleFade={handleToggleFade}
        tabs={openTabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
        onTabClose={handleTabClose}
        onOpenCollaboration={handleOpenCollaboration}
        isCollaborating={isCollaborating}
        collaborationUsers={activeUsers.length}
        showChat={showChat}
        onToggleChat={() => setShowChat(!showChat)}
        chatMessagesCount={chatMessages.length}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        onOpenBackground={() => setShowBackgroundSelector(true)}
        practiceModeEnabled={practiceModeEnabled}
        onTogglePracticeMode={() => setPracticeModeEnabled(!practiceModeEnabled)}
        onOpenSnippets={() => setShowSnippetManager(true)}
        splitViewEnabled={splitViewEnabled}
        onToggleSplitView={handleToggleSplitView}
        onOpenGit={() => setShowGitPanel(true)}
        onOpenDevTools={() => setShowDevToolsMenu(true)}
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
        onOpenPanel={() => setShowCollaborationPanel(true)}
      />

      {/* Notificaciones de colaboración */}
      {notifications.map((notification) => (
        <CollaborationNotification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
      
      <ImageManager
        isOpen={showImageManager}
        onClose={() => setShowImageManager(false)}
        images={images}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
      />

      <ThemeSelector
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />

      <BackgroundSelector
        isOpen={showBackgroundSelector}
        onClose={() => setShowBackgroundSelector(false)}
        currentBackground={editorBackground.id}
        onBackgroundChange={handleBackgroundChange}
      />

      <ShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />

      <SnippetManager
        isOpen={showSnippetManager}
        onClose={() => setShowSnippetManager(false)}
        onInsertSnippet={handleInsertSnippet}
        currentTheme={currentTheme}
      />

      <GitPanel
        isOpen={showGitPanel}
        onClose={() => setShowGitPanel(false)}
        files={files}
        currentTheme={currentTheme}
      />

      {/* Menú de herramientas de desarrollador */}
      {showDevToolsMenu && (
        <DevToolsMenu onClose={() => setShowDevToolsMenu(false)} />
      )}

      <SessionManager
        isOpen={showSessionManager}
        onClose={() => setShowSessionManager(false)}
        onCreateSession={handleCreateSession}
        onJoinSession={handleJoinSession}
        isConfigured={isCollaborationConfigured}
        isAuthenticated={isAuthenticated}
        user={user}
      />

      <CollaborationPanel
        isOpen={showCollaborationPanel}
        onClose={() => setShowCollaborationPanel(false)}
        currentUser={currentUser}
        activeUsers={activeUsers}
        currentSession={currentSession}
        onChangePermissions={changeUserPermissions}
        onLeaveSession={handleLeaveSession}
        remoteCursors={remoteCursors}
        typingUsers={typingUsers}
        activeFile={activeTab}
      />

      {/* 🔥 NUEVO: Chat Panel */}
      {isCollaborating && (
        <ChatPanel
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          messages={chatMessages}
          currentUser={currentUser}
          onSendMessage={handleSendChatMessage}
          isMinimized={isChatMinimized}
          onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
        />
      )}

      {/* 🔐 Modal de Autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        authMode="login"
      />

      {/* Modal Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.6)'}} onClick={()=>setShowResetModal(false)}>
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
              <button className="px-3 py-1.5 rounded border" style={{borderColor:'var(--theme-border)', color:'var(--theme-text)'}} onClick={()=>setShowResetModal(false)}>Cancelar</button>
              <button className="px-3 py-1.5 rounded" style={{backgroundColor:'#ef4444', color:'#fff'}} onClick={performReset}>Resetear</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar con FileExplorer */}
        {showSidebar && (
          <>
            <div 
              style={{ width: `${sidebarWidth}px`, minWidth: '180px', maxWidth: '400px' }}
              className={`flex-shrink-0 relative ${!editorBackground.image ? 'shadow-blue-glow' : ''}`}
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
              backgroundColor: 'rgba(96, 165, 250, 0.05)',
              transition: 'background-color 200ms ease'
            }}
            onDoubleClick={() => setShowSidebar(true)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.05)'}
            title="Doble clic para mostrar el explorador"
          />
        )}
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
                  ...(isFadeMode ? { 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    maxWidth: '850px',
                    maxHeight: '550px',
                    width: '90%',
                    height: '550px',
                    borderRadius: '16px', 
                    border: '1px solid #3f3f46',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(96, 165, 250, 0.1)',
                    overflow: 'hidden',
                    transition: 'all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: (showTerminal || showPreview) 
                      ? 'translate(-50%, calc(-50% - 30px)) scale(0.92) rotateX(5deg)' 
                      : 'translate(-50%, -50%) scale(1) rotateX(0deg)',
                    opacity: (showTerminal || showPreview) ? 0 : 1,
                    zIndex: (showTerminal || showPreview) ? 1 : 3,
                    filter: (showTerminal || showPreview) ? 'blur(2px) brightness(0.7)' : 'blur(0px) brightness(1)',
                    transformOrigin: 'center center',
                    perspective: '1000px',
                    pointerEvents: (showTerminal || showPreview) ? 'none' : 'auto'
                  } : {})
                }}
                className={`flex-shrink-0 overflow-hidden relative ${!editorBackground.image && !isFadeMode ? 'shadow-blue-glow' : ''}`}
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
                  <CodeEditor
                    value={activeFile?.content || ''}
                    language={activeFile?.language || 'plaintext'}
                    onChange={handleCodeChange}
                    projectFiles={files}
                    projectImages={images}
                    currentTheme={currentTheme}
                    isImage={activeFile?.isImage || false}
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
                    style={{ 
                      width: isFadeMode ? '90%' : `${previewWidth}%`,
                      ...(isFadeMode ? {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        maxWidth: '850px',
                        maxHeight: '550px',
                        height: '550px',
                        borderRadius: '16px',
                        border: '1px solid #3f3f46',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(251, 191, 36, 0.1)',
                        overflow: 'hidden',
                        transition: 'all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: showPreview 
                          ? 'translate(-50%, -50%) scale(1) rotateY(0deg)' 
                          : 'translate(calc(-50% + 30px), -50%) scale(0.92) rotateY(-5deg)',
                        opacity: showPreview ? 1 : 0,
                        zIndex: showPreview ? 4 : 1,
                        filter: showPreview ? 'blur(0px) brightness(1)' : 'blur(2px) brightness(0.7)',
                        transformOrigin: 'center center',
                        perspective: '1000px',
                        pointerEvents: showPreview ? 'auto' : 'none'
                      } : {})
                    }}
                    className={`flex-shrink-0 overflow-hidden ${!editorBackground.image && !isFadeMode ? 'shadow-yellow-glow' : ''}`}
                  >
                    <Preview 
                      content={getPreviewContent()}
                      projectFiles={files}
                      projectImages={images}
                      currentTheme={currentTheme}
                    />
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
                    ...(isFadeMode ? {
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      maxWidth: '850px',
                      maxHeight: '550px',
                      width: '90%',
                      height: '550px',
                      borderRadius: '16px',
                      border: '1px solid #3f3f46',
                      overflow: 'hidden',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(251, 191, 36, 0.1)',
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
                  className={`flex-shrink-0 ${!editorBackground.image && !isFadeMode ? 'shadow-blue-glow-strong' : ''}`}
                >
                  <Terminal 
                    ref={terminalRef}
                    isOpen={showTerminal}
                    onClose={() => setShowTerminal(false)}
                    onToggleSize={() => setIsTerminalMaximized(v => !v)}
                    isMaximized={isTerminalMaximized}
                    onExecuteCode={handleExecuteCode}
                    onOpenThemes={() => setShowThemeSelector(true)}
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
      <FloatingTerminal
        isVisible={showFloatingTerminal}
        output={floatingTerminalOutput}
        isError={floatingTerminalError}
        onClose={() => setShowFloatingTerminal(false)}
      />

      {/* 🎨 Efectos del modo Fade */}
      {isFadeMode && (
        <>
          {/* Partículas de código flotantes */}
          <CodeParticles />
          
          {/* Efecto de pulso al ejecutar código */}
          <ExecutionPulse show={executionPulse.show} isError={executionPulse.isError} />
        </>
      )}
    </div>
  );
}

export default App;
