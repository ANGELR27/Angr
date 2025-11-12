import { useEffect, useState, useCallback } from 'react';

/**
 * Hook centralizado para gestionar atajos de teclado
 * @param {Object} shortcuts - Mapa de atajos { key: handler }
 * @param {Object} options - Opciones { enabled, showIndicator }
 */
function useKeyboardShortcuts(shortcuts, options = {}) {
  const { enabled = true, showIndicator = true } = options;
  const [activeShortcut, setActiveShortcut] = useState(null);

  const showShortcutIndicator = useCallback((key, action) => {
    if (!showIndicator) return;
    setActiveShortcut({ key, action, timestamp: Date.now() });
  }, [showIndicator]);

  const clearIndicator = useCallback(() => {
    setActiveShortcut(null);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // Construir la combinación de teclas
      const keys = [];
      if (e.ctrlKey || e.metaKey) keys.push('Ctrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      
      const key = e.key.toUpperCase();
      
      // Para teclas especiales
      const specialKeys = {
        'ESCAPE': 'Esc',
        ' ': 'Space',
        'ARROWUP': '↑',
        'ARROWDOWN': '↓',
        'ARROWLEFT': '←',
        'ARROWRIGHT': '→'
      };
      
      const displayKey = specialKeys[key] || key;
      keys.push(displayKey);
      
      const combination = keys.join('+');
      
      // Buscar handler correspondiente
      for (const [shortcutKey, handler] of Object.entries(shortcuts)) {
        if (shortcutKey === combination) {
          e.preventDefault();
          const result = handler(e);
          if (result !== false && showIndicator) {
            showShortcutIndicator(shortcutKey, handler.displayName || 'Acción');
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, shortcuts, showIndicator, showShortcutIndicator]);

  return {
    activeShortcut,
    clearIndicator
  };
}

export default useKeyboardShortcuts;
