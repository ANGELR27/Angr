/**
 * Utilidades para validación de props y datos
 * Previene errores comunes y mejora la robustez del código
 */

/**
 * Valida que un objeto tenga las propiedades requeridas
 * @param {Object} obj - Objeto a validar
 * @param {Array<string>} requiredProps - Lista de propiedades requeridas
 * @param {string} componentName - Nombre del componente (para mensajes de error)
 * @returns {boolean} - true si es válido
 * @throws {Error} - Si falta alguna propiedad requerida
 */
export const validateRequiredProps = (obj, requiredProps, componentName = 'Component') => {
  if (!obj || typeof obj !== 'object') {
    throw new Error(`${componentName}: Se esperaba un objeto, pero recibió ${typeof obj}`);
  }

  const missingProps = requiredProps.filter(prop => !(prop in obj));
  
  if (missingProps.length > 0) {
    throw new Error(
      `${componentName}: Faltan propiedades requeridas: ${missingProps.join(', ')}`
    );
  }

  return true;
};

/**
 * Valida que un archivo tenga la estructura correcta
 * @param {Object} file - Archivo a validar
 * @returns {boolean} - true si es válido
 */
export const isValidFile = (file) => {
  if (!file || typeof file !== 'object') return false;
  
  return (
    typeof file.name === 'string' &&
    typeof file.type === 'string' &&
    (file.type === 'file' || file.type === 'folder') &&
    (file.type === 'folder' ? typeof file.children === 'object' : true)
  );
};

/**
 * Valida estructura de usuario de colaboración
 * @param {Object} user - Usuario a validar
 * @returns {boolean}
 */
export const isValidCollaborationUser = (user) => {
  if (!user || typeof user !== 'object') return false;
  
  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.color === 'string' &&
    user.name.trim().length > 0 &&
    user.name.length <= 50
  );
};

/**
 * Valida posición de cursor
 * @param {Object} position - Posición a validar
 * @returns {boolean}
 */
export const isValidCursorPosition = (position) => {
  if (!position || typeof position !== 'object') return false;
  
  return (
    typeof position.lineNumber === 'number' &&
    typeof position.column === 'number' &&
    position.lineNumber > 0 &&
    position.column > 0
  );
};

/**
 * Sanitiza nombre de archivo/carpeta
 * @param {string} name - Nombre a sanitizar
 * @returns {string} - Nombre sanitizado
 */
export const sanitizeFileName = (name) => {
  if (typeof name !== 'string') return 'archivo';
  
  // Eliminar caracteres no permitidos en nombres de archivo
  return name
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/^\.+/, '') // No permitir nombres que empiecen con punto
    .substring(0, 255) // Límite de longitud
    || 'archivo';
};

/**
 * Valida y sanitiza URL
 * @param {string} url - URL a validar
 * @returns {string|null} - URL válida o null
 */
export const validateUrl = (url) => {
  if (typeof url !== 'string') return null;
  
  try {
    const parsed = new URL(url);
    // Solo permitir http y https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.href;
  } catch (e) {
    return null;
  }
};

/**
 * Valida sesión de colaboración
 * @param {Object} session - Sesión a validar
 * @returns {boolean}
 */
export const isValidSession = (session) => {
  if (!session || typeof session !== 'object') return false;
  
  return (
    typeof session.id === 'string' &&
    session.id.length > 0 &&
    session.id.length <= 100
  );
};

/**
 * Limpia y valida contenido HTML para preview
 * @param {string} html - HTML a validar
 * @returns {string} - HTML seguro
 */
export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  
  // Esta es una sanitización básica
  // Para producción, considera usar una librería como DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover scripts
    .trim();
};

/**
 * Valida estructura de archivos del proyecto
 * @param {Object} files - Estructura de archivos
 * @returns {boolean}
 */
export const validateProjectStructure = (files) => {
  if (!files || typeof files !== 'object') return false;
  
  // Verificar que al menos tenga una estructura válida
  const hasValidStructure = Object.values(files).every(item => 
    isValidFile(item)
  );
  
  return hasValidStructure;
};

/**
 * Genera color aleatorio válido para usuario
 * @returns {string} - Color hexadecimal
 */
export const generateValidUserColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#E63946', '#F77F00', '#06FFA5', '#3D5A80', '#EE6C4D'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Valida y limita tamaño de contenido
 * @param {string} content - Contenido a validar
 * @param {number} maxSize - Tamaño máximo en bytes (default: 5MB)
 * @returns {boolean}
 */
export const isContentSizeValid = (content, maxSize = 5 * 1024 * 1024) => {
  if (typeof content !== 'string') return false;
  
  // Calcular tamaño en bytes (aproximado)
  const sizeInBytes = new Blob([content]).size;
  return sizeInBytes <= maxSize;
};

/**
 * Debounce mejorado con validación
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function}
 */
export const debounceWithValidation = (func, wait = 300) => {
  if (typeof func !== 'function') {
    throw new Error('debounce: El primer argumento debe ser una función');
  }
  
  if (typeof wait !== 'number' || wait < 0) {
    throw new Error('debounce: El tiempo de espera debe ser un número positivo');
  }
  
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default {
  validateRequiredProps,
  isValidFile,
  isValidCollaborationUser,
  isValidCursorPosition,
  sanitizeFileName,
  validateUrl,
  isValidSession,
  sanitizeHtml,
  validateProjectStructure,
  generateValidUserColor,
  isContentSizeValid,
  debounceWithValidation
};
