import { useEffect, useState } from 'react';

/**
 * Pantalla de carga creativa con animaciones
 */
const LoadingScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Progreso más rápido
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onLoadComplete?.(), 200);
          return 100;
        }
        // Progreso más rápido y variable
        return prev + Math.random() * 30 + 10;
      });
    }, 80);

    // Animación de puntos más rápida
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 300);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [onLoadComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(13, 13, 13, 0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Sombras de colores de fondo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle 600px at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 70%),
            radial-gradient(circle 500px at 80% 20%, rgba(255, 255, 100, 0.12) 0%, transparent 70%),
            radial-gradient(circle 550px at 50% 70%, rgba(168, 85, 247, 0.12) 0%, transparent 70%)
          `,
          animation: 'pulseColors 4s ease-in-out infinite',
        }}
      />

      {/* Logo/Icono central */}
      <div
        style={{
          position: 'relative',
          marginBottom: '40px',
        }}
      >
        {/* Círculos concéntricos animados */}
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            animation: 'expandRing 2s ease-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '2px solid rgba(168, 85, 247, 0.3)',
            animation: 'expandRing 2s ease-out infinite 0.5s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 100, 0.3)',
            animation: 'expandRing 2s ease-out infinite 1s',
          }}
        />

        {/* Símbolo de código */}
        <div
          style={{
            fontSize: '48px',
            fontFamily: '"Fira Code", "Consolas", monospace',
            color: '#fff',
            textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          {'</>'}
        </div>
      </div>

      {/* Texto "Cargando" */}
      <div
        style={{
          fontSize: '18px',
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '30px',
          fontWeight: '500',
          letterSpacing: '2px',
        }}
      >
        CARGANDO{dots}
      </div>

      {/* Barra de progreso */}
      <div
        style={{
          width: '300px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(progress, 100)}%`,
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 1) 0%, rgba(168, 85, 247, 1) 50%, rgba(255, 255, 100, 1) 100%)',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
          }}
        />
      </div>

      {/* Porcentaje */}
      <div
        style={{
          marginTop: '15px',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: '"Fira Code", monospace',
        }}
      >
        {Math.floor(progress)}%
      </div>

      {/* Partículas flotantes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            backgroundColor: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#a855f7' : '#ffff64',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.6,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes expandRing {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulseColors {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
