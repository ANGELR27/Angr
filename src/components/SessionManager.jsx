import { useState, useEffect } from 'react';
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
  const [mode, setMode] = useState('menu'); // menu, create, join, created
  const [sessionName, setSessionName] = useState('');
  const [userName, setUserName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [createdSessionId, setCreatedSessionId] = useState(''); // ID de la sesión creada
  const [accessControl, setAccessControl] = useState('public');
  const [password, setPassword] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Detectar ID de sesión en la URL cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSessionId = urlParams.get('session');
      
      if (urlSessionId) {
        // Si hay un ID en la URL, ir directamente al modo "join" y pre-llenarlo
        setSessionId(urlSessionId);
        setMode('join');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateSession = async () => {
    // Validación de entrada
    if (!userName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (userName.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (accessControl === 'private' && !password) {
      setError('Por favor ingresa una contraseña para la sesión privada');
      return;
    }

    if (accessControl === 'private' && password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await onCreateSession({
        sessionName: sessionName.trim() || 'Sesión sin nombre',
        userName: userName.trim(),
        accessControl,
        password: accessControl === 'private' ? password : null,
      });

      setShareLink(result.shareLink);
      setCreatedSessionId(result.sessionId);
      setMode('created');
    } catch (err) {
      console.error('Error al crear sesión:', err);
      setError(err.message || 'Error al crear la sesión. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSession = async () => {
    // Validación de entrada
    if (!userName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (userName.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (!sessionId.trim()) {
      setError('Por favor ingresa el ID de la sesión');
      return;
    }

    if (sessionId.trim().length < 4) {
      setError('El ID de sesión parece incorrecto. Verifica que lo hayas copiado correctamente.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onJoinSession(sessionId.trim(), {
        userName: userName.trim(),
        password: password || null,
      });
      
      // Éxito - cerrar modal
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error al unirse a sesión:', err);
      
      // Mensajes de error más descriptivos
      if (err.message.includes('not found') || err.message.includes('no existe')) {
        setError('Sesión no encontrada. Verifica que el ID sea correcto.');
      } else if (err.message.includes('password') || err.message.includes('contraseña')) {
        setError('Contraseña incorrecta. Verifica con quien compartió la sesión.');
      } else {
        setError(err.message || 'Error al unirse a la sesión. Por favor intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    // Limpiar el parámetro de URL si el usuario cancela sin unirse
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('session')) {
      urlParams.delete('session');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState({}, '', newUrl);
    }
    
    setMode('menu');
    setSessionName('');
    setUserName('');
    setSessionId('');
    setCreatedSessionId('');
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
              {mode === 'join' && (sessionId ? `Unirse a Sesión ${sessionId}` : 'Unirse a Sesión')}
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
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creando...
                    </>
                  ) : (
                    'Crear Sesión'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Formulario Unirse a Sesión */}
          {mode === 'join' && (
            <div className="space-y-4">
              {/* Mensaje cuando viene de URL */}
              {sessionId && (
                <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded text-sm text-blue-300">
                  <p className="font-medium mb-1">¡Te han invitado a colaborar!</p>
                  <p className="text-xs text-gray-400">Ingresa tu nombre para unirte a la sesión</p>
                </div>
              )}

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
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ID de Sesión {sessionId && '(Detectado automáticamente)'}
                </label>
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Pega el ID de la sesión aquí"
                  disabled={!!sessionId}
                  className={`w-full border rounded px-3 py-2 text-white placeholder-gray-500 font-mono text-sm ${
                    sessionId 
                      ? 'bg-[#1e1e1e] border-blue-500/50 cursor-not-allowed' 
                      : 'bg-[#2d2d30] border-[#3e3e42] focus:outline-none focus:border-purple-500'
                  }`}
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
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uniéndose...
                    </>
                  ) : (
                    'Unirse'
                  )}
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
                  Comparte este ID o enlace para que otros se unan
                </p>
              </div>

              {/* ID de Sesión destacado */}
              <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  ID de Sesión
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-center py-3 bg-[#1e1e1e] rounded border border-[#3e3e42]">
                    <span className="text-2xl font-bold text-blue-400 font-mono tracking-wider">
                      {createdSessionId}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdSessionId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    title="Copiar ID"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Tus compañeros pueden ingresar este ID para unirse
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  O comparte el enlace completo
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
                <p className="text-xs text-gray-400 mt-1">
                  Con el enlace se unirán automáticamente
                </p>
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
