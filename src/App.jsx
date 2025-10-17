import { useState, useEffect, useRef, useCallback } from 'react'
import FileExplorer from './components/FileExplorer'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'
import TopBar from './components/TopBar'
import Terminal from './components/Terminal'
import ImageManager from './components/ImageManager'
import ThemeSelector from './components/ThemeSelector'
import ShortcutsHelp from './components/ShortcutsHelp'
import AutoSaveIndicator from './components/AutoSaveIndicator'
import SessionManager from './components/SessionManager'
import CollaborationPanel from './components/CollaborationPanel'
import CollaborationBanner from './components/CollaborationBanner'
import CollaborationNotification from './components/CollaborationNotification'
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './utils/storage'
import { applyGlobalTheme } from './utils/globalThemes'
import { useDebouncedSaveMultiple } from './hooks/useDebouncedSave'
import { useCollaboration } from './hooks/useCollaboration'

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
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSessionManager, setShowSessionManager] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.THEME, 'vs-dark');
  });
  const [images, setImages] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.IMAGES, []);
  });
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.SIDEBAR_WIDTH, 280);
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

  // Aplicar tema cuando cambia
  useEffect(() => {
    applyGlobalTheme(currentTheme);
  }, [currentTheme]);

  // Aplicar tema al cargar la aplicación
  useEffect(() => {
    applyGlobalTheme(currentTheme);
  }, []);

  // Toggle modo lite conservando el tema previo
  const handleToggleLite = () => {
    if (currentTheme === 'lite') {
      setCurrentTheme(prevThemeRef.current || 'vs-dark');
    } else {
      prevThemeRef.current = currentTheme;
      setCurrentTheme('lite');
    }
  };

  // Listener para atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e) => {
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

    // Transmitir cambios si hay colaboración activa
    if (isCollaborating) {
      broadcastFileChange(activeTab, value, null);
    }
  };

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

  // Handlers de colaboración
  const handleCreateSession = async (sessionData) => {
    const result = await createSession(sessionData);
    setShowCollaborationPanel(true);
    return result;
  };

  const handleJoinSession = async (sessionId, userData) => {
    const result = await joinSession(sessionId, userData);
    setShowCollaborationPanel(true);
    return result;
  };

  const handleLeaveSession = async () => {
    await leaveSession();
    setShowCollaborationPanel(false);
  };

  // Detectar si hay un ID de sesión en la URL al cargar
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (sessionId && !isCollaborating) {
      setShowSessionManager(true);
    }
  }, [isCollaborating]);

  const handleExecuteCode = () => {
    const activeFile = getFileByPath(activeTab);
    
    if (!activeFile) {
      if (terminalRef.current) {
        terminalRef.current.addLog('error', ['No hay archivo abierto']);
      }
      return;
    }

    if (activeFile.language !== 'javascript') {
      if (terminalRef.current) {
        terminalRef.current.addLog('error', ['Solo se puede ejecutar código JavaScript']);
      }
      return;
    }

    if (!activeFile.content || activeFile.content.trim() === '') {
      if (terminalRef.current) {
        terminalRef.current.addLog('error', ['El archivo está vacío']);
      }
      return;
    }

    // Abrir terminal si está cerrada
    if (!showTerminal) {
      setShowTerminal(true);
    }

    // Ejecutar el código después de un pequeño delay para asegurar que la terminal está abierta
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.executeJS(activeFile.content);
      }
    }, showTerminal ? 0 : 100);
  };

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
                    fileName.endsWith('.json') ? 'json' : 'plaintext';
    
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

  const getPreviewContent = () => {
    const htmlFile = getFileByPath('index.html');
    const cssFile = getFileByPath('styles.css');
    const jsFile = getFileByPath('script.js');

    if (!htmlFile) return '';

    let html = htmlFile.content || '';

    // Inyectar CSS inline
    if (cssFile && cssFile.content) {
      html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
    }

    // Inyectar JS inline
    if (jsFile && jsFile.content) {
      html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);
    }

    return html;
  };

  // Handlers para redimensionar paneles
  const handleSidebarResize = (e) => {
    if (!isResizingSidebar.current) return;
    const newWidth = Math.max(150, Math.min(500, e.clientX));
    setSidebarWidth(newWidth);
  };

  const handlePreviewResize = (e) => {
    if (!isResizingPreview.current) return;
    const container = document.querySelector('.editor-preview-container');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const newPreviewWidth = ((containerRect.width - mouseX) / containerRect.width) * 100;
    setPreviewWidth(Math.max(20, Math.min(80, newPreviewWidth)));
  };

  const handleTerminalResize = (e) => {
    if (!isResizingTerminal.current) return;
    const container = document.querySelector('.main-content-area');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const newHeight = containerRect.bottom - e.clientY;
    setTerminalHeight(Math.max(100, Math.min(600, newHeight)));
  };

  const handleMouseUp = () => {
    isResizingSidebar.current = false;
    isResizingPreview.current = false;
    isResizingTerminal.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleSidebarResize);
    document.addEventListener('mousemove', handlePreviewResize);
    document.addEventListener('mousemove', handleTerminalResize);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleSidebarResize);
      document.removeEventListener('mousemove', handlePreviewResize);
      document.removeEventListener('mousemove', handleTerminalResize);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const activeFile = getFileByPath(activeTab);

  return (
    <div className="h-screen flex flex-col bg-editor-bg text-white relative overflow-hidden">
      {/* Efectos de esquinas con glow azul y amarillo */}
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
        tabs={openTabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
        onTabClose={handleTabClose}
        onOpenCollaboration={() => isCollaborating ? setShowCollaborationPanel(true) : setShowSessionManager(true)}
        isCollaborating={isCollaborating}
        collaborationUsers={activeUsers.length}
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

      <ShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />

      <SessionManager
        isOpen={showSessionManager}
        onClose={() => setShowSessionManager(false)}
        onCreateSession={handleCreateSession}
        onJoinSession={handleJoinSession}
        isConfigured={isCollaborationConfigured}
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
        <div 
          style={{ width: `${sidebarWidth}px`, minWidth: '150px', maxWidth: '500px' }}
          className="flex-shrink-0 shadow-blue-glow relative"
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
          />
        </div>
        
        {/* Resize handle para sidebar */}
        <div
          className="w-1 bg-border-color cursor-col-resize resize-handle transition-colors shadow-blue-glow"
          style={{
            background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))'
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            isResizingSidebar.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden main-content-area">
            <div 
              className="flex overflow-hidden editor-preview-container"
              style={{ 
                height: showTerminal ? `calc(100% - ${terminalHeight}px - 4px)` : '100%' 
              }}
            >
              <div 
                style={{ width: showPreview ? `${100 - previewWidth}%` : '100%' }}
                className="flex-shrink-0 shadow-mixed-glow overflow-hidden"
              >
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
                />
              </div>
              
              {showPreview && (
                <>
                  {/* Resize handle para preview */}
                  <div
                    className="w-1 cursor-col-resize resize-handle transition-colors shadow-yellow-glow flex-shrink-0"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(234, 179, 8, 0.3), rgba(59, 130, 246, 0.3))'
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      isResizingPreview.current = true;
                      document.body.style.cursor = 'col-resize';
                      document.body.style.userSelect = 'none';
                    }}
                  />
                  <div 
                    style={{ width: `${previewWidth}%` }}
                    className="flex-shrink-0 shadow-yellow-glow overflow-hidden"
                  >
                    <Preview 
                      content={getPreviewContent()}
                      onConsoleLog={handleConsoleLog}
                      projectFiles={files}
                      projectImages={images}
                      currentTheme={currentTheme}
                    />
                  </div>
                </>
              )}
            </div>
            
            {showTerminal && (
              <>
                {/* Resize handle para terminal */}
                <div
                  className="h-1 cursor-row-resize resize-handle transition-colors shadow-mixed-glow flex-shrink-0"
                  style={{
                    background: 'linear-gradient(to right, rgba(59, 130, 246, 0.3), rgba(234, 179, 8, 0.3), rgba(147, 51, 234, 0.3))'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    isResizingTerminal.current = true;
                    document.body.style.cursor = 'row-resize';
                    document.body.style.userSelect = 'none';
                  }}
                />
                <div style={{ height: `${terminalHeight}px` }} className="shadow-blue-glow-strong flex-shrink-0">
                  <Terminal 
                    ref={terminalRef}
                    isOpen={showTerminal}
                    onClose={() => setShowTerminal(false)}
                    onToggleSize={() => setIsTerminalMaximized(v => !v)}
                    isMaximized={isTerminalMaximized}
                    onExecuteCode={handleExecuteCode}
                    onOpenThemes={() => setShowThemeSelector(true)}
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
    </div>
  );
}

export default App;
