import { useState } from 'react';
import { ChevronRight, ChevronDown, FileCode2, Folder, FolderOpen, FileJson, Braces, Palette, Trash2, FileImage, Upload, Edit3, Plus, FolderPlus } from 'lucide-react';

function FileExplorer({ files, onFileSelect, activeFile, onDeleteFile, onAddImageFile, onRenameFile, onMoveItem, onCreateFile, onCreateFolder, currentTheme }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['components', 'examples']));
  const [contextMenu, setContextMenu] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [modal, setModal] = useState({ open: false, type: null, path: null, value: '' });
  const [importToast, setImportToast] = useState(null);
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
    // Mostrar overlay solo si es un drag EXTERNO de archivos (no movimiento interno)
    const dt = e.dataTransfer;
    const hasInternalPath = !!dt.getData('text/source-path');
    const hasFiles = dt.types && Array.from(dt.types).includes('Files');
    if (!hasInternalPath && hasFiles) setIsDraggingOver(true);
  };

  const handleDragOver = (e) => {
    // Siempre prevenir para permitir drop fiable (navegadores requieren preventDefault)
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const dt = e.dataTransfer;
    const rootChildren = getChildrenOfPath(files, null);

    const importImages = [];
    const processFile = (file, targetPath = null) => {
      if (!file || !file.type) return;
      if (!file.type.startsWith('image/')) return; // por ahora solo imágenes
      const children = getChildrenOfPath(files, targetPath);
      const unique = getUniqueName(file.name, children);
      const reader = new FileReader();
      reader.onload = (event) => {
        onAddImageFile && onAddImageFile({
          name: unique,
          data: event.target.result,
          size: file.size,
          type: file.type
        }, targetPath);
      };
      reader.readAsDataURL(file);
      importImages.push(unique);
    };

    // Carpetas (webkit entries) si están disponibles
    if (dt.items && dt.items.length && typeof dt.items[0].webkitGetAsEntry === 'function') {
      const entries = Array.from(dt.items).map(it => it.webkitGetAsEntry()).filter(Boolean);
      let pending = 0;
      const walk = (entry, basePath = null) => {
        if (entry.isFile) {
          pending++;
          entry.file((file) => { processFile(file, basePath); pending--; if (pending === 0) showToast(`Importadas ${importImages.length} imágenes`); });
        } else if (entry.isDirectory) {
          const dirReader = entry.createReader();
          pending++;
          dirReader.readEntries((ents) => {
            ents.forEach(en => walk(en, basePath ? `${basePath}/${entry.name}` : entry.name));
            pending--; if (pending === 0) showToast(`Importadas ${importImages.length} imágenes`);
          });
        }
      };
      entries.forEach(en => walk(en, null));
      if (!entries.length) showToast('Nada para importar');
      return;
    }

    // Archivos sueltos
    const fileList = dt.files;
    if (fileList && fileList.length) {
      Array.from(fileList).forEach(f => processFile(f, null));
      if (importImages.length) showToast(`Importadas ${importImages.length} imágenes`);
    }
  };

  // Drag & drop interno
  const onDragStartItem = (e, path) => {
    e.dataTransfer.setData('text/source-path', path);
    e.dataTransfer.effectAllowed = 'move';
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
    const importImages = [];
    const processFile = (file) => {
      if (!file || !file.type) return;
      if (!file.type.startsWith('image/')) return;
      const children = getChildrenOfPath(files, folderPath);
      const unique = getUniqueName(file.name, children);
      const reader = new FileReader();
      reader.onload = (event) => {
        onAddImageFile && onAddImageFile({ name: unique, data: event.target.result, size: file.size, type: file.type }, folderPath);
      };
      reader.readAsDataURL(file);
      importImages.push(unique);
    };

    if (dt.items && dt.items.length && typeof dt.items[0].webkitGetAsEntry === 'function') {
      const entries = Array.from(dt.items).map(it => it.webkitGetAsEntry()).filter(Boolean);
      let pending = 0;
      const walk = (entry, base = folderPath) => {
        if (entry.isFile) {
          pending++;
          entry.file((file) => { processFile(file); pending--; if (pending === 0) showToast(`Importadas ${importImages.length} imágenes a ${folderPath}`); });
        } else if (entry.isDirectory) {
          const reader = entry.createReader();
          pending++;
          reader.readEntries((ents) => { ents.forEach(en => walk(en, base)); pending--; if (pending === 0) showToast(`Importadas ${importImages.length} imágenes a ${folderPath}`); });
        }
      };
      entries.forEach(en => walk(en));
      if (!entries.length) showToast('Nada para importar');
      return;
    }

    const extFiles = dt.files;
    if (extFiles && extFiles.length > 0) {
      Array.from(extFiles).forEach(file => processFile(file));
      if (importImages.length) showToast(`Importadas ${importImages.length} imágenes a ${folderPath}`);
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
              onDragOver={(e) => onDragOverFolder(e, currentPath)}
              onDragLeave={(e) => onDragLeaveFolder(e, currentPath)}
              onDrop={(e) => onDropToFolder(e, currentPath)}
              className={`flex items-center gap-2 cursor-pointer transition-all group rounded-sm mx-1 border`
              }
              style={{
                padding: isLite ? '4px 6px' : '6px 12px',
                backgroundColor: dragOverFolder === currentPath ? (isLite ? 'var(--theme-background-secondary)' : 'rgba(234,179,8,0.1)') : 'transparent',
                borderColor: dragOverFolder === currentPath ? (isLite ? 'var(--theme-border)' : 'rgba(234,179,8,0.4)') : 'transparent'
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
          className={`flex items-center gap-2 cursor-pointer transition-all group rounded-sm mx-1 border`}
          style={{
            padding: isLite ? '4px 6px' : '6px 12px',
            backgroundColor: isActive ? (isLite ? 'var(--theme-background-secondary)' : 'rgba(59,130,246,0.2)') : 'transparent',
            borderColor: isActive ? (isLite ? 'var(--theme-border)' : 'rgba(59,130,246,0.4)') : 'transparent'
          }}
        >
          <span className="ml-6">{getFileIcon(item.name)}</span>
          <span className="text-sm" style={{color: 'var(--theme-text)'}}>{item.name}</span>
        </div>
      );
    });
  };

  return (
    <div 
      className="w-64 border-r overflow-y-auto relative" 
      style={{ backgroundColor: 'var(--theme-background-tertiary)', borderColor: 'var(--theme-border)' }}
      onClick={closeContextMenu}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      
      {/* Overlay de drag & drop */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute inset-0 bg-blue-500/15 border-2 border-dashed border-blue-400 rounded" />
          <div className="absolute inset-x-2 bottom-4 flex items-center justify-center">
            <div className="px-3 py-1.5 rounded text-xs" style={{backgroundColor:'rgba(30,58,138,0.6)', color:'#cfe3ff'}}>Suelta archivos de tu PC para importarlos</div>
          </div>
        </div>
      )}
      
      <div className="px-3 py-2 border-b border-border-color relative z-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{color: 'var(--theme-secondary)'}}>
          Explorador
        </h2>
        <p className="text-xs mt-1" style={{color: 'var(--theme-text-secondary)'}}>Arrastra imágenes aquí</p>
      </div>
      {importToast && (
        <div className="absolute bottom-3 left-3 right-3 z-50 flex justify-center">
          <div className="px-3 py-1.5 text-xs rounded border shadow" style={{backgroundColor:'var(--theme-background-secondary)', borderColor:'var(--theme-border)', color:'var(--theme-text)'}}>
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
          className="fixed rounded-lg z-50 py-1 min-w-[200px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleNewFileClick}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-all"
            style={{ color: 'var(--theme-text)', backgroundColor: 'var(--theme-background-secondary)', borderBottom: '1px solid var(--theme-border)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo archivo</span>
          </button>
          <button
            onClick={handleNewFolderClick}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-all"
            style={{ color: 'var(--theme-text)', backgroundColor: 'var(--theme-background-secondary)', borderBottom: '1px solid var(--theme-border)' }}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Nueva carpeta</span>
          </button>
          <button
            onClick={handleRenameClick}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-all"
            style={{ color: 'var(--theme-text)', backgroundColor: 'var(--theme-background-secondary)', borderBottom: '1px solid var(--theme-border)' }}
          >
            <Edit3 className="w-4 h-4" />
            <span>Renombrar {contextMenu.type === 'folder' ? 'carpeta' : 'archivo'}</span>
          </button>
          <button
            onClick={handleDeleteClick}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-all"
            style={{ color: 'var(--theme-text)', backgroundColor: 'var(--theme-background-secondary)' }}
          >
            <Trash2 className="w-4 h-4" />
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
