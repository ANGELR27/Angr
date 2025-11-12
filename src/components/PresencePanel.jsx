import { useState } from 'react';
import { 
  Users, 
  Crown, 
  Edit3, 
  Eye, 
  ChevronDown,
  ChevronUp,
  Circle,
  MoreVertical,
  Shield
} from 'lucide-react';

/**
 * Panel mejorado de presencia con avatares, estados y roles
 * Muestra usuarios activos con indicadores visuales y opciones de gestión
 */
export default function PresencePanel({ 
  activeUsers = [], 
  currentUser,
  onChangePermissions
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const getRoleIcon = (role) => {
    const icons = {
      owner: Crown,
      editor: Edit3,
      viewer: Eye,
    };
    return icons[role] || Eye;
  };

  const getRoleColor = (role) => {
    const colors = {
      owner: 'text-yellow-400',
      editor: 'text-blue-400',
      viewer: 'text-gray-400',
    };
    return colors[role] || 'text-gray-400';
  };

  const getRoleName = (role) => {
    const names = {
      owner: 'Propietario',
      editor: 'Editor',
      viewer: 'Observador',
    };
    return names[role] || 'Usuario';
  };

  const handleRoleChange = (userId, newRole) => {
    if (onChangePermissions && currentUser?.role === 'owner') {
      onChangePermissions(userId, newRole);
      setSelectedUser(null);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isOwner = currentUser?.role === 'owner';

  return (
    <div className="fixed top-20 right-4 z-30 w-80 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 border-b border-[#3e3e42] bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">
            Equipo Activo
          </h3>
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
            {activeUsers.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Lista de usuarios */}
      {isExpanded && (
        <div className="max-h-[400px] overflow-y-auto">
          {activeUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sin usuarios conectados</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3e3e42]">
              {activeUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                const roleColor = getRoleColor(user.role);
                const isCurrentUser = user.id === currentUser?.id;

                return (
                  <div
                    key={user.id}
                    className={`p-3 hover:bg-[#2d2d30] transition-colors ${
                      isCurrentUser ? 'bg-blue-500/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg"
                          style={{ backgroundColor: user.color || '#888' }}
                        >
                          {getInitials(user.name)}
                        </div>
                        {/* Indicador de online */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1e1e1e]" />
                      </div>

                      {/* Info del usuario */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate">
                            {user.name}
                            {isCurrentUser && (
                              <span className="ml-1 text-xs text-blue-400">(Tú)</span>
                            )}
                          </p>
                        </div>

                        {/* Rol */}
                        <div className={`flex items-center gap-1 ${roleColor}`}>
                          <RoleIcon className="w-3 h-3" />
                          <span className="text-xs">
                            {getRoleName(user.role)}
                          </span>
                        </div>
                      </div>

                      {/* Menú de opciones (solo para owner) */}
                      {isOwner && !isCurrentUser && (
                        <div className="relative">
                          <button
                            onClick={() => setSelectedUser(
                              selectedUser === user.id ? null : user.id
                            )}
                            className="p-1 hover:bg-[#3e3e42] rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>

                          {/* Dropdown de roles */}
                          {selectedUser === user.id && (
                            <div className="absolute right-0 top-8 w-40 bg-[#2d2d30] border border-[#3e3e42] rounded-lg shadow-xl overflow-hidden z-50">
                              <div className="p-2">
                                <p className="text-xs text-gray-400 px-2 py-1">
                                  Cambiar rol
                                </p>
                                
                                <button
                                  onClick={() => handleRoleChange(user.id, 'editor')}
                                  className="w-full flex items-center gap-2 px-2 py-2 hover:bg-[#3e3e42] rounded transition-colors text-left"
                                  disabled={user.role === 'editor'}
                                >
                                  <Edit3 className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm text-white">Editor</span>
                                </button>

                                <button
                                  onClick={() => handleRoleChange(user.id, 'viewer')}
                                  className="w-full flex items-center gap-2 px-2 py-2 hover:bg-[#3e3e42] rounded transition-colors text-left"
                                  disabled={user.role === 'viewer'}
                                >
                                  <Eye className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-white">Observador</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer con leyenda */}
          {activeUsers.length > 0 && (
            <div className="p-3 border-t border-[#3e3e42] bg-[#252526]">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                  <span>Conectado</span>
                </div>
                {isOwner && (
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Gestor</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
