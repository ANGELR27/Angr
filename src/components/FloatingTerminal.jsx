import { useState, useEffect } from 'react';
import { Terminal, CheckCircle, XCircle } from 'lucide-react';

/**
 * Terminal flotante minimalista con glassmorphism
 * Aparece con Ctrl+Alt+S y se oculta automáticamente después de 5 segundos
 */
const FloatingTerminal = ({ isVisible, output, isError, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Iniciar animación de entrada
      setIsAnimating(true);
      
      // Desaparecer después de 5 segundos
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 500); // Esperar a que termine la animación
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`floating-terminal ${isAnimating ? 'fade-in' : 'fade-out'}`}
      style={{
        position: 'fixed',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '450px',
        maxWidth: '90vw',
        maxHeight: '300px',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      {/* Glassmorphism container */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.85) 0%, rgba(10, 10, 20, 0.9) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1.5px solid ${isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
          borderRadius: '20px',
          padding: '24px',
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.05) inset,
            0 20px 60px -12px ${isError ? 'rgba(239, 68, 68, 0.35)' : 'rgba(59, 130, 246, 0.35)'},
            0 8px 24px -8px rgba(0, 0, 0, 0.5),
            0 0 100px -20px ${isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}
          `,
          animation: isAnimating ? 'slideUp 0.4s ease-out' : 'slideDown 0.5s ease-in',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Gradient overlay superior */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, 
              transparent, 
              ${isError ? 'rgba(239, 68, 68, 0.6)' : 'rgba(59, 130, 246, 0.6)'}, 
              transparent)`
          }}
        />
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '10px'
          }}
        >
          {isError ? (
            <XCircle size={20} color="#ef4444" />
          ) : (
            <CheckCircle size={20} color="#10b981" />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="rgba(255, 255, 255, 0.7)" />
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}
            >
              {isError ? 'Error de Ejecución' : 'Resultado'}
            </span>
          </div>
        </div>

        {/* Output */}
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '13px',
            fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            padding: '10px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
          className="custom-scrollbar"
        >
          {output}
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: '15px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              background: isError 
                ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                : 'linear-gradient(90deg, #3b82f6, #2563eb)',
              animation: 'shrink 5s linear',
              width: '100%'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          to {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .fade-in {
          animation: slideUp 0.4s ease-out forwards;
        }

        .fade-out {
          animation: slideDown 0.5s ease-in forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default FloatingTerminal;
