import { useState } from 'react';
import { MessageSquare, Check, Reply, Trash2, X, ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Panel de comentarios en código - Estilo Google Docs
 */
export default function CommentsPanel({
  isOpen,
  onClose,
  comments = [],
  currentUser,
  currentFile,
  onAddComment,
  onResolveComment,
  onReplyComment,
  onDeleteComment,
}) {
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showResolved, setShowResolved] = useState(false);

  // Filtrar comentarios del archivo actual
  const fileComments = comments.filter(
    (c) => c.filePath === currentFile || c.workspace_file_id === currentFile
  );

  // Separar en resueltos y no resueltos
  const unresolvedComments = fileComments.filter((c) => !c.is_resolved);
  const resolvedComments = fileComments.filter((c) => c.is_resolved);

  const toggleExpanded = (commentId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const handleReply = (commentId) => {
    if (!replyText.trim()) return;

    onReplyComment(commentId, replyText.trim());
    setReplyText('');
    setReplyingTo(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES');
  };

  const renderComment = (comment) => {
    const isExpanded = expandedComments.has(comment.id);
    const isReplying = replyingTo === comment.id;
    const hasReplies = comment.comment_replies && comment.comment_replies.length > 0;
    const canResolve = currentUser?.id === comment.user_id || currentUser?.role === 'owner';

    return (
      <div
        key={comment.id}
        className="border border-[#3e3e42] rounded-lg p-3 bg-[#252526] hover:bg-[#2d2d30] transition-colors"
      >
        {/* Header del comentario */}
        <div className="flex items-start gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
            style={{ backgroundColor: comment.userColor || comment.user_color || '#888' }}
          >
            {(comment.userName || comment.user_name)?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  {comment.userName || comment.user_name}
                </span>
                <span className="text-xs text-gray-500">
                  Línea {comment.lineNumber || comment.line_number}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatTime(comment.createdAt || comment.created_at)}
              </span>
            </div>

            <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
              {comment.commentText || comment.comment_text}
            </p>
          </div>
        </div>

        {/* Respuestas */}
        {hasReplies && (
          <div className="mt-2 ml-10">
            <button
              onClick={() => toggleExpanded(comment.id)}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mb-2"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              {comment.comment_replies.length} respuesta
              {comment.comment_replies.length !== 1 ? 's' : ''}
            </button>

            {isExpanded && (
              <div className="space-y-2">
                {comment.comment_replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="flex gap-2 p-2 bg-[#1e1e1e] rounded"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                      style={{ backgroundColor: reply.userColor || '#666' }}
                    >
                      {reply.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-300">
                          {reply.user_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 whitespace-pre-wrap">
                        {reply.reply_text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input de respuesta */}
        {isReplying && (
          <div className="mt-2 ml-10">
            <div className="flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="flex-1 bg-[#1e1e1e] border border-[#3e3e42] rounded px-2 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleReply(comment.id)}
                  disabled={!replyText.trim()}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-xs disabled:cursor-not-allowed"
                >
                  <Reply className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center gap-2 mt-2">
          {!comment.is_resolved && (
            <>
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Reply className="w-3 h-3" />
                Responder
              </button>
              {canResolve && (
                <button
                  onClick={() => onResolveComment(comment.id)}
                  className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Resolver
                </button>
              )}
            </>
          )}
          {comment.is_resolved && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Resuelto
            </span>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-20 z-40 w-96 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-2xl overflow-hidden max-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#3e3e42] bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Comentarios</h3>
          {unresolvedComments.length > 0 && (
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
              {unresolvedComments.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filtros */}
      <div className="p-3 border-b border-[#3e3e42] bg-[#252526]">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="rounded"
          />
          Mostrar resueltos ({resolvedComments.length})
        </label>
      </div>

      {/* Lista de comentarios */}
      <div className="overflow-y-auto max-h-[calc(100vh-220px)] p-3 space-y-3">
        {!currentFile ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">Abre un archivo para ver comentarios</p>
          </div>
        ) : unresolvedComments.length === 0 && resolvedComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No hay comentarios en este archivo</p>
            <p className="text-xs mt-1">
              Selecciona texto y haz clic derecho para comentar
            </p>
          </div>
        ) : (
          <>
            {/* Comentarios no resueltos */}
            {unresolvedComments.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                  Activos ({unresolvedComments.length})
                </h4>
                <div className="space-y-2">
                  {unresolvedComments.map(renderComment)}
                </div>
              </div>
            )}

            {/* Comentarios resueltos */}
            {showResolved && resolvedComments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                  Resueltos ({resolvedComments.length})
                </h4>
                <div className="space-y-2 opacity-60">
                  {resolvedComments.map(renderComment)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-3 border-t border-[#3e3e42] bg-[#252526]">
        <p className="text-xs text-gray-400">
          💡 Tip: Selecciona código y presiona Ctrl+Alt+C para comentar
        </p>
      </div>
    </div>
  );
}
