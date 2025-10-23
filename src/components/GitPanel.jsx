import { useState, useEffect } from 'react';
import { X, GitBranch, Clock, FileText, Download } from 'lucide-react';

function GitPanel({ isOpen, onClose, files, currentTheme }) {
  const [fileHistory, setFileHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [changes, setChanges] = useState([]);
  const isLite = currentTheme === 'lite';

  // Cargar historial desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('code-editor-file-history');
    if (saved) {
      try {
        setFileHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Error cargando historial:', e);
      }
    }
  }, []);

  // Detectar cambios en archivos
  useEffect(() => {
    if (!files) return;

    const getAllFiles = (fileTree, basePath = '') => {
      let result = [];
      Object.entries(fileTree || {}).forEach(([key, item]) => {
        const currentPath = basePath ? `${basePath}/${key}` : key;
        if (item.type === 'file') {
          result.push({
            path: currentPath,
            name: item.name,
            content: item.content || '',
            language: item.language,
            lastModified: Date.now()
          });
        } else if (item.type === 'folder' && item.children) {
          result = result.concat(getAllFiles(item.children, currentPath));
        }
      });
      return result;
    };

    const currentFiles = getAllFiles(files);
    const saved = localStorage.getItem('code-editor-last-snapshot');
    
    if (saved) {
      try {
        const lastSnapshot = JSON.parse(saved);
        const changedFiles = [];

        currentFiles.forEach(file => {
          const oldFile = lastSnapshot.find(f => f.path === file.path);
          if (oldFile && oldFile.content !== file.content) {
            changedFiles.push({
              path: file.path,
              name: file.name,
              status: 'modified',
              timestamp: Date.now()
            });
          } else if (!oldFile) {
            changedFiles.push({
              path: file.path,
              name: file.name,
              status: 'added',
              timestamp: Date.now()
            });
          }
        });

        // Detectar archivos eliminados
        lastSnapshot.forEach(oldFile => {
          if (!currentFiles.find(f => f.path === oldFile.path)) {
            changedFiles.push({
              path: oldFile.path,
              name: oldFile.name,
              status: 'deleted',
              timestamp: Date.now()
            });
          }
        });

        setChanges(changedFiles);
      } catch (e) {
        console.error('Error comparando archivos:', e);
      }
    }

    // Guardar snapshot actual
    localStorage.setItem('code-editor-last-snapshot', JSON.stringify(currentFiles));
  }, [files]);

  const handleCommit = (message) => {
    if (!message.trim()) {
      alert('Por favor escribe un mensaje para el commit');
      return;
    }

    const commit = {
      id: Date.now().toString(),
      message,
      timestamp: new Date().toISOString(),
      changes: [...changes],
      filesCount: changes.length
    };

    const updatedHistory = [commit, ...fileHistory].slice(0, 50); // Mantener últimos 50 commits
    setFileHistory(updatedHistory);
    localStorage.setItem('code-editor-file-history', JSON.stringify(updatedHistory));
    
    // Limpiar cambios actuales
    setChanges([]);
    alert('✅ Commit guardado exitosamente');
  };

  const handleExportProject = () => {
    // Esta funcionalidad se implementará en el próximo paso
    alert('🚧 Función de exportar próximamente');
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'added': return '#22c55e';
      case 'modified': return '#f59e0b';
      case 'deleted': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'added': return 'Agregado';
      case 'modified': return 'Modificado';
      case 'deleted': return 'Eliminado';
      default: return status;
    }
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
          maxWidth: '900px',
          maxHeight: '85vh',
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
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" style={{ color: isLite ? '#8b5cf6' : '#c084fc' }} />
            <h2 className="text-lg font-bold" style={{ color: isLite ? '#111827' : '#e0e0e0' }}>
              Control de Versiones
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-red-500/20 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: isLite ? '#ef4444' : '#f87171' }} />
          </button>
        </div>

        <div className="flex h-full" style={{ maxHeight: 'calc(85vh - 70px)' }}>
          {/* Panel izquierdo: Cambios pendientes */}
          <div className="w-1/2 p-4 border-r overflow-y-auto" style={{ borderColor: isLite ? '#e5e7eb' : 'rgba(139, 92, 246, 0.2)' }}>
            <h3 className="text-md font-bold mb-3 flex items-center gap-2" style={{ color: isLite ? '#374151' : '#e0e0e0' }}>
              <FileText className="w-4 h-4" />
              Cambios Pendientes ({changes.length})
            </h3>

            {changes.length === 0 ? (
              <div className="text-center py-8" style={{ color: isLite ? '#9ca3af' : '#6b7280' }}>
                <p className="text-sm">No hay cambios pendientes</p>
                <p className="text-xs mt-1">Edita algunos archivos para ver cambios aquí</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {changes.map((change, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded border"
                      style={{
                        backgroundColor: isLite ? '#f9fafb' : '#2d2d30',
                        borderColor: getStatusColor(change.status) + '50'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color: isLite ? '#111827' : '#e0e0e0' }}>
                          {change.name}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: getStatusColor(change.status) + '20',
                            color: getStatusColor(change.status)
                          }}
                        >
                          {getStatusLabel(change.status)}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: isLite ? '#6b7280' : '#9ca3af' }}>
                        {change.path}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Commit */}
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Mensaje del commit..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleCommit(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full mb-2 p-2 rounded border text-sm"
                    style={{
                      backgroundColor: isLite ? '#ffffff' : '#1e1e1e',
                      borderColor: isLite ? '#d1d5db' : '#3e3e42',
                      color: isLite ? '#111827' : '#e0e0e0'
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      if (input.value.trim()) {
                        handleCommit(input.value);
                        input.value = '';
                      }
                    }}
                    className="w-full py-2 px-4 rounded font-medium hover:opacity-80 transition-opacity text-sm"
                    style={{
                      backgroundColor: '#8b5cf6',
                      color: '#ffffff'
                    }}
                  >
                    Guardar Commit
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Panel derecho: Historial */}
          <div className="w-1/2 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-bold flex items-center gap-2" style={{ color: isLite ? '#374151' : '#e0e0e0' }}>
                <Clock className="w-4 h-4" />
                Historial ({fileHistory.length})
              </h3>
              <button
                onClick={handleExportProject}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: isLite ? '#e5e7eb' : '#3e3e42',
                  color: isLite ? '#374151' : '#e0e0e0'
                }}
                title="Exportar proyecto"
              >
                <Download className="w-3 h-3" />
                Exportar
              </button>
            </div>

            {fileHistory.length === 0 ? (
              <div className="text-center py-8" style={{ color: isLite ? '#9ca3af' : '#6b7280' }}>
                <p className="text-sm">No hay commits guardados</p>
                <p className="text-xs mt-1">Haz tu primer commit para iniciar el historial</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fileHistory.map((commit) => (
                  <div
                    key={commit.id}
                    className="p-3 rounded border"
                    style={{
                      backgroundColor: isLite ? '#f9fafb' : '#2d2d30',
                      borderColor: isLite ? '#e5e7eb' : 'rgba(139, 92, 246, 0.2)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium flex-1" style={{ color: isLite ? '#111827' : '#e0e0e0' }}>
                        {commit.message}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded ml-2"
                        style={{
                          backgroundColor: isLite ? '#ddd6fe' : 'rgba(139, 92, 246, 0.2)',
                          color: isLite ? '#7c3aed' : '#c084fc'
                        }}
                      >
                        {commit.filesCount} archivos
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: isLite ? '#6b7280' : '#9ca3af' }}>
                      {formatDate(commit.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GitPanel;
