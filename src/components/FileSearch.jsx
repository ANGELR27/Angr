import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, FileCode2, Folder, FileJson, Braces, Palette, X } from 'lucide-react';

/**
 * Componente de búsqueda rápida de archivos (estilo VSCode Ctrl+P)
 * Permite buscar y abrir archivos rápidamente con fuzzy search
 */
function FileSearch({ isOpen, onClose, files, onFileSelect, currentTheme }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const isLite = currentTheme === 'lite';

  /**
   * Construye una lista plana de todos los archivos
   */
  const buildFileList = (fileTree, basePath = '') => {
    let fileList = [];
    
    Object.entries(fileTree || {}).forEach(([key, item]) => {
      const currentPath = basePath ? `${basePath}/${key}` : key;
      
      if (item.type === 'file') {
        fileList.push({
          path: currentPath,
          name: item.name,
          extension: item.name.split('.').pop()?.toLowerCase(),
          isImage: !!item.isImage
        });
      } else if (item.type === 'folder' && item.children) {
        fileList = fileList.concat(buildFileList(item.children, currentPath));
      }
    });
    
    return fileList;
  };

  /**
   * Fuzzy search - busca coincidencias flexibles
   */
  const fuzzySearch = (searchQuery, text) => {
    const query = searchQuery.toLowerCase();
    const target = text.toLowerCase();
    
    let queryIndex = 0;
    let score = 0;
    let consecutiveMatch = 0;
    
    for (let i = 0; i < target.length && queryIndex < query.length; i++) {
      if (target[i] === query[queryIndex]) {
        queryIndex++;
        consecutiveMatch++;
        score += consecutiveMatch * 2; // Bonus por coincidencias consecutivas
      } else {
        consecutiveMatch = 0;
      }
    }
    
    if (queryIndex === query.length) {
      // Bonus si el match está al inicio
      if (target.startsWith(query)) score += 10;
      return score;
    }
    
    return 0;
  };

  /**
   * Actualiza los resultados cuando cambia el query
   */
  useEffect(() => {
    if (!query.trim()) {
      const allFiles = buildFileList(files);
      setResults(allFiles.slice(0, 10)); // Mostrar primeros 10 si no hay query
      setSelectedIndex(0);
      return;
    }

    const allFiles = buildFileList(files);
    const searchResults = allFiles
      .map(file => ({
        ...file,
        score: fuzzySearch(query, file.name) + fuzzySearch(query, file.path) * 0.5
      }))
      .filter(file => file.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, files]);

  /**
   * Maneja el teclado (flechas, enter, escape)
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            onFileSelect(results[selectedIndex].path);
            handleClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onFileSelect]);

  /**
   * Scroll automático al item seleccionado
   */
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, results]);

  /**
   * Focus automático en el input al abrir
   */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
    }
  }, [isOpen]);

  /**
   * Cierra el modal y limpia el estado
   */
  const handleClose = () => {
    setQuery('');
    setSelectedIndex(0);
    onClose();
  };

  /**
   * Obtiene el icono según el tipo de archivo
   */
  const getFileIcon = (extension, isImage) => {
    if (isImage) return <FileCode2 className="w-4 h-4 text-purple-400" />;
    
    switch (extension) {
      case 'html': return <FileCode2 className="w-4 h-4 text-orange-400" />;
      case 'css': return <Palette className="w-4 h-4 text-blue-400" />;
      case 'js': return <Braces className="w-4 h-4 text-yellow-400" />;
      case 'json': return <FileJson className="w-4 h-4 text-green-400" />;
      default: return <FileCode2 className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-2xl rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--theme-background-secondary)',
          border: '1px solid var(--theme-border)',
          boxShadow: isLite ? '0 10px 40px rgba(0, 0, 0, 0.3)' : '0 10px 40px var(--theme-glow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input de búsqueda */}
        <div 
          className="flex items-center gap-3 p-4 border-b"
          style={{ borderColor: 'var(--theme-border)' }}
        >
          <Search className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar archivos... (escribe para filtrar)"
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: 'var(--theme-text)' }}
          />
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" style={{ color: 'var(--theme-text-secondary)' }} />
          </button>
        </div>

        {/* Resultados */}
        <div 
          ref={resultsRef}
          className="max-h-96 overflow-y-auto"
          style={{ 
            backgroundColor: 'var(--theme-background)',
          }}
        >
          {results.length === 0 ? (
            <div 
              className="p-8 text-center"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              {query ? '❌ No se encontraron archivos' : '📁 Comienza a escribir para buscar'}
            </div>
          ) : (
            results.map((file, index) => (
              <div
                key={file.path}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  index === selectedIndex ? 'bg-theme-bg-secondary' : ''
                }`}
                style={{
                  borderLeft: index === selectedIndex ? '3px solid var(--theme-primary)' : '3px solid transparent',
                  backgroundColor: index === selectedIndex ? 'var(--theme-background-secondary)' : 'transparent'
                }}
                onClick={() => {
                  onFileSelect(file.path);
                  handleClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {getFileIcon(file.extension, file.isImage)}
                <div className="flex-1 min-w-0">
                  <div 
                    className="font-medium truncate"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    {file.name}
                  </div>
                  <div 
                    className="text-xs truncate"
                    style={{ color: 'var(--theme-text-secondary)' }}
                  >
                    {file.path}
                  </div>
                </div>
                {index === selectedIndex && (
                  <kbd 
                    className="px-2 py-1 text-xs rounded"
                    style={{ 
                      backgroundColor: 'var(--theme-surface)',
                      color: 'var(--theme-text-secondary)'
                    }}
                  >
                    ↵
                  </kbd>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer con ayuda */}
        <div 
          className="flex items-center justify-between px-4 py-2 text-xs border-t"
          style={{ 
            borderColor: 'var(--theme-border)',
            backgroundColor: 'var(--theme-background-tertiary)',
            color: 'var(--theme-text-secondary)'
          }}
        >
          <div className="flex gap-4">
            <span><kbd className="px-1.5 py-0.5 rounded bg-gray-700">↑↓</kbd> navegar</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-gray-700">↵</kbd> abrir</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-gray-700">ESC</kbd> cerrar</span>
          </div>
          <span>{results.length} archivo{results.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}

FileSearch.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  files: PropTypes.object.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  currentTheme: PropTypes.string
};

export default FileSearch;
