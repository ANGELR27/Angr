import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, X, Github, Chrome } from 'lucide-react';

/**
 * 🔐 Modal de Autenticación para Colaboración
 * Requiere login para usar funciones colaborativas
 */
export default function AuthModal({ isOpen, onClose, onAuthSuccess, authMode = 'login' }) {
  const [mode, setMode] = useState(authMode); // 'login' o 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validaciones
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      if (mode === 'signup' && !displayName) {
        throw new Error('El nombre es requerido');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Llamar al callback con los datos
      await onAuthSuccess({
        mode,
        email,
        password,
        displayName: mode === 'signup' ? displayName : undefined
      });

      // Cerrar modal en caso de éxito
      onClose();
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError(err.message || 'Error al autenticar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setError('');
    setIsLoading(true);

    try {
      await onAuthSuccess({
        mode: 'social',
        provider
      });
      onClose();
    } catch (err) {
      console.error(`Error con ${provider}:`, err);
      setError(err.message || `Error al autenticar con ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#3e3e42] bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex items-center gap-3">
            {mode === 'login' ? (
              <LogIn className="w-6 h-6 text-blue-400" />
            ) : (
              <UserPlus className="w-6 h-6 text-purple-400" />
            )}
            <h2 className="text-xl font-bold text-white">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-blue-900/20 border-b border-blue-600/30">
          <p className="text-sm text-blue-200 text-center">
            🔐 Se requiere autenticación para usar la colaboración en tiempo real
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Formulario Email/Password */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full bg-[#2d2d30] border border-[#3e3e42] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-[#2d2d30] border border-[#3e3e42] rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#2d2d30] border border-[#3e3e42] rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-gray-400 mt-1">
                  Mínimo 6 caracteres, combina mayúsculas y números
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-sm text-red-300">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#3e3e42]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1e1e1e] text-gray-400">
                O continúa con
              </span>
            </div>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialAuth('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg transition-colors border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5" />
              Continuar con Google
            </button>

            <button
              onClick={() => handleSocialAuth('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#24292e] hover:bg-[#1a1e22] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5" />
              Continuar con GitHub
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              disabled={isLoading}
            >
              {mode === 'login' ? (
                <>¿No tienes cuenta? <span className="font-semibold">Regístrate aquí</span></>
              ) : (
                <>¿Ya tienes cuenta? <span className="font-semibold">Inicia sesión</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#252526] border-t border-[#3e3e42]">
          <p className="text-xs text-gray-400 text-center">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad
          </p>
        </div>
      </div>
    </div>
  );
}
