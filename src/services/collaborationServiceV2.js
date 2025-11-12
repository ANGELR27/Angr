import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs';
import { YjsSupabaseProvider } from './yjsSupabaseProvider';

// Configuración de Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key-aqui';

/**
 * 🚀 SERVICIO DE COLABORACIÓN V2 + YJS CRDT
 * Mejoras principales:
 * - ✅ Presence nativo de Supabase (no más eventos manuales)
 * - ✅ Links cortos y QR codes
 * - ✅ Persistencia en base de datos
 * - ✅ Compression de payloads grandes
 * - ✅ Batching de cursores
 * - 🔥 Yjs CRDT para resolución automática de conflictos
 */
class CollaborationServiceV2 {
  constructor() {
    this.supabase = null;
    this.currentSession = null;
    this.currentUser = null;
    this.channel = null;
    
    // 🔥 YJS CRDT
    this.ydoc = null; // Documento compartido
    this.yjsProvider = null; // Provider Supabase
    this.ytext = null; // Texto compartido para el editor
    this.yfiles = null; // Map de archivos compartidos
    
    // Callbacks
    this.callbacks = {
      onFileChange: null,
      onUsersChanged: null, // 🔥 NUEVO: Un solo callback para usuarios
      onCursorMove: null,
      onConnectionStatusChange: null,
      onProjectState: null,
      onChatMessage: null, // 💬 Chat en tiempo real
      onNotification: null, // 🔔 Notificaciones
      onActivity: null, // 📊 Actividad del equipo
      onTypingIndicator: null, // ✍️ Indicador de escritura
    };
    
    // Estado de conexión
    this.connectionStatus = 'disconnected';
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    
    // Cache y optimizaciones
    this.fileCache = {};
    this.processedMessages = new Set();
    
    // 🔥 NUEVO: Batching de cursores
    this.cursorBatch = [];
    this.cursorBatchTimer = null;
    this.cursorBatchDelay = 100; // 100ms
    
    // Heartbeat
    this.heartbeatInterval = null;
    this.heartbeatFrequency = 10000; // 10s
    
    // 💬 Chat y Notificaciones
    this.chatMessages = [];
    this.activityLog = [];
    this.typingUsers = new Map(); // userId -> timestamp
    this.typingTimeout = 2000; // 2 segundos
    
    // Inicializar si hay credenciales
    if (SUPABASE_URL !== 'https://tu-proyecto.supabase.co' && SUPABASE_ANON_KEY !== 'tu-anon-key-aqui') {
      this.initializeSupabase();
    }
  }

