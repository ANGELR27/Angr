import { useRef, useCallback } from 'react';

/**
 * Hook personalizado para throttle de funciones
 * Limita la frecuencia de ejecución de una función
 * 
 * @param {Function} callback - Función a throttlear
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} Función throttleada
 */
export function useThrottle(callback, delay) {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= delay) {
      callback(...args);
      lastRun.current = now;
    } else {
      // Programar ejecución al final del período de throttle
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRun.current = Date.now();
      }, delay - timeSinceLastRun);
    }
  }, [callback, delay]);
}

/**
 * Hook para debounce simple
 * Espera a que el usuario deje de llamar la función por un tiempo
 * 
 * @param {Function} callback - Función a debounce
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} Función debounceda
 */
export function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}
