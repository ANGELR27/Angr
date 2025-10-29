import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar modales de forma consolidada
 * Previene que múltiples modales estén abiertos simultáneamente
 * 
 * @param {string|null} initialModal - Modal inicial abierto
 * @returns {Object} - Funciones y estado para manejar modales
 * 
 * @example
 * const modal = useModal();
 * modal.openModal('imageManager');
 * modal.isOpen('imageManager'); // true
 * modal.closeModal();
 */
export function useModal(initialModal = null) {
  const [currentModal, setCurrentModal] = useState(initialModal);
  
  /**
   * Abre un modal específico (cierra cualquier otro abierto)
   */
  const openModal = useCallback((modalName) => {
    setCurrentModal(modalName);
  }, []);
  
  /**
   * Cierra el modal actual
   */
  const closeModal = useCallback(() => {
    setCurrentModal(null);
  }, []);
  
  /**
   * Toggle de un modal específico
   */
  const toggleModal = useCallback((modalName) => {
    setCurrentModal(prev => prev === modalName ? null : modalName);
  }, []);
  
  /**
   * Verifica si un modal específico está abierto
   */
  const isOpen = useCallback((modalName) => {
    return currentModal === modalName;
  }, [currentModal]);
  
  return {
    currentModal,
    openModal,
    closeModal,
    toggleModal,
    isOpen
  };
}

/**
 * Nombres de modales como constantes para evitar typos
 */
export const MODAL_NAMES = {
  IMAGE_MANAGER: 'imageManager',
  THEME_SELECTOR: 'themeSelector',
  SHORTCUTS_HELP: 'shortcutsHelp',
  RESET: 'reset',
  SESSION_MANAGER: 'sessionManager',
  COLLABORATION_PANEL: 'collaborationPanel',
  BACKGROUND_SELECTOR: 'backgroundSelector',
  SNIPPET_MANAGER: 'snippetManager',
  GIT_PANEL: 'gitPanel',
  CHAT: 'chat',
  DEV_TOOLS: 'devTools',
  AUTH: 'auth',
  FLOATING_TERMINAL: 'floatingTerminal'
};
