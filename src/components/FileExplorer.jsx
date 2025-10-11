import { useState } from 'react';
import { ChevronRight, ChevronDown, FileCode2, Folder, FolderOpen, FileJson, Braces, Palette, Trash2, FileImage, Upload, Edit3, Plus, FolderPlus } from 'lucide-react';

function FileExplorer({ files, onFileSelect, activeFile, onDeleteFile, onAddImageFile, onRenameFile, onMoveItem, onCreateFile, onCreateFolder }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['components', 'examples']));
  const [contextMenu, setContextMenu] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [modal, setModal] = useState({ open: false, type: null, path: null, value: '' });

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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
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

    const files = e.dataTransfer.files;
    
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        // Verificar si es una imagen
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          
          reader.onload = (event) => {
            if (onAddImageFile) {
              onAddImageFile({
                name: file.name,
                data: event.target.result,
                size: file.size,
                type: file.type
              }, null);
            }
          };
          
          reader.readAsDataURL(file);
        }
      });
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

    // 2) archivos externos (imágenes)
    const extFiles = e.dataTransfer.files;
    if (extFiles && extFiles.length > 0) {
      Array.from(extFiles).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            onAddImageFile && onAddImageFile({
              name: file.name,
              data: event.target.result,
              size: file.size,
              type: file.type
            }, folderPath);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const getFileIcon = (fileName) => {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    
    if (imageExtensions.some(ext => fileName.endsWith(ext))) {
      return <FileImage className="w-4 h-4 text-pink-400" />;
    }
    if (fileName.endsWith('.html')) {
      return <FileCode2 className="w-4 h-4 text-orange-400" />;
    }
    if (fileName.endsWith('.css')) {
      return <Palette className="w-4 h-4 text-blue-400" />;
    }
    if (fileName.endsWith('.js')) {
      return <Braces className="w-4 h-4 text-yellow-400" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-4 h-4 text-green-400" />;
    }
    return <FileCode2 className="w-4 h-4 text-gray-400" />;
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
              className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all group rounded-sm mx-1 border ${dragOverFolder === currentPath ? 'border-yellow-400 bg-yellow-500/10' : 'border-transparent hover:bg-yellow-500/10 hover:border-yellow-500/30 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]'}`}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-yellow-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-yellow-400" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              )}
              <span className="text-sm text-gray-200 group-hover:text-yellow-200">{item.name}</span>
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
          className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all group rounded-sm mx-1 border ${
            isActive 
              ? 'bg-blue-500/20 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
              : 'border-transparent hover:bg-blue-500/10 hover:border-blue-500/30 hover:shadow-[0_0_10px_rgba(59,130,246,0.2)]'
          }`}
        >
          <span className="ml-6">{getFileIcon(item.name)}</span>
          <span className={`text-sm ${isActive ? 'text-blue-100 font-medium' : 'text-gray-300 group-hover:text-blue-200'}`}>
            {item.name}
          </span>
        </div>
      );
    });
  };

  return (
    <div 
      className="w-64 border-r overflow-y-auto relative" 
      style={{ backgroundColor: 'var(--theme-background-tertiary)', borderColor: 'var(--theme-border)' }}
      onClick={closeContextMenu}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      
      {/* Overlay de drag & drop */}
      {isDraggingOver && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-400 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3 animate-bounce" />
            <p className="text-lg font-bold text-blue-200">Suelta la imagen aquí</p>
            <p className="text-sm text-blue-300 mt-1">Se agregará al explorador</p>
          </div>
        </div>
      )}
      
      <div className="px-3 py-3 border-b border-border-color relative z-10">
        <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          Explorador
        </h2>
        <p className="text-xs text-gray-500 mt-1">Arrastra imágenes aquí</p>
      </div>
      <div className="py-2 relative z-10">
        {renderFileTree(files)}
      </div>

      {/* Menú Contextual */}
      {contextMenu && (
        <div
          className="fixed bg-gray-800 border border-blue-500/30 rounded-lg shadow-2xl z-50 py-1 min-w-[200px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleNewFileClick}
            className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-green-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo archivo</span>
          </button>
          <button
            onClick={handleNewFolderClick}
            className="w-full px-4 py-2 text-left text-sm text-yellow-400 hover:bg-yellow-500/20 flex items-center gap-2 transition-all"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Nueva carpeta</span>
          </button>
          <button
            onClick={handleRenameClick}
            className="w-full px-4 py-2 text-left text-sm text-blue-400 hover:bg-blue-500/20 flex items-center gap-2 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Renombrar {contextMenu.type === 'folder' ? 'carpeta' : 'archivo'}</span>
          </button>
          <button
            onClick={handleDeleteClick}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2 transition-all"
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
