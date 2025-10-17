import { useState, useEffect, useCallback, useRef } from 'react';
import collaborationService from '../services/collaborationService';

/**
 * Hook personalizado para gestionar colaboración en tiempo real
 * @param {Object} files - Archivos del proyecto
 * @param {Function} onFilesChange - Callback para actualizar archivos
 */
export function useCollaboration(files, onFilesChange) {
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [remoteCursors, setRemoteCursors] = useState({});
  const [isConfigured, setIsConfigured] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // Usuarios escribiendo
  
  const lastChangeTimestamp = useRef(0);
  const isApplyingRemoteChange = useRef(false);
  const typingTimers = useRef({}); // Timers para "escribiendo"

  useEffect(() => {
    setIsConfigured(collaborationService.isConfigured());
  }, []);

  // Inicializar listeners
  useEffect(() => {
    if (!isCollaborating) return;

    // Listener para cambios de archivos
    collaborationService.on('fileChange', (payload) => {
      // Evitar bucles de sincronización
      if (isApplyingRemoteChange.current) return;
      if (payload.timestamp <= lastChangeTimestamp.current) return;

      isApplyingRemoteChange.current = true;
      lastChangeTimestamp.current = payload.timestamp;

      // Aplicar el cambio remoto
      const parts = payload.filePath.split('/');
      
      const updateNestedFile = (obj, path, newContent) => {
        if (path.length === 1) {
          return {
            ...obj,
            [path[0]]: {
              ...obj[path[0]],
              content: newContent
            }
          };
        }
        
        const [first, ...rest] = path;
        return {
          ...obj,
          [first]: {
            ...obj[first],
            children: updateNestedFile(obj[first].children, rest, newContent)
          }
        };
      };

      const updatedFiles = updateNestedFile(files, parts, payload.content);
      onFilesChange(updatedFiles);

      setTimeout(() => {
        isApplyingRemoteChange.current = false;
      }, 100);
    });

    // Listener para usuarios que se unen
    collaborationService.on('userJoined', (user) => {
      setActiveUsers(prev => {
        // Evitar duplicados
        if (prev.some(u => u.id === user.id)) return prev;
        return [...prev, user];
      });

      // Agregar notificación
      addNotification({
        type: 'user-joined',
        userName: user.name,
        userColor: user.color,
        message: 'se ha unido a la sesión'
      });
    });

    // Listener para usuarios que se van
    collaborationService.on('userLeft', (data) => {
      const user = activeUsers.find(u => u.id === data.userId);
      
      setActiveUsers(prev => prev.filter(u => u.id !== data.userId));
      setRemoteCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[data.userId];
        return newCursors;
      });
      setTypingUsers(prev => {
        const newTyping = { ...prev };
        delete newTyping[data.userId];
        return newTyping;
      });

      // Agregar notificación
      if (user) {
        addNotification({
          type: 'user-left',
          userName: user.name,
          userColor: user.color,
          message: 'ha salido de la sesión'
        });
      }
    });

    // Listener para movimiento de cursor
    collaborationService.on('cursorMove', (payload) => {
      setRemoteCursors(prev => ({
        ...prev,
        [payload.userId]: {
          userName: payload.userName,
          userColor: payload.userColor,
          filePath: payload.filePath,
          position: payload.position,
          selection: payload.selection,
        }
      }));
    });

    // Listener para cambios de archivos - actualizar estado "escribiendo"
    collaborationService.on('fileChange', (payload) => {
      // Marcar que el usuario está escribiendo
      setTypingUsers(prev => ({
        ...prev,
        [payload.userId]: {
          filePath: payload.filePath,
          timestamp: Date.now()
        }
      }));

      // Limpiar después de 2 segundos
      if (typingTimers.current[payload.userId]) {
        clearTimeout(typingTimers.current[payload.userId]);
      }
      
      typingTimers.current[payload.userId] = setTimeout(() => {
        setTypingUsers(prev => {
          const newTyping = { ...prev };
          delete newTyping[payload.userId];
          return newTyping;
        });
      }, 2000);
    });

    // Listener para cambios de acceso
    collaborationService.on('accessChanged', (payload) => {
      if (currentUser && payload.userId === currentUser.id) {
        setCurrentUser(prev => ({
          ...prev,
          role: payload.newRole
        }));
      }
    });

    return () => {
      // Cleanup listeners
    };
  }, [isCollaborating, files, onFilesChange, currentUser]);

  // Crear nueva sesión
  const createSession = useCallback(async (sessionData) => {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Consulta la documentación para configurarlo.');
    }

    try {
      const result = await collaborationService.createSession(sessionData);
      setIsCollaborating(true);
      setCurrentSession(collaborationService.getCurrentSession());
      setCurrentUser(collaborationService.getCurrentUser());
      setActiveUsers([collaborationService.getCurrentUser()]);
      
      return result;
    } catch (error) {
      console.error('Error al crear sesión:', error);
      throw error;
    }
  }, [isConfigured]);

  // Unirse a sesión existente
  const joinSession = useCallback(async (sessionId, userData) => {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado');
    }

    try {
      const result = await collaborationService.joinSession(sessionId, userData);
      setIsCollaborating(true);
      setCurrentSession({ id: sessionId });
      setCurrentUser(collaborationService.getCurrentUser());
      
      // IMPORTANTE: Inicializar con el usuario actual
      // Los demás usuarios se agregarán vía el listener 'userJoined'
      setActiveUsers([collaborationService.getCurrentUser()]);
      
      return result;
    } catch (error) {
      console.error('Error al unirse a la sesión:', error);
      throw error;
    }
  }, [isConfigured]);

  // Transmitir cambio de archivo
  const broadcastFileChange = useCallback(async (filePath, content, cursorPosition) => {
    if (!isCollaborating || isApplyingRemoteChange.current) return;

    const timestamp = Date.now();
    lastChangeTimestamp.current = timestamp;
    
    await collaborationService.broadcastFileChange(filePath, content, cursorPosition);
  }, [isCollaborating]);

  // Transmitir movimiento de cursor
  const broadcastCursorMove = useCallback(async (filePath, position, selection) => {
    if (!isCollaborating) return;
    
    await collaborationService.broadcastCursorMove(filePath, position, selection);
  }, [isCollaborating]);

  // Cambiar permisos de usuario
  const changeUserPermissions = useCallback(async (userId, newRole) => {
    if (!isCollaborating) return;
    
    await collaborationService.changeUserPermissions(userId, newRole);
  }, [isCollaborating]);

  // Agregar notificación
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Eliminar notificación
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Salir de la sesión
  const leaveSession = useCallback(async () => {
    await collaborationService.leaveSession();
    setIsCollaborating(false);
    setActiveUsers([]);
    setCurrentSession(null);
    setCurrentUser(null);
    setRemoteCursors({});
    setNotifications([]);
    setTypingUsers({});
  }, []);

  return {
    isCollaborating,
    activeUsers,
    currentSession,
    currentUser,
    remoteCursors,
    isConfigured,
    notifications,
    typingUsers,
    createSession,
    joinSession,
    broadcastFileChange,
    broadcastCursorMove,
    changeUserPermissions,
    leaveSession,
    removeNotification,
  };
}

export default useCollaboration;
