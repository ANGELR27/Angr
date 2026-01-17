import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Trash2, Upload, Edit3, Plus, FolderPlus, FolderInput } from 'lucide-react';
// 🎨 Iconos profesionales de cada tecnología
import { 
  FaPython, FaHtml5, FaCss3Alt, FaJs, FaReact, FaJava, FaPhp, 
  FaRust, FaSwift, FaDatabase, FaMarkdown, FaFileCode, FaFileImage,
  FaFileAlt, FaCog, FaNpm, FaGitAlt, FaDocker
} from 'react-icons/fa';
import { 
  SiTypescript, SiKotlin, SiGo, SiRuby, SiCplusplus, 
  SiC, SiYaml, SiVuedotjs, SiSvelte
} from 'react-icons/si';
import { VscTerminalBash, VscJson, VscFile } from 'react-icons/vsc';

function FileExplorer({ files, onFileSelect, activeFile, onDeleteFile, onAddImageFile, onRenameFile, onMoveItem, onCreateFile, onCreateFolder, currentTheme, onToggleSidebar }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['components', 'examples']));
  const [contextMenu, setContextMenu] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [modal, setModal] = useState({ open: false, type: null, path: null, value: '' });
  const [importToast, setImportToast] = useState(null);
  const [dragFileCount, setDragFileCount] = useState(0);
  const [dragFileTypes, setDragFileTypes] = useState([]);
  const [isDraggingInternalToRoot, setIsDraggingInternalToRoot] = useState(false);
  const isLite = currentTheme === 'lite';
  const isFeel = currentTheme === 'feel';
  
  // Referencias para inputs de archivo
  const folderInputRef = useRef(null);
  const filesInputRef = useRef(null);

  // Helpers de árbol
  const getChildrenOfPath = (tree, path) => {
    if (!path) return tree; // raíz
    const parts = path.split('/');
    let current = tree;
    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      const entry = current?.[key];
      if (!entry || entry.type !== 'folder') return null;
      current = entry.children;
    }
    return current;
  };
  const getUniqueName = (baseName, childrenObj) => {
    if (!childrenObj) return baseName;
    if (!childrenObj[baseName]) return baseName;
    const extIdx = baseName.lastIndexOf('.');
    const name = extIdx > 0 ? baseName.slice(0, extIdx) : baseName;
    const ext = extIdx > 0 ? baseName.slice(extIdx) : '';
    let i = 1;
    let candidate = `${name} (${i})${ext}`;
    while (childrenObj[candidate]) { i++; candidate = `${name} (${i})${ext}`; }
    return candidate;
  };
  const showToast = (text) => {
    setImportToast(text);
    setTimeout(() => setImportToast(null), 2000);
  };

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleContextMenu = (e, path, type) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      path,
      type
    });
  };

  const handleDeleteClick = () => {
    if (contextMenu) {
      setModal({ open: true, type: 'delete', path: contextMenu.path, value: '' });
      setContextMenu(null);
    }
  };

  const handleRenameClick = () => {
    if (contextMenu) {
      const currentName = contextMenu.path.split('/').pop();
      setModal({ open: true, type: 'rename', path: contextMenu.path, value: currentName });
      setContextMenu(null);
    }
  };

  const handleNewFileClick = () => {
    const parentPath = contextMenu?.type === 'folder' ? contextMenu.path : null;
    setModal({ open: true, type: 'new-file', path: parentPath, value: 'nuevo.txt' });
    setContextMenu(null);
  };

  const handleNewFolderClick = () => {
    const parentPath = contextMenu?.type === 'folder' ? contextMenu.path : null;
    setModal({ open: true, type: 'new-folder', path: parentPath, value: 'carpeta' });
    setContextMenu(null);
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    
    // Si es un movimiento interno, mostrar feedback diferente
    const hasInternalSource = dt.types && Array.from(dt.types).includes('text/source-path');
    if (hasInternalSource) {
      setIsDraggingInternalToRoot(true);
      return;
    }
    
    const hasFiles = dt.types && Array.from(dt.types).includes('Files');
    
    if (hasFiles) {
      setIsDraggingOver(true);
      // Detectar tipos de archivos
      const items = dt.items;
      if (items && items.length) {
        const count = items.length;
        const types = new Set();
        for (let i = 0; i < Math.min(items.length, 5); i++) {
          const item = items[i];
          if (item.kind === 'file') {
            const ext = item.type.split('/').pop() || 'archivo';
            types.add(ext);
          }
        }
        setDragFileCount(count);
        setDragFileTypes(Array.from(types));
      }
    }
  };

  const handleDragOver = (e) => {
    // Siempre prevenir para permitir drop fiable (navegadores requieren preventDefault)
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Solo cerrar si sale del contenedor principal
    if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget)) {
      setIsDraggingOver(false);
      setIsDraggingInternalToRoot(false);
      setDragFileCount(0);
      setDragFileTypes([]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    setIsDraggingInternalToRoot(false);
    setDragFileCount(0);
    setDragFileTypes([]);
    const dt = e.dataTransfer;
    
    // Verificar si es un movimiento interno primero
    const sourcePath = dt.getData('text/source-path');
    if (sourcePath) {
      // Es un movimiento interno a la raíz
      if (onMoveItem) {
        onMoveItem(sourcePath, null); // null = raíz
        showToast('✅ Archivo movido a la raíz');
      }
      return;
    }
    
    const rootChildren = getChildrenOfPath(files, null);

    const importedFiles = [];
    const createdFolders = new Set();
    
    // Función para crear carpetas recursivamente
    const ensureFolderPath = (folderPath) => {
      if (!folderPath || createdFolders.has(folderPath)) return;
      
      const parts = folderPath.split('/');
      let currentPath = '';
      
      for (const part of parts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        if (!createdFolders.has(currentPath)) {
          const parentPath = currentPath.split('/').slice(0, -1).join('/') || null;
          const folderName = part;
          
          // Verificar si la carpeta ya existe en files
          const existingChildren = getChildrenOfPath(files, parentPath);
          const exists = existingChildren.some(child => 
            child.type === 'folder' && child.name === folderName
          );
          
          if (!exists && onCreateFolder) {
            onCreateFolder(folderName, parentPath);
            createdFolders.add(currentPath);
            // Expandir automáticamente las carpetas importadas
            setExpandedFolders(prev => new Set([...prev, currentPath]));
          }
        }
      }
    };
    
    const processFile = (file, targetPath = null) => {
      if (!file || !file.name) return;
      
      // Crear estructura de carpetas si es necesario
      if (targetPath) {
        ensureFolderPath(targetPath);
      }
      
      // Detectar si es imagen por tipo MIME o extensión
      const isImage = (file.type && file.type.startsWith('image/')) || 
                      file.name.match(/\.(png|jpg|jpeg|gif|svg|webp|bmp|ico)$/i);
      
      // Soporte para imágenes
      if (isImage) {
        const children = getChildrenOfPath(files, targetPath);
        const unique = getUniqueName(file.name, children);
        const reader = new FileReader();
        reader.onload = (event) => {
          onAddImageFile && onAddImageFile({
            name: unique,
            data: event.target.result,
            size: file.size,
            type: file.type || 'image/png'
          }, targetPath);
        };
        reader.readAsDataURL(file);
        importedFiles.push({ name: unique, type: 'imagen', path: targetPath });
      }
      // Soporte para archivos de texto (HTML, CSS, JS, etc.)
      else if (file.type.match(/text\/|application\/(javascript|json)/) || 
               file.name.match(/\.(html|css|js|json|txt|md)$/i)) {
        const children = getChildrenOfPath(files, targetPath);
        const unique = getUniqueName(file.name, children);
        const reader = new FileReader();
        reader.onload = (event) => {
          onCreateFile && onCreateFile(unique, targetPath, event.target.result);
        };
        reader.readAsText(file);
        importedFiles.push({ name: unique, type: 'código', path: targetPath });
      }
    };

    // Carpetas (webkit entries) si están disponibles
    if (dt.items && dt.items.length && typeof dt.items[0].webkitGetAsEntry === 'function') {
      const entries = Array.from(dt.items).map(it => it.webkitGetAsEntry()).filter(Boolean);
      
      // Si hay entries válidos, usar ese método
      if (entries.length > 0) {
        let pending = 0;
        const walk = (entry, basePath = null) => {
          if (entry.isFile) {
            pending++;
            entry.file((file) => { 
              processFile(file, basePath); 
              pending--; 
              if (pending === 0 && importedFiles.length > 0) {
                const images = importedFiles.filter(f => f.type === 'imagen').length;
                const code = importedFiles.filter(f => f.type === 'código').length;
                const folders = createdFolders.size;
                let msg = '✅ Importados: ';
                if (folders) msg += `${folders} carpeta${folders > 1 ? 's' : ''}, `;
                if (images) msg += `${images} imagen${images > 1 ? 'es' : ''}`;
                if (code) msg += `${images ? ', ' : ''}${code} archivo${code > 1 ? 's' : ''} de código`;
                showToast(msg);
              }
            });
          } else if (entry.isDirectory) {
            const dirReader = entry.createReader();
            pending++;
            dirReader.readEntries((ents) => {
              ents.forEach(en => walk(en, basePath ? `${basePath}/${entry.name}` : entry.name));
              pending--; 
              if (pending === 0 && importedFiles.length > 0) {
                const images = importedFiles.filter(f => f.type === 'imagen').length;
                const code = importedFiles.filter(f => f.type === 'código').length;
                const folders = createdFolders.size;
                let msg = '✅ Importados: ';
                if (folders) msg += `${folders} carpeta${folders > 1 ? 's' : ''}, `;
                if (images) msg += `${images} imagen${images > 1 ? 'es' : ''}`;
                if (code) msg += `${images ? ', ' : ''}${code} archivo${code > 1 ? 's' : ''} de código`;
                showToast(msg);
              }
            });
          }
        };
        entries.forEach(en => walk(en, null));
        return;
      }
      // Si entries está vacío, continuar con dt.files (imágenes de la web, etc.)
    }

    // Archivos sueltos (funciona para imágenes de la web, archivos del sistema, etc.)
    const fileList = dt.files;
    if (fileList && fileList.length) {
      Array.from(fileList).forEach(f => processFile(f, null));
      setTimeout(() => {
        if (importedFiles.length > 0) {
          const images = importedFiles.filter(f => f.type === 'imagen').length;
          const code = importedFiles.filter(f => f.type === 'código').length;
          let msg = '✅ Importados: ';
          if (images) msg += `${images} imagen${images > 1 ? 'es' : ''}`;
          if (code) msg += `${images ? ', ' : ''}${code} archivo${code > 1 ? 's' : ''} de código`;
          showToast(msg);
        } else {
          showToast('⚠️ No se pudo importar (formato no soportado)');
        }
      }, 100);
    } else {
      showToast('⚠️ Nada para importar');
    }
  };

  // Importación manual de archivos/carpetas
  const handleManualImport = (fileList) => {
    if (!fileList || fileList.length === 0) {
      showToast('⚠️ No se seleccionaron archivos');
      return;
    }

    const importedFiles = [];
    const createdFolders = new Set();
    let processedCount = 0;
    const totalFiles = fileList.length;
    
    // Función para crear carpetas recursivamente (con setTimeout para asegurar actualización)
    const ensureFolderPath = (folderPath) => {
      if (!folderPath || createdFolders.has(folderPath)) return;
      
      const parts = folderPath.split('/');
      let currentPath = '';
      
      for (const part of parts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        if (!createdFolders.has(currentPath)) {
          const parentPath = currentPath.split('/').slice(0, -1).join('/') || null;
          const folderName = part;
          
          const existingChildren = getChildrenOfPath(files, parentPath);
          const exists = existingChildren?.some(child => 
            child.type === 'folder' && child.name === folderName
          );
          
          if (!exists && onCreateFolder) {
            setTimeout(() => {
              onCreateFolder(folderName, parentPath);
            }, 0);
            createdFolders.add(currentPath);
            setExpandedFolders(prev => new Set([...prev, currentPath]));
          }
        }
      }
    };

    // Procesar cada archivo
    Array.from(fileList).forEach((file, index) => {
      // Extraer el path relativo del archivo si está disponible (webkitRelativePath)
      const relativePath = file.webkitRelativePath || file.name;
      const pathParts = relativePath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const folderPath = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : null;
      
      // Crear estructura de carpetas primero
      if (folderPath) {
        ensureFolderPath(folderPath);
      }
      
      // Detectar si es imagen
      const isImage = (file.type && file.type.startsWith('image/')) || 
                      fileName.match(/\.(png|jpg|jpeg|gif|svg|webp|bmp|ico)$/i);
      
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setTimeout(() => {
            const children = getChildrenOfPath(files, folderPath);
            const unique = getUniqueName(fileName, children || {});
            onAddImageFile && onAddImageFile({
              name: unique,
              data: event.target.result,
              size: file.size,
              type: file.type || 'image/png'
            }, folderPath);
          }, 50 * index); // Delay escalonado para evitar condiciones de carrera
          importedFiles.push({ name: fileName, type: 'imagen' });
          processedCount++;
          if (processedCount === totalFiles) {
            showImportSummary(importedFiles, createdFolders.size);
          }
        };
        reader.readAsDataURL(file);
      }
      // Archivos de código
      else if (file.type.match(/text\/|application\/(javascript|json)/) || 
               fileName.match(/\.(html|css|js|json|txt|md)$/i)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setTimeout(() => {
            const children = getChildrenOfPath(files, folderPath);
            const unique = getUniqueName(fileName, children || {});
            onCreateFile && onCreateFile(unique, folderPath, event.target.result);
          }, 50 * index); // Delay escalonado
          importedFiles.push({ name: fileName, type: 'código' });
          processedCount++;
          if (processedCount === totalFiles) {
            showImportSummary(importedFiles, createdFolders.size);
          }
        };
        reader.readAsText(file);
      } else {
        processedCount++;
        if (processedCount === totalFiles) {
          showImportSummary(importedFiles, createdFolders.size);
        }
      }
    });
  };

  // Función auxiliar para mostrar resumen de importación
  const showImportSummary = (importedFiles, foldersCount) => {
    setTimeout(() => {
      if (importedFiles.length > 0) {
        const images = importedFiles.filter(f => f.type === 'imagen').length;
        const code = importedFiles.filter(f => f.type === 'código').length;
        let msg = '✅ Importados: ';
        if (foldersCount) msg += `${foldersCount} carpeta${foldersCount > 1 ? 's' : ''}, `;
        if (images) msg += `${images} imagen${images > 1 ? 'es' : ''}`;
        if (code) msg += `${images ? ', ' : ''}${code} archivo${code > 1 ? 's' : ''} de código`;
        showToast(msg);
      } else {
        showToast('⚠️ No se pudo importar (formato no soportado)');
      }
    }, 200);
  };

  // Drag & drop interno
  const onDragStartItem = (e, path) => {
    e.dataTransfer.setData('text/source-path', path);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragEndItem = (e) => {
    // Limpiar estados al terminar el drag (sea exitoso o cancelado)
    // Usar setTimeout para asegurar que se ejecute después del drop
    setTimeout(() => {
      setIsDraggingInternalToRoot(false);
      setDragOverFolder(null);
      setIsDraggingOver(false);
      setDragFileCount(0);
      setDragFileTypes([]);
    }, 0);
  };

  const onDragOverFolder = (e, folderPath) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(folderPath);
  };

  const onDragLeaveFolder = (e, folderPath) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverFolder === folderPath) setDragOverFolder(null);
  };

  const onDropToFolder = (e, folderPath) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(null);

    // 1) movimiento interno
    const sourcePath = e.dataTransfer.getData('text/source-path');
    if (sourcePath) {
      if (onMoveItem) onMoveItem(sourcePath, folderPath);
      return;
    }

    const dt = e.dataTransfer;
    const importedFiles = [];
    const processFile = (file) => {
      if (!file || !file.name) return;
      
      // Detectar si es imagen por tipo MIME o extensión
      const isImage = (file.type && file.type.startsWith('image/')) || 
                      file.name.match(/\.(png|jpg|jpeg|gif|svg|webp|bmp|ico)$/i);
      
      if (isImage) {
        const children = getChildrenOfPath(files, folderPath);
        const unique = getUniqueName(file.name, children);
        const reader = new FileReader();
        reader.onload = (event) => {
          onAddImageFile && onAddImageFile({ 
            name: unique, 
            data: event.target.result, 
            size: file.size, 
            type: file.type || 'image/png' 
          }, folderPath);
        };
        reader.readAsDataURL(file);
        importedFiles.push({ name: unique, type: 'imagen' });
      }
      // Soporte para archivos de texto
      else if (file.type.match(/text\/|application\/(javascript|json)/) || 
               file.name.match(/\.(html|css|js|json|txt|md)$/i)) {
        const children = getChildrenOfPath(files, folderPath);
        const unique = getUniqueName(file.name, children);
        const reader = new FileReader();
        reader.onload = (event) => {
          onCreateFile && onCreateFile(unique, folderPath, event.target.result);
        };
        reader.readAsText(file);
        importedFiles.push({ name: unique, type: 'código' });
      }
    };

    if (dt.items && dt.items.length && typeof dt.items[0].webkitGetAsEntry === 'function') {
      const entries = Array.from(dt.items).map(it => it.webkitGetAsEntry()).filter(Boolean);
      
      // Si hay entries válidos, usar ese método
      if (entries.length > 0) {
        let pending = 0;
        const walk = (entry, base = folderPath) => {
          if (entry.isFile) {
            pending++;
            entry.file((file) => { 
              processFile(file); 
              pending--; 
              if (pending === 0 && importedFiles.length > 0) {
                const images = importedFiles.filter(f => f.type === 'imagen').length;
                const code = importedFiles.filter(f => f.type === 'código').length;
                let msg = `✅ Importados en ${folderPath}: `;
                if (images) msg += `${images} imagen${images > 1 ? 'es' : ''}`;
                if (code) msg += `${images ? ', ' : ''}${code} archivo${code > 1 ? 's' : ''} de código`;
                showToast(msg);
              }
            });
          } else if (entry.isDirectory) {
            const reader = entry.createReader();
            pending++;
            reader.readEntries((ents) => { 
              ents.forEach(en => walk(en, base)); 
              pending--; 
              if (pending === 0 && importedFiles.length > 0) {
                const images = importedFiles.filter(f => f.type === 'imagen').length;
                const code = importedFiles.filter(f => f.type === 'código').length;
                let msg = `✅ Importados en ${folderPath}: `;
                if (images) msg += `${images} imagen${images > 1 ? 'es' : ''}`;
                if (code) msg += `${images ? ', ' : ''}${code} archivo${code > 1 ? 's' : ''} de código`;
                showToast(msg);
              }
            });
          }
        };
        entries.forEach(en => walk(en));
        return;
      }
      // Si entries está vacío, continuar con dt.files
    }

    const extFiles = dt.files;
    if (extFiles && extFiles.length > 0) {
      Array.from(extFiles).forEach(file => processFile(file));
      setTimeout(() => {
        if (importedFiles.length > 0) {
          const images = importedFiles.filter(f => f.type === 'imagen').length;
          const code = importedFiles.filter(f => f.type === 'código').length;
          let msg = `✅ Importados en ${folderPath}: `;
          if (images) msg += `${images} imagen${images > 1 ? 'es' : ''}`;
          if (code) msg += `${images ? ', ' : ''}${code} archivo${code > 1 ? 's' : ''} de código`;
          showToast(msg);
        } else {
          showToast('⚠️ No se pudo importar (formato no soportado)');
        }
      }, 100);
    } else {
      showToast('⚠️ Nada para importar');
    }
  };

  const getFileIcon = (fileName) => {
    const baseColor = isLite ? 'var(--theme-secondary)' : '';
    const iconSize = 16; // 16px para mejor visualización

    if (typeof fileName !== 'string') {
      return <VscFile size={iconSize} style={{color: baseColor || '#9ca3af'}} />;
    }
    
    // 🖼️ IMÁGENES
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp'].some(e => fileName.endsWith(e))) {
      return <FaFileImage size={iconSize} style={{color: baseColor || '#f472b6'}} />;
    }
    
    // 🌐 HTML
    if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
      return <FaHtml5 size={iconSize} style={{color: baseColor || '#e34c26'}} />;
    }
    
    // 🎨 CSS
    if (fileName.endsWith('.css') || fileName.endsWith('.scss') || fileName.endsWith('.sass') || fileName.endsWith('.less')) {
      return <FaCss3Alt size={iconSize} style={{color: baseColor || '#264de4'}} />;
    }
    
    // 💛 JAVASCRIPT
    if (fileName.endsWith('.js') || fileName.endsWith('.mjs') || fileName.endsWith('.cjs')) {
      return <FaJs size={iconSize} style={{color: baseColor || '#f7df1e'}} />;
    }
    
    // 🔷 TYPESCRIPT
    if (fileName.endsWith('.ts')) {
      return <SiTypescript size={iconSize} style={{color: baseColor || '#3178c6'}} />;
    }
    
    // ⚛️ REACT (JSX/TSX)
    if (fileName.endsWith('.jsx') || fileName.endsWith('.tsx')) {
      return <FaReact size={iconSize} style={{color: baseColor || '#61dafb'}} />;
    }
    
    // 📋 JSON
    if (fileName.endsWith('.json')) {
      return <VscJson size={iconSize} style={{color: baseColor || '#f7df1e'}} />;
    }
    
    // 🐍 PYTHON
    if (fileName.endsWith('.py') || fileName.endsWith('.pyw') || fileName.endsWith('.pyx')) {
      return <FaPython size={iconSize} style={{color: baseColor || '#3776ab'}} />;
    }
    
    // ☕ JAVA
    if (fileName.endsWith('.java')) {
      return <FaJava size={iconSize} style={{color: baseColor || '#f89820'}} />;
    }
    
    // 🟣 KOTLIN
    if (fileName.endsWith('.kt') || fileName.endsWith('.kts')) {
      return <SiKotlin size={iconSize} style={{color: baseColor || '#7f52ff'}} />;
    }
    
    // 🔵 C
    if (fileName.endsWith('.c') || fileName.endsWith('.h')) {
      return <SiC size={iconSize} style={{color: baseColor || '#a8b9cc'}} />;
    }
    
    // 🔷 C++
    if (fileName.endsWith('.cpp') || fileName.endsWith('.cc') || fileName.endsWith('.cxx') || fileName.endsWith('.hpp')) {
      return <SiCplusplus size={iconSize} style={{color: baseColor || '#00599c'}} />;
    }
    
    // 🟢 C#
    if (fileName.endsWith('.cs')) {
      return <FaFileCode size={iconSize} style={{color: baseColor || '#239120'}} />;
    }
    
    // 🦀 RUST
    if (fileName.endsWith('.rs')) {
      return <FaRust size={iconSize} style={{color: baseColor || '#dea584'}} />;
    }
    
    // 🔷 GO
    if (fileName.endsWith('.go')) {
      return <SiGo size={iconSize} style={{color: baseColor || '#00add8'}} />;
    }
    
    // 🍎 SWIFT
    if (fileName.endsWith('.swift')) {
      return <FaSwift size={iconSize} style={{color: baseColor || '#fa7343'}} />;
    }
    
    // 🐘 PHP
    if (fileName.endsWith('.php')) {
      return <FaPhp size={iconSize} style={{color: baseColor || '#777bb4'}} />;
    }
    
    // 💎 RUBY
    if (fileName.endsWith('.rb') || fileName.endsWith('.erb')) {
      return <SiRuby size={iconSize} style={{color: baseColor || '#cc342d'}} />;
    }
    
    // 📝 MARKDOWN
    if (fileName.endsWith('.md') || fileName.endsWith('.markdown')) {
      return <FaMarkdown size={iconSize} style={{color: baseColor || '#083fa1'}} />;
    }
    
    // 📄 TEXTO
    if (fileName.endsWith('.txt') || fileName.endsWith('.log')) {
      return <FaFileAlt size={iconSize} style={{color: baseColor || '#9ca3af'}} />;
    }
    
    // ⚙️ YAML
    if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) {
      return <SiYaml size={iconSize} style={{color: baseColor || '#cb171e'}} />;
    }
    
    // 🔧 CONFIGURACIÓN
    if (fileName.endsWith('.xml') || fileName.endsWith('.toml') || fileName.endsWith('.ini') || fileName.endsWith('.conf') || fileName.endsWith('.config')) {
      return <FaCog size={iconSize} style={{color: baseColor || '#6b7280'}} />;
    }
    
    // 🔑 ENV
    if (fileName.endsWith('.env')) {
      return <FaCog size={iconSize} style={{color: baseColor || '#ecd53f'}} />;
    }
    
    // 🗄️ BASE DE DATOS
    if (fileName.endsWith('.sql') || fileName.endsWith('.db') || fileName.endsWith('.sqlite')) {
      return <FaDatabase size={iconSize} style={{color: baseColor || '#4479a1'}} />;
    }
    
    // 📦 NPM
    if (fileName === 'package.json' || fileName === 'package-lock.json') {
      return <FaNpm size={iconSize} style={{color: baseColor || '#cb3837'}} />;
    }
    
    // 🔒 LOCK FILES
    if (fileName.endsWith('.lock') || fileName === 'yarn.lock' || fileName === 'pnpm-lock.yaml') {
      return <FaCog size={iconSize} style={{color: baseColor || '#6b7280'}} />;
    }
    
    // 💻 BASH
    if (fileName.endsWith('.sh') || fileName.endsWith('.bash') || fileName.endsWith('.zsh')) {
      return <VscTerminalBash size={iconSize} style={{color: baseColor || '#4eaa25'}} />;
    }
    
    // 🔵 POWERSHELL
    if (fileName.endsWith('.ps1')) {
      return <FaFileCode size={iconSize} style={{color: baseColor || '#012456'}} />;
    }
    
    // 🪟 BAT
    if (fileName.endsWith('.bat') || fileName.endsWith('.cmd')) {
      return <FaFileCode size={iconSize} style={{color: baseColor || '#6b7280'}} />;
    }
    
    // 🟢 VUE
    if (fileName.endsWith('.vue')) {
      return <SiVuedotjs size={iconSize} style={{color: baseColor || '#42b883'}} />;
    }
    
    // 🟠 SVELTE
    if (fileName.endsWith('.svelte')) {
      return <SiSvelte size={iconSize} style={{color: baseColor || '#ff3e00'}} />;
    }
    
    // 🔷 GIT
    if (fileName === '.gitignore' || fileName === '.gitattributes') {
      return <FaGitAlt size={iconSize} style={{color: baseColor || '#f05032'}} />;
    }
    
    // 🐳 DOCKER
    if (fileName === 'Dockerfile' || fileName === 'docker-compose.yml') {
      return <FaDocker size={iconSize} style={{color: baseColor || '#2496ed'}} />;
    }
    
    // 📄 DEFAULT
    return <VscFile size={iconSize} style={{color: baseColor || '#9ca3af'}} />;
  };

  const renderFileTree = (items, path = '') => {
    return Object.entries(items).map(([key, item]) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isExpanded = expandedFolders.has(currentPath);
      const isActive = activeFile === currentPath;

      if (item.type === 'folder') {
        return (
          <div key={currentPath}>
            <div
              onClick={() => toggleFolder(currentPath)}
              onContextMenu={(e) => handleContextMenu(e, currentPath, 'folder')}
              draggable
              onDragStart={(e) => onDragStartItem(e, currentPath)}
              onDragEnd={onDragEndItem}
              onDragOver={(e) => onDragOverFolder(e, currentPath)}
              onDragLeave={(e) => onDragLeaveFolder(e, currentPath)}
              onDrop={(e) => onDropToFolder(e, currentPath)}
              className={`flex items-center gap-2 cursor-pointer transition-all group relative ${
                dragOverFolder === currentPath ? 'scale-105' : ''
              }`}
              style={{
                padding: (isLite || isFeel) ? '4px 6px' : '6px 12px',
                paddingLeft: '12px',
                backgroundColor: dragOverFolder === currentPath 
                  ? (isFeel ? 'rgba(255, 255, 227, 0.15)' : isLite ? 'rgba(208, 252, 1, 0.15)' : 'rgba(139, 92, 246, 0.15)') 
                  : 'transparent',
                borderLeft: dragOverFolder === currentPath 
                  ? (isFeel ? '3px solid #FFFFE3' : isLite ? '3px solid var(--theme-secondary)' : '3px solid rgba(139, 92, 246, 0.6)') 
                  : '3px solid transparent',
                boxShadow: dragOverFolder === currentPath 
                  ? (isFeel ? '0 0 15px rgba(255, 255, 227, 0.3)' : isLite ? '0 0 15px rgba(208, 252, 1, 0.3)' : '0 0 15px rgba(139, 92, 246, 0.3)') 
                  : 'none'
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} />
              ) : (
                <ChevronRight className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} />
              ) : (
                <Folder className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} />
              )}
              <span className="text-sm" style={{color: 'var(--theme-text)'}}>{item.name}</span>
            </div>
            {isExpanded && item.children && (
              <div className="ml-4">
                {renderFileTree(item.children, currentPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={currentPath}
          onClick={() => onFileSelect(currentPath)}
          onContextMenu={(e) => handleContextMenu(e, currentPath, 'file')}
          draggable
          onDragStart={(e) => onDragStartItem(e, currentPath)}
          onDragEnd={onDragEndItem}
          className={`flex items-center gap-2 cursor-pointer transition-all group`}
          style={{
            padding: (isLite || isFeel) ? '4px 6px' : '6px 12px',
            paddingLeft: '12px',
            backgroundColor: isActive ? (isFeel ? 'rgba(255, 255, 227, 0.15)' : isLite ? 'var(--theme-background-secondary)' : 'rgba(59,130,246,0.2)') : 'transparent',
            borderLeft: isActive ? (isFeel ? '3px solid #FFFFE3' : isLite ? '3px solid var(--theme-primary)' : '3px solid rgba(59,130,246,0.8)') : '3px solid transparent'
          }}
        >
          <span className="ml-3">{getFileIcon(item.name)}</span>
          <span className="text-sm" style={{color: 'var(--theme-text)'}}>{item.name}</span>
        </div>
      );
    });
  };

  return (
    <div 
      className="w-full h-full border-r overflow-y-auto relative" 
      style={{ backgroundColor: 'var(--theme-background-tertiary)', borderColor: 'var(--theme-border)' }}
      onDoubleClick={() => {
        if (typeof onToggleSidebar === 'function') onToggleSidebar();
      }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={onDragEndItem}
    >
      
      {/* Overlay para movimiento interno a raíz */}
      {isDraggingInternalToRoot && (
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center">
          <div className="absolute inset-2 border-2 border-dashed rounded-lg transition-all" 
            style={{
              borderColor: isFeel ? '#FFFFE3' : isLite ? 'var(--theme-secondary)' : 'rgba(59, 130, 246, 0.6)',
              backgroundColor: isFeel ? 'rgba(255, 255, 227, 0.05)' : isLite ? 'rgba(208, 252, 1, 0.05)' : 'rgba(59, 130, 246, 0.1)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          
          <div className="relative z-10 flex flex-col items-center gap-3 px-4 py-6 rounded-lg backdrop-blur-sm"
            style={{
              backgroundColor: isFeel ? 'rgba(16, 16, 14, 0.9)' : isLite ? 'rgba(27, 23, 24, 0.9)' : 'rgba(20, 20, 30, 0.9)',
              border: `2px solid ${isFeel ? '#FFFFE3' : isLite ? 'var(--theme-secondary)' : 'rgba(59, 130, 246, 0.4)'}`
            }}
          >
            <Folder className="w-12 h-12" style={{color: isFeel ? '#FFFFE3' : isLite ? 'var(--theme-secondary)' : '#60a5fa'}} />
            
            <div className="text-center">
              <p className="text-sm font-semibold" style={{color: 'var(--theme-text)'}}>
                Mover a la raíz
              </p>
              <p className="text-xs mt-1" style={{color: 'var(--theme-text-secondary)'}}>
                Suelta para mover el archivo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay mejorado de drag & drop */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center">
          <div className="absolute inset-2 border-2 border-dashed rounded-lg transition-all" 
            style={{
              borderColor: isFeel ? '#FFFFE3' : isLite ? 'var(--theme-secondary)' : 'rgba(139, 92, 246, 0.6)',
              backgroundColor: isFeel ? 'rgba(255, 255, 227, 0.05)' : isLite ? 'rgba(208, 252, 1, 0.05)' : 'rgba(139, 92, 246, 0.1)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          
          <div className="relative z-10 flex flex-col items-center gap-3 px-4 py-6 rounded-lg backdrop-blur-sm"
            style={{
              backgroundColor: isFeel ? 'rgba(16, 16, 14, 0.9)' : isLite ? 'rgba(27, 23, 24, 0.9)' : 'rgba(20, 20, 30, 0.9)',
              border: `2px solid ${isFeel ? '#FFFFE3' : isLite ? 'var(--theme-secondary)' : 'rgba(139, 92, 246, 0.4)'}`
            }}
          >
            <Upload className="w-12 h-12" style={{color: isFeel ? '#FFFFE3' : isLite ? 'var(--theme-secondary)' : '#a78bfa'}} />
            
            <div className="text-center">
              <p className="text-sm font-semibold mb-1" style={{color: 'var(--theme-text)'}}>
                Suelta para importar
              </p>
              <p className="text-xs" style={{color: 'var(--theme-text-secondary)'}}>
                {dragFileCount > 0 ? (
                  <>
                    <span className="font-semibold" style={{color: isFeel ? '#FFFFE3' : isLite ? 'var(--theme-secondary)' : '#a78bfa'}}>
                      {dragFileCount}
                    </span> archivo{dragFileCount > 1 ? 's' : ''}
                    {dragFileTypes.length > 0 && (
                      <span className="ml-1">
                        ({dragFileTypes.slice(0, 3).join(', ')})
                      </span>
                    )}
                  </>
                ) : (
                  'Archivos, carpetas e imágenes'
                )}
              </p>
            </div>
            
            <div className="flex gap-3 text-xs" style={{color: 'var(--theme-text-muted)'}}>
              <div className="flex items-center gap-1">
                <Folder className="w-3 h-3" />
                <span>Carpetas</span>
              </div>
              <div className="flex items-center gap-1">
                <FaFileImage className="w-3 h-3" />
                <span>Imágenes</span>
              </div>
              <div className="flex items-center gap-1">
                <VscFile className="w-3 h-3" />
                <span>HTML/CSS/JS</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-2 py-1.5 border-b border-border-color relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-semibold uppercase tracking-wide" style={{color: 'var(--theme-secondary)'}}>
            Explorador
          </h2>
          
          {/* Botones de importación - compactos y sutiles */}
          <div className="flex gap-0.5">
            <button
              onClick={() => folderInputRef.current?.click()}
              className="p-1 rounded transition-opacity"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--theme-text-muted)',
                opacity: 0.5
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
              title="Importar carpeta"
            >
              <FolderInput className="w-3.5 h-3.5" />
            </button>
            
            <button
              onClick={() => filesInputRef.current?.click()}
              className="p-1 rounded transition-opacity"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--theme-text-muted)',
                opacity: 0.5
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
              title="Importar archivos"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        {/* Inputs ocultos para selección de archivos */}
        <input
          ref={folderInputRef}
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          onChange={(e) => handleManualImport(e.target.files)}
          style={{ display: 'none' }}
        />
        <input
          ref={filesInputRef}
          type="file"
          multiple
          accept=".html,.css,.js,.json,.txt,.md,.png,.jpg,.jpeg,.gif,.svg,.webp,.bmp,.ico"
          onChange={(e) => handleManualImport(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      {importToast && (
        <div className="absolute bottom-3 left-3 right-3 z-50 flex justify-center animate-fade-in">
          <div className="px-4 py-2 text-sm rounded-lg border shadow-lg backdrop-blur-sm" 
            style={{
              backgroundColor: isFeel ? 'rgba(16, 16, 14, 0.95)' : isLite ? 'rgba(27, 23, 24, 0.95)' : 'rgba(30, 30, 40, 0.95)',
              borderColor: isFeel ? '#FFFFE3' : isLite ? 'var(--theme-secondary)' : 'rgba(139, 92, 246, 0.5)',
              color: 'var(--theme-text)',
              boxShadow: isFeel 
                ? '0 4px 20px rgba(255, 255, 227, 0.2)' 
                : isLite 
                ? '0 4px 20px rgba(208, 252, 1, 0.2)' 
                : '0 4px 20px rgba(139, 92, 246, 0.3)'
            }}>
            {importToast}
          </div>
        </div>
      )}
      <div className="py-1 relative z-10">
        {renderFileTree(files)}
      </div>

      {/* Menú Contextual */}
      {contextMenu && (
        <div
          className="fixed rounded-lg z-50 py-1 min-w-[200px] shadow-xl border"
          style={{ 
            top: contextMenu.y, 
            left: contextMenu.x,
            backgroundColor: 'var(--theme-background-secondary)',
            borderColor: 'var(--theme-border)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleNewFileClick}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-all hover:bg-opacity-80"
            style={{ 
              color: 'var(--theme-text)', 
              backgroundColor: 'transparent',
              borderBottom: '1px solid var(--theme-border)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Plus className="w-4 h-4" style={{color: 'var(--theme-primary)'}} />
            <span>Nuevo archivo</span>
          </button>
          <button
            onClick={handleNewFolderClick}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-all"
            style={{ 
              color: 'var(--theme-text)', 
              backgroundColor: 'transparent',
              borderBottom: '1px solid var(--theme-border)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FolderPlus className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} />
            <span>Nueva carpeta</span>
          </button>
          <button
            onClick={handleRenameClick}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-all"
            style={{ 
              color: 'var(--theme-text)', 
              backgroundColor: 'transparent',
              borderBottom: '1px solid var(--theme-border)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Edit3 className="w-4 h-4" style={{color: 'var(--theme-accent)'}} />
            <span>Renombrar {contextMenu.type === 'folder' ? 'carpeta' : 'archivo'}</span>
          </button>
          <button
            onClick={handleDeleteClick}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-all"
            style={{ 
              color: 'var(--theme-text)', 
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--theme-text)';
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Eliminar {contextMenu.type === 'folder' ? 'carpeta' : 'archivo'}</span>
          </button>
        </div>
      )}

      {/* Modal personalizado */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.5)'}} onClick={() => setModal({ open:false, type:null, path:null, value:'' })}>
          <div className="w-[420px] rounded-lg p-4" style={{backgroundColor:'var(--theme-background-secondary)', border:'1px solid var(--theme-border)'}} onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-sm font-semibold mb-3" style={{color:'var(--theme-text)'}}>
              {modal.type === 'rename' && 'Renombrar'}
              {modal.type === 'delete' && 'Confirmar eliminación'}
              {modal.type === 'new-file' && 'Nuevo archivo'}
              {modal.type === 'new-folder' && 'Nueva carpeta'}
            </h3>

            {(modal.type === 'rename' || modal.type === 'new-file' || modal.type === 'new-folder') && (
              <input
                autoFocus
                className="w-full px-3 py-2 rounded mb-4 outline-none"
                style={{backgroundColor:'var(--theme-surface)', border:'1px solid var(--theme-border)', color:'var(--theme-text)'}}
                value={modal.value}
                onChange={(e)=>setModal({...modal, value:e.target.value})}
                onKeyDown={(e)=>{ if(e.key==='Enter') {
                  if(modal.type==='rename' && onRenameFile && modal.value){ onRenameFile(modal.path, modal.value); setModal({open:false}); }
                  if(modal.type==='new-file' && (onCreateFile||onCreateFolder) && modal.value){ onCreateFile ? onCreateFile(modal.value, modal.path||undefined) : null; setModal({open:false}); }
                  if(modal.type==='new-folder' && (onCreateFolder) && modal.value){ onCreateFolder(modal.value, modal.path||undefined); setModal({open:false}); }
                }}}
              />
            )}

            {modal.type === 'delete' && (
              <p className="text-sm mb-4" style={{color:'var(--theme-text-secondary)'}}>
                ¿Seguro que deseas eliminar <span className="font-semibold" style={{color:'var(--theme-primary)'}}>{modal.path}</span>?
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button className="px-3 py-1.5 rounded border" style={{borderColor:'var(--theme-border)', color:'var(--theme-text)'}} onClick={()=>setModal({open:false, type:null, path:null, value:''})}>Cancelar</button>
              {modal.type === 'delete' && (
                <button className="px-3 py-1.5 rounded" style={{backgroundColor:'var(--theme-primary)', color:'#fff'}} onClick={()=>{ onDeleteFile && onDeleteFile(modal.path); setModal({open:false}); }}>Eliminar</button>
              )}
              {modal.type === 'rename' && (
                <button className="px-3 py-1.5 rounded" style={{backgroundColor:'var(--theme-primary)', color:'#fff'}} onClick={()=>{ if(onRenameFile && modal.value){ onRenameFile(modal.path, modal.value); setModal({open:false}); } }}>Renombrar</button>
              )}
              {modal.type === 'new-file' && (
                <button className="px-3 py-1.5 rounded" style={{backgroundColor:'var(--theme-primary)', color:'#fff'}} onClick={()=>{ if((onCreateFile||onCreateFolder) && modal.value){ onCreateFile ? onCreateFile(modal.value, modal.path||undefined) : null; setModal({open:false}); } }}>Crear</button>
              )}
              {modal.type === 'new-folder' && (
                <button className="px-3 py-1.5 rounded" style={{backgroundColor:'var(--theme-primary)', color:'#fff'}} onClick={()=>{ if(onCreateFolder && modal.value){ onCreateFolder(modal.value, modal.path||undefined); setModal({open:false}); } }}>Crear</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileExplorer;
