import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook para manejar paneles redimensionables
 * Maneja el resize del sidebar, preview y terminal
 * 
 * @param {Object} initialSizes - Tamaños iniciales de los paneles
 * @returns {Object} Estado y métodos para redimensionar paneles
 */
export function useResizablePanels(initialSizes = {}) {
  const [sidebarWidth, setSidebarWidth] = useState(initialSizes.sidebar || 280);
  const [previewWidth, setPreviewWidth] = useState(initialSizes.preview || 50);
  const [terminalHeight, setTerminalHeight] = useState(initialSizes.terminal || 250);

  const isResizingSidebar = useRef(false);
  const isResizingPreview = useRef(false);
  const isResizingTerminal = useRef(false);

  /**
   * Inicia el resize del sidebar
   */
  const startSidebarResize = useCallback(() => {
    isResizingSidebar.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  /**
   * Inicia el resize del preview
   */
  const startPreviewResize = useCallback(() => {
    isResizingPreview.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  /**
   * Inicia el resize del terminal
   */
  const startTerminalResize = useCallback(() => {
    isResizingTerminal.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, []);

  /**
   * Maneja el movimiento del mouse durante resize del sidebar
   */
  const handleSidebarResize = useCallback((e) => {
    if (!isResizingSidebar.current) return;
    const newWidth = Math.max(150, Math.min(500, e.clientX));
    setSidebarWidth(newWidth);
  }, []);

  /**
   * Maneja el movimiento del mouse durante resize del preview
   */
  const handlePreviewResize = useCallback((e) => {
    if (!isResizingPreview.current) return;
    
    const container = document.querySelector('.editor-preview-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const newPreviewWidth = ((containerRect.width - mouseX) / containerRect.width) * 100;
    setPreviewWidth(Math.max(20, Math.min(80, newPreviewWidth)));
  }, []);

  /**
   * Maneja el movimiento del mouse durante resize del terminal
   */
  const handleTerminalResize = useCallback((e) => {
    if (!isResizingTerminal.current) return;
    
    const container = document.querySelector('.main-content-area');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newHeight = containerRect.bottom - e.clientY;
    setTerminalHeight(Math.max(100, Math.min(600, newHeight)));
  }, []);

  /**
   * Detiene el resize
   */
  const stopResize = useCallback(() => {
    isResizingSidebar.current = false;
    isResizingPreview.current = false;
    isResizingTerminal.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  /**
   * Resetea todos los tamaños a los valores por defecto
   */
  const resetSizes = useCallback(() => {
    setSidebarWidth(280);
    setPreviewWidth(50);
    setTerminalHeight(250);
  }, []);

  // Event listeners para mouse move y mouse up
  useEffect(() => {
    const handleMouseMove = (e) => {
      handleSidebarResize(e);
      handlePreviewResize(e);
      handleTerminalResize(e);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResize);
    };
  }, [handleSidebarResize, handlePreviewResize, handleTerminalResize, stopResize]);

  return {
    // Estado
    sidebarWidth,
    previewWidth,
    terminalHeight,
    
    // Setters
    setSidebarWidth,
    setPreviewWidth,
    setTerminalHeight,
    
    // Métodos de control
    startSidebarResize,
    startPreviewResize,
    startTerminalResize,
    stopResize,
    resetSizes,
    
    // Refs (por si se necesitan)
    isResizingSidebar,
    isResizingPreview,
    isResizingTerminal
  };
}