  initializeSupabase() {
    try {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        realtime: {
          params: {
            eventsPerSecond: 100,
          },
        },
        auth: {
          persistSession: false,
        },
      });
      console.log('✅ Supabase V2 inicializado');
    } catch (error) {
      console.error('❌ Error al inicializar Supabase:', error);
    }
  }

  isConfigured() {
    return !!this.supabase;
  }

  // =========================================
  // 🔗 SISTEMA DE LINKS MEJORADO
  // =========================================
  
  /**
   * Generar link corto para compartir (5 caracteres)
   */
  generateShortSessionId() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  }

  /**
   * Obtener link compartible con múltiples formatos
   */
  getShareableLink(sessionId) {
    const baseUrl = window.location.origin;
    const shortLink = `${baseUrl}?s=${sessionId}`;
    
    return {
      sessionId,
      fullLink: shortLink,
      embedLink: `${shortLink}&embed=true`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shortLink)}`,
    };
  }

  /**
   * Copiar link al portapapeles
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      
      // Fallback para navegadores antiguos
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (error) {
      console.error('Error al copiar:', error);
      return false;
    }
  }

  // =========================================
  // 🎯 CREAR SESIÓN
  // =========================================
  
  async createSession(sessionData) {
    if (!this.supabase) {
      throw new Error('Supabase no está configurado');
    }

    // Validar datos
    if (!sessionData?.userName?.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }

    // Generar IDs
    const sessionId = this.generateShortSessionId();
    const userId = uuidv4();
    
    this.currentUser = {
      id: userId,
      name: sessionData.userName.trim(),
      color: this.generateUserColor(),
      role: 'owner',
      online_at: new Date().toISOString(),
    };

    // Guardar en base de datos
    try {
      const { data: dbSession, error } = await this.supabase
        .from('collaboration_sessions')
        .insert({
          session_code: sessionId,
          session_name: sessionData.sessionName || 'Sesión de Código',
          owner_user_id: userId,
          owner_name: this.currentUser.name,
          access_control: sessionData.accessControl || 'public',
          password_hash: sessionData.password || null,
          project_state: {
            files: sessionData.files || {},
            images: sessionData.images || [],
          },
        })
        .select()
        .single();

      if (error) {
        console.error('Error al crear sesión en BD:', error);
        throw new Error('No se pudo crear la sesión: ' + error.message);
      }

      console.log('✅ Sesión creada en BD:', dbSession);
      
      this.currentSession = {
        id: sessionId,
        dbId: dbSession.id,
        name: dbSession.session_name,
        owner: userId,
        accessControl: dbSession.access_control,
        createdAt: dbSession.created_at,
      };
    } catch (error) {
      console.error('Error al guardar sesión:', error);
      throw error;
    }

    // Conectar al canal con Presence
    await this.connectToChannel(sessionId);

    // Guardar en localStorage para restauración
    this.saveSessionToStorage();

    // Generar links para compartir
    const shareLinks = this.getShareableLink(sessionId);

    return {
      sessionId,
      userId,
      ...shareLinks,
    };
  }

  // =========================================
  // 🚪 UNIRSE A SESIÓN
  // =========================================
  
  async joinSession(sessionId, userData) {
    if (!this.supabase) {
      throw new Error('Supabase no está configurado');
    }

    if (!userData?.userName?.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }

    // Verificar que la sesión existe
    const { data: session, error } = await this.supabase
      .from('collaboration_sessions')
      .select('*')
      .eq('session_code', sessionId)
      .eq('is_active', true)
      .single();

    if (error || !session) {
      throw new Error('Sesión no encontrada o inactiva');
    }

    // Verificar contraseña si es necesaria
    if (session.access_control === 'private' && session.password_hash) {
      if (!userData.password || userData.password !== session.password_hash) {
        throw new Error('Contraseña incorrecta');
      }
    }

    const userId = uuidv4();
    
    this.currentUser = {
      id: userId,
      name: userData.userName.trim(),
      color: this.generateUserColor(),
      role: 'viewer',
      online_at: new Date().toISOString(),
    };

    this.currentSession = {
      id: sessionId,
      dbId: session.id,
      name: session.session_name,
      owner: session.owner_user_id,
      accessControl: session.access_control,
    };

    // Conectar al canal
    await this.connectToChannel(sessionId);

    // Guardar en localStorage
    this.saveSessionToStorage();

    // Cargar estado del proyecto
    if (session.project_state) {
      setTimeout(() => {
        if (this.callbacks.onProjectState) {
          this.callbacks.onProjectState({
            files: session.project_state.files || {},
            images: session.project_state.images || [],
            fromUserId: session.owner_user_id,
          });
        }
      }, 500);
    }

    return { userId, sessionId };
  }

  // =========================================
  // 📡 CONECTAR AL CANAL CON PRESENCE NATIVO
  // =========================================
  
  async connectToChannel(sessionId) {
    if (!this.supabase) return;

    console.log('🔌 Conectando al canal:', sessionId);
    this.updateConnectionStatus('connecting');

    this.channel = this.supabase.channel(`session:${sessionId}`, {
      config: {
        broadcast: { 
          self: false, // No recibir propios broadcasts
          ack: true // 🔥 Confirmar entrega de mensajes
        },
        presence: { key: this.currentUser?.id }, // ✅ PRESENCE NATIVO
      },
    });

    // =========================================
    // 🔥 PRESENCE: Sistema nativo de usuarios
    // =========================================
    
    // Evento: Lista completa de usuarios (sync)
    this.channel.on('presence', { event: 'sync' }, () => {
      const presenceState = this.channel.presenceState();
      const allUsers = Object.values(presenceState)
        .flat()
        .map(p => p.user)
        .filter(u => u && u.id); // Filtrar usuarios válidos
      
      // 🔧 FIX: Deduplicar por userId (evita duplicados al reconectar)
      const uniqueUsers = Array.from(
        new Map(allUsers.map(user => [user.id, user])).values()
      );
      
      console.log('👥 Usuarios en línea (sync):', {
        raw: allUsers.length,
        unique: uniqueUsers.length,
        duplicados: allUsers.length - uniqueUsers.length,
        nombres: uniqueUsers.map(u => u.name)
      });
      
      if (this.callbacks.onUsersChanged) {
        this.callbacks.onUsersChanged(uniqueUsers);
      }
    });

    // Evento: Nuevos usuarios se unieron
    this.channel.on('presence', { event: 'join' }, ({ newPresences }) => {
      console.log('👋 Usuarios se unieron:', newPresences);
      
      // El evento sync se encargará de actualizar la lista completa
      // Aquí solo notificamos
      newPresences.forEach(presence => {
        console.log(`✅ ${presence.user.name} se unió`);
      });
    });

    // Evento: Usuarios se fueron
    this.channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
      console.log('👋 Usuarios se fueron:', leftPresences);
      
      leftPresences.forEach(presence => {
        console.log(`❌ ${presence.user.name} salió`);
      });
    });

    // =========================================
    // 📝 BROADCAST: Cambios en archivos
    // =========================================
    
    this.channel.on('broadcast', { event: 'file-change' }, (payload) => {
      const data = payload.payload;
      
      console.log('📥 Broadcast file-change recibido:', {
        from: data.userName,
        userId: data.userId,
        filePath: data.filePath,
        contentLength: data.content?.length,
        messageId: data.messageId,
        hasCallback: !!this.callbacks.onFileChange
      });
      
      // Evitar duplicados
      if (this.isMessageProcessed(data.messageId)) {
        console.log('⏸️ Mensaje duplicado - ignorar');
        return;
      }
      
      if (this.callbacks.onFileChange) {
        console.log('✅ Llamando callback onFileChange');
        this.callbacks.onFileChange(data);
      } else {
        console.warn('⚠️ No hay callback registrado para onFileChange');
      }
    });

    // =========================================
    // 🖱️ BROADCAST: Movimientos de cursor
    // =========================================
    
    this.channel.on('broadcast', { event: 'cursor-move' }, (payload) => {
      if (this.callbacks.onCursorMove && payload.payload.userId !== this.currentUser?.id) {
        this.callbacks.onCursorMove(payload.payload);
      }
    });

    // =========================================
    // 📦 BROADCAST: Estado del proyecto
    // =========================================
    
    this.channel.on('broadcast', { event: 'project-state' }, (payload) => {
      if (this.callbacks.onProjectState && payload.payload.fromUserId !== this.currentUser?.id) {
        this.callbacks.onProjectState(payload.payload);
      }
    });

    // =========================================
    // 🔐 BROADCAST: Cambio de permisos
    // =========================================
    
    this.channel.on('broadcast', { event: 'permission-change' }, async (payload) => {
      const { userId, newRole } = payload.payload;
      
      console.log('📥 Cambio de permisos recibido:', { userId, newRole });
      
      // Si el cambio es para el usuario actual, actualizar su rol
      if (userId === this.currentUser?.id) {
        console.log('🔄 Actualizando tu rol a:', newRole);
        this.currentUser.role = newRole;
        
        // Actualizar tracking de presence con nuevo rol
        await this.channel.track({
          user: this.currentUser,
          online_at: new Date().toISOString(),
        });
        
        // Guardar en localStorage
        const session = this.getCurrentSession();
        if (session) {
          session.userRole = newRole;
          this.saveSessionToStorage(session);
        }
      }
      
      // Notificar al callback si existe
      if (this.callbacks.onAccessChanged) {
        this.callbacks.onAccessChanged({ userId, role: newRole });
      }
    });

    // =========================================
    // 💬 BROADCAST: Mensajes de chat
    // =========================================
    
    this.channel.on('broadcast', { event: 'chat-message' }, (payload) => {
      const message = payload.payload;
      
      console.log('💬 Mensaje de chat recibido:', {
        from: message.userName,
        preview: message.message.substring(0, 30)
      });
      
      // Agregar a la lista local
      this.chatMessages.push(message);
      
      // Mantener solo los últimos 100 mensajes
      if (this.chatMessages.length > 100) {
        this.chatMessages = this.chatMessages.slice(-100);
      }
      
      // Notificar al callback
      if (this.callbacks.onChatMessage) {
        this.callbacks.onChatMessage(message);
      }
      
      // Registrar actividad
      if (message.userId !== this.currentUser?.id) {
        this.logActivity('chat_received', `${message.userName} envió un mensaje`);
      }
    });

    // =========================================
    // ✍️ BROADCAST: Indicadores de escritura
    // =========================================
    
    this.channel.on('broadcast', { event: 'user-typing' }, (payload) => {
      const { userId, userName, isTyping } = payload.payload;
      
      // Ignorar propios eventos
      if (userId === this.currentUser?.id) return;
      
      if (isTyping) {
        this.typingUsers.set(userId, { userName, timestamp: Date.now() });
      } else {
        this.typingUsers.delete(userId);
      }
      
      // Notificar al callback
      if (this.callbacks.onTypingIndicator) {
        this.callbacks.onTypingIndicator(Array.from(this.typingUsers.values()));
      }
      
      // Auto-limpiar indicador después de 2 segundos
      setTimeout(() => {
        const user = this.typingUsers.get(userId);
        if (user && Date.now() - user.timestamp >= this.typingTimeout) {
          this.typingUsers.delete(userId);
          if (this.callbacks.onTypingIndicator) {
            this.callbacks.onTypingIndicator(Array.from(this.typingUsers.values()));
          }
        }
      }, this.typingTimeout);
    });

    // =========================================
    // 🔔 BROADCAST: Notificaciones
    // =========================================
    
    this.channel.on('broadcast', { event: 'notification' }, (payload) => {
      const notification = payload.payload;
      
      console.log('🔔 Notificación recibida:', notification.title);
      
      // Notificar al callback
      if (this.callbacks.onNotification) {
        this.callbacks.onNotification(notification);
      }
      
      // Registrar actividad
      this.logActivity('notification', notification.title, notification.metadata);
    });

    // =========================================
    // 🔗 SUSCRIBIRSE AL CANAL
    // =========================================
    
    await this.channel.subscribe(async (status) => {
      console.log('📡 Estado de suscripción:', status);
      
      if (status === 'SUBSCRIBED') {
        console.log('✅ Canal suscrito - anunciando presencia');
        this.updateConnectionStatus('connected');
        
        // 🔥 ANUNCIAR PRESENCIA (esto es lo clave)
        await this.channel.track({
          user: this.currentUser,
          online_at: new Date().toISOString(),
        });
        
        console.log('✅ Presencia anunciada:', this.currentUser.name);
        
        // 🔥 Inicializar Yjs CRDT
        this.initializeYjs();
        
        // Iniciar heartbeat
        this.startHeartbeat();
        
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error('❌ Error en canal:', status);
        this.updateConnectionStatus('disconnected');
        this.attemptReconnection(sessionId);
        
      } else if (status === 'CLOSED') {
        console.warn('🔌 Canal cerrado');
        this.updateConnectionStatus('disconnected');
        this.stopHeartbeat();
      }
    });

    return this.channel;
  }

  // =========================================
  // 📤 BROADCAST: Cambio en archivo
  // =========================================
  
  async broadcastFileChange(filePath, content, cursorPosition, version) {
    console.log('📡 broadcastFileChange llamado:', {
      hasChannel: !!this.channel,
      connectionStatus: this.connectionStatus,
      hasUser: !!this.currentUser,
      filePath,
      contentLength: content?.length
    });

    if (!this.channel || this.connectionStatus !== 'connected') {
      console.warn('⚠️ No se puede enviar - sin conexión:', {
        hasChannel: !!this.channel,
        status: this.connectionStatus
      });
      return;
    }

    if (!this.currentUser) {
      console.error('❌ No hay usuario actual');
      return;
    }

    const messageId = `${this.currentUser.id}-${filePath}-${Date.now()}`;
    
    // Actualizar cache
    this.fileCache[filePath] = content;

    const message = {
      type: 'broadcast',
      event: 'file-change',
      payload: {
        messageId,
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        userColor: this.currentUser.color,
        filePath,
        content, // Contenido completo (sistema legacy)
        cursorPosition,
        version,
        timestamp: Date.now(),
      },
    };

    console.log('📤 Enviando broadcast a Supabase...', {
      event: 'file-change',
      filePath,
      contentLength: content.length,
      version
    });

    try {
      const result = await this.channel.send(message);
      console.log('✅ Broadcast enviado exitosamente:', result);
      
      // Actualizar actividad en BD
      this.updateSessionActivity();
    } catch (error) {
      console.error('❌ Error al enviar cambio:', error);
      console.error('Stack:', error.stack);
    }
  }

  // =========================================
  // 🖱️ BROADCAST: Cursor con batching
  // =========================================
  
  async broadcastCursorMove(filePath, position, selection, version) {
    if (!this.channel || !this.currentUser) return;

    // Agregar al batch
    this.cursorBatch.push({
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userColor: this.currentUser.color,
      filePath,
      position,
      selection,
      version,
      timestamp: Date.now(),
    });

    // Enviar batch después del delay
    if (!this.cursorBatchTimer) {
      this.cursorBatchTimer = setTimeout(async () => {
        if (this.cursorBatch.length > 0) {
          // Enviar solo el último cursor (más reciente)
          const lastCursor = this.cursorBatch[this.cursorBatch.length - 1];
          
          try {
            await this.channel.send({
              type: 'broadcast',
              event: 'cursor-move',
              payload: lastCursor,
            });
          } catch (error) {
            console.error('Error al enviar cursor:', error);
          }
          
          this.cursorBatch = [];
        }
        this.cursorBatchTimer = null;
      }, this.cursorBatchDelay);
    }
  }

  // =========================================
  // 💓 HEARTBEAT
  // =========================================
  
  startHeartbeat() {
    if (this.heartbeatInterval) return;
    
    this.heartbeatInterval = setInterval(async () => {
      if (this.channel && this.currentUser) {
        try {
          // Actualizar presencia
          await this.channel.track({
            user: this.currentUser,
            online_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Error en heartbeat:', error);
        }
      }
    }, this.heartbeatFrequency);
    
    console.log('💓 Heartbeat iniciado');
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log('🛑 Heartbeat detenido');
    }
  }

  // =========================================
  // 🔄 RECONEXIÓN
  // =========================================
  
  async attemptReconnection(sessionId) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Máximo de reconexiones alcanzado');
      this.updateConnectionStatus('failed');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    console.log(`🔄 Reconexión ${this.reconnectAttempts}/${this.maxReconnectAttempts} en ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      if (this.channel) {
        // 🔧 FIX: Hacer untrack antes de unsubscribe para limpiar presence
        console.log('🧹 Limpiando presence antiguo antes de reconectar...');
        try {
          await this.channel.untrack();
        } catch (e) {
          console.warn('⚠️ No se pudo hacer untrack:', e.message);
        }
        
        await this.channel.unsubscribe();
        this.channel = null;
      }
      
      await this.connectToChannel(sessionId);
      this.reconnectAttempts = 0;
      console.log('✅ Reconexión exitosa');
    } catch (error) {
      console.error('❌ Error en reconexión:', error);
      this.attemptReconnection(sessionId);
    }
  }

  // =========================================
  // 🔧 UTILIDADES
  // =========================================
  
  updateConnectionStatus(status) {
    const previousStatus = this.connectionStatus;
    this.connectionStatus = status;
    
    if (this.callbacks.onConnectionStatusChange) {
      this.callbacks.onConnectionStatusChange({
        status,
        previousStatus,
        reconnectAttempts: this.reconnectAttempts,
      });
    }
  }

  isMessageProcessed(messageId) {
    if (this.processedMessages.has(messageId)) {
      return true;
    }
    this.processedMessages.add(messageId);
    
    // Limpiar mensajes antiguos
    if (this.processedMessages.size > 1000) {
      const toDelete = Array.from(this.processedMessages).slice(0, 500);
      toDelete.forEach(id => this.processedMessages.delete(id));
    }
    
    return false;
  }

  generateUserColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
      '#F8B739', '#52B788', '#EF476F', '#06FFA5'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  saveSessionToStorage() {
    if (this.currentSession && this.currentUser) {
      localStorage.setItem('collaboration_session', JSON.stringify({
        session: this.currentSession,
        user: this.currentUser,
      }));
    }
  }

  async restoreSessionFromStorage() {
    const stored = localStorage.getItem('collaboration_session');
    if (!stored) return null;

    try {
      const { session, user } = JSON.parse(stored);
      this.currentSession = session;
      this.currentUser = user;
      
      await this.connectToChannel(session.id);
      return { session, user };
    } catch (error) {
      console.error('Error al restaurar sesión:', error);
      localStorage.removeItem('collaboration_session');
      return null;
    }
  }

  async updateSessionActivity() {
    if (!this.currentSession?.dbId || this.currentUser?.role !== 'owner') return;
    
    try {
      await this.supabase
        .from('collaboration_sessions')
        .update({
          last_activity_at: new Date().toISOString(),
          total_edits: this.supabase.sql`total_edits + 1`,
        })
        .eq('id', this.currentSession.dbId);
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
    }
  }

  // =========================================
  // 🔥 MÉTODOS YJS CRDT
  // =========================================
  
  initializeYjs() {
    if (!this.channel) {
      console.warn('⚠️ No se puede inicializar Yjs sin canal');
      return;
    }

    console.log('🔥 Inicializando Yjs CRDT...');

    // Crear documento compartido
    this.ydoc = new Y.Doc();
    
    // Crear texto compartido para el editor actual
    this.ytext = this.ydoc.getText('monaco');
    
    // Crear Map para todos los archivos
    this.yfiles = this.ydoc.getMap('files');
    
    // Crear awareness para cursores y presencia
    const awareness = new Y.Awareness(this.ydoc);
    awareness.setLocalState({
      user: this.currentUser,
      cursor: null,
      selection: null,
    });

    // Crear provider que conecta Yjs con Supabase
    this.yjsProvider = new YjsSupabaseProvider(
      this.ydoc,
      this.channel,
      awareness
    );

    console.log('✅ Yjs CRDT inicializado');
  }

  /**
   * Obtener documento Yjs
   */
  getYDoc() {
    return this.ydoc;
  }

  /**
   * Obtener texto compartido actual (para Monaco binding)
   */
  getYText() {
    return this.ytext;
  }

  /**
   * Obtener Map de archivos compartidos
   */
  getYFiles() {
    return this.yfiles;
  }

  /**
   * Cambiar archivo activo (crea/obtiene YText para ese archivo)
   */
  setActiveFile(filePath) {
    if (!this.ydoc || !this.yfiles) {
      console.warn('⚠️ Yjs no inicializado');
      return null;
    }

    // Obtener o crear YText para este archivo
    let fileText = this.yfiles.get(filePath);
    if (!fileText) {
      fileText = new Y.Text();
      this.yfiles.set(filePath, fileText);
      console.log('📄 Archivo Yjs creado:', filePath);
    }

    // Actualizar referencia actual
    this.ytext = fileText;
    
    return fileText;
  }

  // =========================================
  // 💾 PERSISTENCIA
  // =========================================

  async setProjectState(files, images = []) {
    if (!this.currentSession?.dbId || this.currentUser?.role !== 'owner') return;
    
    try {
      await this.supabase
        .from('collaboration_sessions')
        .update({
          project_state: { files, images },
          updated_at: new Date().toISOString(),
        })
        .eq('id', this.currentSession.dbId);
      
      console.log('💾 Estado guardado en BD');
    } catch (error) {
      console.error('Error al guardar estado:', error);
    }
  }

  // =========================================
  // 🔐 CAMBIAR PERMISOS DE USUARIO
  // =========================================
  
  async changeUserPermissions(userId, newRole) {
    if (!this.channel || !this.currentUser || this.currentUser.role !== 'owner') {
      console.warn('⚠️ Solo el propietario puede cambiar permisos');
      return;
    }

    console.log('🔐 Cambiando permisos:', { userId, newRole });

    // Broadcast a todos los usuarios del cambio
    await this.channel.send({
      type: 'broadcast',
      event: 'permission-change',
      payload: {
        userId,
        newRole,
        timestamp: Date.now(),
      },
    });

    // Si es el propio usuario, actualizar su presencia
    if (userId === this.currentUser.id) {
      this.currentUser.role = newRole;
      await this.channel.track({
        user: this.currentUser,
        online_at: new Date().toISOString(),
      });
    }

    console.log('✅ Cambio de permisos enviado');
  }

  // =========================================
  // 💬 CHAT EN TIEMPO REAL
  // =========================================
  
  /**
   * Enviar mensaje al chat
   */
  async sendChatMessage(message, messageType = 'text') {
    if (!this.channel || !this.currentUser) {
      console.warn('⚠️ No se puede enviar mensaje - sin canal o usuario');
      return;
    }

    const chatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userColor: this.currentUser.color,
      message,
      messageType,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
    };

    // Broadcast a todos los usuarios
    await this.channel.send({
      type: 'broadcast',
      event: 'chat-message',
      payload: chatMessage
    });

    console.log('💬 Mensaje de chat enviado:', message.substring(0, 50));
    
    // Registrar actividad
    this.logActivity('chat_message', `${this.currentUser.name} envió un mensaje`);
  }

  /**
   * Indicar que el usuario está escribiendo
   */
  async broadcastTyping(isTyping = true) {
    if (!this.channel || !this.currentUser) return;

    await this.channel.send({
      type: 'broadcast',
      event: 'user-typing',
      payload: {
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        isTyping,
        timestamp: Date.now(),
      }
    });
  }

  // =========================================
  // 🔔 NOTIFICACIONES
  // =========================================
  
  /**
   * Enviar notificación al equipo
   */
  async sendNotification(type, title, message, metadata = {}) {
    if (!this.channel) return;

    const notification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      metadata,
      timestamp: Date.now(),
    };

    await this.channel.send({
      type: 'broadcast',
      event: 'notification',
      payload: notification
    });

    console.log('🔔 Notificación enviada:', title);
  }

  // =========================================
  // 📊 ACTIVIDAD Y REGISTRO
  // =========================================
  
  /**
   * Registrar actividad
   */
  logActivity(activityType, description, metadata = {}) {
    const activity = {
      id: `act-${Date.now()}`,
      type: activityType,
      description,
      userId: this.currentUser?.id,
      userName: this.currentUser?.name,
      timestamp: Date.now(),
      metadata,
    };

    this.activityLog.push(activity);
    
    // Mantener solo las últimas 100 actividades
    if (this.activityLog.length > 100) {
      this.activityLog = this.activityLog.slice(-100);
    }

    // Notificar a los listeners
    if (this.callbacks.onActivity) {
      this.callbacks.onActivity(activity);
    }
  }

  /**
   * Obtener log de actividades
   */
  getActivityLog() {
    return this.activityLog;
  }

  async leaveSession() {
    // 🔥 Destruir Yjs provider
    if (this.yjsProvider) {
      this.yjsProvider.destroy();
      this.yjsProvider = null;
    }
    this.ydoc = null;
    this.ytext = null;
    this.yfiles = null;
    
    if (this.channel) {
      // Anunciar salida con untrack
      await this.channel.untrack();
      await this.channel.unsubscribe();
      this.channel = null;
    }
    
    this.stopHeartbeat();
    this.currentSession = null;
    this.currentUser = null;
    this.connectionStatus = 'disconnected';
    
    localStorage.removeItem('collaboration_session');
  }

  getCurrentSession() {
    return this.currentSession;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  on(event, callback) {
    const eventMap = {
      'fileChange': 'onFileChange',
      'usersChanged': 'onUsersChanged',
      'cursorMove': 'onCursorMove',
      'connectionStatusChange': 'onConnectionStatusChange',
      'projectState': 'onProjectState',
      'chatMessage': 'onChatMessage', // 💬 Chat
      'notification': 'onNotification', // 🔔 Notificaciones
      'activity': 'onActivity', // 📊 Actividad
      'typingIndicator': 'onTypingIndicator', // ✍️ Escribiendo
    };
    
    const callbackName = eventMap[event];
    if (callbackName) {
      this.callbacks[callbackName] = callback;
    }
  }

  /**
   * Obtener mensajes de chat
   */
  getChatMessages() {
    return this.chatMessages;
  }
}

// Exportar instancia única
const collaborationServiceV2 = new CollaborationServiceV2();
export default collaborationServiceV2;
