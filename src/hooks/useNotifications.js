import { useState, useCallback } from 'react';

/**
 * Hook centralizado para gestionar notificaciones
 * Reemplaza múltiples sistemas de notificaciones por uno unificado
 * 
 * @example
 * const { notifications, addNotification, removeNotification } = useNotifications();
 * 
 * // Agregar una notificación
 * addNotification({
 *   type: 'success',
 *   title: 'Archivo guardado',
 *   message: 'Los cambios se guardaron correctamente',
 *   duration: 3000
 * });
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  /**
   * Agrega una nueva notificación
   * @param {Object} notification - Objeto de notificación
   * @param {string} notification.type - Tipo: 'success', 'error', 'warning', 'info', 'user-joined', 'user-left'
   * @param {string} notification.title - Título (opcional)
   * @param {string} notification.message - Mensaje
   * @param {number} notification.duration - Duración en ms (default: 5000)
   * @param {boolean} notification.autoDismiss - Auto-cerrar (default: true)
   * @param {string} notification.userName - Nombre de usuario (para notificaciones colaborativas)
   * @param {string} notification.userColor - Color del usuario (para notificaciones colaborativas)
   * @returns {string} ID de la notificación creada
   */
  const addNotification = useCallback((notification) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title,
      message: notification.message,
      duration: notification.duration || 5000,
      autoDismiss: notification.autoDismiss !== false,
      timestamp: Date.now(),
      userName: notification.userName,
      userColor: notification.userColor,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-eliminar después de la duración especificada
    if (newNotification.autoDismiss) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  /**
   * Elimina una notificación específica
   * @param {string} notificationId - ID de la notificación
   */
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  /**
   * Elimina todas las notificaciones
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Obtiene el contador de notificaciones no leídas
   * @returns {number} Cantidad de notificaciones
   */
  const getCount = useCallback(() => {
    return notifications.length;
  }, [notifications]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    getCount,
  };
}

/**
 * Tipos de notificaciones disponibles
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  PERMISSION_CHANGED: 'permission-changed',
  PROJECT_SYNCED: 'project-synced',
};

/**
 * Helper para crear notificaciones rápidas
 */
export const createNotification = {
  success: (message, title = '✅ Éxito') => ({
    type: NOTIFICATION_TYPES.SUCCESS,
    title,
    message,
    duration: 3000,
  }),
  
  error: (message, title = '❌ Error') => ({
    type: NOTIFICATION_TYPES.ERROR,
    title,
    message,
    duration: 5000,
  }),
  
  warning: (message, title = '⚠️ Advertencia') => ({
    type: NOTIFICATION_TYPES.WARNING,
    title,
    message,
    duration: 4000,
  }),
  
  info: (message, title = 'ℹ️ Información') => ({
    type: NOTIFICATION_TYPES.INFO,
    title,
    message,
    duration: 3000,
  }),
  
  userJoined: (userName, userColor) => ({
    type: NOTIFICATION_TYPES.USER_JOINED,
    message: 'se unió a la sesión',
    userName,
    userColor,
    duration: 4000,
  }),
  
  userLeft: (userName, userColor) => ({
    type: NOTIFICATION_TYPES.USER_LEFT,
    message: 'salió de la sesión',
    userName,
    userColor,
    duration: 4000,
  }),
};
