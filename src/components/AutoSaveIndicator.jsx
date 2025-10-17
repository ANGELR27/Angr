import { useEffect, useState } from 'react';
import { Check, Save, AlertCircle } from 'lucide-react';

/**
 * Indicador visual de guardado automático
 * Muestra el estado del guardado: guardando, guardado, o error
 */
function AutoSaveIndicator({ status = 'idle', currentTheme }) {
  const [visible, setVisible] = useState(false);
  const isLite = currentTheme === 'lite';

  useEffect(() => {
    if (status === 'saving' || status === 'saved' || status === 'error') {
      setVisible(true);
    }

    // Auto-ocultar después de 2 segundos si está guardado
    if (status === 'saved') {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Solo mostrar en modo lite
  if (!visible || !isLite) return null;

  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <Save className="w-3.5 h-3.5 animate-pulse" />;
      case 'saved':
        return <Check className="w-3.5 h-3.5" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const getText = () => {
    switch (status) {
      case 'saving':
        return 'Guardando...';
      case 'saved':
        return 'Guardado';
      case 'error':
        return 'Error al guardar';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (status) {
      case 'saving':
        return isLite ? '#3b82f6' : 'var(--theme-primary)';
      case 'saved':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return 'var(--theme-text)';
    }
  };

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300"
      style={{
        backgroundColor: isLite ? '#f3f4f6' : 'var(--theme-background-secondary)',
        color: getColor(),
        border: `1px solid ${getColor()}20`,
        boxShadow: status === 'saved' 
          ? `0 0 10px ${getColor()}30, 0 0 20px ${getColor()}20`
          : 'none',
        animation: status === 'saving' ? 'pulse 2s ease-in-out infinite' : 'none'
      }}
    >
      {getIcon()}
      <span>{getText()}</span>
    </div>
  );
}

export default AutoSaveIndicator;
