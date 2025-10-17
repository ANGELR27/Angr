/**
 * Indicador de usuario activo en un archivo
 */
export default function ActiveUserIndicator({ users }) {
  if (!users || users.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2 ml-2">
      {users.slice(0, 3).map((user, index) => (
        <div
          key={user.id}
          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#1e1e1e] shadow-sm relative hover:z-10 transition-transform hover:scale-110"
          style={{ 
            backgroundColor: user.color,
            animation: `pulse 2s infinite ${index * 0.2}s`
          }}
          title={`${user.name} está ${user.isTyping ? 'escribiendo' : 'viendo'} este archivo`}
        >
          {user.name.charAt(0).toUpperCase()}
          {user.isTyping && (
            <div
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-400 border border-[#1e1e1e]"
              style={{ animation: 'blink 1s infinite' }}
            />
          )}
        </div>
      ))}
      
      {users.length > 3 && (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-700 text-white text-[9px] font-bold border-2 border-[#1e1e1e]"
          title={`+${users.length - 3} más`}
        >
          +{users.length - 3}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 currentColor;
          }
          50% {
            box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 30%, transparent);
          }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
