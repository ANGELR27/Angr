import { useMemo } from 'react';

/**
 * Indicador visual de usuarios escribiendo en tiempo real
 * Similar a Google Docs
 */
function TypingIndicator({ typingUsers, activePath, remoteCursors }) {
  // Filtrar usuarios que están escribiendo en el archivo actual
  const activeTypingUsers = useMemo(() => {
    return Object.entries(typingUsers || {})
      .filter(([userId, data]) => data.filePath === activePath)
      .map(([userId]) => {
        // Obtener información del usuario desde remoteCursors
        const userInfo = remoteCursors?.[userId];
        return userInfo ? {
          id: userId,
          name: userInfo.userName,
          color: userInfo.userColor
        } : null;
      })
      .filter(Boolean);
  }, [typingUsers, activePath, remoteCursors]);

  if (activeTypingUsers.length === 0) return null;

  return (
    <div className="typing-indicator-container">
      <div className="typing-indicator">
        <div className="typing-users">
          {activeTypingUsers.map((user, index) => (
            <span key={user.id} style={{ color: user.color }}>
              {user.name}
              {index < activeTypingUsers.length - 1 && ', '}
            </span>
          ))}
        </div>
        <span className="typing-text">
          {activeTypingUsers.length === 1 ? 'está escribiendo' : 'están escribiendo'}
        </span>
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <style>{`
        .typing-indicator-container {
          position: absolute;
          bottom: 12px;
          left: 12px;
          z-index: 1000;
          pointer-events: none;
          animation: slideInFromLeft 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, rgba(40, 40, 45, 0.98) 0%, rgba(30, 30, 35, 0.98) 100%);
          backdrop-filter: blur(12px) saturate(180%);
          padding: 9px 16px;
          border-radius: 24px;
          font-size: 12px;
          color: #f0f0f0;
          box-shadow: 
            0 6px 20px rgba(0, 0, 0, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.2s ease;
        }

        .typing-indicator:hover {
          transform: translateY(-1px);
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.5),
            0 3px 10px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .typing-users {
          font-weight: 700;
          letter-spacing: 0.2px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .typing-text {
          color: #b0b0b0;
          font-weight: 500;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
          margin-left: 2px;
        }

        .typing-dots span {
          width: 5px;
          height: 5px;
          background: linear-gradient(135deg, #888 0%, #666 100%);
          border-radius: 50%;
          animation: typing-bounce 1.2s infinite ease-in-out;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .typing-dots span:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes typing-bounce {
          0%, 60%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          30% {
            transform: translateY(-7px) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default TypingIndicator;
