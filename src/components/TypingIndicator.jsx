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
          bottom: 10px;
          left: 10px;
          z-index: 1000;
          pointer-events: none;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(30, 30, 30, 0.95);
          backdrop-filter: blur(10px);
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 12px;
          color: #e0e0e0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .typing-users {
          font-weight: 600;
        }

        .typing-text {
          color: #999;
        }

        .typing-dots {
          display: flex;
          gap: 3px;
          align-items: center;
        }

        .typing-dots span {
          width: 4px;
          height: 4px;
          background: #666;
          border-radius: 50%;
          animation: typing-bounce 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing-bounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default TypingIndicator;
