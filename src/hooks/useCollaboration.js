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
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 🚀 Estado de conexión
  
  const lastChangeTimestamp = useRef(0);
  const isApplyingRemoteChange = useRef(false);
  const typingTimers = useRef({}); // Timers para "escribiendo"
  const fileVersionsRef = useRef({}); // Versiones por archivo

  // 🔥 MOVER addNotification AQUÍ para que esté disponible en los useEffect
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

  useEffect(() => {
    console.log('🚀 useCollaboration: Inicializando...');
    const isSupabaseConfigured = collaborationService.isConfigured();
    setIsConfigured(isSupabaseConfigured);
    console.log(`⚙️ Supabase configurado: ${isSupabaseConfigured}`);
    
    // Intentar restaurar sesión al cargar
    const restoreSession = async () => {
      try {
        console.log('🔄 Iniciando proceso de restauración de sesión...');
        const restored = await collaborationService.restoreSessionFromStorage();
        
        if (restored) {
          console.log('✅ Sesión restaurada con éxito:', {
            sessionId: restored.session.id,
            userName: restored.user.name,
            userRole: restored.user.role
          });
          
          // Actualizar estados de React
          console.log('📝 Actualizando estados de React...');
          setIsCollaborating(true);
          setCurrentSession(restored.session);
          setCurrentUser(restored.user);
          setActiveUsers([restored.user]);
          console.log('✅ Estados de React actualizados');
          
          // Limpiar parámetro de URL si coincide con la sesión restaurada
          const urlParams = new URLSearchParams(window.location.search);
          const urlSessionId = urlParams.get('session');
          if (urlSessionId && urlSessionId === restored.session.id) {
            urlParams.delete('session');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState({}, '', newUrl);
            console.log('🧹 URL limpiada después de restaurar sesión');
          }
          
          // Restaurar archivos del proyecto desde localStorage
          const storedFiles = localStorage.getItem('collaboration_project_files');
          if (storedFiles) {
            try {
              const parsedFiles = JSON.parse(storedFiles);
              const fileCount = Object.keys(parsedFiles).length;
              console.log(`📁 Aplicando ${fileCount} archivos restaurados desde localStorage`);
              onFilesChange(parsedFiles);
              console.log('✅ Archivos aplicados al estado');
            } catch (e) {
              console.error('❌ Error al parsear archivos:', e);
            }
          } else {
            console.log('ℹ️ No hay archivos guardados en localStorage');
          }

          // Si no eres owner, también solicitar estado actual por si hay cambios
          if (restored.user.role !== 'owner') {
            console.log('👤 Usuario no es owner - solicitando archivos al owner...');
            setTimeout(async () => {
              await collaborationService.requestProjectState();
              console.log('📡 Solicitud de archivos enviada');
            }, 1500);
          } else {
            console.log('👑 Usuario es owner - no necesita solicitar archivos');
          }
          
          console.log('🎉 PROCESO DE RESTAURACIÓN COMPLETADO');
        } else {
          console.log('ℹ️ No se encontró sesión para restaurar');
        }
      } catch (error) {
        console.error('❌ Error al restaurar sesión:', error);
        console.error('Stack trace:', error.stack);
      }
    };

    restoreSession();
  }, [onFilesChange]);

  // Inicializar listeners
  useEffect(() => {
    if (!isCollaborating) return;

    // 🔥 FUNCIONES DE CALLBACK PARA LIMPIAR CORRECTAMENTE
    const handleFileChange = (payload) => {
      console.log('📥 MENSAJE RECIBIDO de Supabase:', {
        filePath: payload.filePath,
        contentLength: payload.content?.length,
        fromUser: payload.userName,
        timestamp: payload.timestamp
      });
      
      // Evitar bucles de sincronización
      if (isApplyingRemoteChange.current) {
        console.log('⏸️ Aplicando cambio remoto - ignorar');
        return;
      }
      // Control de versiones por archivo: ignorar si la versión es antigua
      const currentVersion = fileVersionsRef.current[payload.filePath] || 0;
      if (typeof payload.version === 'number') {
        if (payload.version <= currentVersion) {
          console.log('⏸️ Versión antigua - ignorar', { incoming: payload.version, currentVersion });
          return;
        }
        // Aceptamos la nueva versión
        fileVersionsRef.current[payload.filePath] = payload.version;
      } else {
        // Fallback a timestamp si no viene versión
        if (payload.timestamp <= lastChangeTimestamp.current) {
          console.log('⏸️ Timestamp antiguo - ignorar');
          return;
        }
      }

      console.log('✅ Aplicando cambio remoto al estado...');
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
              content: newContent,
              _lastModified: Date.now(),
              _remoteUpdate: true
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
      console.log('🔄 Actualizando estado con timestamp:', Date.now());
      onFilesChange(updatedFiles);
      console.log('🎉 Cambio aplicado exitosamente');

      setTimeout(() => {
        isApplyingRemoteChange.current = false;
      }, 100);

      // 🔥 ACTUALIZAR TYPING INDICATOR AQUÍ (evitar listener duplicado)
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
    };

    const handleUserJoined = (user) => {
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
    };

    const handleUserLeft = (data) => {
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
    };

    const handleCursorMove = (payload) => {
      console.log('📍 Hook recibió cursor remoto:', {
        userId: payload.userId,
        userName: payload.userName,
        filePath: payload.filePath,
        position: payload.position
      });
      
      const currentVersion = fileVersionsRef.current[payload.filePath] || 0;
      if (typeof payload.version === 'number' && payload.version < currentVersion) {
        console.log('⏸️ Cursor con versión antigua - ignorar');
        return;
      }
      
      console.log('✅ Actualizando estado de remoteCursors');
      setRemoteCursors(prev => {
        const updated = {
          ...prev,
          [payload.userId]: {
            userName: payload.userName,
            userColor: payload.userColor,
            filePath: payload.filePath,
            position: payload.position,
            selection: payload.selection,
            version: payload.version,
          }
        };
        console.log('📦 Nuevo estado de remoteCursors:', Object.keys(updated));
        return updated;
      });
    };

    const handleAccessChanged = (payload) => {
      if (currentUser && payload.userId === currentUser.id) {
        setCurrentUser(prev => ({
          ...prev,
          role: payload.newRole
        }));
      }
    };

    const handleProjectState = (payload) => {
      console.log('📦 RECIBIENDO ESTADO DEL PROYECTO');
      console.log('   - Archivos recibidos:', Object.keys(payload.files || {}));
      console.log('   - Total archivos:', Object.keys(payload.files || {}).length);
      console.log('   - De usuario:', payload.fromUserId);
      
      // Aplicar el estado recibido
      if (payload.files && Object.keys(payload.files).length > 0) {
        console.log('✅ APLICANDO ARCHIVOS AL PROYECTO...');
        onFilesChange(payload.files);
        // Reiniciar versiones conocidas (nuevo snapshot)
        fileVersionsRef.current = {};
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('collaboration_project_files', JSON.stringify(payload.files));
        console.log('💾 Archivos guardados localmente');
        
        // Mostrar notificación
        addNotification({
          type: 'project-synced',
          message: `Proyecto sincronizado: ${Object.keys(payload.files).length} archivos`,
          userName: 'Sistema'
        });
        
        console.log('🎉 SINCRONIZACIÓN COMPLETA');
      } else {
        console.warn('⚠️ No se recibieron archivos o está vacío');
      }
    };

    // 🚀 Manejar cambios de estado de conexión
    const handleConnectionStatusChange = (data) => {
      console.log('📡 Estado de conexión cambió:', data);
      setConnectionStatus(data.status);
      
      // Notificaciones según el estado
      if (data.status === 'connected' && data.previousStatus !== 'connected') {
        addNotification({
          type: 'connection-restored',
          message: 'Conexión restaurada',
          userName: 'Sistema'
        });
      } else if (data.status === 'disconnected') {
        addNotification({
          type: 'connection-lost',
          message: 'Conexión perdida - intentando reconectar...',
          userName: 'Sistema'
        });
      } else if (data.status === 'failed') {
        addNotification({
          type: 'connection-failed',
          message: 'No se pudo reconectar - recarga la página',
          userName: 'Sistema'
        });
      }
    };

    // 🔥 REGISTRAR LISTENERS
    collaborationService.on('fileChange', handleFileChange);
    collaborationService.on('userJoined', handleUserJoined);
    collaborationService.on('userLeft', handleUserLeft);
    collaborationService.on('cursorMove', handleCursorMove);
    collaborationService.on('accessChanged', handleAccessChanged);
    collaborationService.on('projectState', handleProjectState);
    collaborationService.on('connectionStatusChange', handleConnectionStatusChange);

    // 🔥 CLEANUP CRÍTICO - LIMPIAR LISTENERS Y TIMERS
    return () => {
      console.log('🧹 Limpiando listeners de colaboración...');
      
      // Limpiar todos los timers de typing
      Object.values(typingTimers.current).forEach(timer => clearTimeout(timer));
      typingTimers.current = {};
      
      // Remover listeners (establecer a null)
      collaborationService.callbacks.onFileChange = null;
      collaborationService.callbacks.onUserJoined = null;
      collaborationService.callbacks.onUserLeft = null;
      collaborationService.callbacks.onCursorMove = null;
      collaborationService.callbacks.onAccessChanged = null;
      collaborationService.callbacks.onProjectState = null;
      collaborationService.callbacks.onConnectionStatusChange = null;
      
      console.log('✅ Listeners limpiados correctamente');
    };
  }, [isCollaborating, files, onFilesChange, currentUser]); // ✅ Removido addNotification para evitar error de inicialización

  // Crear nueva sesión
  const createSession = useCallback(async (sessionData) => {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Consulta la documentación para configurarlo.');
    }

    try {
      // Pasar los archivos actuales a la sesión
      const sessionWithFiles = {
        ...sessionData,
        files: files
      };
      
      const result = await collaborationService.createSession(sessionWithFiles);
      setIsCollaborating(true);
      setCurrentSession(collaborationService.getCurrentSession());
      setCurrentUser(collaborationService.getCurrentUser());
      setActiveUsers([collaborationService.getCurrentUser()]);
      
      // Guardar estado inicial del proyecto
      await collaborationService.setProjectState(files);
      console.log('💾 Proyecto inicial guardado con archivos:', Object.keys(files));
      
      return result;
    } catch (error) {
      console.error('Error al crear sesión:', error);
      throw error;
    }
  }, [isConfigured, files]);

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
      
      // Solicitar el estado del proyecto al owner inmediatamente
      console.log('🔍 Buscando archivos del proyecto...');
      
      // Intentar varias veces para asegurar que recibimos los archivos
      let attempts = 0;
      const maxAttempts = 3;
      
      const requestFiles = async () => {
        await collaborationService.requestProjectState();
        console.log(`📡 Solicitud de archivos #${attempts + 1}`);
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(requestFiles, 2000); // Reintentar cada 2 segundos
        }
      };
      
      // Primera solicitud después de 1 segundo
      setTimeout(requestFiles, 1000);
      
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
    // Incrementar versión por archivo y enviar
    const nextVersion = (fileVersionsRef.current[filePath] || 0) + 1;
    fileVersionsRef.current[filePath] = nextVersion;
    await collaborationService.broadcastFileChange(filePath, content, cursorPosition, nextVersion);
  }, [isCollaborating]);

  // Transmitir movimiento de cursor
  const broadcastCursorMove = useCallback(async (filePath, position, selection) => {
    if (!isCollaborating) return;
    
    const version = fileVersionsRef.current[filePath] || 0;
    await collaborationService.broadcastCursorMove(filePath, position, selection, version);
  }, [isCollaborating]);

  // Cambiar permisos de usuario
  const changeUserPermissions = useCallback(async (userId, newRole) => {
    if (!isCollaborating) return;
    
    await collaborationService.changeUserPermissions(userId, newRole);
  }, [isCollaborating]);

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
    connectionStatus, // 🚀 Estado de conexión
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
