import { ChevronRight, Home, Folder, File } from 'lucide-react';

function Breadcrumbs({ activeFile, files, onNavigate }) {
  if (!activeFile) {
    return (
      <div 
        className="flex items-center gap-2 px-4 py-2 text-sm border-b"
        style={{
          backgroundColor: 'var(--theme-background-secondary)',
          borderColor: 'var(--theme-border)',
          color: 'var(--theme-text-secondary)'
        }}
      >
        <Home size={16} />
        <span>Sin archivo seleccionado</span>
      </div>
    );
  }

  // Dividir la ruta en partes
  const parts = activeFile.split('/').filter(Boolean);
  
  // Obtener info del archivo
  const getFileInfo = (path) => {
    const pathParts = path.split('/').filter(Boolean);
    let current = files;
    
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (!current[part]) return null;
      if (i === pathParts.length - 1) {
        return current[part];
      }
      if (current[part].type === 'folder' && current[part].children) {
        current = current[part].children;
      }
    }
    return null;
  };

  const handleBreadcrumbClick = (index) => {
    if (index === parts.length - 1) return; // Ya estamos en el archivo actual
    
    // Construir ruta hasta el índice clickeado
    const path = parts.slice(0, index + 1).join('/');
    const info = getFileInfo(path);
    
    // Si es un archivo, navegar a él
    if (info && info.type === 'file') {
      onNavigate && onNavigate(path);
    }
  };

  return (
    <div 
      className="flex items-center gap-1 px-4 py-2 text-sm border-b overflow-x-auto"
      style={{
        backgroundColor: 'var(--theme-background-secondary)',
        borderColor: 'var(--theme-border)',
        color: 'var(--theme-text)',
        maxWidth: '100%',
        whiteSpace: 'nowrap'
      }}
    >
      {/* Icono de inicio */}
      <button
        onClick={() => onNavigate && onNavigate(null)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-opacity-10 hover:bg-white transition-colors"
        title="Raíz del proyecto"
      >
        <Home size={14} />
      </button>

      <ChevronRight size={14} style={{ color: 'var(--theme-text-secondary)', flexShrink: 0 }} />

      {/* Partes de la ruta */}
      {parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        const path = parts.slice(0, index + 1).join('/');
        const info = getFileInfo(path);
        const isFolder = info && info.type === 'folder';
        
        return (
          <div key={index} className="flex items-center gap-1" style={{ flexShrink: 0 }}>
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                isLast 
                  ? 'font-semibold' 
                  : 'hover:bg-opacity-10 hover:bg-white cursor-pointer'
              }`}
              style={{
                color: isLast ? 'var(--theme-accent)' : 'var(--theme-text)',
                cursor: isLast ? 'default' : 'pointer'
              }}
              title={path}
              disabled={isLast}
            >
              {isFolder ? (
                <Folder size={14} />
              ) : (
                <File size={14} />
              )}
              <span>{part}</span>
            </button>
            
            {!isLast && (
              <ChevronRight 
                size={14} 
                style={{ color: 'var(--theme-text-secondary)', flexShrink: 0 }} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;
