// Utilidades de validación para el editor

/**
 * Caracteres prohibidos en nombres de archivos/carpetas
 */
const FORBIDDEN_CHARS = /[<>:"/\\|?*\x00-\x1F]/g;
const FORBIDDEN_NAMES = [
  'CON', 'PRN', 'AUX', 'NUL',
  'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
];

/**
 * Valida un nombre de archivo o carpeta
 * @param {string} name - Nombre a validar
 * @param {boolean} isFolder - Si es carpeta (sin extensión requerida)
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateFileName = (name, isFolder = false) => {
  // Validar que no esté vacío
  if (!name || name.trim() === '') {
    return { valid: false, error: '❌ El nombre no puede estar vacío' };
  }

  // Validar longitud
  if (name.length > 255) {
    return { valid: false, error: '❌ El nombre es demasiado largo (máximo 255 caracteres)' };
  }

  // Validar caracteres prohibidos
  if (FORBIDDEN_CHARS.test(name)) {
    return { valid: false, error: '❌ El nombre contiene caracteres no permitidos: < > : " / \\ | ? *' };
  }

  // Validar que no empiece o termine con espacio o punto
  if (name.startsWith(' ') || name.endsWith(' ')) {
    return { valid: false, error: '❌ El nombre no puede empezar o terminar con espacios' };
  }

  if (name.startsWith('.') && name.length === 1) {
    return { valid: false, error: '❌ El nombre no puede ser solo un punto' };
  }

  if (name.endsWith('.')) {
    return { valid: false, error: '❌ El nombre no puede terminar con un punto' };
  }

  // Validar nombres reservados de Windows
  const nameWithoutExt = name.split('.')[0].toUpperCase();
  if (FORBIDDEN_NAMES.includes(nameWithoutExt)) {
    return { valid: false, error: `❌ "${name}" es un nombre reservado del sistema` };
  }

  // Validar que archivos tengan extensión (opcional, depende del caso de uso)
  if (!isFolder && !name.includes('.')) {
    return { 
      valid: true, 
      warning: '⚠️ El archivo no tiene extensión. Se creará como archivo de texto plano.' 
    };
  }

  // Validar extensiones conocidas (para dar advertencias)
  if (!isFolder) {
    const ext = name.split('.').pop().toLowerCase();
    const knownExtensions = [
      'html', 'htm', 'css', 'js', 'jsx', 'ts', 'tsx', 'json', 'xml',
      'md', 'txt', 'py', 'java', 'c', 'cpp', 'h', 'php', 'rb', 'go',
      'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp',
      'mp4', 'webm', 'mp3', 'wav', 'pdf', 'zip', 'rar'
    ];

    if (!knownExtensions.includes(ext)) {
      return { 
        valid: true, 
        warning: `⚠️ Extensión ".${ext}" no reconocida. ¿Estás seguro?` 
      };
    }
  }

  return { valid: true };
};

/**
 * Sanitiza un nombre de archivo removiendo caracteres prohibidos
 * @param {string} name - Nombre a sanitizar
 * @returns {string} - Nombre sanitizado
 */
export const sanitizeFileName = (name) => {
  if (!name) return '';
  
  // Reemplazar caracteres prohibidos por guión bajo
  let sanitized = name.replace(FORBIDDEN_CHARS, '_');
  
  // Remover espacios al inicio y final
  sanitized = sanitized.trim();
  
  // Remover puntos al inicio (excepto para archivos ocultos como .gitignore)
  if (sanitized.startsWith('.') && sanitized.split('.').length > 2) {
    sanitized = sanitized.substring(1);
  }
  
  // Remover puntos al final
  while (sanitized.endsWith('.')) {
    sanitized = sanitized.slice(0, -1);
  }
  
  // Si el nombre sanitizado está vacío o es solo guiones bajos, usar nombre por defecto
  if (!sanitized || /^_+$/.test(sanitized)) {
    sanitized = 'archivo_sin_nombre';
  }
  
  return sanitized;
};

/**
 * Valida una ruta completa de archivo/carpeta
 * @param {string} path - Ruta a validar
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validatePath = (path) => {
  if (!path || path.trim() === '') {
    return { valid: false, error: '❌ La ruta no puede estar vacía' };
  }

  // Validar longitud total de la ruta
  if (path.length > 1024) {
    return { valid: false, error: '❌ La ruta es demasiado larga (máximo 1024 caracteres)' };
  }

  // Validar cada segmento de la ruta
  const segments = path.split('/').filter(Boolean);
  
  for (const segment of segments) {
    const isLastSegment = segment === segments[segments.length - 1];
    const hasExtension = segment.includes('.');
    const isFolder = !isLastSegment || !hasExtension;
    
    const validation = validateFileName(segment, isFolder);
    if (!validation.valid) {
      return { valid: false, error: `En "${segment}": ${validation.error}` };
    }
  }

  return { valid: true };
};

/**
 * Genera un nombre único añadiendo número al final
 * @param {string} baseName - Nombre base
 * @param {Array<string>} existingNames - Nombres existentes
 * @returns {string} - Nombre único
 */
export const generateUniqueName = (baseName, existingNames = []) => {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }

  const ext = baseName.includes('.') ? baseName.substring(baseName.lastIndexOf('.')) : '';
  const name = ext ? baseName.substring(0, baseName.lastIndexOf('.')) : baseName;
  
  let counter = 1;
  let uniqueName = `${name} (${counter})${ext}`;
  
  while (existingNames.includes(uniqueName)) {
    counter++;
    uniqueName = `${name} (${counter})${ext}`;
  }
  
  return uniqueName;
};

/**
 * Valida el tamaño de un archivo
 * @param {number} sizeInBytes - Tamaño en bytes
 * @param {number} maxSizeInMB - Tamaño máximo en MB (por defecto 10MB)
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateFileSize = (sizeInBytes, maxSizeInMB = 10) => {
  const maxBytes = maxSizeInMB * 1024 * 1024;
  
  if (sizeInBytes > maxBytes) {
    const sizeMB = (sizeInBytes / 1024 / 1024).toFixed(2);
    return { 
      valid: false, 
      error: `❌ El archivo es demasiado grande (${sizeMB}MB). Máximo permitido: ${maxSizeInMB}MB` 
    };
  }
  
  return { valid: true };
};

/**
 * Formatea el tamaño de archivo para mostrar
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado (ej: "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
