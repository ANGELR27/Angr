import { useEffect, useRef, useCallback } from 'react';
import { saveToStorage } from '../utils/storage';

/**
 * Hook personalizado para guardar datos con debounce
 * Optimiza el guardado reduciendo llamadas a localStorage
 * 
 * @param {string} key - Clave de localStorage
 * @param {any} value - Valor a guardar
 * @param {number} delay - Retraso en ms (por defecto 1000ms)
 * @param {boolean} saveImmediately - Si se debe guardar inmediatamente al cargar
 */
export function useDebouncedSave(key, value, delay = 1000, saveImmediately = false) {
  const timeoutRef = useRef(null);
  const isFirstRender = useRef(true);
  const previousValue = useRef(value);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveToStorage(key, value);
    }, delay);
  }, [key, value, delay]);

  useEffect(() => {
    // En el primer render, solo guardar si saveImmediately es true
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (saveImmediately) {
        saveToStorage(key, value);
      }
      return;
    }

    // Solo guardar si el valor cambió
    if (JSON.stringify(value) !== JSON.stringify(previousValue.current)) {
      previousValue.current = value;
      debouncedSave();
    }

    // Cleanup: guardar inmediatamente al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        saveToStorage(key, value);
      }
    };
  }, [key, value, debouncedSave, saveImmediately]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}

/**
 * Hook para múltiples valores con debounce compartido
 * Más eficiente cuando se guardan varios valores relacionados
 * 
 * @param {Object} items - Objeto con { key: value } para guardar
 * @param {number} delay - Retraso en ms
 * @param {Function} onSave - Callback al guardar (opcional)
 * @returns {string} status - Estado del guardado: 'idle', 'saving', 'saved', 'error'
 */
export function useDebouncedSaveMultiple(items, delay = 1000, onSave = null) {
  const timeoutRef = useRef(null);
  const isFirstRender = useRef(true);
  const previousItems = useRef(items);

  useEffect(() => {
    // Skip en el primer render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousItems.current = items;
      return;
    }

    // Verificar si algo cambió
    const hasChanged = Object.keys(items).some(
      key => JSON.stringify(items[key]) !== JSON.stringify(previousItems.current[key])
    );

    if (!hasChanged) return;

    // Actualizar referencia
    previousItems.current = items;

    // Debounce del guardado
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        Object.entries(items).forEach(([key, value]) => {
          saveToStorage(key, value);
        });
        if (onSave) onSave('saved');
      } catch (error) {
        console.error('Error al guardar:', error);
        if (onSave) onSave('error');
      }
    }, delay);

    // Notificar que está guardando
    if (onSave) onSave('saving');

    // Cleanup: guardar inmediatamente al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        try {
          Object.entries(items).forEach(([key, value]) => {
            saveToStorage(key, value);
          });
        } catch (error) {
          console.error('Error al guardar en cleanup:', error);
        }
      }
    };
  }, [items, delay, onSave]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}
