import { useState, useCallback } from 'react';

/**
 * Hook centralizado para gestionar todos los modales/paneles del editor
 * Reemplaza 13+ estados individuales de show/hide con una solución unificada
 * 
 * @example
 * const { openModal, closeModal, toggleModal, isOpen } = useModals();
 * 
 * // Abrir un modal
 * openModal('imageManager');
 * 
 * // Cerrar un modal
 * closeModal('themeSelector');
 * 
 * // Toggle un modal
 * toggleModal('gitPanel');
 * 
 * // Verificar si está abierto
 * if (isOpen('shortcuts')) { ... }
 */
export function useModals() {
  const [openModals, setOpenModals] = useState(new Set());

  /**
   * Abre un modal específico
   * @param {string} modalName - Nombre del modal a abrir
   */
  const openModal = useCallback((modalName) => {
    setOpenModals(prev => {
      const next = new Set(prev);
      next.add(modalName);
      return next;
    });
  }, []);

  /**
   * Cierra un modal específico
   * @param {string} modalName - Nombre del modal a cerrar
   */
  const closeModal = useCallback((modalName) => {
    setOpenModals(prev => {
      const next = new Set(prev);
      next.delete(modalName);
      return next;
    });
  }, []);

  /**
   * Alterna el estado de un modal (abre si está cerrado, cierra si está abierto)
   * @param {string} modalName - Nombre del modal a alternar
   */
  const toggleModal = useCallback((modalName) => {
    setOpenModals(prev => {
      const next = new Set(prev);
      if (next.has(modalName)) {
        next.delete(modalName);
      } else {
        next.add(modalName);
      }
      return next;
    });
  }, []);

  /**
   * Verifica si un modal está abierto
   * @param {string} modalName - Nombre del modal
   * @returns {boolean} true si el modal está abierto
   */
  const isOpen = useCallback((modalName) => {
    return openModals.has(modalName);
  }, [openModals]);

  /**
   * Cierra todos los modales
   */
  const closeAll = useCallback(() => {
    setOpenModals(new Set());
  }, []);

  /**
   * Obtiene la lista de modales abiertos (útil para debugging)
   * @returns {Array<string>} Array con los nombres de modales abiertos
   */
  const getOpenModals = useCallback(() => {
    return Array.from(openModals);
  }, [openModals]);

  return {
    openModal,
    closeModal,
    toggleModal,
    isOpen,
    closeAll,
    getOpenModals,
  };
}

/**
 * Nombres de modales disponibles (para referencia y autocompletado)
 */
export const MODALS = {
  IMAGE_MANAGER: 'imageManager',
  THEME_SELECTOR: 'themeSelector',
  SHORTCUTS: 'shortcuts',
  RESET: 'reset',
  SESSION_MANAGER: 'sessionManager',
  COLLABORATION_PANEL: 'collaborationPanel',
  BACKGROUND_SELECTOR: 'backgroundSelector',
  SNIPPET_MANAGER: 'snippetManager',
  GIT_PANEL: 'gitPanel',
  CHAT: 'chat',
  DEV_TOOLS: 'devTools',
  FLOATING_TERMINAL: 'floatingTerminal',
  AUTH: 'auth',
};
