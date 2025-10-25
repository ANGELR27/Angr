import { useState } from 'react';
import { Search, X, FileText, ChevronRight } from 'lucide-react';

const FadeSearch = ({ files, onFileSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchInFiles = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = [];
    
    const searchRecursive = (obj, path = '') => {
      Object.entries(obj).forEach(([key, item]) => {
        if (item.type === 'file') {
          const fileName = item.name.toLowerCase();
          const content = (item.content || '').toLowerCase();
          const searchTerm = query.toLowerCase();
          
          // Buscar en nombre de archivo
          if (fileName.includes(searchTerm)) {
            results.push({
              path: path ? `${path}/${item.name}` : item.name,
              name: item.name,
              type: 'filename',
              preview: item.name
            });
          }
          
          // Buscar en contenido
          const lines = (item.content || '').split('\n');
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(searchTerm)) {
              results.push({
                path: path ? `${path}/${item.name}` : item.name,
                name: item.name,
                type: 'content',
                line: index + 1,
                preview: line.trim()
              });
            }
          });
        } else if (item.type === 'folder') {
          searchRecursive(item.children, path ? `${path}/${key}` : key);
        }
      });
    };

    searchRecursive(files);
    setSearchResults(results.slice(0, 50)); // Limitar a 50 resultados
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchInFiles(query);
  };

  const handleResultClick = (result) => {
    onFileSelect(result.path);
  };

  return (
    <div 
      className="flex flex-col h-full border-r"
      style={{
        width: '350px',
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a'
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 border-b"
        style={{ borderColor: '#2a2a2a' }}
      >
        <h3 className="text-sm font-semibold" style={{ color: '#e4e4e7' }}>
          Buscar
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10"
        >
          <X className="w-4 h-4" style={{ color: '#71717a' }} />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3">
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded"
          style={{
            backgroundColor: '#2a2a2a',
            border: '1px solid #3f3f46'
          }}
        >
          <Search className="w-4 h-4" style={{ color: '#71717a' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Buscar en archivos..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: '#e4e4e7' }}
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {searchResults.length > 0 ? (
          <div className="px-2">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleResultClick(result)}
                className="w-full text-left p-2 rounded hover:bg-white/5 transition-colors mb-1"
              >
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#60a5fa' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium truncate" style={{ color: '#e4e4e7' }}>
                        {result.name}
                      </span>
                      {result.type === 'content' && (
                        <span className="text-xs" style={{ color: '#71717a' }}>
                          Línea {result.line}
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-1 truncate" style={{ color: '#a1a1aa' }}>
                      {result.preview}
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#71717a' }} />
                </div>
              </button>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <Search className="w-8 h-8 mb-3" style={{ color: '#3f3f46' }} />
            <p className="text-sm" style={{ color: '#71717a' }}>
              No se encontraron resultados
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <Search className="w-8 h-8 mb-3" style={{ color: '#3f3f46' }} />
            <p className="text-sm" style={{ color: '#71717a' }}>
              Escribe para buscar en archivos
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {searchResults.length > 0 && (
        <div 
          className="p-2 border-t text-xs text-center"
          style={{ 
            borderColor: '#2a2a2a',
            color: '#71717a'
          }}
        >
          {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default FadeSearch;
