import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Smile } from 'lucide-react';

/**
 * Chat en tiempo real para colaboradores
 * Permite comunicación instantánea sin salir del editor
 */
function CollaborativeChat({ 
  isOpen, 
  onToggle, 
  messages = [], 
  onSendMessage, 
  currentUser,
  activeUsers = [],
  isMinimized,
  onToggleMinimize 
}) {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus en input cuando se abre
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage({
      text: newMessage.trim(),
      user: currentUser,
      timestamp: Date.now(),
    });

    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const emojis = ['👍', '❤️', '😊', '🎉', '🚀', '✅', '💡', '🔥'];

  const insertEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // Agrupar mensajes por fecha
  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(msg => {
      const date = new Date(msg.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (!isOpen) {
    // Badge flotante con contador de mensajes no leídos
    const unreadCount = 0; // TODO: implementar conteo real
    
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all hover:scale-110 z-50"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`
      fixed left-4 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col
      ${isMinimized ? 'bottom-4 w-80' : 'bottom-4 w-96 h-[600px]'}
      transition-all duration-300
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <MessageCircle size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Chat del Equipo</h3>
            <p className="text-xs text-gray-400">
              {activeUsers.length} usuario{activeUsers.length !== 1 ? 's' : ''} en línea
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleMinimize}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            {isMinimized ? (
              <Maximize2 size={16} className="text-gray-400" />
            ) : (
              <Minimize2 size={16} className="text-gray-400" />
            )}
          </button>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Lista de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.keys(messageGroups).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageCircle size={48} className="mb-3 opacity-50" />
                <p className="text-sm">No hay mensajes aún</p>
                <p className="text-xs mt-1">Sé el primero en escribir 👋</p>
              </div>
            ) : (
              Object.entries(messageGroups).map(([date, msgs]) => (
                <div key={date}>
                  {/* Separador de fecha */}
                  <div className="flex items-center gap-2 my-4">
                    <div className="flex-1 h-px bg-gray-700"></div>
                    <span className="text-xs text-gray-500">
                      {new Date(date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                    <div className="flex-1 h-px bg-gray-700"></div>
                  </div>

                  {/* Mensajes del día */}
                  {msgs.map((message) => {
                    const isOwnMessage = currentUser && message.user.id === currentUser.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-2 mb-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        {!isOwnMessage && (
                          <div
                            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-xs"
                            style={{ backgroundColor: message.user.color || '#888' }}
                          >
                            {message.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Burbuja de mensaje */}
                        <div className={`flex-1 max-w-[80%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                          {!isOwnMessage && (
                            <span className="text-xs font-medium text-gray-400 mb-1">
                              {message.user.name}
                            </span>
                          )}
                          
                          <div className={`
                            px-4 py-2 rounded-2xl
                            ${isOwnMessage 
                              ? 'bg-blue-600 text-white rounded-tr-sm' 
                              : 'bg-gray-800 text-gray-200 rounded-tl-sm'
                            }
                          `}>
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.text}
                            </p>
                          </div>

                          <span className="text-xs text-gray-500 mt-1">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de mensaje */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe un mensaje..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  rows={1}
                  style={{
                    maxHeight: '120px',
                    minHeight: '40px',
                  }}
                />

                {/* Botón de emojis */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-2 top-2 p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <Smile size={18} className="text-gray-400" />
                </button>

                {/* Picker de emojis */}
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl flex gap-1">
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="p-2 hover:bg-gray-700 rounded text-xl transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Send size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Presiona <kbd className="px-1 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs">Enter</kbd> para enviar
            </p>
          </form>
        </>
      )}
    </div>
  );
}

export default CollaborativeChat;
