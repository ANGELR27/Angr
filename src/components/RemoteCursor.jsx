import { useState, useEffect } from 'react';

/**
 * Componente que muestra el cursor de un usuario remoto
 */
export default function RemoteCursor({ user, position, isTyping }) {
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    // Mostrar etiqueta por 3 segundos después de un movimiento
    setShowLabel(true);
    const timer = setTimeout(() => setShowLabel(false), 3000);
    return () => clearTimeout(timer);
  }, [position]);

  if (!position) return null;

  return (
    <div
      className="remote-cursor"
      style={{
        position: 'absolute',
        left: `${position.column * 7.2}px`, // Ancho aproximado de carácter
        top: `${position.lineNumber * 19}px`, // Altura de línea
        pointerEvents: 'none',
        zIndex: 1000,
        transition: 'all 0.15s ease-out',
      }}
    >
      {/* Línea vertical del cursor */}
      <div
        style={{
          width: '2px',
          height: '19px',
          backgroundColor: user.color,
          animation: isTyping ? 'pulse 1s infinite' : 'none',
        }}
      />

      {/* Etiqueta con nombre */}
      {(showLabel || isTyping) && (
        <div
          style={{
            position: 'absolute',
            top: '-24px',
            left: '0',
            backgroundColor: user.color,
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {user.name}
          {isTyping && (
            <span
              style={{
                marginLeft: '4px',
                animation: 'blink 1s infinite',
              }}
            >
              ✍️
            </span>
          )}
        </div>
      )}

      {/* Animaciones CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
