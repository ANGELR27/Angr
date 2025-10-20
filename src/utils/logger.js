/**
 * Sistema de logging condicional
 * En desarrollo: muestra todos los logs
 * En producción: solo muestra errores
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Log general - solo en desarrollo
   */
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Errores - siempre se muestran
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Advertencias - solo en desarrollo
   */
  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * Información - solo en desarrollo
   */
  info: (...args) => {
    if (isDev) {
      console.info(...args);
    }
  },

  /**
   * Debug detallado - solo en desarrollo
   */
  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * Tabla - solo en desarrollo
   */
  table: (...args) => {
    if (isDev) {
      console.table(...args);
    }
  },

  /**
   * Grupo de logs - solo en desarrollo
   */
  group: (label) => {
    if (isDev) {
      console.group(label);
    }
  },

  /**
   * Grupo colapsado - solo en desarrollo
   */
  groupCollapsed: (label) => {
    if (isDev) {
      console.groupCollapsed(label);
    }
  },

  /**
   * Cerrar grupo - solo en desarrollo
   */
  groupEnd: () => {
    if (isDev) {
      console.groupEnd();
    }
  },

  /**
   * Timer - solo en desarrollo
   */
  time: (label) => {
    if (isDev) {
      console.time(label);
    }
  },

  /**
   * Timer end - solo en desarrollo
   */
  timeEnd: (label) => {
    if (isDev) {
      console.timeEnd(label);
    }
  }
};

/**
 * Logs específicos para colaboración
 */
export const collabLogger = {
  fileChange: (payload) => {
    logger.log('📥 MENSAJE RECIBIDO:', {
      filePath: payload.filePath,
      contentLength: payload.content?.length,
      fromUser: payload.userName
    });
  },

  cursorMove: (payload) => {
    logger.debug('📍 Cursor remoto:', {
      userName: payload.userName,
      filePath: payload.filePath,
      position: payload.position
    });
  },

  userJoined: (user) => {
    logger.info('👋 Usuario unido:', user.name);
  },

  userLeft: (userId) => {
    logger.info('👋 Usuario salió:', userId);
  },

  sessionCreated: (sessionId) => {
    logger.log('✅ Sesión creada:', sessionId);
  },

  sessionJoined: (sessionId) => {
    logger.log('✅ Unido a sesión:', sessionId);
  },

  error: (message, error) => {
    logger.error('❌ Error colaboración:', message, error);
  }
};

/**
 * Performance logger
 */
export const perfLogger = {
  start: (label) => {
    if (isDev) {
      performance.mark(`${label}-start`);
    }
  },

  end: (label) => {
    if (isDev) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      const measure = performance.getEntriesByName(label)[0];
      logger.log(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
    }
  }
};

export default logger;
