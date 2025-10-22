import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, AlertTriangle, CheckCircle, User } from 'lucide-react';

/**
 * Sistema de notificaciones avanzado
 */
export default function NotificationSystem({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, mentions

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'mentions') return notification.notification_type === 'mention';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'mention':
        return <User className="w-4 h-4 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'error':
        return 'border-red-500/30 bg-red-900/20';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-900/20';
      case 'success':
        return 'border-green-500/30 bg-green-900/20';
      case 'mention':
        return 'border-blue-500/30 bg-blue-900/20';
      default:
        return 'border-gray-500/30 bg-gray-900/20';
    }
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

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-[#3e3e42] rounded transition-colors"
        title="Notificaciones"
      >
        <Bell className="w-5 h-5 text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 z-50 w-96 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#3e3e42] bg-[#252526]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">
                  Notificaciones
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Marcar todas como leídas
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#3e3e42] text-gray-400 hover:text-white'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    filter === 'unread'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#3e3e42] text-gray-400 hover:text-white'
                  }`}
                >
                  No leídas ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('mentions')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    filter === 'mentions'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#3e3e42] text-gray-400 hover:text-white'
                  }`}
                >
                  Menciones
                </button>
              </div>
            </div>

            {/* Lista de notificaciones */}
            <div className="max-h-[500px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Bell className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">No hay notificaciones</p>
                </div>
              ) : (
                <div className="divide-y divide-[#3e3e42]">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[#2d2d30] transition-colors cursor-pointer ${
                        !notification.is_read ? 'bg-blue-900/10' : ''
                      }`}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 pt-1">
                          {getIcon(notification.notification_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium text-white">
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.created_at)}
                            </span>
                            {!notification.is_read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead(notification.id);
                                }}
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Marcar leída
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-[#3e3e42] bg-[#252526] text-center">
                <button
                  onClick={onClearAll}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Limpiar todas las notificaciones
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
