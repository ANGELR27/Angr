/**
 * Servicio de Presencia Avanzada
 * Rastrea ubicación, estado y actividad de usuarios en tiempo real
 */
class PresenceService {
  constructor() {
    this.users = new Map(); // userId -> PresenceData
    this.callbacks = {
      onUserJoined: null,
      onUserLeft: null,
      onUserUpdated: null,
      onUserStatusChanged: null,
      onUserFileChanged: null,
    };
    this.inactivityTimeout = 5 * 60 * 1000; // 5 minutos
    this.inactivityTimers = new Map();
  }

  /**
   * Agregar o actualizar presencia de usuario
   */
  updatePresence(userId, userData) {
    const wasPresent = this.users.has(userId);
    const now = Date.now();

    const presenceData = {
      userId,
      name: userData.name,
      color: userData.color,
      status: userData.status || 'active', // active, idle, away, busy
      currentFile: userData.currentFile || null,
      currentLine: userData.currentLine || null,
      lastActivity: now,
      joinedAt: wasPresent ? this.users.get(userId).joinedAt : now,
      customStatus: userData.customStatus || null,
      isTyping: userData.isTyping || false,
      selection: userData.selection || null,
    };

    this.users.set(userId, presenceData);

    // Resetear timer de inactividad
    this.resetInactivityTimer(userId);

    // Emitir evento
    if (wasPresent) {
      this.callbacks.onUserUpdated?.(presenceData);
    } else {
      this.callbacks.onUserJoined?.(presenceData);
    }

    console.log('👤 Presencia actualizada:', userId, presenceData.status);
  }

  /**
   * Actualizar solo el estado del usuario
   */
  updateUserStatus(userId, status, customStatus = null) {
    const user = this.users.get(userId);
    if (!user) return;

    user.status = status;
    user.customStatus = customStatus;
    user.lastActivity = Date.now();

    this.callbacks.onUserStatusChanged?.({ userId, status, customStatus });
    console.log(`🎭 Estado cambiado: ${userId} -> ${status}`);
  }

  /**
   * Actualizar archivo actual del usuario
   */
  updateCurrentFile(userId, filePath, lineNumber = null) {
    const user = this.users.get(userId);
    if (!user) return;

    const previousFile = user.currentFile;
    user.currentFile = filePath;
    user.currentLine = lineNumber;
    user.lastActivity = Date.now();

    this.callbacks.onUserFileChanged?.({
      userId,
      previousFile,
      currentFile: filePath,
      lineNumber,
    });

    console.log(`📁 Usuario ${userId} viendo: ${filePath}`);
  }

  /**
   * Marcar usuario como escribiendo
   */
  setTypingStatus(userId, isTyping, filePath = null) {
    const user = this.users.get(userId);
    if (!user) return;

    user.isTyping = isTyping;
    if (filePath) {
      user.currentFile = filePath;
    }
    user.lastActivity = Date.now();

    this.callbacks.onUserUpdated?.(user);
  }

  /**
   * Actualizar selección del usuario
   */
  updateSelection(userId, selection) {
    const user = this.users.get(userId);
    if (!user) return;

    user.selection = selection;
    user.lastActivity = Date.now();

    this.callbacks.onUserUpdated?.(user);
  }

  /**
   * Remover usuario
   */
  removeUser(userId) {
    const user = this.users.get(userId);
    if (!user) return;

    this.users.delete(userId);

    // Limpiar timer de inactividad
    if (this.inactivityTimers.has(userId)) {
      clearTimeout(this.inactivityTimers.get(userId));
      this.inactivityTimers.delete(userId);
    }

    this.callbacks.onUserLeft?.(user);
    console.log('👋 Usuario salió:', userId);
  }

  /**
   * Obtener presencia de un usuario
   */
  getUserPresence(userId) {
    return this.users.get(userId) || null;
  }

  /**
   * Obtener todos los usuarios presentes
   */
  getAllUsers() {
    return Array.from(this.users.values());
  }

  /**
   * Obtener usuarios en un archivo específico
   */
  getUsersInFile(filePath) {
    return Array.from(this.users.values()).filter(
      user => user.currentFile === filePath
    );
  }

  /**
   * Obtener usuarios por estado
   */
  getUsersByStatus(status) {
    return Array.from(this.users.values()).filter(
      user => user.status === status
    );
  }

  /**
   * Obtener usuarios activos (no idle ni away)
   */
  getActiveUsers() {
    return Array.from(this.users.values()).filter(
      user => user.status === 'active' || user.status === 'busy'
    );
  }

  /**
   * Timer de inactividad
   */
  resetInactivityTimer(userId) {
    // Limpiar timer anterior
    if (this.inactivityTimers.has(userId)) {
      clearTimeout(this.inactivityTimers.get(userId));
    }

    // Crear nuevo timer
    const timer = setTimeout(() => {
      const user = this.users.get(userId);
      if (user && user.status === 'active') {
        this.updateUserStatus(userId, 'idle');
      }
    }, this.inactivityTimeout);

    this.inactivityTimers.set(userId, timer);
  }

  /**
   * Sincronizar presencia desde broadcast
   */
  syncPresence(payload) {
    const { action, userId, data } = payload;

    switch (action) {
      case 'join':
      case 'update':
        this.updatePresence(userId, data);
        break;

      case 'leave':
        this.removeUser(userId);
        break;

      case 'status':
        this.updateUserStatus(userId, data.status, data.customStatus);
        break;

      case 'file':
        this.updateCurrentFile(userId, data.filePath, data.lineNumber);
        break;

      case 'typing':
        this.setTypingStatus(userId, data.isTyping, data.filePath);
        break;

      case 'selection':
        this.updateSelection(userId, data.selection);
        break;
    }
  }

  /**
   * Obtener estadísticas de presencia
   */
  getStats() {
    const all = this.getAllUsers();
    const active = this.getActiveUsers();
    const idle = this.getUsersByStatus('idle');
    const away = this.getUsersByStatus('away');

    return {
      total: all.length,
      active: active.length,
      idle: idle.length,
      away: away.length,
      typing: all.filter(u => u.isTyping).length,
    };
  }

  /**
   * Registrar callbacks
   */
  on(event, callback) {
    const eventMap = {
      'userJoined': 'onUserJoined',
      'userLeft': 'onUserLeft',
      'userUpdated': 'onUserUpdated',
      'userStatusChanged': 'onUserStatusChanged',
      'userFileChanged': 'onUserFileChanged',
    };

    const callbackKey = eventMap[event];
    if (callbackKey) {
      this.callbacks[callbackKey] = callback;
    }
  }

  /**
   * Limpiar todo
   */
  clearAll() {
    this.users.clear();
    this.inactivityTimers.forEach(timer => clearTimeout(timer));
    this.inactivityTimers.clear();
    console.log('🧹 Presencia limpiada');
  }
}

// Exportar instancia singleton
export const presenceService = new PresenceService();
export default presenceService;
