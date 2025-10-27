import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Code, Smile, Image as ImageIcon, Minimize2, Maximize2 } from 'lucide-react';

/**
 * Panel de chat en tiempo real para colaboración
 */
export default function ChatPanel({ 
  isOpen, 
  onClose,
  messages = [],
  currentUser,
  onSendMessage,
  isMinimized = false,
  onToggleMinimize
}) {
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('text');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  // Focus en input cuando se abre
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    
    if (!messageText.trim()) return;

    onSendMessage({
      message: messageText.trim(),
      messageType,
      timestamp: Date.now(),
    });

    setMessageText('');
    setMessageType('text');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    // Manejar tanto timestamps numéricos como strings ISO
    const date = new Date(timestamp);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn('⚠️ Timestamp inválido:', timestamp);
      return 'Ahora';
    }
    
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (msg) => {
    const isOwnMessage = msg.userId === currentUser?.id;
    const isSystemMessage = msg.messageType === 'system';

    if (isSystemMessage) {
      return (
        <div key={msg.id} className="flex justify-center my-2">
          <div className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">
            {msg.message}
          </div>
        </div>
      );
    }

    return (
      <div
        key={msg.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
      >
        <div className={`flex gap-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
            style={{ backgroundColor: msg.userColor || '#888' }}
            title={msg.userName}
          >
            {msg.userName?.charAt(0).toUpperCase()}
          </div>

          {/* Mensaje */}
          <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-300">
                {msg.userName}
              </span>
              <span className="text-xs text-gray-500">
                {formatTime(msg.createdAt || msg.timestamp)}
              </span>
            </div>
            
            <div
              className={`px-3 py-2 rounded-lg ${
                isOwnMessage
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#2d2d30] text-gray-100'
              }`}
            >
              {msg.messageType === 'code' ? (
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  <code>{msg.message}</code>
                </pre>
              ) : (
                <p className="text-sm whitespace-pre-wrap break-words">
                  {msg.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed right-4 z-40 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
        isMinimized 
          ? 'bottom-4 w-80 h-16' 
          : 'bottom-4 w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#3e3e42] bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">
            Chat de Equipo
          </h3>
          {messages.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              {messages.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleMinimize}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title={isMinimized ? 'Maximizar' : 'Minimizar'}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="Cerrar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contenido minimizado */}
      {isMinimized && (
        <div 
          className="p-3 cursor-pointer hover:bg-[#2d2d30] transition-colors"
          onClick={onToggleMinimize}
        >
          <p className="text-xs text-gray-400">
            {messages.length > 0 
              ? `${messages[messages.length - 1].userName}: ${messages[messages.length - 1].message.substring(0, 40)}...`
              : 'Click para abrir el chat'
            }
          </p>
        </div>
      )}

      {/* Contenido completo */}
      {!isMinimized && (
        <>
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 h-[calc(100%-120px)]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">No hay mensajes aún</p>
                <p className="text-xs">¡Sé el primero en escribir!</p>
              </div>
            ) : (
              messages.map(renderMessage)
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-[#3e3e42] p-3 bg-[#252526]">
            {/* Tipo de mensaje */}
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => setMessageType('text')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  messageType === 'text'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#3e3e42] text-gray-400 hover:text-white'
                }`}
                title="Mensaje de texto"
              >
                Texto
              </button>
              <button
                onClick={() => setMessageType('code')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                  messageType === 'code'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#3e3e42] text-gray-400 hover:text-white'
                }`}
                title="Fragmento de código"
              >
                <Code className="w-3 h-3" />
                Código
              </button>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <textarea
                ref={inputRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  messageType === 'code' 
                    ? 'Pega tu código aquí...' 
                    : 'Escribe un mensaje...'
                }
                className={`flex-1 bg-[#1e1e1e] border border-[#3e3e42] rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none ${
                  messageType === 'code' ? 'font-mono' : ''
                }`}
                rows={messageType === 'code' ? 3 : 1}
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors flex items-center justify-center"
                title="Enviar mensaje (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-2">
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </p>
          </div>
        </>
      )}
    </div>
  );
}
