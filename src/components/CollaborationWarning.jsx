import { AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

/**
 * Advertencia visual cuando Supabase no está configurado
 */
function CollaborationWarning({ isConfigured, onClose }) {
  const [copied, setCopied] = useState(false);

  if (isConfigured) return null;

  const envExample = `VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 p-4">
      <div 
        className="max-w-2xl w-full rounded-xl p-6 shadow-2xl"
        style={{
          backgroundColor: 'var(--theme-background-secondary)',
          border: '2px solid rgba(234, 179, 8, 0.5)'
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
          >
            <AlertTriangle className="w-8 h-8" style={{ color: '#eab308' }} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--theme-text)' }}>
              Colaboración No Configurada
            </h2>
            <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
              Para habilitar la colaboración en tiempo real, necesitas configurar Supabase
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-6">
          {/* Paso 1 */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Crear Proyecto en Supabase (Gratis)
            </h3>
            <p className="text-sm mb-2 ml-8" style={{ color: 'var(--theme-text-secondary)' }}>
              Ve a <a 
                href="https://supabase.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                supabase.com
                <ExternalLink className="w-3 h-3" />
              </a> y crea un proyecto gratuito (toma ~2 minutos)
            </p>
          </div>

          {/* Paso 2 */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Copiar Credenciales
            </h3>
            <p className="text-sm mb-2 ml-8" style={{ color: 'var(--theme-text-secondary)' }}>
              En tu proyecto de Supabase: <strong>Project Settings → API</strong>
            </p>
            <ul className="text-sm ml-8 space-y-1" style={{ color: 'var(--theme-text-secondary)' }}>
              <li>• Copia <strong>Project URL</strong></li>
              <li>• Copia <strong>anon/public key</strong></li>
            </ul>
          </div>

          {/* Paso 3 */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Crear Archivo .env
            </h3>
            <p className="text-sm mb-2 ml-8" style={{ color: 'var(--theme-text-secondary)' }}>
              En la raíz del proyecto, crea un archivo <code className="bg-black/30 px-1 rounded">.env</code>
            </p>
            <div className="ml-8 relative">
              <pre 
                className="text-xs p-3 rounded overflow-x-auto"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'var(--theme-text)' }}
              >
                {envExample}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 rounded transition-colors"
                style={{
                  backgroundColor: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                  color: copied ? '#22c55e' : 'var(--theme-text)'
                }}
                title="Copiar al portapapeles"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Paso 4 */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Reiniciar Servidor
            </h3>
            <p className="text-sm ml-8" style={{ color: 'var(--theme-text-secondary)' }}>
              Detén el servidor (Ctrl+C) y ejecuta <code className="bg-black/30 px-1 rounded">npm run dev</code> nuevamente
            </p>
          </div>

          {/* Nota */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              borderColor: 'rgba(59, 130, 246, 0.3)'
            }}
          >
            <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
              <strong className="text-blue-400">💡 Nota:</strong> Todas las demás funciones del editor 
              (preview, terminal, archivos) funcionan sin Supabase. Solo la colaboración en tiempo 
              real requiere esta configuración.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded transition-all"
            style={{
              backgroundColor: 'var(--theme-primary)',
              color: 'white'
            }}
          >
            Entendido
          </button>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 rounded transition-all text-center inline-flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'var(--theme-text)',
              border: '1px solid var(--theme-border)'
            }}
          >
            Ir a Supabase
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Link documentación */}
        <p className="text-center text-xs mt-4" style={{ color: 'var(--theme-text-secondary)' }}>
          ¿Necesitas ayuda? Lee <code className="bg-black/30 px-1 rounded">CONFIGURACION_RAPIDA.md</code>
        </p>
      </div>
    </div>
  );
}

export default CollaborationWarning;
