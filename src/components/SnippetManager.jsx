import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Copy, Check } from 'lucide-react';

function SnippetManager({ isOpen, onClose, onInsertSnippet, currentTheme }) {
  const [snippets, setSnippets] = useState([]);
  const [newSnippet, setNewSnippet] = useState({ name: '', language: 'javascript', code: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const isLite = currentTheme === 'lite';

  // Cargar snippets desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('code-editor-custom-snippets');
    if (saved) {
      try {
        setSnippets(JSON.parse(saved));
      } catch (e) {
        console.error('Error cargando snippets:', e);
      }
    }
  }, []);

  // Guardar snippets en localStorage
  const saveSnippets = (newSnippets) => {
    setSnippets(newSnippets);
    localStorage.setItem('code-editor-custom-snippets', JSON.stringify(newSnippets));
  };

  const handleCreateSnippet = () => {
    if (!newSnippet.name || !newSnippet.code) {
      alert('Por favor completa al menos el nombre y el código del snippet');
      return;
    }

    const snippet = {
      id: Date.now().toString(),
      ...newSnippet,
      createdAt: new Date().toISOString()
    };

    saveSnippets([...snippets, snippet]);
    setNewSnippet({ name: '', language: 'javascript', code: '', description: '' });
    setIsCreating(false);
  };

  const handleDeleteSnippet = (id) => {
    if (confirm('¿Estás seguro de eliminar este snippet?')) {
      saveSnippets(snippets.filter(s => s.id !== id));
    }
  };

  const handleInsertSnippet = (snippet) => {
    onInsertSnippet(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-lg shadow-2xl overflow-hidden"
        style={{
          backgroundColor: isLite ? '#FFFFFF' : '#1e1e1e',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '80vh',
          border: `1px solid ${isLite ? '#e5e7eb' : 'rgba(139, 92, 246, 0.3)'}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{
            backgroundColor: isLite ? '#f9fafb' : '#252526',
            borderColor: isLite ? '#e5e7eb' : 'rgba(139, 92, 246, 0.2)'
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: isLite ? '#111827' : '#e0e0e0' }}>
            📝 Mis Snippets Personalizados
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-red-500/20 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: isLite ? '#ef4444' : '#f87171' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 70px)' }}>
          {/* Botón crear nuevo snippet */}
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full mb-4 p-3 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
              style={{
                borderColor: isLite ? '#8b5cf6' : 'rgba(139, 92, 246, 0.5)',
                color: isLite ? '#8b5cf6' : '#c084fc'
              }}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Crear Nuevo Snippet</span>
            </button>
          )}

          {/* Formulario crear snippet */}
          {isCreating && (
            <div
              className="mb-4 p-4 rounded-lg border"
              style={{
                backgroundColor: isLite ? '#f3f4f6' : '#2d2d30',
                borderColor: isLite ? '#d1d5db' : 'rgba(139, 92, 246, 0.3)'
              }}
            >
              <h3 className="text-md font-bold mb-3" style={{ color: isLite ? '#374151' : '#e0e0e0' }}>
                Nuevo Snippet
              </h3>
              
              <input
                type="text"
                placeholder="Nombre del snippet..."
                value={newSnippet.name}
                onChange={(e) => setNewSnippet({ ...newSnippet, name: e.target.value })}
                className="w-full mb-2 p-2 rounded border"
                style={{
                  backgroundColor: isLite ? '#ffffff' : '#1e1e1e',
                  borderColor: isLite ? '#d1d5db' : '#3e3e42',
                  color: isLite ? '#111827' : '#e0e0e0'
                }}
              />

              <input
                type="text"
                placeholder="Descripción (opcional)..."
                value={newSnippet.description}
                onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
                className="w-full mb-2 p-2 rounded border"
                style={{
                  backgroundColor: isLite ? '#ffffff' : '#1e1e1e',
                  borderColor: isLite ? '#d1d5db' : '#3e3e42',
                  color: isLite ? '#111827' : '#e0e0e0'
                }}
              />

              <select
                value={newSnippet.language}
                onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
                className="w-full mb-2 p-2 rounded border"
                style={{
                  backgroundColor: isLite ? '#ffffff' : '#1e1e1e',
                  borderColor: isLite ? '#d1d5db' : '#3e3e42',
                  color: isLite ? '#111827' : '#e0e0e0'
                }}
              >
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="json">JSON</option>
              </select>

              <textarea
                placeholder="Código del snippet..."
                value={newSnippet.code}
                onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                className="w-full mb-3 p-2 rounded border font-mono text-sm"
                rows="6"
                style={{
                  backgroundColor: isLite ? '#ffffff' : '#1e1e1e',
                  borderColor: isLite ? '#d1d5db' : '#3e3e42',
                  color: isLite ? '#111827' : '#e0e0e0'
                }}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleCreateSnippet}
                  className="flex-1 py-2 px-4 rounded font-medium hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff'
                  }}
                >
                  Crear Snippet
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewSnippet({ name: '', language: 'javascript', code: '', description: '' });
                  }}
                  className="py-2 px-4 rounded font-medium hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: isLite ? '#e5e7eb' : '#3e3e42',
                    color: isLite ? '#374151' : '#e0e0e0'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de snippets */}
          {snippets.length === 0 && !isCreating && (
            <div className="text-center py-8" style={{ color: isLite ? '#9ca3af' : '#6b7280' }}>
              <p className="text-lg mb-2">No tienes snippets guardados</p>
              <p className="text-sm">Crea tu primer snippet para usarlo en cualquier proyecto</p>
            </div>
          )}

          <div className="space-y-3">
            {snippets.map(snippet => (
              <div
                key={snippet.id}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: isLite ? '#f9fafb' : '#2d2d30',
                  borderColor: isLite ? '#e5e7eb' : 'rgba(139, 92, 246, 0.2)'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-md" style={{ color: isLite ? '#111827' : '#e0e0e0' }}>
                      {snippet.name}
                    </h4>
                    {snippet.description && (
                      <p className="text-sm mt-1" style={{ color: isLite ? '#6b7280' : '#9ca3af' }}>
                        {snippet.description}
                      </p>
                    )}
                    <span
                      className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: isLite ? '#ddd6fe' : 'rgba(139, 92, 246, 0.2)',
                        color: isLite ? '#7c3aed' : '#c084fc'
                      }}
                    >
                      {snippet.language}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleInsertSnippet(snippet)}
                      className="p-2 rounded hover:bg-green-500/20 transition-colors"
                      title="Insertar en editor"
                    >
                      {copiedId === snippet.id ? (
                        <Check className="w-4 h-4" style={{ color: '#22c55e' }} />
                      ) : (
                        <Copy className="w-4 h-4" style={{ color: isLite ? '#22c55e' : '#4ade80' }} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteSnippet(snippet.id)}
                      className="p-2 rounded hover:bg-red-500/20 transition-colors"
                      title="Eliminar snippet"
                    >
                      <Trash2 className="w-4 h-4" style={{ color: isLite ? '#ef4444' : '#f87171' }} />
                    </button>
                  </div>
                </div>
                <pre
                  className="mt-2 p-2 rounded text-xs overflow-x-auto"
                  style={{
                    backgroundColor: isLite ? '#ffffff' : '#1e1e1e',
                    color: isLite ? '#111827' : '#d4d4d4',
                    border: `1px solid ${isLite ? '#e5e7eb' : '#3e3e42'}`
                  }}
                >
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SnippetManager;
