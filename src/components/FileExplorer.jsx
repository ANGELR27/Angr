import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, FileCode2, Folder, FolderOpen, FileJson, Braces, Palette, Trash2, FileImage, Upload, Edit3, Plus, FolderPlus, File } from 'lucide-react';

function FileExplorer({ files, onFileSelect, activeFile, onDeleteFile, onAddImageFile, onRenameFile, onMoveItem, onCreateFile, onCreateFolder, currentTheme }) {
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
    const processFile = (file, targetPath = null) => {
      if (!file || !file.name) return;
      
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
        importedFiles.push({ name: unique, type: 'imagen' });
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
        importedFiles.push({ name: unique, type: 'código' });
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
                let msg = '✅ Importados: ';
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
                let msg = '✅ Importados: ';
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
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    
    if (imageExtensions.some(ext => fileName.endsWith(ext))) {
      return <FileImage className="w-4 h-4" style={{color: isLite ? 'var(--theme-secondary)' : '#f472b6'}} />;
    }
    if (fileName.endsWith('.html')) {
      return <FileCode2 className="w-4 h-4" style={{color: isLite ? 'var(--theme-secondary)' : '#fb923c'}} />;
    }
    if (fileName.endsWith('.css')) {
      return <Palette className="w-4 h-4" style={{color: isLite ? 'var(--theme-secondary)' : '#60a5fa'}} />;
    }
    if (fileName.endsWith('.js')) {
      return <Braces className="w-4 h-4" style={{color: isLite ? 'var(--theme-secondary)' : '#facc15'}} />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-4 h-4" style={{color: isLite ? 'var(--theme-secondary)' : '#4ade80'}} />;
    }
    return <FileCode2 className="w-4 h-4" style={{color: isLite ? 'var(--theme-secondary)' : '#9ca3af'}} />;
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
                padding: isLite ? '4px 6px' : '6px 12px',
                paddingLeft: '12px',
                backgroundColor: dragOverFolder === currentPath 
                  ? (isLite ? 'rgba(208, 252, 1, 0.15)' : 'rgba(139, 92, 246, 0.15)') 
                  : 'transparent',
                borderLeft: dragOverFolder === currentPath 
                  ? (isLite ? '3px solid var(--theme-secondary)' : '3px solid rgba(139, 92, 246, 0.6)') 
                  : '3px solid transparent',
                boxShadow: dragOverFolder === currentPath 
                  ? (isLite ? '0 0 15px rgba(208, 252, 1, 0.3)' : '0 0 15px rgba(139, 92, 246, 0.3)') 
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
            padding: isLite ? '4px 6px' : '6px 12px',
            paddingLeft: '12px',
            backgroundColor: isActive ? (isLite ? 'var(--theme-background-secondary)' : 'rgba(59,130,246,0.2)') : 'transparent',
            borderLeft: isActive ? (isLite ? '3px solid var(--theme-primary)' : '3px solid rgba(59,130,246,0.8)') : '3px solid transparent'
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
      onClick={closeContextMenu}
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
              borderColor: isLite ? 'var(--theme-secondary)' : 'rgba(59, 130, 246, 0.6)',
              backgroundColor: isLite ? 'rgba(208, 252, 1, 0.05)' : 'rgba(59, 130, 246, 0.1)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          
          <div className="relative z-10 flex flex-col items-center gap-3 px-4 py-6 rounded-lg backdrop-blur-sm"
            style={{
              backgroundColor: isLite ? 'rgba(27, 23, 24, 0.9)' : 'rgba(20, 20, 30, 0.9)',
              border: `2px solid ${isLite ? 'var(--theme-secondary)' : 'rgba(59, 130, 246, 0.4)'}`
            }}
          >
            <Folder className="w-12 h-12" style={{color: isLite ? 'var(--theme-secondary)' : '#60a5fa'}} />
            
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
              borderColor: isLite ? 'var(--theme-secondary)' : 'rgba(139, 92, 246, 0.6)',
              backgroundColor: isLite ? 'rgba(208, 252, 1, 0.05)' : 'rgba(139, 92, 246, 0.1)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          
          <div className="relative z-10 flex flex-col items-center gap-3 px-4 py-6 rounded-lg backdrop-blur-sm"
            style={{
              backgroundColor: isLite ? 'rgba(27, 23, 24, 0.9)' : 'rgba(20, 20, 30, 0.9)',
              border: `2px solid ${isLite ? 'var(--theme-secondary)' : 'rgba(139, 92, 246, 0.4)'}`
            }}
          >
            <Upload className="w-12 h-12" style={{color: isLite ? 'var(--theme-secondary)' : '#a78bfa'}} />
            
            <div className="text-center">
              <p className="text-sm font-semibold mb-1" style={{color: 'var(--theme-text)'}}>
                Suelta para importar
              </p>
              <p className="text-xs" style={{color: 'var(--theme-text-secondary)'}}>
                {dragFileCount > 0 ? (
                  <>
                    <span className="font-semibold" style={{color: isLite ? 'var(--theme-secondary)' : '#a78bfa'}}>
                      {dragFileCount}
                    </span> archivo{dragFileCount > 1 ? 's' : ''}
                    {dragFileTypes.length > 0 && (
                      <span className="ml-1">
                        ({dragFileTypes.slice(0, 3).join(', ')})
                      </span>
                    )}
                  </>
                ) : (
                  'Archivos e imágenes'
                )}
              </p>
            </div>
            
            <div className="flex gap-2 text-xs" style={{color: 'var(--theme-text-muted)'}}>
              <div className="flex items-center gap-1">
                <FileImage className="w-3 h-3" />
                <span>Imágenes</span>
              </div>
              <div className="flex items-center gap-1">
                <File className="w-3 h-3" />
                <span>HTML/CSS/JS</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-3 py-2 border-b border-border-color relative z-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{color: 'var(--theme-secondary)'}}>
          Explorador
        </h2>
      </div>
      {importToast && (
        <div className="absolute bottom-3 left-3 right-3 z-50 flex justify-center animate-fade-in">
          <div className="px-4 py-2 text-sm rounded-lg border shadow-lg backdrop-blur-sm" 
            style={{
              backgroundColor: isLite ? 'rgba(27, 23, 24, 0.95)' : 'rgba(30, 30, 40, 0.95)',
              borderColor: isLite ? 'var(--theme-secondary)' : 'rgba(139, 92, 246, 0.5)',
              color: 'var(--theme-text)',
              boxShadow: isLite 
                ? '0 4px 20px rgba(208, 252, 1, 0.2)' 
                : '0 4px 20px rgba(139, 92, 246, 0.3)'
            }}>
            {importToast}
          </div>
        </div>
      )}
      <div className="py-2 relative z-10">
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
