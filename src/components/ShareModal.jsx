import { useState } from 'react';
import { X, Copy, Check, QrCode, Link2, Mail, Download } from 'lucide-react';

/**
 * 🔗 Modal para compartir sesión de colaboración
 * Con links cortos, QR code, y múltiples opciones
 */
export default function ShareModal({ isOpen, onClose, shareData, theme }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen || !shareData) return null;

  const { fullLink, embedLink, qrCode, sessionId } = shareData;

  const handleCopy = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Únete a mi sesión de código',
          text: `Colabora conmigo en tiempo real. Código de sesión: ${sessionId}`,
          url: fullLink,
        });
      } catch (error) {
        console.log('Error al compartir:', error);
      }
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `session-${sessionId}-qr.png`;
    link.click();
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Únete a mi sesión de código colaborativo');
    const body = encodeURIComponent(
      `¡Hola!\n\nTe invito a colaborar conmigo en tiempo real.\n\n` +
      `Código de sesión: ${sessionId}\n` +
      `Link directo: ${fullLink}\n\n` +
      `¡Nos vemos allí! 🚀`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`w-full max-w-lg rounded-xl shadow-2xl ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Link2 size={24} className="text-blue-500" />
              Compartir Sesión
            </h2>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Invita a otros a colaborar en tiempo real
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Código de sesión destacado */}
          <div className={`p-4 rounded-lg border-2 border-dashed ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-blue-500/30' 
              : 'bg-blue-50 border-blue-300'
          }`}>
            <div className="text-center">
              <p className={`text-xs font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Código de Sesión
              </p>
              <p className="text-3xl font-mono font-bold text-blue-500 tracking-wider">
                {sessionId}
              </p>
            </div>
          </div>

          {/* Link completo */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Link Directo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={fullLink}
                readOnly
                className={`flex-1 px-4 py-2.5 rounded-lg font-mono text-sm border ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-300'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
              <button
                onClick={() => handleCopy(fullLink)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {copied ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-3">
            {/* QR Code */}
            <button
              onClick={() => setShowQR(!showQR)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200'
              }`}
            >
              <QrCode size={18} />
              <span>Ver QR</span>
            </button>

            {/* Compartir (si disponible) */}
            {navigator.share && (
              <button
                onClick={handleShare}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30'
                    : 'bg-green-50 hover:bg-green-100 text-green-600 border border-green-200'
                }`}
              >
                <Link2 size={18} />
                <span>Compartir</span>
              </button>
            )}

            {/* Email */}
            <button
              onClick={shareViaEmail}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30'
                  : 'bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200'
              }`}
            >
              <Mail size={18} />
              <span>Email</span>
            </button>
          </div>

          {/* QR Code Display */}
          {showQR && (
            <div className={`p-4 rounded-lg text-center ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <img
                src={qrCode}
                alt="QR Code"
                className="mx-auto w-64 h-64 rounded-lg"
              />
              <p className={`text-xs mt-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Escanea con tu móvil para unirte
              </p>
              <button
                onClick={handleDownloadQR}
                className={`mt-3 flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                <Download size={16} />
                Descargar QR
              </button>
            </div>
          )}

          {/* Instrucciones */}
          <div className={`p-4 rounded-lg text-sm ${
            theme === 'dark' 
              ? 'bg-gray-900/50 text-gray-400' 
              : 'bg-gray-50 text-gray-600'
          }`}>
            <p className="font-medium mb-2">📌 Cómo compartir:</p>
            <ul className="space-y-1 text-xs">
              <li>• Copia el link y envíalo por WhatsApp, Telegram, etc.</li>
              <li>• Comparte el código de sesión (5 caracteres)</li>
              <li>• Escanea el QR code desde móvil</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-6 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Los usuarios podrán editar en tiempo real
          </p>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
