import { useState, useEffect, useRef } from 'react';
import { Terminal, CheckCircle, XCircle } from 'lucide-react';

/**
 * Terminal flotante minimalista con glassmorphism
 * Aparece con Ctrl+Alt+S y se oculta automáticamente después de 5 segundos
 * Al pasar el mouse encima, se pausa el auto-cierre
 */
const FloatingTerminal = ({ isVisible, output, isError, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      // Iniciar animación de entrada
      setIsAnimating(true);
      
      // Desaparecer después de 5 segundos solo si no hay hover
      if (!isHovered) {
        timerRef.current = setTimeout(() => {
          setIsAnimating(false);
          setTimeout(onClose, 500); // Esperar a que termine la animación
        }, 5000);
      }

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, isHovered, onClose]);

  // Manejar hover: pausar/reanudar timer
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reiniciar timer cuando el mouse sale
    if (isVisible) {
      timerRef.current = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 500);
      }, 5000);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`floating-terminal ${isAnimating ? 'fade-in' : 'fade-out'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'fixed',
        bottom: '50px',
        left: '50%',
        width: '450px',
        maxWidth: '90vw',
        maxHeight: '300px',
        zIndex: 9999,
        pointerEvents: 'auto',
        cursor: isHovered ? 'default' : 'auto'
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
            0 0 100px -20px ${isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}${isHovered ? ',\n            0 0 50px rgba(59, 130, 246, 0.3)' : ''}
          `,
          animation: isAnimating ? 'slideUp 0.4s ease-out' : 'slideDown 0.5s ease-in',
          position: 'relative',
          overflow: 'hidden',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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
            gap: '12px',
            marginBottom: '18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '12px',
            position: 'relative'
          }}
        >
          {/* Icon con glow */}
          <div
            style={{
              padding: '6px',
              borderRadius: '10px',
              background: isError 
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))',
              border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              boxShadow: isError 
                ? '0 0 20px rgba(239, 68, 68, 0.3)'
                : '0 0 20px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isError ? (
              <XCircle size={20} color="#ef4444" strokeWidth={2.5} />
            ) : (
              <CheckCircle size={20} color="#10b981" strokeWidth={2.5} />
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <Terminal 
              size={16} 
              color="rgba(255, 255, 255, 0.5)" 
              strokeWidth={2}
            />
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}
            >
              {isError ? 'Error de Ejecución' : 'Resultado'}
            </span>
          </div>

          {/* Badge animado */}
          <div
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '500',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            Ctrl+Alt+S
          </div>
        </div>

        {/* Output */}
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '13px',
            fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
            lineHeight: '1.7',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            padding: '14px',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.25) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3) inset',
            position: 'relative'
          }}
          className="custom-scrollbar"
        >
          {/* Subtle shine effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent)',
              borderRadius: '12px 12px 0 0',
              pointerEvents: 'none'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {output}
          </div>
        </div>

        {/* Progress bar - pausada cuando hay hover */}
        <div
          style={{
            marginTop: '18px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3) inset'
          }}
        >
          {/* Glow effect */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: 0,
              right: 0,
              height: '10px',
              background: isError 
                ? 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.3), transparent)'
                : 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.3), transparent)',
              animation: isHovered ? 'none' : 'shrink 5s linear',
              width: '100%',
              filter: 'blur(4px)'
            }}
          />
          <div
            style={{
              height: '100%',
              background: isError 
                ? 'linear-gradient(90deg, #ef4444, #dc2626, #b91c1c)'
                : 'linear-gradient(90deg, #3b82f6, #2563eb, #1d4ed8)',
              animation: isHovered ? 'none' : 'shrink 5s linear',
              width: '100%',
              boxShadow: isError 
                ? '0 0 12px rgba(239, 68, 68, 0.6)'
                : '0 0 12px rgba(59, 130, 246, 0.6)',
              position: 'relative'
            }}
          >
            {/* Shine effect en la barra */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent)'
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .floating-terminal {
          /* Estado inicial: centrado y listo para animar */
          transform: translate(-50%, 0);
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translate(-50%, 30px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes slideDown {
          0% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, 30px);
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
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .fade-out {
          animation: slideDown 0.5s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          margin: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.25));
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.3));
        }
      `}</style>
    </div>
  );
};

export default FloatingTerminal;
