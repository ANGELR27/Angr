/**
 * Efecto de pulso/onda al ejecutar código
 * Se activa con Ctrl+Alt+S
 */
const ExecutionPulse = ({ show, isError }) => {
  if (!show) return null;

  const color = isError
    ? 'rgba(239, 68, 68, 0.4)' // Rojo para errores
    : 'rgba(59, 130, 246, 0.4)'; // Azul para éxito

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Onda expansiva 1 */}
      <div
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: `3px solid ${color}`,
          animation: 'pulseWave 1.5s ease-out',
        }}
      />

      {/* Onda expansiva 2 */}
      <div
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: `2px solid ${color}`,
          animation: 'pulseWave 1.5s ease-out 0.2s',
        }}
      />

      {/* Onda expansiva 3 */}
      <div
        style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: `1px solid ${color}`,
          animation: 'pulseWave 1.5s ease-out 0.4s',
        }}
      />

      {/* Flash central */}
      <div
        style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animation: 'pulseFlash 1.5s ease-out',
        }}
      />

      <style>{`
        @keyframes pulseWave {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(15);
            opacity: 0;
          }
        }

        @keyframes pulseFlash {
          0% {
            opacity: 1;
            transform: scale(0.5);
          }
          50% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default ExecutionPulse;
