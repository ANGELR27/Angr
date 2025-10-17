import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Componente de estado de conexión para colaboración
 * Muestra estado actual: Online, Offline, Reconectando, Sincronizado
 */
function ConnectionStatus({ isCollaborating, connectionState, onReconnect, pendingChanges = 0 }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);

  // Escuchar cambios en la conexión de red
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Conexión restaurada');
      setIsOnline(true);
      if (onReconnect) onReconnect();
    };

    const handleOffline = () => {
      console.log('📵 Conexión perdida');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onReconnect]);

  // No mostrar si no estamos colaborando
  if (!isCollaborating) return null;

  // Determinar estado y estilo
  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        text: 'Sin conexión',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        pulseColor: 'bg-red-500',
        showPending: true,
      };
    }

    switch (connectionState) {
      case 'connecting':
      case 'reconnecting':
        return {
          icon: RefreshCw,
          text: 'Reconectando...',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          pulseColor: 'bg-yellow-500',
          spinning: true,
          showPending: true,
        };
      case 'syncing':
        return {
          icon: RefreshCw,
          text: 'Sincronizando...',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          pulseColor: 'bg-blue-500',
          spinning: true,
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Error de conexión',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          pulseColor: 'bg-red-500',
          showRetry: true,
        };
      case 'connected':
      default:
        return {
          icon: CheckCircle,
          text: 'Conectado',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          pulseColor: 'bg-green-500',
        };
    }
  };

  const status = getStatusConfig();
  const Icon = status.icon;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Badge compacto */}
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm
        ${status.bgColor} ${status.borderColor} ${status.color}
        transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:scale-105
      `}>
        {/* Indicador de pulso */}
        <div className="relative">
          <Icon 
            size={16} 
            className={status.spinning ? 'animate-spin' : ''} 
          />
          {connectionState === 'connected' && isOnline && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.pulseColor} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status.pulseColor}`}></span>
            </span>
          )}
        </div>

        <span className="text-xs font-medium">
          {status.text}
        </span>

        {/* Badge de cambios pendientes */}
        {status.showPending && pendingChanges > 0 && (
          <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full font-bold">
            {pendingChanges}
          </span>
        )}
      </div>

      {/* Panel de detalles expandido */}
      {showDetails && (
        <div className="absolute bottom-full right-0 mb-2 w-64 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
          <div className="space-y-3">
            {/* Estado principal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Estado:</span>
              <span className={`text-sm font-semibold ${status.color}`}>
                {status.text}
              </span>
            </div>

            {/* Conexión de red */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Red:</span>
              <span className={`text-sm font-semibold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Cambios pendientes */}
            {pendingChanges > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Pendientes:</span>
                <span className="text-sm font-semibold text-orange-400">
                  {pendingChanges} cambio{pendingChanges !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Información de sincronización */}
            {connectionState === 'connected' && (
              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Wifi size={12} />
                  Sincronización en tiempo real activa
                </p>
              </div>
            )}

            {/* Botón de reconexión */}
            {status.showRetry && onReconnect && (
              <button
                onClick={onReconnect}
                className="w-full mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                Reintentar
              </button>
            )}

            {/* Mensaje offline */}
            {!isOnline && (
              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-yellow-400">
                  ⚠️ Los cambios se guardarán localmente y se sincronizarán cuando vuelva la conexión
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConnectionStatus;
