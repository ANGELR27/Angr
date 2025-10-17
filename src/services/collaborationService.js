import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

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
    };
    
    // Inicializar solo si hay credenciales válidas
    if (SUPABASE_URL !== 'https://tu-proyecto.supabase.co' && SUPABASE_ANON_KEY !== 'tu-anon-key-aqui') {
      this.initializeSupabase();
    }
  }

  initializeSupabase() {
    try {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) {
      console.error('Error al inicializar Supabase:', error);
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

  // Conectar al canal de Supabase Realtime
  async connectToChannel(sessionId) {
    if (!this.supabase) return;

    this.channel = this.supabase.channel(`session:${sessionId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: this.currentUser?.id },
      },
    });

    // Escuchar cambios en archivos
    this.channel.on('broadcast', { event: 'file-change' }, (payload) => {
      console.log('🎯 Supabase broadcast recibido:', {
        event: 'file-change',
        fromUserId: payload.payload.userId,
        currentUserId: this.currentUser?.id,
        isSameUser: payload.payload.userId === this.currentUser?.id,
        filePath: payload.payload.filePath,
        hasCallback: !!this.callbacks.onFileChange
      });
      
      if (payload.payload.userId === this.currentUser?.id) {
        console.log('⏸️ Es mi propio mensaje - ignorar');
        return;
      }
      
      if (this.callbacks.onFileChange) {
        console.log('📞 Llamando callback onFileChange...');
        this.callbacks.onFileChange(payload.payload);
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

    // Responder a solicitudes de lista de usuarios
    this.channel.on('broadcast', { event: 'request-user-list' }, async (payload) => {
      // Si alguien pide la lista, respondo con mi información
      if (this.currentUser && payload.payload.requesterId !== this.currentUser.id) {
        await this.channel.send({
          type: 'broadcast',
          event: 'user-response',
          payload: {
            ...this.currentUser,
            timestamp: Date.now()
          }
        });
      }
    });

    // Recibir respuestas de otros usuarios
    this.channel.on('broadcast', { event: 'user-response' }, (payload) => {
      if (this.callbacks.onUserJoined && payload.payload.id !== this.currentUser?.id) {
        this.callbacks.onUserJoined(payload.payload);
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

    // Suscribirse al canal
    await this.channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Conectado a la sesión colaborativa');
      }
    });

    // Rastrear presencia de usuarios
    this.channel.on('presence', { event: 'sync' }, () => {
      const state = this.channel.presenceState();
      console.log('Usuarios en línea:', state);
    });

    return this.channel;
  }

  // Transmitir cambio en archivo
  async broadcastFileChange(filePath, content, cursorPosition, version) {
    console.log('📡 broadcastFileChange llamado:', {
      hasChannel: !!this.channel,
      hasUser: !!this.currentUser,
      filePath,
      contentLength: content?.length
    });
    
    if (!this.channel || !this.currentUser) {
      console.error('❌ NO se puede enviar - falta channel o usuario:', {
        hasChannel: !!this.channel,
        hasUser: !!this.currentUser
      });
      return;
    }

    const payload = {
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userColor: this.currentUser.color,
      filePath,
      content,
      cursorPosition,
      version: typeof version === 'number' ? version : undefined,
      timestamp: Date.now(),
    };
    
    console.log('📤 Enviando a Supabase Realtime:', payload);
    
    try {
      await this.channel.send({
        type: 'broadcast',
        event: 'file-change',
        payload
      });
      console.log('✅ Mensaje enviado exitosamente a Supabase');
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
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

  // Notificar que un usuario se unió
  async broadcastUserJoined() {
    if (!this.channel || !this.currentUser) return;

    // 1. Anunciar mi llegada a todos
    await this.channel.send({
      type: 'broadcast',
      event: 'user-joined',
      payload: this.currentUser,
    });

    // 2. Solicitar lista de usuarios existentes
    // Esto hará que todos los demás usuarios respondan con su información
    await this.channel.send({
      type: 'broadcast',
      event: 'request-user-list',
      payload: {
        requesterId: this.currentUser.id,
        timestamp: Date.now()
      }
    });
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

  // Salir de la sesión
  async leaveSession() {
    if (this.channel) {
      await this.channel.send({
        type: 'broadcast',
        event: 'user-left',
        payload: {
          userId: this.currentUser.id,
          userName: this.currentUser.name,
        },
      });
      await this.channel.unsubscribe();
      this.channel = null;
    }

    this.currentSession = null;
    this.currentUser = null;
    this.clearSessionStorage();
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
}

// Exportar instancia singleton
export const collaborationService = new CollaborationService();
export default collaborationService;
