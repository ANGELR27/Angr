import { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle, 
  X,
  MessageCircle,
  Users,
  FileText,
  Activity
} from 'lucide-react';

/**
 * Componente de notificaciones Toast con animaciones y múltiples tipos
 * Tipos: success, error, info, warning, chat, user-joined, user-left, file-change
 */
export default function NotificationToast({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

function ToastItem({ notification, onRemove }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10);

    // Auto-cerrar después de 5 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const getConfig = () => {
    const configs = {
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-500/90',
        borderColor: 'border-green-400',
        iconColor: 'text-white',
      },
      error: {
        icon: XCircle,
        bgColor: 'bg-red-500/90',
        borderColor: 'border-red-400',
        iconColor: 'text-white',
      },
      warning: {
        icon: AlertCircle,
        bgColor: 'bg-yellow-500/90',
        borderColor: 'border-yellow-400',
        iconColor: 'text-white',
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-500/90',
        borderColor: 'border-blue-400',
        iconColor: 'text-white',
      },
      'chat-message': {
        icon: MessageCircle,
        bgColor: 'bg-purple-500/90',
        borderColor: 'border-purple-400',
        iconColor: 'text-white',
      },
      'user-joined': {
        icon: Users,
        bgColor: 'bg-green-500/90',
        borderColor: 'border-green-400',
        iconColor: 'text-white',
      },
      'user-left': {
        icon: Users,
        bgColor: 'bg-gray-500/90',
        borderColor: 'border-gray-400',
        iconColor: 'text-white',
      },
      'file-change': {
        icon: FileText,
        bgColor: 'bg-blue-500/90',
        borderColor: 'border-blue-400',
        iconColor: 'text-white',
      },
      'connection-restored': {
        icon: CheckCircle,
        bgColor: 'bg-green-500/90',
        borderColor: 'border-green-400',
        iconColor: 'text-white',
      },
      'connection-lost': {
        icon: AlertCircle,
        bgColor: 'bg-orange-500/90',
        borderColor: 'border-orange-400',
        iconColor: 'text-white',
      },
      'activity': {
        icon: Activity,
        bgColor: 'bg-indigo-500/90',
        borderColor: 'border-indigo-400',
        iconColor: 'text-white',
      },
    };

    return configs[notification.type] || configs.info;
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor}
        border-l-4 rounded-r-lg shadow-2xl backdrop-blur-sm
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start gap-3 p-4 pr-2">
        {/* Icono */}
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* Título con nombre de usuario si existe */}
          {notification.userName && (
            <div className="flex items-center gap-2 mb-1">
              {notification.userColor && (
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: notification.userColor }}
                />
              )}
              <p className="text-sm font-semibold text-white">
                {notification.userName}
              </p>
            </div>
          )}

          {/* Mensaje */}
          <p className="text-sm text-white/90 break-words">
            {notification.message}
          </p>

          {/* Metadata adicional */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="mt-2 text-xs text-white/70">
              {notification.metadata.fileName && (
                <span>📄 {notification.metadata.fileName}</span>
              )}
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors p-1"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="h-1 bg-white/20 overflow-hidden rounded-br-lg">
        <div
          className="h-full bg-white/50 animate-[shrink_5s_linear]"
          style={{
            animation: 'shrink 5s linear forwards',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
