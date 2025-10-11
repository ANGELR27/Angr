import { Plus, FolderPlus, Eye, EyeOff, Code2, Terminal, Image, Save, RotateCcw, Keyboard } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

function TopBar({ showPreview, setShowPreview, onNewFile, onNewFolder, showTerminal, setShowTerminal, onOpenImageManager, onAddImageFile, onResetAll, onOpenShortcuts }) {
  const imageInputRef = useRef(null);
  const [showSaved, setShowSaved] = useState(false);

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

  return (
    <div className="h-12 bg-tab-bg border-b border-border-color flex items-center justify-between px-4 relative shadow-mixed-glow">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileSelect}
        className="hidden"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-theme-primary/5 via-transparent to-theme-accent/5 pointer-events-none"></div>

      <div className="flex items-center gap-3 relative z-10">
        <div className="relative shadow-blue-glow-strong" style={{
          padding: '8px',
          borderRadius: '8px'
        }}>
          <div className="absolute inset-0 blur-2xl opacity-60" style={{
            backgroundColor: 'var(--theme-primary)',
            animation: 'pulseBlueGlow 2s ease-in-out infinite'
          }}></div>
          <Code2 className="w-5 h-5 relative z-10" style={{color: 'var(--theme-primary)'}} />
        </div>
        <span className="text-sm font-semibold relative z-10" style={{color: 'var(--theme-text)'}}>
          Code Editor
        </span>
        
        <div className="flex items-center gap-1" style={{opacity: 0.85}}>
          <Save className="w-3 h-3" style={{color: 'var(--theme-secondary)'}} />
          <span className="text-xs" style={{color: 'var(--theme-text-secondary)'}}>Auto-guardado</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 relative z-10">
        <button
          onClick={handleNewFile}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-bg-secondary rounded transition-all border"
          style={{
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
          <span>Archivo</span>
        </button>
        
        <button
          onClick={handleNewFolder}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-bg-secondary rounded transition-all border"
          style={{
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
          <span>Carpeta</span>
        </button>
        
        <div className="w-px h-6 mx-2" style={{
          background: `linear-gradient(to bottom, 
            color-mix(in srgb, var(--theme-primary) 50%, transparent), 
            color-mix(in srgb, var(--theme-secondary) 50%, transparent), 
            color-mix(in srgb, var(--theme-accent) 50%, transparent))`
        }}></div>
        
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-bg-secondary rounded transition-all border"
          style={{
            borderColor: 'color-mix(in srgb, var(--theme-secondary) 30%, transparent)',
            color: 'var(--theme-text)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-secondary) 20%, transparent)';
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-secondary) 50%, transparent)';
            e.currentTarget.style.boxShadow = '0 0 20px color-mix(in srgb, var(--theme-secondary) 60%, transparent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--theme-background-secondary)';
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-secondary) 30%, transparent)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title={showPreview ? 'Ocultar preview' : 'Mostrar preview'}
        >
          {showPreview ? <EyeOff className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} /> : <Eye className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} />}
          <span>Preview</span>
        </button>
        
        <button
          onClick={() => setShowTerminal(!showTerminal)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-all border"
          style={{
            backgroundColor: showTerminal ? 'color-mix(in srgb, var(--theme-accent) 25%, transparent)' : 'var(--theme-background-secondary)',
            borderColor: showTerminal ? 'color-mix(in srgb, var(--theme-accent) 50%, transparent)' : 'color-mix(in srgb, var(--theme-accent) 30%, transparent)',
            boxShadow: showTerminal ? '0 0 20px color-mix(in srgb, var(--theme-accent) 50%, transparent)' : 'none',
            color: 'var(--theme-text)'
          }}
          onMouseEnter={(e) => {
            if (!showTerminal) {
              e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-accent) 20%, transparent)';
              e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-accent) 50%, transparent)';
              e.currentTarget.style.boxShadow = '0 0 20px color-mix(in srgb, var(--theme-accent) 50%, transparent)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showTerminal) {
              e.currentTarget.style.backgroundColor = 'var(--theme-background-secondary)';
              e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-accent) 30%, transparent)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          title={showTerminal ? 'Ocultar terminal' : 'Mostrar terminal'}
        >
          <Terminal className="w-4 h-4" style={{color: 'var(--theme-accent)'}} />
          <span>Terminal</span>
        </button>
        
        <button
          onClick={onOpenImageManager}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-bg-secondary rounded transition-all border"
          style={{
            borderColor: 'color-mix(in srgb, var(--theme-secondary) 30%, transparent)',
            color: 'var(--theme-text)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-secondary) 20%, transparent)';
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-secondary) 50%, transparent)';
            e.currentTarget.style.boxShadow = '0 0 20px color-mix(in srgb, var(--theme-secondary) 60%, transparent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--theme-background-secondary)';
            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-secondary) 30%, transparent)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="Gestor de imágenes"
        >
          <Image className="w-4 h-4" style={{color: 'var(--theme-secondary)'}} />
          <span>Imágenes</span>
        </button>

        <div className="w-px h-6 mx-2" style={{
          background: `linear-gradient(to bottom, 
            color-mix(in srgb, var(--theme-primary) 50%, transparent), 
            color-mix(in srgb, var(--theme-accent) 50%, transparent))`
        }}></div>

        <button
          onClick={onOpenShortcuts}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-bg-secondary rounded transition-all border"
          style={{
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
          title="Atajos de teclado (F1 o ?)">
          <Keyboard className="w-4 h-4" style={{color: 'var(--theme-accent)'}} />
          <span>Atajos</span>
        </button>

        <button
          onClick={onResetAll}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-theme-bg-secondary rounded transition-all border"
          style={{
            borderColor: '#ef444433',
            color: 'var(--theme-text)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ef444420';
            e.currentTarget.style.borderColor = '#ef444466';
            e.currentTarget.style.boxShadow = '0 0 20px #ef444450';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--theme-background-secondary)';
            e.currentTarget.style.borderColor = '#ef444433';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="Resetear todo (eliminar datos guardados)"
        >
          <RotateCcw className="w-4 h-4 text-red-400" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

export default TopBar;
