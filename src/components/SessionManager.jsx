import { useState } from 'react';
import { Users, Copy, Check, Lock, Globe, UserPlus, X, Share2, LogIn, Settings } from 'lucide-react';

/**
 * Componente para gestionar sesiones de colaboración
 */
export default function SessionManager({ 
  isOpen, 
  onClose, 
  onCreateSession, 
  onJoinSession,
  isConfigured 
}) {
  const [mode, setMode] = useState('menu'); // menu, create, join
  const [sessionName, setSessionName] = useState('');
  const [userName, setUserName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [accessControl, setAccessControl] = useState('public');
  const [password, setPassword] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreateSession = async () => {
    if (!userName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    try {
      setError('');
      const result = await onCreateSession({
        sessionName: sessionName || 'Sesión sin nombre',
        userName: userName.trim(),
        accessControl,
        password: accessControl === 'private' ? password : null,
      });

      setShareLink(result.shareLink);
      setMode('created');
    } catch (err) {
      setError(err.message || 'Error al crear la sesión');
    }
  };

  const handleJoinSession = async () => {
    if (!userName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!sessionId.trim()) {
      setError('Por favor ingresa el ID de la sesión');
      return;
    }

    try {
      setError('');
      await onJoinSession(sessionId.trim(), {
        userName: userName.trim(),
        password: password || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error al unirse a la sesión');
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setMode('menu');
    setSessionName('');
    setUserName('');
    setSessionId('');
    setPassword('');
    setShareLink('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42] bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              {mode === 'menu' && 'Colaboración en Tiempo Real'}
              {mode === 'create' && 'Crear Sesión'}
              {mode === 'join' && 'Unirse a Sesión'}
              {mode === 'created' && '¡Sesión Creada!'}
            </h2>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advertencia si no está configurado */}
        {!isConfigured && (
          <div className="p-4 bg-yellow-900/20 border-b border-yellow-600/30">
            <div className="flex items-start gap-2">
              <Settings className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-yellow-200 font-medium">
                  Configuración Requerida
                </p>
                <p className="text-xs text-yellow-300/80 mt-1">
                  Para usar colaboración en tiempo real, necesitas configurar Supabase.
                  Crea un archivo <code className="bg-black/30 px-1 rounded">.env</code> con:
                </p>
                <pre className="text-xs bg-black/30 p-2 rounded mt-2 text-yellow-200">
VITE_SUPABASE_URL=tu_url_aqui{'\n'}
VITE_SUPABASE_ANON_KEY=tu_key_aqui
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Menu Principal */}
          {mode === 'menu' && (
            <div className="space-y-3">
              <button
                onClick={() => setMode('create')}
                disabled={!isConfigured}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg hover:shadow-blue-500/50"
              >
                <Share2 className="w-5 h-5" />
                <div className="text-left flex-1">
                  <div className="font-semibold">Crear Nueva Sesión</div>
                  <div className="text-xs opacity-90">Inicia una sesión y comparte el enlace</div>
                </div>
              </button>

              <button
                onClick={() => setMode('join')}
                disabled={!isConfigured}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
              >
                <LogIn className="w-5 h-5" />
                <div className="text-left flex-1">
                  <div className="font-semibold">Unirse a Sesión</div>
                  <div className="text-xs opacity-90">Ingresa con un ID de sesión existente</div>
                </div>
              </button>
            </div>
          )}

          {/* Formulario Crear Sesión */}
          {mode === 'create' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tu Nombre *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full bg-[#2d2d30] border border-[#3e3e42] rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la Sesión (opcional)
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Ej: Proyecto React"
                  className="w-full bg-[#2d2d30] border border-[#3e3e42] rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Control de Acceso
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 rounded hover:bg-[#2d2d30] cursor-pointer">
                    <input
                      type="radio"
                      name="access"
                      value="public"
                      checked={accessControl === 'public'}
                      onChange={(e) => setAccessControl(e.target.value)}
                      className="text-blue-500"
                    />
                    <Globe className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Pública - Cualquiera puede unirse</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded hover:bg-[#2d2d30] cursor-pointer">
                    <input
                      type="radio"
                      name="access"
                      value="private"
                      checked={accessControl === 'private'}
                      onChange={(e) => setAccessControl(e.target.value)}
                      className="text-blue-500"
                    />
                    <Lock className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Privada - Requiere contraseña</span>
                  </label>
                </div>
              </div>

              {accessControl === 'private' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa una contraseña"
                    className="w-full bg-[#2d2d30] border border-[#3e3e42] rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => resetForm()}
                  className="flex-1 px-4 py-2 bg-[#2d2d30] hover:bg-[#3e3e42] text-white rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateSession}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-lg"
                >
                  Crear Sesión
                </button>
              </div>
            </div>
          )}

          {/* Formulario Unirse a Sesión */}
          {mode === 'join' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tu Nombre *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ej: María García"
                  className="w-full bg-[#2d2d30] border border-[#3e3e42] rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ID de Sesión *
                </label>
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Pega el ID de la sesión aquí"
                  className="w-full bg-[#2d2d30] border border-[#3e3e42] rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña (si es requerida)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  className="w-full bg-[#2d2d30] border border-[#3e3e42] rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => resetForm()}
                  className="flex-1 px-4 py-2 bg-[#2d2d30] hover:bg-[#3e3e42] text-white rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleJoinSession}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors shadow-lg"
                >
                  Unirse
                </button>
              </div>
            </div>
          )}

          {/* Sesión Creada */}
          {mode === 'created' && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-white font-medium">¡Sesión creada exitosamente!</p>
                <p className="text-sm text-gray-400 mt-1">
                  Comparte este enlace para que otros se unan
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enlace para compartir
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 bg-[#2d2d30] border border-[#3e3e42] rounded px-3 py-2 text-white font-mono text-sm"
                  />
                  <button
                    onClick={copyShareLink}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Comenzar a Colaborar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
