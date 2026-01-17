// Utilidades para persistencia con localStorage

const STORAGE_KEYS = {
  FILES: 'code-editor-files',
  OPEN_TABS: 'code-editor-open-tabs',
  ACTIVE_TAB: 'code-editor-active-tab',
  THEME: 'code-editor-theme',
  IMAGES: 'code-editor-images',
  SHOW_PREVIEW: 'code-editor-show-preview',
  SHOW_TERMINAL: 'code-editor-show-terminal',
  FONT_SIZE: 'code-editor-font-size',
  APP_FONT: 'code-editor-app-font',
  CODE_FONT: 'code-editor-code-font',
  SIDEBAR_WIDTH: 'code-editor-sidebar-width',
  PREVIEW_WIDTH: 'code-editor-preview-width',
  TERMINAL_HEIGHT: 'code-editor-terminal-height',
  EDITOR_BACKGROUND: 'code-editor-background',
  PRACTICE_MODE: 'code-editor-practice-mode',
};

// Verificar si localStorage está disponible y tiene espacio
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Obtener tamaño aproximado del storage usado (en MB)
export const getStorageSize = () => {
  try {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024 / 1024).toFixed(2); // MB
  } catch (error) {
    return 0;
  }
};

// Limpiar elementos antiguos si la cuota está llena
const cleanupOldData = () => {
  try {
    // Eliminar imágenes si el storage está muy lleno (prioridad baja)
    if (getStorageSize() > 8) { // Si supera 8MB
      localStorage.removeItem(STORAGE_KEYS.IMAGES);
      console.warn('⚠️ Storage casi lleno. Imágenes eliminadas para liberar espacio.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al limpiar datos antiguos:', error);
    return false;
  }
};

// Guardar en localStorage con manejo robusto de errores
export const saveToStorage = (key, data) => {
  if (!isStorageAvailable()) {
    console.warn('⚠️ localStorage no disponible. Los datos no se guardarán.');
    return false;
  }

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // Si es error de cuota, intentar limpiar
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      console.warn('⚠️ Cuota de localStorage excedida. Intentando liberar espacio...');
      
      if (cleanupOldData()) {
        // Reintentar guardado después de limpiar
        try {
          localStorage.setItem(key, JSON.stringify(data));
          console.log('✅ Datos guardados después de liberar espacio.');
          return true;
        } catch (retryError) {
          console.error('❌ No se pudo guardar incluso después de limpiar:', retryError);
          return false;
        }
      } else {
        console.error('❌ No se pudo liberar espacio suficiente.');
        return false;
      }
    } else {
      console.error('Error al guardar en localStorage:', error);
      return false;
    }
  }
};

// Cargar de localStorage con validación mejorada
export const loadFromStorage = (key, defaultValue = null) => {
  if (!isStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') {
      return defaultValue;
    }
    
    const parsed = JSON.parse(item);
    
    // Validación adicional: verificar que no sea un valor corrupto
    if (parsed === null || parsed === undefined) {
      return defaultValue;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error al cargar "${key}" de localStorage:`, error);
    // Si hay datos corruptos, eliminarlos
    try {
      localStorage.removeItem(key);
      console.warn(`⚠️ Datos corruptos eliminados para la clave: ${key}`);
    } catch (e) {
      // Ignorar error de eliminación
    }
    return defaultValue;
  }
};

// Limpiar localStorage
export const clearStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('✅ Storage limpiado correctamente.');
    return true;
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
    return false;
  }
};

// Exportar un objeto con toda la información del storage
export const getStorageInfo = () => {
  return {
    available: isStorageAvailable(),
    sizeInMB: getStorageSize(),
    keys: Object.keys(STORAGE_KEYS).length,
    items: Object.keys(localStorage).filter(k => k.startsWith('code-editor-')).length
  };
};

// Exportar keys
export { STORAGE_KEYS };
