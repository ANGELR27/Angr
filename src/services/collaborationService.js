import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import databaseService from './databaseService';
import diffService from './diffService';

// IMPORTANTE: El usuario debe configurar sus propias credenciales de Supabase
// Crear un proyecto en https://supabase.com y obtener URL y anon key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key-aqui';

class CollaborationService {
  constructor() {
    this.supabase = null;
    this.currentSession = null;
    this.currentUser = null;
    this.channel = null;
    this.callbacks = {
      onFileChange: null,
      onUserJoined: null,
      onUserLeft: null,
      onCursorMove: null,
      onAccessChanged: null,
      onProjectState: null,
      onConnectionStatusChange: null,
    };
    
    // 🚀 Sistema robusto de reconexión
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isReconnecting = false;
    this.connectionStatus = 'disconnected'; // disconnected, connecting, connected
    
    // 🔥 NUEVO: Cache de contenidos para diffs
    this.fileCache = {};
    
    // 🔄 Buffer para cambios offline
    this.offlineBuffer = [];
    this.maxBufferSize = 100;
    
    // 💓 Heartbeat REFORZADO para detectar desconexiones
    this.heartbeatInterval = null;
    this.heartbeatFrequency = 10000; // 10 segundos (más frecuente)
    this.lastHeartbeat = Date.now();
    this.keepAliveInterval = null; // Ping adicional cada 5s
    
    // 🎯 Control de cambios duplicados mejorado
    this.processedMessages = new Set();
    this.messageExpirationTime = 60000; // 1 minuto
    
    // Inicializar solo si hay credenciales válidas
    if (SUPABASE_URL !== 'https://tu-proyecto.supabase.co' && SUPABASE_ANON_KEY !== 'tu-anon-key-aqui') {
      this.initializeSupabase();
    }
  }

