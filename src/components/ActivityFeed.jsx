import { useState } from 'react';
import { 
  Activity, 
  MessageCircle, 
  FileText, 
  Users, 
  Code,
  Save,
  X,
  Minimize2,
  Maximize2,
  Clock
} from 'lucide-react';

/**
 * Feed de actividad en tiempo real del equipo
 * Muestra acciones de usuarios, cambios en archivos, mensajes, etc.
 */
export default function ActivityFeed({ 
  activities = [], 
  isOpen, 
  onClose,
  isMinimized = false,
  onToggleMinimize 
}) {
  const [filter, setFilter] = useState('all'); // all, chat, file, user

  const getActivityIcon = (type) => {
    const icons = {
      chat_message: MessageCircle,
      chat_received: MessageCircle,
      file_change: FileText,
      file_saved: Save,
      code_execution: Code,
      user_joined: Users,
      user_left: Users,
      notification: Activity,
      permission_change: Users,
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colors = {
      chat_message: 'text-purple-400',
      chat_received: 'text-purple-400',
      file_change: 'text-blue-400',
      file_saved: 'text-green-400',
      code_execution: 'text-yellow-400',
      user_joined: 'text-green-400',
      user_left: 'text-gray-400',
      notification: 'text-indigo-400',
      permission_change: 'text-orange-400',
    };
    return colors[type] || 'text-gray-400';
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'chat') return activity.type.includes('chat');
    if (filter === 'file') return activity.type.includes('file') || activity.type.includes('code');
    if (filter === 'user') return activity.type.includes('user') || activity.type.includes('permission');
    return true;
  });

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed right-4 z-40 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
        isMinimized 
          ? 'bottom-24 w-80 h-16' 
          : 'bottom-24 w-96 h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#3e3e42] bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">
            Actividad del Equipo
          </h3>
          {filteredActivities.length > 0 && (
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
              {filteredActivities.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleMinimize}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title={isMinimized ? 'Maximizar' : 'Minimizar'}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contenido minimizado */}
      {isMinimized && (
        <div 
          className="p-3 cursor-pointer hover:bg-[#2d2d30] transition-colors"
          onClick={onToggleMinimize}
        >
          <p className="text-xs text-gray-400">
            {filteredActivities.length > 0 
              ? `${filteredActivities[filteredActivities.length - 1].description}`
              : 'Sin actividad reciente'
            }
          </p>
        </div>
      )}

      {/* Contenido completo */}
      {!isMinimized && (
        <>
          {/* Filtros */}
          <div className="flex gap-1 p-2 border-b border-[#3e3e42] bg-[#252526]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#3e3e42] text-gray-400 hover:text-white'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => setFilter('chat')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filter === 'chat'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#3e3e42] text-gray-400 hover:text-white'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setFilter('file')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filter === 'file'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#3e3e42] text-gray-400 hover:text-white'
              }`}
            >
              📄 Archivos
            </button>
            <button
              onClick={() => setFilter('user')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filter === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#3e3e42] text-gray-400 hover:text-white'
              }`}
            >
              👥 Usuarios
            </button>
          </div>

          {/* Lista de actividad */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100%-120px)]">
            {filteredActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Activity className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Sin actividad reciente</p>
              </div>
            ) : (
              filteredActivities.slice().reverse().map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);

                return (
                  <div
                    key={activity.id}
                    className="flex gap-3 p-2 rounded hover:bg-[#2d2d30] transition-colors"
                  >
                    {/* Icono y línea */}
                    <div className="flex flex-col items-center">
                      <div className={`${colorClass} flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 w-px bg-[#3e3e42] mt-2" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0 pb-2">
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-white">
                          {activity.userName || 'Sistema'}
                        </span>
                        {' '}
                        <span className="text-gray-400">{activity.description}</span>
                      </p>

                      {/* Metadata */}
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          {activity.metadata.fileName && (
                            <span className="inline-flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {activity.metadata.fileName}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatTime(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
