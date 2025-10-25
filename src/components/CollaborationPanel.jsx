import { useState } from 'react';
import { 
  Users, X, Crown, Edit, Eye, Shield, UserX, 
  ChevronDown, ChevronUp, Copy, Check, LogOut,
  Link2, UserCircle, Activity, FileText
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
        return <Crown className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
      default:
        return <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
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
    <div className="fixed right-4 top-20 z-40 w-80 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 dark:border-black/10 bg-white/5 dark:bg-black/5">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Colaboración Activa
          </h3>
          <span className="px-2 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full">
            {activeUsers.length} en línea
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Session Info - Simplified */}
      <div className="p-3 space-y-2 border-b border-white/10 dark:border-black/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Link2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Sesión</span>
          </div>
          <span className="text-xs text-gray-900 dark:text-white font-medium">
            {currentSession?.name || 'Sin nombre'}
          </span>
        </div>

        {/* Session Code - Compact */}
        <div className="flex items-center gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-lg border border-white/10 dark:border-black/10">
          <div className="flex-1">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Código</div>
            <div className="text-sm text-gray-900 dark:text-white font-bold font-mono tracking-wider">
              {currentSession?.id || 'N/A'}
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(currentSession?.id || '');
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg transition-colors"
            title="Copiar código"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Current User - Compact */}
      <div className="p-3 border-b border-white/10 dark:border-black/10">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg"
            style={{ backgroundColor: currentUser?.color }}
          >
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-900 dark:text-white font-medium truncate">
              {currentUser?.name}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
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
          className="w-full flex items-center justify-between p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <span className="text-sm text-gray-800 dark:text-gray-300 font-medium">
            Usuarios Activos ({activeUsers.length})
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
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
                  className="flex items-start gap-2 p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-white/10 dark:border-black/10 last:border-b-0"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm relative flex-shrink-0"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                    {isTyping && (
                      <div 
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"
                        style={{ animation: 'pulse 1s infinite' }}
                      />
                    )}
                    {!isTyping && isInSameFile && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-black" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">(ú)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        {getRoleIcon(user.role)}
                        <span>{getRoleLabel(user.role)}</span>
                      </div>
                      {isTyping && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <Activity className="w-3 h-3 animate-pulse" />
                          <span className="animate-pulse">
                            {typingFile ? typingFile.split('/').pop() : 'Escribiendo'}
                          </span>
                        </div>
                      )}
                      {!isTyping && isInSameFile && (
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <FileText className="w-3 h-3" />
                          <span>Mismo archivo</span>
                        </div>
                      )}
                      {!isTyping && !isInSameFile && userCursor?.filePath && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                          <FileText className="w-3 h-3" />
                          <span>{userCursor.filePath.split('/').pop()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for owner - Icon buttons */}
                  {isOwner && !isCurrentUser && (
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => onChangePermissions(user.id, 'editor')}
                        className={`p-1.5 rounded transition-all ${
                          user.role === 'editor'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-blue-500/20'
                        }`}
                        title="Cambiar a Editor"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onChangePermissions(user.id, 'viewer')}
                        className={`p-1.5 rounded transition-all ${
                          user.role === 'viewer'
                            ? 'bg-gray-500 text-white shadow-md'
                            : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20'
                        }`}
                        title="Cambiar a Observador"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-white/10 dark:border-black/10">
        <button
          onClick={onLeaveSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Salir de la Sesión</span>
        </button>
      </div>

      {/* Permissions Legend - Compact */}
      <div className="p-3 border-t border-white/10 dark:border-black/10">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center gap-1">
              <Crown className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
              <span className="text-[10px]">Propietario</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Edit className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span className="text-[10px]">Editor</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-[10px]">Observador</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
