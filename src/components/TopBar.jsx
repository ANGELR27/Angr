import { Plus, FolderPlus, Eye, EyeOff, Code2, Terminal, Image, Save, RotateCcw, Keyboard, ChevronDown, ChevronUp, Download, X, FileCode2, Braces, Palette, FileJson } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

function TopBar({ showPreview, setShowPreview, onNewFile, onNewFolder, showTerminal, setShowTerminal, onOpenImageManager, onAddImageFile, onResetAll, onOpenShortcuts, onExport, currentTheme, onToggleLite, tabs, activeTab, onTabClick, onTabClose }) {
  const imageInputRef = useRef(null);
  const [showSaved, setShowSaved] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const isLite = currentTheme === 'lite';

  // Mostrar indicador de guardado
  useEffect(() => {
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNewFile = () => {
    const fileName = prompt('Nombre del nuevo archivo (ej: archivo.html, styles.css, script.js, imagen.png):');
    if (fileName) {
      // Verificar si es una imagen
      const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
      const extension = fileName.split('.').pop()?.toLowerCase();
      
      if (imageExtensions.includes(extension)) {
        // Trigger file input para subir imagen
        imageInputRef.current?.click();
        imageInputRef.current.dataset.fileName = fileName;
      } else {
        onNewFile(fileName);
      }
    }
  };

  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    const fileName = e.target.dataset.fileName;
    
    if (file && fileName) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onAddImageFile({
          name: fileName,
          data: event.target.result,
          size: file.size,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
    
    e.target.value = '';
  };

  const handleNewFolder = () => {
    const folderName = prompt('Nombre de la nueva carpeta:');
    if (folderName) {
      onNewFolder(folderName);
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.html')) {
      return <FileCode2 className="w-3.5 h-3.5 text-orange-400" />;
    }
    if (fileName.endsWith('.css')) {
      return <Palette className="w-3.5 h-3.5 text-blue-400" />;
    }
    if (fileName.endsWith('.js')) {
      return <Braces className="w-3.5 h-3.5 text-yellow-400" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-3.5 h-3.5 text-green-400" />;
    }
    return <FileCode2 className="w-3.5 h-3.5 text-gray-400" />;
  };

  const getFileName = (path) => {
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="border-b border-border-color flex items-center relative"
      style={{ height: isLite ? '40px' : '48px', backgroundColor: 'var(--theme-background-tertiary)', boxShadow: isLite ? 'none' : undefined }}>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileSelect}
        className="hidden"
      />
      
      {!isLite && <div className="absolute inset-0 bg-gradient-to-r from-theme-primary/5 via-transparent to-theme-accent/5 pointer-events-none"></div>}

      {/* Sección izquierda - Logo y estado */}
      <div className="flex items-center gap-3 relative z-10 px-3 flex-shrink-0">
        <div className="relative" style={{ padding: isLite ? '4px' : '8px', borderRadius: '8px' }}>
          {!isLite && (
            <div className="absolute inset-0 blur-2xl opacity-60" style={{
              backgroundColor: 'var(--theme-primary)',
              animation: 'pulseBlueGlow 2s ease-in-out infinite'
            }}></div>
          )}
          <Code2 className="w-5 h-5 relative z-10" style={{color: 'var(--theme-secondary)'}} />
        </div>
        <span className="text-sm font-semibold relative z-10" style={{color: 'var(--theme-text)'}}>
          Code Editor
        </span>
        
        {!isLite && (
          <div className="flex items-center gap-1" style={{opacity: 0.85}}>
            <Save className="w-3 h-3" style={{color: 'var(--theme-secondary)'}} />
            <span className="text-xs" style={{color: 'var(--theme-text-secondary)'}}>Auto-guardado</span>
          </div>
        )}
      </div>

      {/* Sección central - Pestañas */}
      <div className="flex-1 flex items-center overflow-x-auto relative z-10 px-2" style={{minWidth: 0}}>
        {tabs && tabs.map((tabPath) => {
          const fileName = getFileName(tabPath);
          const isActive = activeTab === tabPath;

          return (
            <div
              key={tabPath}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-t cursor-pointer group transition-all flex-shrink-0 ${
                isActive ? 'bg-theme-bg-secondary' : 'hover:bg-theme-bg-secondary/50'
              }`}
              onClick={() => onTabClick(tabPath)}
              style={{ 
                userSelect: 'none',
                borderBottom: isActive ? '2px solid var(--theme-primary)' : '2px solid transparent',
                marginBottom: '-2px'
              }}
            >
              {getFileIcon(fileName)}
              <span 
                className={`text-xs transition-colors ${isActive ? 'font-medium' : ''}`}
                style={{ 
                  color: isActive ? 'var(--theme-text)' : 'var(--theme-text-secondary)',
                  userSelect: 'none', 
                  cursor: 'pointer' 
                }}
              >
                {fileName}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tabPath);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded p-0.5 transition-all"
              >
                <X className="w-3 h-3" style={{color: 'var(--theme-text-secondary)'}} />
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Sección derecha - Acciones */}
      <div className="flex items-center gap-1.5 relative z-10 px-2 flex-shrink-0">
        <button
          onClick={handleNewFile}
          className="flex items-center justify-center rounded transition-all border"
          style={{
            padding: '6px',
            backgroundColor: 'var(--theme-background-secondary)',
            borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
            color: 'var(--theme-text)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 20%, transparent)';
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-primary) 50%, transparent)';
            e.currentTarget.style.boxShadow = '0 0 20px var(--theme-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--theme-background-secondary)';
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-primary) 30%, transparent)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="Nuevo archivo"
        >
          <Plus className="w-4 h-4" style={{color: 'var(--theme-primary)'}} />
        </button>
        
        {!isLite && (
        <button
          onClick={handleNewFolder}
          className="flex items-center justify-center rounded transition-all border"
          style={{
            padding: '6px',
            backgroundColor: 'var(--theme-background-secondary)',
            borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
            color: 'var(--theme-text)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-accent) 20%, transparent)';
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-accent) 50%, transparent)';
            e.currentTarget.style.boxShadow = '0 0 20px color-mix(in srgb, var(--theme-accent) 60%, transparent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--theme-background-secondary)';
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-accent) 30%, transparent)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="Nueva carpeta"
        >
          <FolderPlus className="w-4 h-4" style={{color: 'var(--theme-accent)'}} />
        </button>
        )}
        
        {!isLite && (
          <div
            className="w-px h-5 mx-1"
            style={{
              background: 'linear-gradient(to bottom, rgba(100,100,100,0.3), rgba(150,150,150,0.3))'
            }}
          />
        )}

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center justify-center rounded transition-all border"
          style={{
            padding: '6px',
            backgroundColor: 'var(--theme-background-secondary)',
            borderColor: 'color-mix(in srgb, var(--theme-secondary) 30%, transparent)',
            color: 'var(--theme-text)'
          }}
          title={showPreview ? 'Ocultar preview' : 'Mostrar preview'}
        >
          {showPreview ? <EyeOff className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} /> : <Eye className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} />}
        </button>
        
        <button
          onClick={() => setShowTerminal(!showTerminal)}
          className="flex items-center justify-center rounded transition-all border"
          style={{
            padding: '6px',
            backgroundColor: showTerminal ? 'color-mix(in srgb, var(--theme-accent) 25%, transparent)' : 'var(--theme-background-secondary)',
            borderColor: showTerminal ? 'color-mix(in srgb, var(--theme-accent) 50%, transparent)' : 'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
            boxShadow: showTerminal ? '0 0 15px color-mix(in srgb, var(--theme-accent) 40%, transparent)' : 'none',
            color: 'var(--theme-text)'
          }}
          title={showTerminal ? 'Ocultar terminal' : 'Mostrar terminal'}
        >
          <Terminal className="w-4 h-4" style={{color: 'var(--theme-accent)'}} />
        </button>

        {!isLite && (
        <button
          onClick={onOpenImageManager}
          className="flex items-center justify-center rounded transition-all border"
          style={{
            padding: '6px',
            backgroundColor: 'var(--theme-background-secondary)',
            borderColor: 'color-mix(in srgb, var(--theme-secondary) 30%, transparent)',
            color: 'var(--theme-text)'
          }}
          title="Gestor de imágenes"
        >
          <Image className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} />
        </button>
        )}

        {!isLite && (
        <button
          onClick={onExport}
          className="flex items-center justify-center rounded transition-all border"
          style={{
            padding: '6px',
            backgroundColor: 'var(--theme-background-secondary)',
            borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
            color: 'var(--theme-text)'
          }}
          title="Exportar proyecto (ZIP)"
        >
          <Download className="w-4 h-4" style={{color:'var(--theme-primary)'}} />
        </button>
        )}

        {!isLite && (
        <button
          onClick={onOpenShortcuts}
          className="flex items-center justify-center rounded transition-all border"
          style={{
            padding: '6px',
            backgroundColor: 'var(--theme-background-secondary)',
            borderColor: 'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
            color: 'var(--theme-text)'
          }}
          title="Atajos de teclado (F1 o ?)">
          <Keyboard className="w-4 h-4" style={{color: 'var(--theme-accent)'}} />
        </button>
        )}

        <button
          onClick={onToggleLite}
          className="flex items-center justify-center rounded transition-all border"
          style={{
            padding: '6px',
            backgroundColor: currentTheme === 'lite' ? 'color-mix(in srgb, var(--theme-secondary) 25%, transparent)' : 'var(--theme-background-secondary)',
            borderColor: currentTheme === 'lite' ? 'color-mix(in srgb, var(--theme-secondary) 50%, transparent)' : 'color-mix(in srgb, var(--theme-secondary) 30%, transparent)',
            boxShadow: currentTheme === 'lite' ? '0 0 15px rgba(208,252,1,0.3)' : 'none',
            color: currentTheme === 'lite' ? '#D0FC01' : 'var(--theme-secondary)'
          }}
          title={currentTheme === 'lite' ? 'Salir de modo Lite' : 'Activar modo Lite'}
        >
          <span style={{ fontSize: '14px' }}>●</span>
        </button>

        {!isLite && (
        <button
          onClick={onResetAll}
          className="flex items-center justify-center rounded transition-all border"
          style={{
            padding: '6px',
            backgroundColor: 'var(--theme-background-secondary)',
            borderColor: '#ef444433',
            color: 'var(--theme-text)'
          }}
          title="Resetear todo (eliminar datos guardados)"
        >
          <RotateCcw className="w-4 h-4 text-red-400" />
        </button>
        )}
      </div>
    </div>
  );
}

export default TopBar;
