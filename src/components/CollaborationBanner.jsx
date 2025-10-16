import { Users, Wifi } from 'lucide-react';

/**
 * Banner de colaboración que muestra usuarios activos
 */
export default function CollaborationBanner({ 
  isCollaborating, 
  activeUsers, 
  currentUser,
  onOpenPanel 
}) {
  if (!isCollaborating) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm rounded-lg shadow-lg border border-blue-500/30 cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all"
      onClick={onOpenPanel}
      title="Click para ver detalles de la sesión"
    >
      <Wifi className="w-4 h-4 text-white animate-pulse" />
      
      <div className="flex items-center gap-1">
        <Users className="w-4 h-4 text-white" />
        <span className="text-xs font-medium text-white">
          {activeUsers.length} {activeUsers.length === 1 ? 'usuario' : 'usuarios'} en línea
        </span>
      </div>

      <div className="flex items-center -space-x-2 ml-2">
        {activeUsers.slice(0, 5).map((user) => (
          <div
            key={user.id}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm"
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
        ))}
        {activeUsers.length > 5 && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-700 text-white text-xs font-bold border-2 border-white">
            +{activeUsers.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}
