import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Check } from 'lucide-react';

// Importar las imágenes
import bg1 from '../img_theme/chica anime.jpg';
import bg2 from '../img_theme/pin by nysk.jpg';
import bg3 from '../img_theme/solo levelin extreme.jpg';
import bg4 from '../img_theme/solo loveling.avif';

const backgrounds = [
  { id: 'none', name: 'Sin fondo', preview: null },
  { id: 'bg1', name: 'Chica Anime', preview: bg1, image: bg1 },
  { id: 'bg2', name: 'Pin by NYSK', preview: bg2, image: bg2 },
  { id: 'bg3', name: 'Solo Leveling Extreme', preview: bg3, image: bg3 },
  { id: 'bg4', name: 'Solo Leveling', preview: bg4, image: bg4 },
];

function BackgroundSelector({ isOpen, onClose, currentBackground, onBackgroundChange }) {
  const [selectedBg, setSelectedBg] = useState(currentBackground || 'none');
  const [opacity, setOpacity] = useState(() => {
    return parseFloat(localStorage.getItem('background-opacity')) || 0.15;
  });
  const [blur, setBlur] = useState(() => {
    return parseFloat(localStorage.getItem('background-blur')) || 0;
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedBg(currentBackground || 'none');
    }
  }, [isOpen, currentBackground]);

  const handleSelect = (bgId) => {
    setSelectedBg(bgId);
    const selectedBgData = backgrounds.find(bg => bg.id === bgId);
    onBackgroundChange(bgId, selectedBgData?.image || null, opacity, blur);
  };

  const handleOpacityChange = (newOpacity) => {
    setOpacity(newOpacity);
    const selectedBgData = backgrounds.find(bg => bg.id === selectedBg);
    if (selectedBg !== 'none') {
      onBackgroundChange(selectedBg, selectedBgData?.image || null, newOpacity, blur);
    }
  };

  const handleBlurChange = (newBlur) => {
    setBlur(newBlur);
    const selectedBgData = backgrounds.find(bg => bg.id === selectedBg);
    if (selectedBg !== 'none') {
      onBackgroundChange(selectedBg, selectedBgData?.image || null, opacity, newBlur);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--theme-background)',
          border: '1px solid var(--theme-border)',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '80vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--theme-border)' }}
        >
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6" style={{ color: 'var(--theme-primary)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>
              Fondo del Editor
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--theme-text-secondary)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          {/* Controles de personalización */}
          {selectedBg !== 'none' && (
            <div className="mb-6 space-y-4">
              {/* Control de opacidad */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--theme-background-secondary)' }}>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>
                  Opacidad del fondo: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.01"
                  value={opacity}
                  onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                  className="w-full"
                  style={{ accentColor: 'var(--theme-primary)' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                  <span>Más transparente (mejor para leer)</span>
                  <span>Más visible</span>
                </div>
              </div>

              {/* Control de desenfoque */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--theme-background-secondary)' }}>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>
                  Desenfoque: {blur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={blur}
                  onChange={(e) => handleBlurChange(parseFloat(e.target.value))}
                  className="w-full"
                  style={{ accentColor: 'var(--theme-primary)' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                  <span>Nítido</span>
                  <span>Difuminado</span>
                </div>
              </div>
            </div>
          )}

          {/* Grid de fondos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {backgrounds.map((bg) => (
              <div
                key={bg.id}
                onClick={() => handleSelect(bg.id)}
                className="relative rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105"
                style={{
                  border: selectedBg === bg.id ? '3px solid var(--theme-primary)' : '1px solid var(--theme-border)',
                  backgroundColor: 'var(--theme-background-secondary)',
                  aspectRatio: '16/9',
                }}
              >
                {/* Preview de la imagen o placeholder */}
                {bg.preview ? (
                  <img
                    src={bg.preview}
                    alt={bg.name}
                    className="w-full h-full object-cover"
                    style={{ opacity: selectedBg === bg.id ? 1 : 0.7 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--theme-background)' }}>
                    <ImageIcon className="w-12 h-12" style={{ color: 'var(--theme-text-secondary)', opacity: 0.3 }} />
                  </div>
                )}

                {/* Overlay con check si está seleccionado */}
                {selectedBg === bg.id && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                    <div className="rounded-full p-2" style={{ backgroundColor: 'var(--theme-primary)' }}>
                      <Check className="w-6 h-6" style={{ color: 'white' }} />
                    </div>
                  </div>
                )}

                {/* Nombre del fondo */}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                  <p className="text-sm font-medium text-white text-center">{bg.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Información */}
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--theme-background-secondary)' }}>
            <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
              💡 <strong>Tip:</strong> El fondo se aplicará al editor y la terminal. Ajusta la opacidad para mantener una buena legibilidad del código.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: 'var(--theme-border)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--theme-background-secondary)',
              color: 'var(--theme-text)',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default BackgroundSelector;
