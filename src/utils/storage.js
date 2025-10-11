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
  SIDEBAR_WIDTH: 'code-editor-sidebar-width',
  PREVIEW_WIDTH: 'code-editor-preview-width',
  TERMINAL_HEIGHT: 'code-editor-terminal-height',
};

// Guardar en localStorage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
};

// Cargar de localStorage
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error al cargar de localStorage:', error);
    return defaultValue;
  }
};

// Limpiar localStorage
export const clearStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
  }
};

// Exportar keys
export { STORAGE_KEYS };
