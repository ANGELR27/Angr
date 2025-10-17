import { useState } from 'react';
import { FileEdit, Check, X, Eye, Edit3, MessageSquare } from 'lucide-react';

/**
 * Panel de Track Changes para revisar y gestionar sugerencias
 * Muestra todas las sugerencias pendientes con opciones para aceptar/rechazar
 */
function TrackChangesPanel({ 
  isOpen, 
  onClose, 
  suggestions = [], 
  currentUser,
  mode = 'editing',
  onModeChange,
  onAcceptSuggestion,
  onRejectSuggestion,
  onJumpToSuggestion 
}) {
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  // Agrupar sugerencias por archivo
  const suggestionsByFile = suggestions.reduce((acc, sug) => {
    if (!acc[sug.filePath]) {
      acc[sug.filePath] = [];
    }
    acc[sug.filePath].push(sug);
    return acc;
  }, {});

  const filteredSuggestions = suggestions.filter(sug => {
    if (filter === 'all') return true;
    return sug.status === filter;
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getModeConfig = (m) => {
    switch (m) {
      case 'editing':
        return {
          icon: Edit3,
          label: 'Editando',
          description: 'Los cambios se aplican directamente',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
        };
      case 'suggesting':
        return {
          icon: MessageSquare,
          label: 'Sugiriendo',
          description: 'Los cambios se proponen para revisión',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
        };
      case 'viewing':
        return {
          icon: Eye,
          label: 'Solo lectura',
          description: 'No se pueden hacer cambios',
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
        };
      default:
        return null;
    }
  };

  const currentModeConfig = getModeConfig(mode);
  const ModeIcon = currentModeConfig?.icon;

  const pendingCount = suggestions.filter(s => s.status === 'pending').length;
  const acceptedCount = suggestions.filter(s => s.status === 'accepted').length;
  const rejectedCount = suggestions.filter(s => s.status === 'rejected').length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileEdit size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Control de Cambios</h2>
              <p className="text-sm text-gray-400">
                {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''} • {acceptedCount} aceptada{acceptedCount !== 1 ? 's' : ''} • {rejectedCount} rechazada{rejectedCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Selector de modo */}
        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-400">Modo de edición:</span>
            {ModeIcon && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentModeConfig.bgColor}`}>
                <ModeIcon size={16} className={currentModeConfig.color} />
                <span className={`text-sm font-medium ${currentModeConfig.color}`}>
                  {currentModeConfig.label}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['editing', 'suggesting', 'viewing'].map(m => {
              const config = getModeConfig(m);
              const Icon = config.icon;
              const isActive = mode === m;

              return (
                <button
                  key={m}
                  onClick={() => onModeChange(m)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-left
                    ${isActive 
                      ? `${config.bgColor} border-${config.color.split('-')[1]}-500` 
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} className={isActive ? config.color : 'text-gray-400'} />
                    <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {config.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtros */}
        <div className="p-4 border-b border-gray-700 flex gap-2">
          {[
            { value: 'all', label: 'Todas', count: suggestions.length },
            { value: 'pending', label: 'Pendientes', count: pendingCount },
            { value: 'accepted', label: 'Aceptadas', count: acceptedCount },
            { value: 'rejected', label: 'Rechazadas', count: rejectedCount },
          ].map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${filter === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }
              `}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Lista de sugerencias */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredSuggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FileEdit size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay sugerencias</p>
              <p className="text-sm">
                {filter === 'pending' 
                  ? 'No hay sugerencias pendientes de revisión'
                  : 'Cambia el modo a "Sugiriendo" para proponer cambios'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSuggestions.map((suggestion) => {
                const isOwnSuggestion = currentUser && suggestion.user.id === currentUser.id;
                const isPending = suggestion.status === 'pending';

                return (
                  <div
                    key={suggestion.id}
                    className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                  >
                    {/* Header de la sugerencia */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs"
                          style={{ backgroundColor: suggestion.user.color || '#888' }}
                        >
                          {suggestion.user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {suggestion.user.name}
                              {isOwnSuggestion && (
                                <span className="ml-2 text-xs text-blue-400">(tú)</span>
                              )}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(suggestion.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">
                              {suggestion.filePath} • Línea {suggestion.range.startLine}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Estado */}
                      <div>
                        {suggestion.status === 'pending' && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                            Pendiente
                          </span>
                        )}
                        {suggestion.status === 'accepted' && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                            <Check size={12} />
                            Aceptada
                          </span>
                        )}
                        {suggestion.status === 'rejected' && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
                            <X size={12} />
                            Rechazada
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Diff de cambios */}
                    <div className="space-y-2 mb-3">
                      {suggestion.originalText && (
                        <div className="p-2 bg-red-900/20 border border-red-500/30 rounded">
                          <div className="text-xs text-red-400 mb-1">- Eliminar:</div>
                          <code className="text-sm text-red-300 font-mono line-through">
                            {suggestion.originalText}
                          </code>
                        </div>
                      )}
                      
                      {suggestion.suggestedText && (
                        <div className="p-2 bg-green-900/20 border border-green-500/30 rounded">
                          <div className="text-xs text-green-400 mb-1">+ Agregar:</div>
                          <code className="text-sm text-green-300 font-mono">
                            {suggestion.suggestedText}
                          </code>
                        </div>
                      )}
                    </div>

                    {/* Comentario */}
                    {suggestion.comment && (
                      <p className="text-sm text-gray-300 mb-3 italic">
                        "{suggestion.comment}"
                      </p>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2">
                      {isPending && currentUser && (
                        <>
                          <button
                            onClick={() => onAcceptSuggestion(suggestion.id)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Check size={14} />
                            Aceptar
                          </button>
                          <button
                            onClick={() => onRejectSuggestion(suggestion.id)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                          >
                            <X size={14} />
                            Rechazar
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => onJumpToSuggestion(suggestion)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Ver en código
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50 flex justify-between">
          <div className="text-sm text-gray-400">
            <span className="font-medium text-white">Tip:</span> Cambia al modo "Sugiriendo" para proponer cambios sin editardirectamente
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
  );
}

export default TrackChangesPanel;
