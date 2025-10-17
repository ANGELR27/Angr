import { useState } from 'react';
import { MessageSquare, X, Send, Check, Trash2, Edit2, MoreVertical } from 'lucide-react';

/**
 * Componente de hilo de comentarios para líneas específicas de código
 * Permite agregar, responder, editar y resolver comentarios
 */
function CommentThread({ 
  threadId,
  lineNumber, 
  filePath,
  comments = [], 
  currentUser,
  isResolved = false,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onResolveThread,
  onClose 
}) {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showOptions, setShowOptions] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment({
      threadId,
      lineNumber,
      filePath,
      text: newComment.trim(),
      user: currentUser,
      timestamp: Date.now(),
    });

    setNewComment('');
  };

  const handleEdit = (commentId, currentText) => {
    setEditingId(commentId);
    setEditText(currentText);
    setShowOptions(null);
  };

  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) return;
    
    onEditComment(threadId, commentId, editText.trim());
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (commentId) => {
    if (confirm('¿Eliminar este comentario?')) {
      onDeleteComment(threadId, commentId);
      setShowOptions(null);
    }
  };

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

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className={`
        p-3 border-b flex items-center justify-between
        ${isResolved ? 'bg-green-900/20 border-green-700/30' : 'border-gray-700'}
      `}>
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className={isResolved ? 'text-green-400' : 'text-blue-400'} />
          <span className="text-sm font-medium text-white">
            Línea {lineNumber}
          </span>
          {isResolved && (
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
              <Check size={12} />
              Resuelto
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isResolved && onResolveThread && (
            <button
              onClick={() => onResolveThread(threadId)}
              className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-green-400 transition-colors"
              title="Marcar como resuelto"
            >
              <Check size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="max-h-80 overflow-y-auto p-3 space-y-3">
        {comments.map((comment) => {
          const isOwnComment = currentUser && comment.user.id === currentUser.id;
          const isEditing = editingId === comment.id;

          return (
            <div key={comment.id} className="flex gap-2 group">
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-xs"
                style={{ backgroundColor: comment.user.color || '#888' }}
              >
                {comment.user.name.charAt(0).toUpperCase()}
              </div>

              {/* Contenido del comentario */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-white">
                    {comment.user.name}
                  </span>
                  {isOwnComment && (
                    <span className="text-xs text-blue-400">(tú)</span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatTime(comment.timestamp)}
                  </span>
                  {comment.edited && (
                    <span className="text-xs text-gray-500 italic">
                      (editado)
                    </span>
                  )}
                </div>

                {/* Texto del comentario */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                      {comment.text}
                    </p>

                    {/* Opciones del comentario */}
                    {isOwnComment && (
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                          <button
                            onClick={() => setShowOptions(showOptions === comment.id ? null : comment.id)}
                            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {showOptions === comment.id && (
                            <div className="absolute right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-1 z-10 min-w-32">
                              <button
                                onClick={() => handleEdit(comment.id, comment.text)}
                                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center gap-2"
                              >
                                <Edit2 size={14} />
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(comment.id)}
                                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {comments.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay comentarios aún
          </p>
        )}
      </div>

      {/* Input para nuevo comentario */}
      {!isResolved && (
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700">
          <div className="flex gap-2">
            {/* Avatar del usuario actual */}
            {currentUser && (
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-xs"
                style={{ backgroundColor: currentUser.color || '#888' }}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Input */}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CommentThread;
