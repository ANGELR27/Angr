import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, FileText, ChevronRight, ChevronDown } from 'lucide-react';

function GlobalSearch({ isOpen, onClose, files, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState(new Set());
  const inputRef = useRef(null);

  // Focus al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Aplanar archivos
  const allFiles = useMemo(() => {
    const flatten = (files, path = '') => {
      let result = [];
      Object.entries(files || {}).forEach(([key, item]) => {
        const currentPath = path ? `${path}/${key}` : key;
        if (item.type === 'file' && !item.isImage) {
          result.push({
            path: currentPath,
            name: item.name,
            content: item.content || '',
            language: item.language
          });
        } else if (item.type === 'folder' && item.children) {
          result = result.concat(flatten(item.children, currentPath));
        }
      });
      return result;
    };
    return flatten(files);
  }, [files]);

  // Buscar en archivos
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const results = [];
    const query = caseSensitive ? searchQuery : searchQuery.toLowerCase();
    
    allFiles.forEach(file => {
      const content = caseSensitive ? file.content : file.content.toLowerCase();
      const lines = file.content.split('\n');
      const matches = [];

      if (useRegex) {
        try {
          const regex = new RegExp(searchQuery, caseSensitive ? 'g' : 'gi');
          lines.forEach((line, index) => {
            if (regex.test(line)) {
              matches.push({
                lineNumber: index + 1,
                line: line.trim(),
                match: searchQuery
              });
            }
          });
        } catch (e) {
          // Regex inválido
        }
      } else {
        lines.forEach((line, index) => {
          const searchLine = caseSensitive ? line : line.toLowerCase();
          if (searchLine.includes(query)) {
            matches.push({
              lineNumber: index + 1,
              line: line.trim(),
              match: searchQuery
            });
          }
        });
      }

      if (matches.length > 0) {
        results.push({
          file,
          matches
        });
      }
    });

    return results;
  }, [searchQuery, allFiles, caseSensitive, useRegex]);

  const toggleFileExpanded = (filePath) => {
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filePath)) {
        newSet.delete(filePath);
      } else {
        newSet.add(filePath);
      }
      return newSet;
    });
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    try {
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, flags);
      const parts = text.split(regex);
      
      return parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} style={{ backgroundColor: 'var(--theme-accent)', color: 'var(--theme-background)' }}>
            {part}
          </span>
        ) : part
      );
    } catch (e) {
      return text;
    }
  };

  const handleResultClick = (filePath, lineNumber) => {
    onNavigate(filePath, lineNumber);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--theme-background)',
          border: '1px solid var(--theme-border)',
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center gap-3 p-4 border-b"
          style={{ borderColor: 'var(--theme-border)' }}
        >
          <Search size={20} style={{ color: 'var(--theme-text-secondary)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar en todos los archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--theme-text)' }}
          />
          
          {/* Opciones */}
          <button
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={`px-2 py-1 text-xs rounded transition-colors ${caseSensitive ? 'bg-opacity-20' : ''}`}
            style={{
              backgroundColor: caseSensitive ? 'var(--theme-accent)' : 'transparent',
              color: caseSensitive ? 'var(--theme-accent)' : 'var(--theme-text-secondary)',
              border: `1px solid ${caseSensitive ? 'var(--theme-accent)' : 'var(--theme-border)'}`
            }}
            title="Coincidir mayúsculas/minúsculas"
          >
            Aa
          </button>
          
          <button
            onClick={() => setUseRegex(!useRegex)}
            className={`px-2 py-1 text-xs rounded transition-colors ${useRegex ? 'bg-opacity-20' : ''}`}
            style={{
              backgroundColor: useRegex ? 'var(--theme-accent)' : 'transparent',
              color: useRegex ? 'var(--theme-accent)' : 'var(--theme-text-secondary)',
              border: `1px solid ${useRegex ? 'var(--theme-accent)' : 'var(--theme-border)'}`
            }}
            title="Usar expresiones regulares"
          >
            .*
          </button>
          
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-opacity-10 hover:bg-white transition-colors"
          >
            <X size={20} style={{ color: 'var(--theme-text-secondary)' }} />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {!searchQuery.trim() ? (
            <div className="text-center py-12" style={{ color: 'var(--theme-text-secondary)' }}>
              <Search size={48} className="mx-auto mb-3 opacity-50" />
              <p>Escribe para buscar en todos los archivos</p>
              <p className="text-xs mt-2">Ctrl+Shift+F para abrir</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--theme-text-secondary)' }}>
              <FileText size={48} className="mx-auto mb-3 opacity-50" />
              <p>No se encontraron resultados para "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm mb-3" style={{ color: 'var(--theme-text-secondary)' }}>
                {searchResults.length} archivo{searchResults.length !== 1 ? 's' : ''} •{' '}
                {searchResults.reduce((acc, r) => acc + r.matches.length, 0)} coincidencia
                {searchResults.reduce((acc, r) => acc + r.matches.length, 0) !== 1 ? 's' : ''}
              </div>
              
              {searchResults.map(({ file, matches }) => {
                const isExpanded = expandedFiles.has(file.path);
                
                return (
                  <div 
                    key={file.path}
                    className="rounded-lg border overflow-hidden"
                    style={{
                      backgroundColor: 'var(--theme-background-secondary)',
                      borderColor: 'var(--theme-border)'
                    }}
                  >
                    {/* File Header */}
                    <button
                      onClick={() => toggleFileExpanded(file.path)}
                      className="w-full flex items-center gap-2 p-3 hover:bg-opacity-10 hover:bg-white transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown size={16} style={{ color: 'var(--theme-text-secondary)' }} />
                      ) : (
                        <ChevronRight size={16} style={{ color: 'var(--theme-text-secondary)' }} />
                      )}
                      <FileText size={16} style={{ color: 'var(--theme-accent)' }} />
                      <span className="font-medium text-sm" style={{ color: 'var(--theme-text)' }}>
                        {file.name}
                      </span>
                      <span className="text-xs ml-auto" style={{ color: 'var(--theme-text-secondary)' }}>
                        {matches.length} coincidencia{matches.length !== 1 ? 's' : ''}
                      </span>
                    </button>

                    {/* Matches */}
                    {isExpanded && (
                      <div className="border-t" style={{ borderColor: 'var(--theme-border)' }}>
                        {matches.slice(0, 10).map((match, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleResultClick(file.path, match.lineNumber)}
                            className="w-full flex items-start gap-3 p-2 px-4 hover:bg-opacity-10 hover:bg-white transition-colors text-left"
                          >
                            <span 
                              className="text-xs font-mono flex-shrink-0"
                              style={{ color: 'var(--theme-text-secondary)', minWidth: '40px' }}
                            >
                              {match.lineNumber}
                            </span>
                            <code 
                              className="text-xs flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                              style={{ color: 'var(--theme-text)' }}
                            >
                              {highlightMatch(match.line, searchQuery)}
                            </code>
                          </button>
                        ))}
                        {matches.length > 10 && (
                          <div className="px-4 py-2 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                            ... y {matches.length - 10} más
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;
