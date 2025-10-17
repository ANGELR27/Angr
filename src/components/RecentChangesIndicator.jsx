import { useEffect, useState } from 'react';

/**
 * Componente para mostrar indicadores visuales de cambios recientes en Monaco Editor
 * Resalta líneas modificadas recientemente con fade-out automático
 */
export function useRecentChangesIndicator(editor, monaco) {
  const [recentChanges, setRecentChanges] = useState(new Map());
  const [decorationIds, setDecorationIds] = useState([]);

  useEffect(() => {
    if (!editor || !monaco) return;

    // Inyectar estilos CSS para los indicadores
    const styleId = 'recent-changes-styles';
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      @keyframes recentChangeFadeIn {
        0% {
          background-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        100% {
          background-color: rgba(59, 130, 246, 0.15);
          box-shadow: none;
        }
      }

      @keyframes recentChangeFadeOut {
        0% {
          background-color: rgba(59, 130, 246, 0.15);
        }
        100% {
          background-color: transparent;
        }
      }

      .recent-change-line {
        background-color: rgba(59, 130, 246, 0.15);
        animation: recentChangeFadeIn 0.3s ease-out;
      }

      .recent-change-gutter {
        background-color: #3b82f6;
        width: 3px !important;
        margin-left: 3px;
      }

      .recent-change-fading {
        animation: recentChangeFadeOut 1s ease-out forwards;
      }
    `;

    return () => {
      // Cleanup
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [editor, monaco]);

  // Actualizar decoraciones cuando cambien los cambios recientes
  useEffect(() => {
    if (!editor || !monaco || recentChanges.size === 0) {
      // Limpiar decoraciones si no hay cambios
      if (decorationIds.length > 0) {
        setDecorationIds(editor?.deltaDecorations(decorationIds, []) || []);
      }
      return;
    }

    const decorations = [];
    const now = Date.now();

    recentChanges.forEach((change, lineNumber) => {
      const age = now - change.timestamp;
      const isFading = age > 3000; // Empezar a desvanecer después de 3 segundos

      // Decoración de línea completa
      decorations.push({
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: isFading ? 'recent-change-line recent-change-fading' : 'recent-change-line',
          glyphMarginClassName: 'recent-change-gutter',
        },
      });
    });

    const newDecorationIds = editor.deltaDecorations(decorationIds, decorations);
    setDecorationIds(newDecorationIds);
  }, [editor, monaco, recentChanges, decorationIds]);

  /**
   * Marcar líneas como recién cambiadas
   */
  const markLinesAsChanged = (startLine, endLine) => {
    const newChanges = new Map(recentChanges);
    
    for (let line = startLine; line <= endLine; line++) {
      newChanges.set(line, {
        timestamp: Date.now(),
        line,
      });
    }

    setRecentChanges(newChanges);

    // Limpiar automáticamente después de 5 segundos
    setTimeout(() => {
      setRecentChanges(current => {
        const updated = new Map(current);
        for (let line = startLine; line <= endLine; line++) {
          const change = updated.get(line);
          if (change && Date.now() - change.timestamp >= 5000) {
            updated.delete(line);
          }
        }
        return updated;
      });
    }, 5000);
  };

  /**
   * Limpiar todos los cambios
   */
  const clearAllChanges = () => {
    setRecentChanges(new Map());
    if (decorationIds.length > 0 && editor) {
      setDecorationIds(editor.deltaDecorations(decorationIds, []));
    }
  };

  return {
    markLinesAsChanged,
    clearAllChanges,
  };
}

/**
 * Componente de barra lateral con actividad reciente
 */
function RecentActivitySidebar({ activities = [], onClose }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);

    if (diffSecs < 10) return 'Ahora mismo';
    if (diffSecs < 60) return `Hace ${diffSecs}s`;
    if (diffMins < 60) return `Hace ${diffMins}m`;
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'edit':
        return '✏️';
      case 'create':
        return '➕';
      case 'delete':
        return '🗑️';
      case 'comment':
        return '💬';
      case 'suggestion':
        return '💡';
      default:
        return '📝';
    }
  };

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-gray-900 border-l border-gray-700 shadow-2xl overflow-hidden flex flex-col z-40">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Actividad Reciente</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Cambios de los últimos 30 minutos
        </p>
      </div>

      {/* Lista de actividades */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">No hay actividad reciente</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id || index}
              className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Icono de tipo de actividad */}
                <div className="text-2xl">
                  {getActivityIcon(activity.type)}
                </div>

                {/* Detalles */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: activity.user?.color || '#888' }}
                    >
                      {activity.user?.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                    <span className="text-sm font-medium text-white truncate">
                      {activity.user?.name || 'Usuario'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mb-1">
                    {activity.description}
                  </p>

                  {activity.filePath && (
                    <p className="text-xs text-gray-500 truncate">
                      📄 {activity.filePath}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentActivitySidebar;
