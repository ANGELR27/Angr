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
      throw new Error('Supabase no está configurado. Agrega las credenciales en el archivo .env');
    }

    const sessionId = uuidv4();
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
      files: {},
    };

    // Conectar al canal de Supabase Realtime
    await this.connectToChannel(sessionId);

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
      throw new Error('Supabase no está configurado');
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
      if (this.callbacks.onFileChange && payload.payload.userId !== this.currentUser?.id) {
        this.callbacks.onFileChange(payload.payload);
      }
    });

    // Escuchar usuarios que se unen
    this.channel.on('broadcast', { event: 'user-joined' }, (payload) => {
      if (this.callbacks.onUserJoined) {
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
      if (this.callbacks.onCursorMove && payload.payload.userId !== this.currentUser?.id) {
        this.callbacks.onCursorMove(payload.payload);
      }
    });

    // Escuchar cambios de permisos
    this.channel.on('broadcast', { event: 'access-changed' }, (payload) => {
      if (this.callbacks.onAccessChanged) {
        this.callbacks.onAccessChanged(payload.payload);
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
  async broadcastFileChange(filePath, content, cursorPosition) {
    if (!this.channel || !this.currentUser) return;

    await this.channel.send({
      type: 'broadcast',
      event: 'file-change',
      payload: {
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        userColor: this.currentUser.color,
        filePath,
        content,
        cursorPosition,
        timestamp: Date.now(),
      },
    });
  }

  // Transmitir movimiento de cursor
  async broadcastCursorMove(filePath, position, selection) {
    if (!this.channel || !this.currentUser) return;

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
        timestamp: Date.now(),
      },
    });
  }

  // Notificar que un usuario se unió
  async broadcastUserJoined() {
    if (!this.channel || !this.currentUser) return;

    await this.channel.send({
      type: 'broadcast',
      event: 'user-joined',
      payload: this.currentUser,
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

  // Obtener usuarios activos en la sesión
  getActiveUsers() {
    if (!this.channel) return [];
    const state = this.channel.presenceState();
    return Object.values(state).flat();
  }

  // Salir de la sesión
  async leaveSession() {
    if (this.channel) {
      await this.broadcastUserLeft();
      await this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.currentSession = null;
    this.currentUser = null;
  }

  // Verificar si Supabase está configurado
  isConfigured() {
    return this.supabase !== null;
  }

  // Obtener información de la sesión actual
  getCurrentSession() {
    return this.currentSession;
  }

  // Obtener información del usuario actual
  getCurrentUser() {
    return this.currentUser;
  }
}

// Exportar instancia singleton
export const collaborationService = new CollaborationService();
export default collaborationService;
