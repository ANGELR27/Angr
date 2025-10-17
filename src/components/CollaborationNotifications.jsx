import { useState, useCallback } from 'react';
import CollaborationNotification from './CollaborationNotification';

/**
 * Gestor de notificaciones de colaboración
 */
export function useCollaborationNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const NotificationsContainer = useCallback(() => (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      <div className="p-4 space-y-2 pointer-events-auto">
        {notifications.map((notification) => (
          <CollaborationNotification
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  ), [notifications, removeNotification]);

  return {
    addNotification,
    NotificationsContainer,
  };
}
