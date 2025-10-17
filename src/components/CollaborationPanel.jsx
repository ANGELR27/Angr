import { useState } from 'react';
import { 
  Users, X, Crown, Edit, Eye, Shield, UserX, 
  ChevronDown, ChevronUp, Copy, Check, LogOut 
} from 'lucide-react';

/**
 * Panel de colaboración que muestra usuarios activos y control de acceso
 */
export default function CollaborationPanel({ 
  isOpen, 
  onClose, 
  activeUsers = [], 
  currentUser, 
  currentSession,
  remoteCursors = {},
  typingUsers = {},
  activeFile,
  onChangePermissions,
  onLeaveSession 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const isOwner = currentUser?.role === 'owner';
  const shareLink = currentSession?.id 
    ? `${window.location.origin}?session=${currentSession.id}`
    : '';

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-blue-400" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-400" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner':
        return 'Propietario';
      case 'editor':
        return 'Editor';
      case 'viewer':
        return 'Observador';
      default:
        return 'Usuario';
    }
  };

  return (
    <div className="fixed right-4 top-20 z-40 w-80 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#3e3e42] bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">
            Colaboración Activa
          </h3>
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
            {activeUsers.length} en línea
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Session Info */}
      <div className="p-3 border-b border-[#3e3e42] bg-[#252526]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Sesión:</span>
          <span className="text-xs text-white font-mono">
            {currentSession?.name || 'Sin nombre'}
          </span>
        </div>

        {/* Session ID */}
        <div className="flex items-center justify-between mb-2 p-2 bg-[#1e1e1e] rounded border border-[#3e3e42]">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">ID de Sesión:</span>
            <span className="text-sm text-blue-400 font-bold font-mono">
              {currentSession?.id || 'N/A'}
            </span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(currentSession?.id || '');
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex items-center gap-1"
          >
            {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedLink ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        
        {/* Share Link */}
        {shareLink && (
          <div className="flex gap-1">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 bg-[#1e1e1e] border border-[#3e3e42] rounded px-2 py-1 text-xs text-white font-mono"
            />
            <button
              onClick={copyShareLink}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
              title="Copiar enlace"
            >
              {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="p-3 border-b border-[#3e3e42] bg-[#252526]">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: currentUser?.color }}
          >
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm text-white font-medium truncate">
                {currentUser?.name}
              </span>
              <span className="text-xs text-gray-400">(tú)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              {getRoleIcon(currentUser?.role)}
              <span>{getRoleLabel(currentUser?.role)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-[#2d2d30] transition-colors"
        >
          <span className="text-sm text-gray-300 font-medium">
            Usuarios Activos ({activeUsers.length})
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="max-h-64 overflow-y-auto">
            {activeUsers.map((user) => {
              const isCurrentUser = user.id === currentUser?.id;
              const userCursor = remoteCursors[user.id];
              const isInSameFile = userCursor?.filePath === activeFile;
              const isTyping = typingUsers[user.id];
              const typingFile = isTyping?.filePath;

              return (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-3 hover:bg-[#2d2d30] transition-colors border-b border-[#3e3e42] last:border-b-0"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm relative"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                    {isTyping && (
                      <div 
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1e1e1e]"
                        style={{ animation: 'pulse 1s infinite' }}
                      />
                    )}
                    {!isTyping && isInSameFile && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#1e1e1e]" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-white truncate">
                        {user.name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-gray-400">(tú)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {getRoleIcon(user.role)}
                      <span>{getRoleLabel(user.role)}</span>
                      {isTyping && (
                        <span className="text-green-400 ml-1 animate-pulse">
                          ✍️ Escribiendo{typingFile ? ` en ${typingFile.split('/').pop()}` : '...'}
                        </span>
                      )}
                      {!isTyping && isInSameFile && (
                        <span className="text-blue-400 ml-1">• Mismo archivo</span>
                      )}
                      {!isTyping && !isInSameFile && userCursor?.filePath && (
                        <span className="text-gray-500 ml-1">
                          👁️ {userCursor.filePath.split('/').pop()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for owner */}
                  {isOwner && !isCurrentUser && (
                    <div className="flex gap-1">
                      <select
                        value={user.role}
                        onChange={(e) => onChangePermissions(user.id, e.target.value)}
                        className="text-xs bg-[#1e1e1e] border border-[#3e3e42] rounded px-2 py-1 text-white"
                        title="Cambiar rol"
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Observador</option>
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-[#3e3e42] bg-[#252526]">
        <button
          onClick={onLeaveSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Salir de la Sesión</span>
        </button>
      </div>

      {/* Permissions Legend */}
      <div className="p-3 border-t border-[#3e3e42] bg-[#1e1e1e]">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="font-medium mb-1">Permisos:</div>
          <div className="flex items-center gap-2">
            <Crown className="w-3 h-3 text-yellow-400" />
            <span>Propietario: Control total</span>
          </div>
          <div className="flex items-center gap-2">
            <Edit className="w-3 h-3 text-blue-400" />
            <span>Editor: Puede editar archivos</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-3 h-3 text-gray-400" />
            <span>Observador: Solo lectura</span>
          </div>
        </div>
      </div>
    </div>
  );
}