  initializeSupabase() {
    try {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        realtime: {
          params: {
            eventsPerSecond: 100, // Mayor throughput
          },
        },
        auth: {
          persistSession: false,
        },
      });
      console.log('✅ Supabase inicializado con configuración optimizada');
    } catch (error) {
      console.error('❌ Error al inicializar Supabase:', error);
    }
  }

  // Crear una nueva sesión de colaboración
  async createSession(sessionData) {
    if (!this.supabase) {
      throw new Error('Supabase no está configurado. Verifica que las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configuradas correctamente.');
    }

    // Validación robusta de datos de entrada
    if (!sessionData) {
      throw new Error('Los datos de la sesión son requeridos');
    }

    if (!sessionData.userName || sessionData.userName.trim().length === 0) {
      throw new Error('El nombre de usuario es requerido');
    }

    if (sessionData.userName.trim().length > 50) {
      throw new Error('El nombre de usuario no puede exceder 50 caracteres');
    }

    if (sessionData.sessionName && sessionData.sessionName.length > 100) {
      throw new Error('El nombre de la sesión no puede exceder 100 caracteres');
    }

    // ID más corto (5 caracteres) para facilitar compartir
    const sessionId = uuidv4().substring(0, 5);
    const userId = uuidv4();
    
    this.currentUser = {
      id: userId,
      name: sessionData.userName || 'Usuario Anónimo',
      color: this.generateUserColor(),
      role: 'owner',
    };

    this.currentSession = {
      id: sessionId,
      name: sessionData.sessionName || 'Sesión de Código',
      owner: userId,
      users: [this.currentUser],
      accessControl: sessionData.accessControl || 'public', // public, private, invite-only
      password: sessionData.password || null,
      createdAt: new Date().toISOString(),
      files: sessionData.files || {}, // Guardar estructura de archivos inicial
      images: sessionData.images || [], // Guardar imágenes
    };

    // 🔥 NUEVO: Guardar sesión en base de datos
    try {
      console.log('💾 Guardando sesión en BD...');
      const dbSession = await databaseService.createSession({
        sessionCode: sessionId,
        sessionName: sessionData.sessionName || 'Sesión de Código',
        ownerUserId: userId,
        ownerName: this.currentUser.name,
        accessControl: sessionData.accessControl || 'public',
        passwordHash: sessionData.password || null,
      });
      
      this.currentSession.dbId = dbSession.id;
      console.log('✅ Sesión guardada en BD:', dbSession.id);
    } catch (error) {
      console.error('❌ Error guardando sesión en BD:', error);
      // Continuar sin BD (fallback a modo local)
    }

    // Conectar al canal de Supabase Realtime
    await this.connectToChannel(sessionId);

    // Anunciar que el creador está en línea (útil para cuando otros se unan después)
    await this.broadcastUserJoined();

    // Guardar sesión en localStorage para persistencia
    this.saveSessionToStorage();

    // Intentar obtener la URL pública de ngrok
    let publicUrl = window.location.origin;
    
    // Si la URL actual ya es de ngrok, usarla
    if (window.location.hostname.includes('ngrok')) {
      publicUrl = window.location.origin;
    }
    // Si estamos en localhost, intentar obtener URL de ngrok desde archivo
    else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        const response = await fetch('/api/ngrok-url').catch(() => null);
        if (response && response.ok) {
          const data = await response.json();
          if (data.url) {
            publicUrl = data.url;
          }
        }
      } catch (e) {
        // Si falla, usar window.location.origin (localhost)
        console.warn('No se pudo obtener URL pública de ngrok, usando localhost');
      }
    }
    
    return {
      sessionId,
      userId,
      shareLink: `${publicUrl}?session=${sessionId}`,
    };
  }

  // Unirse a una sesión existente
  async joinSession(sessionId, userData) {
    if (!this.supabase) {
      throw new Error('Supabase no está configurado. Verifica que las variables de entorno estén configuradas correctamente.');
    }

    // Validación de datos
    if (!sessionId || sessionId.trim().length === 0) {
      throw new Error('El ID de sesión es requerido');
    }

    if (!userData || !userData.userName || userData.userName.trim().length === 0) {
      throw new Error('El nombre de usuario es requerido para unirse');
    }

    if (userData.userName.trim().length > 50) {
      throw new Error('El nombre de usuario no puede exceder 50 caracteres');
    }

    const userId = uuidv4();
    
    this.currentUser = {
      id: userId,
      name: userData.userName || 'Usuario Anónimo',
      color: this.generateUserColor(),
      role: 'viewer', // owner, editor, viewer
    };

    // Conectar al canal
    await this.connectToChannel(sessionId);

    // Notificar que el usuario se unió
    await this.broadcastUserJoined();

    // Guardar sesión en localStorage para persistencia
    this.saveSessionToStorage();

    return { userId, sessionId };
  }

  // 🚀 Conectar al canal con reconexión automática
  async connectToChannel(sessionId) {
    if (!this.supabase) return;

    // Actualizar estado de conexión
    this.connectionStatus = 'connecting';
    if (this.callbacks.onConnectionStatusChange) {
      this.callbacks.onConnectionStatusChange({
        status: 'connecting',
        previousStatus: this.connectionStatus,
        reconnectAttempts: this.reconnectAttempts,
      });
    }

    this.channel = this.supabase.channel(`session:${sessionId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: this.currentUser?.id },
      },
    });

    // Escuchar cambios en archivos (con detección de duplicados)
    this.channel.on('broadcast', { event: 'file-change' }, (payload) => {
      const data = payload.payload;
      
      console.log('🎯 Diff recibido:', {
        event: 'file-change',
        messageId: data.messageId,
        fromUserId: data.userId,
        currentUserId: this.currentUser?.id,
        isSameUser: data.userId === this.currentUser?.id,
        filePath: data.filePath,
        diffType: data.diffData?.type,
        diffSize: data.diffData?.size,
        hasCallback: !!this.callbacks.onFileChange
      });
      
      // Ignorar mensajes propios
      if (data.userId === this.currentUser?.id) {
        console.log('⏸️ Es mi propio mensaje - ignorar');
        return;
      }
      
      // Detectar y evitar duplicados
      if (data.messageId && this.isMessageProcessed(data.messageId)) {
        console.log('⏸️ Mensaje duplicado detectado - ignorar');
        return;
      }
      
      if (this.callbacks.onFileChange) {
        // 🔥 APLICAR DIFF recibido
        const oldContent = this.fileCache[data.filePath] || '';
        const newContent = diffService.applyDiff(oldContent, data.diffData);
        
        // Verificar integridad si hay hash
        if (data.contentHash) {
          const isValid = diffService.verifyIntegrity(oldContent, newContent, data.contentHash);
          if (!isValid) {
            console.error('❌ Error de integridad - hash no coincide');
            // TODO: Solicitar contenido completo
            return;
          }
        }
        
        // Actualizar cache
        this.fileCache[data.filePath] = newContent;
        
        console.log('📞 Llamando callback onFileChange con contenido aplicado...');
        this.callbacks.onFileChange({
          ...data,
          content: newContent, // 🔥 Contenido reconstruido
        });
      } else {
        console.warn('⚠️ No hay callback registrado para onFileChange');
      }
    });

    // Escuchar usuarios que se unen
    this.channel.on('broadcast', { event: 'user-joined' }, (payload) => {
      if (this.callbacks.onUserJoined && payload.payload.id !== this.currentUser?.id) {
        this.callbacks.onUserJoined(payload.payload);
      }
    });

    // Responder a solicitudes de lista de usuarios MEJORADO
    this.channel.on('broadcast', { event: 'request-user-list' }, async (payload) => {
      console.log('📢 Solicitud de lista recibida de:', payload.payload.requesterId);
      console.log('👤 Mi ID:', this.currentUser?.id);
      
      // Si alguien pide la lista, respondo con mi información
      if (this.currentUser && payload.payload.requesterId !== this.currentUser.id) {
        console.log('✅ Respondiendo con mi información a:', payload.payload.requesterId);
        
        // Responder con delay aleatorio para evitar colisiones
        const delay = Math.random() * 500; // 0-500ms
        setTimeout(async () => {
          try {
            await this.channel.send({
              type: 'broadcast',
              event: 'user-response',
              payload: {
                ...this.currentUser,
                timestamp: Date.now(),
                respondingTo: payload.payload.requesterId
              }
            });
            console.log('📤 Respuesta enviada exitosamente');
          } catch (error) {
            console.error('❌ Error al enviar respuesta:', error);
          }
        }, delay);
      } else {
        console.log('⏸️ No respondo (es mi propia solicitud o no hay usuario)');
      }
    });

    // Recibir respuestas de otros usuarios MEJORADO
    this.channel.on('broadcast', { event: 'user-response' }, (payload) => {
      console.log('📥 Respuesta de usuario recibida:', {
        userName: payload.payload.name,
        userId: payload.payload.id,
        respondingTo: payload.payload.respondingTo,
        myId: this.currentUser?.id
      });
      
      if (this.callbacks.onUserJoined && payload.payload.id !== this.currentUser?.id) {
        console.log('✅ Agregando usuario a la lista:', payload.payload.name);
        this.callbacks.onUserJoined(payload.payload);
      } else {
        console.log('⏸️ No agregar (es mi propio usuario o no hay callback)');
      }
    });

    // Escuchar usuarios que se van
    this.channel.on('broadcast', { event: 'user-left' }, (payload) => {
      if (this.callbacks.onUserLeft) {
        this.callbacks.onUserLeft(payload.payload);
      }
    });

    // Escuchar movimientos de cursor
    this.channel.on('broadcast', { event: 'cursor-move' }, (payload) => {
      console.log('📍 Cursor remoto recibido:', {
        userName: payload.payload.userName,
        filePath: payload.payload.filePath,
        position: payload.payload.position,
        isMyOwn: payload.payload.userId === this.currentUser?.id
      });
      
      if (this.callbacks.onCursorMove && payload.payload.userId !== this.currentUser?.id) {
        console.log('✅ Procesando cursor remoto de', payload.payload.userName);
        this.callbacks.onCursorMove(payload.payload);
      } else if (payload.payload.userId === this.currentUser?.id) {
        console.log('⏸️ Ignorando mi propio cursor');
      }
    });

    // Escuchar cambios de permisos
    this.channel.on('broadcast', { event: 'access-changed' }, (payload) => {
      if (this.callbacks.onAccessChanged) {
        this.callbacks.onAccessChanged(payload.payload);
      }
    });

    // Solicitud de sincronización de proyecto
    this.channel.on('broadcast', { event: 'request-project-state' }, async (payload) => {
      // Si soy el owner y alguien solicita el estado, lo envío
      if (this.currentUser?.role === 'owner' && payload.payload.requesterId !== this.currentUser.id) {
        await this.broadcastProjectState();
      }
    });

    // Recibir el estado del proyecto
    this.channel.on('broadcast', { event: 'project-state' }, (payload) => {
      if (this.callbacks.onProjectState && payload.payload.fromUserId !== this.currentUser?.id) {
        this.callbacks.onProjectState(payload.payload);
      }
    });

    // Suscribirse al canal con manejo de estados
    await this.channel.subscribe((status) => {
      console.log('📡 Estado de conexión:', status);
      
      if (status === 'SUBSCRIBED') {
        console.log('✅ Conectado a la sesión colaborativa');
        this.connectionStatus = 'connected';
        this.reconnectAttempts = 0;
        
        if (this.callbacks.onConnectionStatusChange) {
          this.callbacks.onConnectionStatusChange({
            status: 'connected',
            previousStatus: this.connectionStatus,
            reconnectAttempts: 0,
          });
        }
        
        if (this.startHeartbeat) this.startHeartbeat();
        if (this.flushOfflineBuffer) this.flushOfflineBuffer();
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Error en el canal');
        this.connectionStatus = 'disconnected';
        
        if (this.callbacks.onConnectionStatusChange) {
          this.callbacks.onConnectionStatusChange({
            status: 'disconnected',
            previousStatus: 'connected',
            reconnectAttempts: this.reconnectAttempts,
          });
        }
        
        if (this.attemptReconnection) this.attemptReconnection(sessionId);
      } else if (status === 'TIMED_OUT') {
        console.warn('⏰ Timeout de conexión');
        this.connectionStatus = 'disconnected';
        
        if (this.attemptReconnection) this.attemptReconnection(sessionId);
      } else if (status === 'CLOSED') {
        console.warn('🔌 Canal cerrado');
        this.connectionStatus = 'disconnected';
        
        if (this.stopHeartbeat) this.stopHeartbeat();
      }
    });

    // Rastrear presencia de usuarios
    this.channel.on('presence', { event: 'sync' }, () => {
      const state = this.channel.presenceState();
      console.log('Usuarios en línea:', state);
    });

    return this.channel;
  }

  // 🚀 Actualizar estado de conexión
  updateConnectionStatus(status) {
    const previousStatus = this.connectionStatus;
    this.connectionStatus = status;
    
    console.log(`📡 Conexión: ${previousStatus} → ${status}`);
    
    if (this.callbacks.onConnectionStatusChange) {
      this.callbacks.onConnectionStatusChange({
        status,
        previousStatus,
        reconnectAttempts: this.reconnectAttempts,
      });
    }
  }

  // 🔄 Intentar reconexión automática
  async attemptReconnection(sessionId) {
    if (this.isReconnecting || this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Máximo de intentos de reconexión alcanzado');
        this.connectionStatus = 'failed';
        
        if (this.callbacks.onConnectionStatusChange) {
          this.callbacks.onConnectionStatusChange({
            status: 'failed',
            previousStatus: 'disconnected',
            reconnectAttempts: this.reconnectAttempts,
          });
        }
      }
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;
    
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
    console.log(`🔄 Intento de reconexión ${this.reconnectAttempts}/${this.maxReconnectAttempts} en ${delay}ms...`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      // Desconectar canal anterior
      if (this.channel) {
        await this.channel.unsubscribe();
        this.channel = null;
      }
      
      // Reconectar
      await this.connectToChannel(sessionId);
      
      // Reenviar información de usuario
      if (this.currentUser) {
        await this.broadcastUserJoined();
      }
      
      console.log('✅ Reconexión exitosa');
    } catch (error) {
      console.error('❌ Error en reconexión:', error);
      this.isReconnecting = false;
      this.attemptReconnection(sessionId);
    }
    
    this.isReconnecting = false;
  }

  // 💓 Iniciar heartbeat REFORZADO para detectar desconexiones
  startHeartbeat() {
    if (this.stopHeartbeat) this.stopHeartbeat(); // Limpiar cualquier heartbeat previo
    
    // Heartbeat principal cada 10 segundos
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastHeartbeat = now - this.lastHeartbeat;
      
      if (timeSinceLastHeartbeat > this.heartbeatFrequency * 2) {
        console.warn('⚠️ Heartbeat perdido - RECONECTANDO automáticamente');
        this.connectionStatus = 'unstable';
        
        if (this.callbacks.onConnectionStatusChange) {
          this.callbacks.onConnectionStatusChange({
            status: 'unstable',
            previousStatus: 'connected',
            reconnectAttempts: this.reconnectAttempts,
          });
        }
        
        // 🔥 RECONEXIÓN AUTOMÁTICA AGRESIVA
        if (this.currentSession) {
          console.log('🔄 Intentando reconexión automática...');
          this.attemptReconnection(this.currentSession.id);
        }
      }
      
      // Enviar heartbeat
      if (this.channel && this.currentUser) {
        this.channel.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: {
            userId: this.currentUser.id,
            timestamp: now,
          },
        }).then(() => {
          this.lastHeartbeat = now;
          // Resetear a connected si estaba unstable
          if (this.connectionStatus === 'unstable') {
            console.log('✅ Conexión restaurada');
            this.connectionStatus = 'connected';
          }
        }).catch((error) => {
          console.error('❌ Error al enviar heartbeat:', error);
          // Intentar reconectar si falla 3 veces seguidas
          this.reconnectAttempts++;
          if (this.reconnectAttempts >= 3 && this.currentSession) {
            console.log('🔄 3 fallos consecutivos - reconectando...');
            this.attemptReconnection(this.currentSession.id);
          }
        });
      }
    }, this.heartbeatFrequency);
    
    // 🔥 Keep-alive ADICIONAL cada 5 segundos para mantener canal vivo
    this.keepAliveInterval = setInterval(() => {
      if (this.channel && this.currentUser) {
        this.channel.send({
          type: 'broadcast',
          event: 'ping',
          payload: { userId: this.currentUser.id, timestamp: Date.now() },
        }).catch(() => {
          // Silencioso, solo para mantener conexión
        });
      }
    }, 5000); // Ping cada 5 segundos
    
    console.log('💓 Heartbeat REFORZADO iniciado (10s + keep-alive 5s)');
  }

  // 🛑 Detener heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    console.log('🛑 Heartbeat y keep-alive detenidos');
  }

  // 📦 Vaciar buffer de cambios offline
  async flushOfflineBuffer() {
    if (this.offlineBuffer.length === 0) return;
    
    console.log(`📤 Enviando ${this.offlineBuffer.length} cambios del buffer offline...`);
    
    const buffer = [...this.offlineBuffer];
    this.offlineBuffer = [];
    
    for (const message of buffer) {
      try {
        await this.channel.send(message);
        await new Promise(resolve => setTimeout(resolve, 50)); // Pequeño delay entre mensajes
      } catch (error) {
        console.error('❌ Error al enviar mensaje del buffer:', error);
        // Volver a agregar al buffer si falla
        if (this.offlineBuffer.length < this.maxBufferSize) {
          this.offlineBuffer.push(message);
        }
      }
    }
    
    console.log('✅ Buffer offline vaciado');
  }

  // 🎯 Verificar si un mensaje ya fue procesado (evitar duplicados)
  isMessageProcessed(messageId) {
    if (this.processedMessages.has(messageId)) {
      return true;
    }
    
    this.processedMessages.add(messageId);
    
    // Limpiar mensajes antiguos
    if (this.processedMessages.size > 1000) {
      const messagesToDelete = Array.from(this.processedMessages).slice(0, 500);
      messagesToDelete.forEach(id => this.processedMessages.delete(id));
    }
    
    return false;
  }

  // 🚀 Transmitir cambio en archivo (mejorado con buffer offline)
  async broadcastFileChange(filePath, content, cursorPosition, version) {
    console.log('📡 broadcastFileChange llamado con DIFF:', {
      hasChannel: !!this.channel,
      hasUser: !!this.currentUser,
      filePath,
      contentLength: content?.length,
      connectionStatus: this.connectionStatus
    });
    
    if (!this.currentUser) {
      console.error('❌ NO se puede enviar - falta usuario');
      return;
    }

    // 🔥 CALCULAR DIFF en lugar de enviar contenido completo
    const oldContent = this.fileCache[filePath] || '';
    const diffData = diffService.calculateDiff(oldContent, content);
    
    console.log('📊 Diff calculado:', {
      type: diffData.type,
      size: diffData.size,
      originalSize: content.length,
      savings: content.length > 0 ? `${Math.round((1 - diffData.size / content.length) * 100)}%` : '0%'
    });

    // Actualizar cache
    this.fileCache[filePath] = content;

    // Generar hash para verificación de integridad
    const contentHash = diffService.generateHash(content);

    // Generar ID único para el mensaje
    const messageId = `${this.currentUser.id}-${filePath}-${Date.now()}`;

    const message = {
      type: 'broadcast',
      event: 'file-change',
      payload: {
        messageId,
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        userColor: this.currentUser.color,
        filePath,
        diffData, // 🔥 En lugar de content completo
        contentHash, // 🔥 Para verificar integridad
        cursorPosition,
        version: typeof version === 'number' ? version : undefined,
        timestamp: Date.now(),
      }
    };
    
    // 🔌 DEBUG: Verificar estado de conexión
    console.log('🔌 Estado de conexión:', {
      hasChannel: !!this.channel,
      connectionStatus: this.connectionStatus,
      willBuffer: !this.channel || this.connectionStatus !== 'connected'
    });
    
    // Si no hay canal o está desconectado, agregar al buffer
    if (!this.channel || this.connectionStatus !== 'connected') {
      console.warn('⚠️ Sin conexión - agregando al buffer offline', {
        hasChannel: !!this.channel,
        status: this.connectionStatus
      });
      
      if (this.offlineBuffer.length < this.maxBufferSize) {
        this.offlineBuffer.push(message);
        console.log(`📦 Buffer offline: ${this.offlineBuffer.length}/${this.maxBufferSize}`);
      } else {
        console.error('❌ Buffer lleno - descartando mensaje antiguo');
        this.offlineBuffer.shift(); // Eliminar el más antiguo
        this.offlineBuffer.push(message);
      }
      return;
    }
    
    console.log('📤 Enviando a Supabase Realtime:', message.payload);
    
    try {
      await this.channel.send(message);
      console.log('✅ Mensaje enviado exitosamente a Supabase');
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      
      // Agregar al buffer si falla el envío
      if (this.offlineBuffer.length < this.maxBufferSize) {
        this.offlineBuffer.push(message);
        console.log('📦 Mensaje agregado al buffer para reintento');
      }
    }
  }

  // Transmitir movimiento de cursor
  async broadcastCursorMove(filePath, position, selection, version) {
    if (!this.channel || !this.currentUser) {
      console.warn('⚠️ No se puede enviar cursor - falta channel o usuario');
      return;
    }

    console.log('📍 Enviando cursor a Supabase:', {
      userName: this.currentUser.name,
      filePath,
      position,
      hasSelection: !!selection
    });

    await this.channel.send({
      type: 'broadcast',
      event: 'cursor-move',
      payload: {
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        userColor: this.currentUser.color,
        filePath,
        position,
        selection,
        version: typeof version === 'number' ? version : undefined,
        timestamp: Date.now(),
      },
    });
  }

  // 🔥 Notificar que un usuario se unió - REFORZADO con reintentos
  async broadcastUserJoined() {
    if (!this.channel || !this.currentUser) return;

    console.log('👋 Anunciando mi llegada:', this.currentUser.name);

    // 1. Anunciar mi llegada a todos
    try {
      await this.channel.send({
        type: 'broadcast',
        event: 'user-joined',
        payload: this.currentUser,
      });
      console.log('✅ Anuncio de llegada enviado');
    } catch (error) {
      console.error('❌ Error al anunciar llegada:', error);
    }

    // 2. Solicitar lista de usuarios existentes CON REINTENTOS
    const requestUserList = async (attempt = 1, maxAttempts = 3) => {
      try {
        console.log(`📢 Solicitando lista de usuarios (intento ${attempt}/${maxAttempts})`);
        
        await this.channel.send({
          type: 'broadcast',
          event: 'request-user-list',
          payload: {
            requesterId: this.currentUser.id,
            timestamp: Date.now(),
            attempt
          }
        });
        
        console.log('✅ Solicitud de lista enviada');
        
        // Reenviar después de 1 segundo si no es el último intento
        if (attempt < maxAttempts) {
          setTimeout(() => {
            requestUserList(attempt + 1, maxAttempts);
          }, 1000 * attempt); // 1s, 2s, 3s
        }
      } catch (error) {
        console.error(`❌ Error al solicitar lista (intento ${attempt}):`, error);
        
        // Reintentar si hay error
        if (attempt < maxAttempts) {
          setTimeout(() => {
            requestUserList(attempt + 1, maxAttempts);
          }, 1000);
        }
      }
    };

    // Iniciar solicitud con reintentos
    await requestUserList(1, 3);
  }

  // Notificar que un usuario se fue
  async broadcastUserLeft() {
    if (!this.channel || !this.currentUser) return;

    await this.channel.send({
      type: 'broadcast',
      event: 'user-left',
      payload: {
        userId: this.currentUser.id,
        userName: this.currentUser.name,
      },
    });
  }

  // Guardar y transmitir el estado del proyecto
  async setProjectState(files, images = []) {
    if (!this.currentSession) return;
    
    this.currentSession.files = files;
    this.currentSession.images = images;

    // Guardar en Supabase Storage (persistente y sin límite)
    if (this.supabase && this.currentUser?.role === 'owner') {
      try {
        // Guardar estado en tabla de sesiones
        const { error } = await this.supabase
          .from('collaboration_sessions')
          .upsert({
            session_id: this.currentSession.id,
            project_state: {
              files: files,
              images: images,
              updated_at: new Date().toISOString()
            },
            owner_id: this.currentUser.id,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'session_id'
          });

        if (!error) {
          console.log('☁️ Proyecto guardado en Supabase');
        } else {
          console.warn('⚠️ Error al guardar en Supabase:', error.message);
          // Fallback a localStorage
          localStorage.setItem('collaboration_project_files', JSON.stringify(files));
        }
      } catch (e) {
        console.warn('⚠️ Supabase no disponible, usando localStorage');
        localStorage.setItem('collaboration_project_files', JSON.stringify(files));
      }
    } else {
      // Fallback a localStorage si no hay Supabase
      if (this.currentUser?.role === 'owner') {
        localStorage.setItem('collaboration_project_files', JSON.stringify(files));
        console.log('💾 Archivos guardados en localStorage (fallback)');
      }
    }
  }

  // Cargar estado del proyecto desde Supabase
  async loadProjectStateFromDatabase(sessionId) {
    if (!this.supabase) return null;

    try {
      const { data, error } = await this.supabase
        .from('collaboration_sessions')
        .select('project_state')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        console.warn('⚠️ No se pudo cargar de Supabase:', error.message);
        return null;
      }

      if (data && data.project_state) {
        console.log('☁️ Estado del proyecto cargado desde Supabase');
        return data.project_state;
      }

      return null;
    } catch (e) {
      console.warn('⚠️ Error al cargar desde Supabase:', e);
      return null;
    }
  }

  // Solicitar el estado del proyecto (cuando te unes)
  async requestProjectState() {
    if (!this.channel || !this.currentUser) return;

    // Primero intentar cargar desde Supabase
    if (this.supabase && this.currentSession) {
      const projectState = await this.loadProjectStateFromDatabase(this.currentSession.id);
      if (projectState && this.callbacks.onProjectState) {
        console.log('📦 Aplicando estado desde Supabase directamente');
        this.callbacks.onProjectState({
          fromUserId: 'database',
          files: projectState.files,
          images: projectState.images,
          timestamp: Date.now()
        });
        return; // Ya tenemos el estado, no necesitamos pedirlo
      }
    }

    // Si no hay en Supabase, pedir al owner por broadcast
    await this.channel.send({
      type: 'broadcast',
      event: 'request-project-state',
      payload: {
        requesterId: this.currentUser.id,
        timestamp: Date.now()
      }
    });
  }

  // Transmitir el estado completo del proyecto (cuando eres owner)
  async broadcastProjectState() {
    if (!this.channel || !this.currentUser || !this.currentSession) return;

    await this.channel.send({
      type: 'broadcast',
      event: 'project-state',
      payload: {
        fromUserId: this.currentUser.id,
        files: this.currentSession.files,
        images: this.currentSession.images,
        timestamp: Date.now()
      }
    });
  }

  // Cambiar permisos de un usuario
  async changeUserPermissions(userId, newRole) {
    if (!this.channel || !this.currentUser) return;
    if (this.currentUser.role !== 'owner') {
      throw new Error('Solo el propietario puede cambiar permisos');
    }

    await this.channel.send({
      type: 'broadcast',
      event: 'access-changed',
      payload: {
        userId,
        newRole,
        changedBy: this.currentUser.id,
      },
    });
  }

  // Registrar callbacks
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase()}${event.slice(1)}`)) {
      this.callbacks[`on${event.charAt(0).toUpperCase()}${event.slice(1)}`] = callback;
    }
  }

  // Generar color aleatorio para el usuario
  generateUserColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Guardar sesión en localStorage
  saveSessionToStorage() {
    if (!this.currentSession || !this.currentUser) {
      console.warn('⚠️ No se puede guardar: falta sesión o usuario');
      return;
    }

    const sessionData = {
      session: {
        id: this.currentSession.id,
        name: this.currentSession.name,
        owner: this.currentSession.owner,
        accessControl: this.currentSession.accessControl,
      },
      user: {
        id: this.currentUser.id,
        name: this.currentUser.name,
        color: this.currentUser.color,
        role: this.currentUser.role,
      },
      timestamp: Date.now()
    };

    console.log('💾 Guardando sesión en localStorage:', {
      sessionId: sessionData.session.id,
      userName: sessionData.user.name,
      userRole: sessionData.user.role
    });

    localStorage.setItem('collaboration_session', JSON.stringify(sessionData));
    console.log('✅ Sesión guardada en localStorage');

    // Guardar archivos del proyecto también (solo si eres owner)
    if (this.currentUser.role === 'owner' && this.currentSession.files) {
      const fileCount = Object.keys(this.currentSession.files).length;
      console.log(`💾 Guardando ${fileCount} archivos del proyecto (owner)`);
      localStorage.setItem('collaboration_project_files', JSON.stringify(this.currentSession.files));
      console.log('✅ Archivos del proyecto guardados');
    }
  }

  // Restaurar sesión desde localStorage
  async restoreSessionFromStorage() {
    try {
      console.log('🔍 Intentando restaurar sesión desde localStorage...');
      
      // Verificar si Supabase está configurado
      if (!this.supabase) {
        console.warn('⚠️ Supabase no está configurado - no se puede restaurar sesión');
        return null;
      }
      
      const stored = localStorage.getItem('collaboration_session');
      if (!stored) {
        console.log('ℹ️ No hay sesión guardada en localStorage');
        return null;
      }

      const sessionData = JSON.parse(stored);
      console.log('📦 Datos de sesión encontrados:', {
        sessionId: sessionData.session?.id,
        userName: sessionData.user?.name,
        userRole: sessionData.user?.role,
        timestamp: new Date(sessionData.timestamp).toLocaleString()
      });
      
      // Verificar que no haya expirado (máximo 24 horas)
      const maxAge = 24 * 60 * 60 * 1000;
      const age = Date.now() - sessionData.timestamp;
      if (age > maxAge) {
        console.warn('⏰ Sesión expirada (más de 24 horas)');
        localStorage.removeItem('collaboration_session');
        localStorage.removeItem('collaboration_project_files');
        return null;
      }
      console.log(`⏱️ Sesión válida (edad: ${Math.round(age / 1000 / 60)} minutos)`);

      // Restaurar estado
      this.currentSession = sessionData.session;
      this.currentUser = sessionData.user;
      console.log('✅ Estado de sesión y usuario restaurado');

      // Si eres owner, restaurar archivos del proyecto
      if (this.currentUser.role === 'owner') {
        const storedFiles = localStorage.getItem('collaboration_project_files');
        if (storedFiles) {
          this.currentSession.files = JSON.parse(storedFiles);
          console.log('📁 Archivos del proyecto restaurados (owner)');
        }
      }

      // Reconectar al canal
      console.log('🔌 Reconectando al canal de Supabase...');
      await this.connectToChannel(sessionData.session.id);
      console.log('✅ Canal reconectado');
      
      // Anunciar que volvimos
      console.log('📢 Anunciando regreso a la sesión...');
      await this.broadcastUserJoined();
      console.log('✅ Anuncio enviado');

      console.log('🎉 SESIÓN RESTAURADA COMPLETAMENTE');
      return {
        session: this.currentSession,
        user: this.currentUser
      };
    } catch (error) {
      console.error('❌ ERROR al restaurar sesión:', error);
      console.error('Stack trace:', error.stack);
      localStorage.removeItem('collaboration_session');
      localStorage.removeItem('collaboration_project_files');
      return null;
    }
  }

  // Limpiar sesión del storage
  clearSessionStorage() {
    localStorage.removeItem('collaboration_session');
    localStorage.removeItem('collaboration_project_files');
  }

  // 🚀 Salir de la sesión (limpieza completa)
  async leaveSession() {
    console.log('👋 Saliendo de la sesión...');
    
    // Detener heartbeat
    if (this.stopHeartbeat) this.stopHeartbeat();
    
    // Notificar salida
    if (this.channel && this.currentUser) {
      try {
        await this.channel.send({
          type: 'broadcast',
          event: 'user-left',
          payload: {
            userId: this.currentUser.id,
            userName: this.currentUser.name,
          },
        });
      } catch (error) {
        console.error('❌ Error al notificar salida:', error);
      }
      
      await this.channel.unsubscribe();
      this.channel = null;
    }

    // Limpiar estados
    this.currentSession = null;
    this.currentUser = null;
    this.reconnectAttempts = 0;
    this.isReconnecting = false;
    this.offlineBuffer = [];
    this.processedMessages.clear();
    this.connectionStatus = 'disconnected';
    
    if (this.callbacks.onConnectionStatusChange) {
      this.callbacks.onConnectionStatusChange({
        status: 'disconnected',
        previousStatus: this.connectionStatus,
        reconnectAttempts: 0,
      });
    }
    
    // Limpiar storage
    this.clearSessionStorage();
    
    console.log('✅ Sesión cerrada completamente');
  }

  // Obtener información de la sesión actual
  getCurrentSession() {
    return this.currentSession;
  }

  // Obtener información del usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Verificar si Supabase está configurado
  isConfigured() {
    return this.supabase !== null;
  }

  // 📡 Obtener estado de conexión
  getConnectionStatus() {
    return {
      status: this.connectionStatus,
      reconnectAttempts: this.reconnectAttempts,
      isReconnecting: this.isReconnecting,
      offlineBufferSize: this.offlineBuffer.length,
      isConnected: this.connectionStatus === 'connected',
    };
  }
}

// Exportar instancia singleton
export const collaborationService = new CollaborationService();
export default collaborationService;
