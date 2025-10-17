import { useState } from 'react';
import { History, RotateCcw, Calendar, User, FileText, X, GitBranch, Download } from 'lucide-react';

/**
 * Panel de Historial de Versiones
 * Muestra snapshots del proyecto con capacidad de restaurar y comparar
 */
function VersionHistory({ isOpen, onClose, snapshots = [], onRestore, currentUser }) {
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareWith, setCompareWith] = useState(null);

  if (!isOpen) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const formatFullDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleRestore = (snapshot) => {
    if (confirm(`¿Restaurar proyecto al estado del ${formatFullDate(snapshot.timestamp)}?`)) {
      onRestore(snapshot.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <History size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Historial de Versiones</h2>
              <p className="text-sm text-gray-400">{snapshots.length} versiones guardadas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {snapshots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <History size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay versiones guardadas</p>
              <p className="text-sm">Las versiones se guardan automáticamente cada 5 minutos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {snapshots.map((snapshot, index) => {
                const isSelected = selectedSnapshot?.id === snapshot.id;
                const isCurrentUser = currentUser && snapshot.user.id === currentUser.id;

                return (
                  <div
                    key={snapshot.id}
                    className={`
                      relative p-4 rounded-lg border transition-all cursor-pointer
                      ${isSelected 
                        ? 'bg-purple-500/10 border-purple-500/50 shadow-lg' 
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'
                      }
                    `}
                    onClick={() => setSelectedSnapshot(isSelected ? null : snapshot)}
                  >
                    {/* Badge de versión */}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full font-mono">
                        v{snapshots.length - index}
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Avatar del usuario */}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                        style={{ backgroundColor: snapshot.user.color || '#888' }}
                      >
                        {snapshot.user.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Información del snapshot */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User size={14} className="text-gray-400" />
                          <span className="font-medium text-white">
                            {snapshot.user.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-blue-400">(tú)</span>
                            )}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-400">
                            {formatDate(snapshot.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-300 mb-2">
                          {snapshot.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatFullDate(snapshot.timestamp)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText size={12} />
                            {snapshot.fileCount} archivo{snapshot.fileCount !== 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download size={12} />
                            {formatSize(snapshot.size)}
                          </span>
                        </div>

                        {/* Acciones expandidas */}
                        {isSelected && (
                          <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestore(snapshot);
                              }}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                            >
                              <RotateCcw size={14} />
                              Restaurar esta versión
                            </button>

                            {snapshots.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCompareMode(true);
                                  setCompareWith(snapshot);
                                }}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                              >
                                <GitBranch size={14} />
                                Comparar versión
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con información */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              <span className="font-medium text-white">Tip:</span> Las versiones se guardan automáticamente cada 5 minutos mientras colaboras
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VersionHistory;
