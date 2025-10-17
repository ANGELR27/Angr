import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para gestionar conexión, reconexión y cola de cambios pendientes
 * en modo colaborativo
 */
export function useConnectionManager(isCollaborating, collaborationService) {
  const [connectionState, setConnectionState] = useState('disconnected');
  const [pendingChanges, setPendingChanges] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 segundo

  // Monitorear estado de red
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Red disponible - intentando reconexión');
      setIsOnline(true);
      if (isCollaborating) {
        handleReconnect();
      }
    };

    const handleOffline = () => {
      console.log('📵 Red perdida - modo offline');
      setIsOnline(false);
      setConnectionState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isCollaborating]);

  // Actualizar estado cuando cambia isCollaborating
  useEffect(() => {
    if (isCollaborating && isOnline) {
      setConnectionState('connected');
      reconnectAttemptsRef.current = 0;
    } else if (!isCollaborating) {
      setConnectionState('disconnected');
    }
  }, [isCollaborating, isOnline]);

  /**
   * Intentar reconexión con backoff exponencial
   */
  const handleReconnect = useCallback(async () => {
    if (!isOnline || !isCollaborating) {
      console.log('⏸️ No se puede reconectar: offline o no colaborando');
      return;
    }

    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error('❌ Máximo de intentos de reconexión alcanzado');
      setConnectionState('error');
      return;
    }

    setConnectionState('reconnecting');
    reconnectAttemptsRef.current += 1;

    console.log(`🔄 Intento de reconexión ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);

    try {
      // Aquí iría la lógica de reconexión específica
      // Por ahora simulamos una reconexión exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ Reconexión exitosa');
      setConnectionState('connected');
      reconnectAttemptsRef.current = 0;

      // Sincronizar cambios pendientes
      await syncPendingChanges();

    } catch (error) {
      console.error('❌ Error en reconexión:', error);
      
      // Calcular delay con backoff exponencial
      const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);
      console.log(`⏳ Reintentando en ${delay}ms...`);

      reconnectTimeoutRef.current = setTimeout(() => {
        handleReconnect();
      }, delay);
    }
  }, [isOnline, isCollaborating]);

  /**
   * Agregar cambio a la cola de pendientes
   */
  const queueChange = useCallback((change) => {
    if (!isOnline || connectionState !== 'connected') {
      console.log('📝 Cambio agregado a cola de pendientes');
      setPendingChanges(prev => [...prev, {
        ...change,
        timestamp: Date.now(),
        id: `${Date.now()}-${Math.random()}`,
      }]);
      return false; // Indica que el cambio fue encolado
    }
    return true; // Indica que el cambio puede enviarse inmediatamente
  }, [isOnline, connectionState]);

  /**
   * Sincronizar todos los cambios pendientes
   */
  const syncPendingChanges = useCallback(async () => {
    if (pendingChanges.length === 0) {
      console.log('✅ No hay cambios pendientes para sincronizar');
      return;
    }

    console.log(`📤 Sincronizando ${pendingChanges.length} cambios pendientes...`);
    setConnectionState('syncing');

    try {
      // Procesar cambios uno por uno
      for (const change of pendingChanges) {
        if (collaborationService && typeof collaborationService.broadcastFileChange === 'function') {
          await collaborationService.broadcastFileChange(
            change.filePath,
            change.content,
            change.cursorPosition
          );
          console.log('✅ Cambio sincronizado:', change.filePath);
        }
      }

      // Limpiar cola después de sincronizar exitosamente
      setPendingChanges([]);
      setConnectionState('connected');
      console.log('🎉 Todos los cambios pendientes sincronizados');

    } catch (error) {
      console.error('❌ Error sincronizando cambios pendientes:', error);
      setConnectionState('error');
    }
  }, [pendingChanges, collaborationService]);

  /**
   * Limpiar cola de cambios pendientes
   */
  const clearPendingChanges = useCallback(() => {
    setPendingChanges([]);
    console.log('🧹 Cola de cambios limpiada');
  }, []);

  /**
   * Obtener resumen del estado
   */
  const getStatusSummary = useCallback(() => {
    return {
      isOnline,
      connectionState,
      pendingCount: pendingChanges.length,
      reconnectAttempts: reconnectAttemptsRef.current,
      canSync: isOnline && connectionState === 'connected' && pendingChanges.length > 0,
    };
  }, [isOnline, connectionState, pendingChanges.length]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    connectionState,
    pendingChanges: pendingChanges.length,
    isOnline,
    queueChange,
    syncPendingChanges,
    clearPendingChanges,
    handleReconnect,
    getStatusSummary,
  };
}

export default useConnectionManager;
