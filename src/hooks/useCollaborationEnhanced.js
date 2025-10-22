import { useState, useEffect, useCallback, useRef } from "react";
import collaborationService from "../services/collaborationService";
import databaseService from "../services/databaseService";
import diffService from "../services/diffService";

/**
 * 🚀 Hook mejorado de colaboración con todas las funcionalidades
 * - Persistencia en base de datos
 * - Sistema de diffs optimizado
 * - Chat en tiempo real
 * - Comentarios en código
 * - Notificaciones
 * - Sincronización de operaciones de archivos
 */
export function useCollaborationEnhanced(files, onFilesChange) {
  // Estados básicos
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [remoteCursors, setRemoteCursors] = useState({});
  const [isConfigured, setIsConfigured] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  
  // 💬 Estados de Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  
  // 💭 Estados de Comentarios
  const [codeComments, setCodeComments] = useState([]);
  const [unresolvedCommentsCount, setUnresolvedCommentsCount] = useState(0);
  
  // 🔔 Estados de Notificaciones
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  
  // 📊 Estados de Performance
  const [syncStats, setSyncStats] = useState({
    totalBytesSent: 0,
    totalBytesSaved: 0,
    diffsUsed: 0,
    fullSyncsUsed: 0,
  });

  const lastChangeTimestamp = useRef(0);
  const isApplyingRemoteChange = useRef(false);
  const typingTimers = useRef({});
  const fileVersionsRef = useRef({});
  const chatSubscriptionRef = useRef(null);

  // Agregar notificación helper
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => {
      const newNotification = {
        id: Date.now() + Math.random(),
        ...notification,
        created_at: new Date().toISOString(),
        is_read: false,
      };
      return [...prev, newNotification];
    });
    setUnreadNotificationsCount(prev => prev + 1);
  }, []);

  // ═══════════════════════════════════════════════════════════
  // 🎯 INICIALIZACIÓN
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    console.log("🚀 useCollaborationEnhanced: Inicializando...");
    const isSupabaseConfigured = collaborationService.isConfigured();
    setIsConfigured(isSupabaseConfigured);
    console.log(`⚙️ Supabase configurado: ${isSupabaseConfigured}`);

    // Restaurar sesión
    const restoreSession = async () => {
      try {
        const restored = await collaborationService.restoreSessionFromStorage();
        if (restored) {
          setIsCollaborating(true);
          setCurrentSession(restored.session);
          setCurrentUser(restored.user);
          setActiveUsers([restored.user]);

          // Cargar datos adicionales desde BD
          if (databaseService.isConfigured && restored.session.dbId) {
            loadSessionData(restored.session.dbId);
          }
        }
      } catch (error) {
        console.error("❌ Error al restaurar sesión:", error);
      }
    };

    restoreSession();
  }, []);

  // ═══════════════════════════════════════════════════════════
  // 📡 CARGAR DATOS DE LA SESIÓN
  // ═══════════════════════════════════════════════════════════

  const loadSessionData = useCallback(async (sessionDbId) => {
    try {
      // Cargar mensajes de chat
      const messages = await databaseService.getChatMessages(sessionDbId, 50);
      setChatMessages(messages);

      // Cargar archivos desde BD
      const dbFiles = await databaseService.getSessionFiles(sessionDbId);
      console.log(`📁 Cargados ${dbFiles.length} archivos desde BD`);

      // Cargar notificaciones
      // TODO: Implementar query de notificaciones por sesión
    } catch (error) {
      console.error("❌ Error cargando datos de sesión:", error);
    }
  }, []);

  // ═══════════════════════════════════════════════════════════
  // 🔄 LISTENERS DE COLABORACIÓN
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    if (!isCollaborating) return;

    // Handler de cambios de archivo (con diff)
    const handleFileChange = (payload) => {
      console.log("📥 Cambio de archivo recibido:", payload.filePath);

      if (isApplyingRemoteChange.current) {
        console.log("⏸️ Aplicando cambio remoto - ignorar");
        return;
      }

      // Control de versiones
      const currentVersion = fileVersionsRef.current[payload.filePath] || 0;
      if (typeof payload.version === "number" && payload.version < currentVersion - 5) {
        console.log("⏸️ Versión muy antigua - ignorar");
        return;
      }

      if (typeof payload.version === "number" && payload.version >= currentVersion) {
        fileVersionsRef.current[payload.filePath] = payload.version;
      }

      console.log("✅ Aplicando cambio remoto con diff");
      isApplyingRemoteChange.current = true;
      lastChangeTimestamp.current = payload.timestamp;

      // Aplicar cambio
      const parts = payload.filePath.split("/");
      const updateNestedFile = (obj, path, newContent) => {
        if (path.length === 1) {
          return {
            ...obj,
            [path[0]]: {
              ...obj[path[0]],
              content: newContent,
              _lastModified: Date.now(),
              _remoteUpdate: true,
            },
          };
        }
        const [first, ...rest] = path;
        return {
          ...obj,
          [first]: {
            ...obj[first],
            children: updateNestedFile(obj[first].children, rest, newContent),
          },
        };
      };

      const updatedFiles = updateNestedFile(files, parts, payload.content);
      onFilesChange(updatedFiles);

      setTimeout(() => {
        isApplyingRemoteChange.current = false;
      }, 100);

      // Actualizar typing indicator
      setTypingUsers((prev) => ({
        ...prev,
        [payload.userId]: {
          filePath: payload.filePath,
          timestamp: Date.now(),
        },
      }));

      if (typingTimers.current[payload.userId]) {
        clearTimeout(typingTimers.current[payload.userId]);
      }

      typingTimers.current[payload.userId] = setTimeout(() => {
        setTypingUsers((prev) => {
          const newTyping = { ...prev };
          delete newTyping[payload.userId];
          return newTyping;
        });
      }, 2000);
    };

    // Handler de operaciones de archivo
    const handleFileOperation = (payload) => {
      console.log("📁 Operación de archivo:", payload.operation, payload.filePath);

      addNotification({
        notification_type: 'info',
        title: 'Operación de archivo',
        message: `${payload.userName} ${payload.operation === 'create' ? 'creó' : payload.operation === 'delete' ? 'eliminó' : 'renombró'} ${payload.filePath}`,
      });

      // TODO: Aplicar la operación al estado de archivos
    };

    // Handler de usuarios
    const handleUserJoined = (user) => {
      setActiveUsers((prev) => {
        if (prev.some((u) => u.id === user.id)) return prev;
        return [...prev, user];
      });

      addNotification({
        notification_type: 'success',
        title: 'Usuario conectado',
        message: `${user.name} se unió a la sesión`,
      });
    };

    const handleUserLeft = (data) => {
      const user = activeUsers.find((u) => u.id === data.userId);
      setActiveUsers((prev) => prev.filter((u) => u.id !== data.userId));
      setRemoteCursors((prev) => {
        const newCursors = { ...prev };
        delete newCursors[data.userId];
        return newCursors;
      });

      if (user) {
        addNotification({
          notification_type: 'warning',
          title: 'Usuario desconectado',
          message: `${user.name} salió de la sesión`,
        });
      }
    };

    const handleCursorMove = (payload) => {
      setRemoteCursors((prev) => ({
        ...prev,
        [payload.userId]: {
          userName: payload.userName,
          userColor: payload.userColor,
          filePath: payload.filePath,
          position: payload.position,
          selection: payload.selection,
          version: payload.version,
        },
      }));
    };

    const handleConnectionStatusChange = (data) => {
      setConnectionStatus(data.status);

      if (data.status === "connected" && data.previousStatus !== "connected") {
        addNotification({
          notification_type: 'success',
          title: 'Reconectado',
          message: 'Conexión restaurada correctamente',
        });
      } else if (data.status === "disconnected") {
        addNotification({
          notification_type: 'error',
          title: 'Desconectado',
          message: 'Intentando reconectar...',
        });
      }
    };

    // Registrar listeners
    collaborationService.on("fileChange", handleFileChange);
    collaborationService.on("fileOperation", handleFileOperation);
    collaborationService.on("userJoined", handleUserJoined);
    collaborationService.on("userLeft", handleUserLeft);
    collaborationService.on("cursorMove", handleCursorMove);
    collaborationService.on("connectionStatusChange", handleConnectionStatusChange);

    // Cleanup
    return () => {
      Object.values(typingTimers.current).forEach((timer) => clearTimeout(timer));
      typingTimers.current = {};

      collaborationService.callbacks.onFileChange = null;
      collaborationService.callbacks.onFileOperation = null;
      collaborationService.callbacks.onUserJoined = null;
      collaborationService.callbacks.onUserLeft = null;
      collaborationService.callbacks.onCursorMove = null;
      collaborationService.callbacks.onConnectionStatusChange = null;
    };
  }, [isCollaborating, files, onFilesChange, activeUsers, addNotification]);

  // ═══════════════════════════════════════════════════════════
  // 💬 FUNCIONES DE CHAT
  // ═══════════════════════════════════════════════════════════

  const sendChatMessage = useCallback(async (messageData) => {
    if (!isCollaborating || !currentSession || !currentUser) return;

    try {
      // Enviar a BD
      if (databaseService.isConfigured && currentSession.dbId) {
        await databaseService.sendChatMessage({
          sessionId: currentSession.dbId,
          userId: currentUser.id,
          userName: currentUser.name,
          userColor: currentUser.color,
          message: messageData.message,
          messageType: messageData.messageType || 'text',
        });
      }

      // Agregar localmente
      const newMessage = {
        id: Date.now(),
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_color: currentUser.color,
        message: messageData.message,
        message_type: messageData.messageType || 'text',
        created_at: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("❌ Error al enviar mensaje:", error);
      addNotification({
        notification_type: 'error',
        title: 'Error en chat',
        message: 'No se pudo enviar el mensaje',
      });
    }
  }, [isCollaborating, currentSession, currentUser, addNotification]);

  // Suscribirse a mensajes de chat
  useEffect(() => {
    if (!isCollaborating || !currentSession?.dbId || !databaseService.isConfigured) return;

    chatSubscriptionRef.current = databaseService.subscribeToChatMessages(
      currentSession.dbId,
      (newMessage) => {
        if (newMessage.user_id !== currentUser?.id) {
          setChatMessages((prev) => [...prev, newMessage]);
          setUnreadChatCount(prev => prev + 1);
        }
      }
    );

    return () => {
      if (chatSubscriptionRef.current) {
        chatSubscriptionRef.current.unsubscribe();
      }
    };
  }, [isCollaborating, currentSession, currentUser]);

  // ═══════════════════════════════════════════════════════════
  // 💭 FUNCIONES DE COMENTARIOS
  // ═══════════════════════════════════════════════════════════

  const addCodeComment = useCallback(async (workspaceFileId, lineNumber, commentText) => {
    if (!isCollaborating || !currentUser) return;

    try {
      const comment = await databaseService.createComment({
        sessionId: currentSession?.dbId,
        workspaceFileId,
        userId: currentUser.id,
        userName: currentUser.name,
        userColor: currentUser.color,
        lineNumber,
        commentText,
      });

      setCodeComments((prev) => [...prev, comment]);
      setUnresolvedCommentsCount(prev => prev + 1);

      addNotification({
        notification_type: 'info',
        title: 'Comentario agregado',
        message: `Comentario en línea ${lineNumber}`,
      });
    } catch (error) {
      console.error("❌ Error al crear comentario:", error);
    }
  }, [isCollaborating, currentSession, currentUser, addNotification]);

  const resolveComment = useCallback(async (commentId) => {
    try {
      await databaseService.resolveComment(commentId, currentUser?.id);
      setCodeComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, is_resolved: true } : c))
      );
      setUnresolvedCommentsCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("❌ Error al resolver comentario:", error);
    }
  }, [currentUser]);

  const replyToComment = useCallback(async (commentId, replyText) => {
    try {
      await databaseService.addCommentReply({
        commentId,
        userId: currentUser?.id,
        userName: currentUser?.name,
        replyText,
      });
    } catch (error) {
      console.error("❌ Error al responder comentario:", error);
    }
  }, [currentUser]);

  // ═══════════════════════════════════════════════════════════
  // 🔔 FUNCIONES DE NOTIFICACIONES
  // ═══════════════════════════════════════════════════════════

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadNotificationsCount(prev => Math.max(0, prev - 1));

    if (databaseService.isConfigured) {
      databaseService.markNotificationAsRead(notificationId).catch(console.error);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadNotificationsCount(0);
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadNotificationsCount(0);
  }, []);

  // ═══════════════════════════════════════════════════════════
  // 🎯 FUNCIONES DE SESIÓN
  // ═══════════════════════════════════════════════════════════

  const createSession = useCallback(async (sessionData) => {
    if (!isConfigured) {
      throw new Error("Supabase no está configurado");
    }

    const result = await collaborationService.createSession({
      ...sessionData,
      files: files,
    });

    setIsCollaborating(true);
    setCurrentSession(collaborationService.getCurrentSession());
    setCurrentUser(collaborationService.getCurrentUser());
    setActiveUsers([collaborationService.getCurrentUser()]);

    // Guardar estado inicial en BD
    if (databaseService.isConfigured) {
      await collaborationService.setProjectState(files);
    }

    return result;
  }, [isConfigured, files]);

  const joinSession = useCallback(async (sessionId, userData) => {
    if (!isConfigured) {
      throw new Error("Supabase no está configurado");
    }

    const result = await collaborationService.joinSession(sessionId, userData);
    setIsCollaborating(true);
    setCurrentSession({ id: sessionId });
    setCurrentUser(collaborationService.getCurrentUser());
    setActiveUsers([collaborationService.getCurrentUser()]);

    // Solicitar estado del proyecto
    setTimeout(() => {
      collaborationService.requestProjectState();
    }, 1000);

    return result;
  }, [isConfigured]);

  const leaveSession = useCallback(async () => {
    await collaborationService.leaveSession();
    setIsCollaborating(false);
    setActiveUsers([]);
    setCurrentSession(null);
    setCurrentUser(null);
    setRemoteCursors({});
    setNotifications([]);
    setTypingUsers({});
    setChatMessages([]);
    setCodeComments([]);
  }, []);

  // ═══════════════════════════════════════════════════════════
  // 📡 FUNCIONES DE SINCRONIZACIÓN CON DIFFS
  // ═══════════════════════════════════════════════════════════

  const broadcastFileChange = useCallback(
    async (filePath, content, cursorPosition) => {
      if (!isCollaborating || isApplyingRemoteChange.current) return;

      const timestamp = Date.now();
      lastChangeTimestamp.current = timestamp;
      const nextVersion = (fileVersionsRef.current[filePath] || 0) + 1;
      fileVersionsRef.current[filePath] = nextVersion;

      // Actualizar estadísticas
      const diffData = diffService.calculateDiff(
        collaborationService.fileCache[filePath] || '',
        content
      );

      setSyncStats(prev => ({
        totalBytesSent: prev.totalBytesSent + diffData.size,
        totalBytesSaved: prev.totalBytesSaved + (content.length - diffData.size),
        diffsUsed: prev.diffsUsed + (diffData.type === 'diff' ? 1 : 0),
        fullSyncsUsed: prev.fullSyncsUsed + (diffData.type === 'full' ? 1 : 0),
      }));

      await collaborationService.broadcastFileChange(
        filePath,
        content,
        cursorPosition,
        nextVersion
      );
    },
    [isCollaborating]
  );

  const broadcastCursorMove = useCallback(
    async (filePath, position, selection) => {
      if (!isCollaborating) return;
      const version = fileVersionsRef.current[filePath] || 0;
      await collaborationService.broadcastCursorMove(filePath, position, selection, version);
    },
    [isCollaborating]
  );

  // ═══════════════════════════════════════════════════════════
  // 🎁 RETORNAR API DEL HOOK
  // ═══════════════════════════════════════════════════════════

  return {
    // Estados básicos
    isCollaborating,
    activeUsers,
    currentSession,
    currentUser,
    remoteCursors,
    isConfigured,
    typingUsers,
    connectionStatus,

    // Chat
    chatMessages,
    unreadChatCount,
    sendChatMessage,
    clearUnreadChat: () => setUnreadChatCount(0),

    // Comentarios
    codeComments,
    unresolvedCommentsCount,
    addCodeComment,
    resolveComment,
    replyToComment,

    // Notificaciones
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,

    // Estadísticas
    syncStats,

    // Funciones de sesión
    createSession,
    joinSession,
    leaveSession,

    // Funciones de sincronización
    broadcastFileChange,
    broadcastCursorMove,
    changeUserPermissions: collaborationService.changeUserPermissions.bind(collaborationService),
  };
}

export default useCollaborationEnhanced;
