import { useEffect, useState } from 'react';
import { UserPlus, UserMinus, Eye, Edit, Crown, RefreshCw } from 'lucide-react';

/**
 * Componente de notificaciones de colaboración
 */
export default function CollaborationNotification({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10);

    // Auto-cerrar después de 4 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'user-joined':
        return <UserPlus className="w-5 h-5" />;
      case 'user-left':
        return <UserMinus className="w-5 h-5" />;
      case 'permission-changed':
        return notification.newRole === 'owner' ? <Crown className="w-5 h-5" /> :
               notification.newRole === 'editor' ? <Edit className="w-5 h-5" /> :
               <Eye className="w-5 h-5" />;
      case 'project-synced':
        return <RefreshCw className="w-5 h-5" />;
      default:
        return <UserPlus className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case 'user-joined':
        return 'from-green-600 to-emerald-600';
      case 'user-left':
        return 'from-red-600 to-rose-600';
      case 'permission-changed':
        return 'from-blue-600 to-indigo-600';
      case 'project-synced':
        return 'from-cyan-600 to-blue-600';
      default:
        return 'from-purple-600 to-pink-600';
    }
  };

  return (
    <div
      className={`fixed top-24 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{ minWidth: '280px', maxWidth: '320px' }}
    >
      <div
        className={`bg-gradient-to-r ${getColor()} rounded-lg shadow-2xl border border-white/20 backdrop-blur-sm p-3 flex items-center gap-3`}
      >
        {/* Avatar/Icono */}
        <div className="flex-shrink-0">
          {notification.userColor ? (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg"
              style={{ backgroundColor: notification.userColor }}
            >
              {notification.userName?.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
              {getIcon()}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 text-white">
          <p className="font-semibold text-sm">
            {notification.userName || 'Usuario'}
          </p>
          <p className="text-xs opacity-90">
            {notification.message}
          </p>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
