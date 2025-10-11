import { useEffect, useState } from 'react';
import { Palette, X, Code2 } from 'lucide-react';

const THEMES = [
  { id: 'vs-dark', name: 'VS Dark', description: 'Tema oscuro por defecto' },
  { id: 'vs', name: 'VS Light', description: 'Tema claro' },
  { id: 'hc-black', name: 'High Contrast', description: 'Alto contraste' },
  { id: 'matrix', name: 'Matrix', description: 'Estilo Matrix verde' },
  { id: 'tokyo-night', name: 'Tokyo Night', description: 'Tokyo Night oscuro' },
  { id: 'dracula', name: 'Dracula', description: 'Tema Dracula' },
  { id: 'monokai', name: 'Monokai', description: 'Tema Monokai' },
  { id: 'github-dark', name: 'GitHub Dark', description: 'GitHub oscuro' },
  { id: 'cobalt2', name: 'Cobalt 2', description: 'Tema Cobalt azul' },
  { id: 'nord', name: 'Nord', description: 'Tema Nord ártico' },
  { id: 'one-dark-pro', name: 'One Dark Pro', description: 'Atom One Dark Pro' },
  { id: 'solarized-dark', name: 'Solarized Dark', description: 'Solarized oscuro' },
  { id: 'material-theme', name: 'Material Theme', description: 'Material Design' },
  { id: 'ayu-dark', name: 'Ayu Dark', description: 'Ayu tema oscuro' },
  { id: 'palenight', name: 'Palenight', description: 'Material Palenight' },
  { id: 'gruvbox-dark', name: 'Gruvbox Dark', description: 'Gruvbox retro' },
  { id: 'synthwave', name: 'Synthwave 84', description: 'Synthwave retro' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neón futurista vibrante' },
  { id: 'oceanic', name: 'Oceanic', description: 'Profundidades del océano' },
  { id: 'sunset', name: 'Sunset', description: 'Atardecer cálido' },
  { id: 'neon-dreams', name: 'Neon Dreams', description: 'Sueños de neón' },
  { id: 'forest', name: 'Forest', description: 'Bosque nocturno' },
];

function ThemeSelector({ isOpen, onClose, currentTheme, onThemeChange }) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [hoveredTheme, setHoveredTheme] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC para cerrar
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    onThemeChange(themeId);
    // Cerrar después de seleccionar
    setTimeout(() => onClose(), 500);
  };

  const getThemeColors = (themeId) => {
    const colors = {
      'matrix': { bg: '#0d0208', keyword: '#00ff41', string: '#39ff14', comment: '#00ff00', number: '#00ff88' },
      'tokyo-night': { bg: '#1a1b26', keyword: '#bb9af7', string: '#9ece6a', comment: '#565f89', number: '#ff9e64' },
      'dracula': { bg: '#282a36', keyword: '#ff79c6', string: '#f1fa8c', comment: '#6272a4', number: '#bd93f9' },
      'monokai': { bg: '#272822', keyword: '#f92672', string: '#e6db74', comment: '#75715e', number: '#ae81ff' },
      'github-dark': { bg: '#0d1117', keyword: '#ff7b72', string: '#a5d6ff', comment: '#8b949e', number: '#79c0ff' },
      'cobalt2': { bg: '#193549', keyword: '#ff9d00', string: '#3ad900', comment: '#0088ff', number: '#ff628c' },
      'nord': { bg: '#2e3440', keyword: '#81a1c1', string: '#a3be8c', comment: '#616e88', number: '#b48ead' },
      'one-dark-pro': { bg: '#282c34', keyword: '#c678dd', string: '#98c379', comment: '#5c6370', number: '#d19a66' },
      'solarized-dark': { bg: '#002b36', keyword: '#859900', string: '#2aa198', comment: '#586e75', number: '#d33682' },
      'material-theme': { bg: '#263238', keyword: '#c792ea', string: '#c3e88d', comment: '#546e7a', number: '#f78c6c' },
      'ayu-dark': { bg: '#0a0e14', keyword: '#ff8f40', string: '#aad94c', comment: '#acb6bf', number: '#ffb454' },
      'palenight': { bg: '#292d3e', keyword: '#c792ea', string: '#c3e88d', comment: '#676e95', number: '#f78c6c' },
      'gruvbox-dark': { bg: '#282828', keyword: '#fb4934', string: '#b8bb26', comment: '#928374', number: '#d3869b' },
      'synthwave': { bg: '#262335', keyword: '#ff7edb', string: '#fede5d', comment: '#848bbd', number: '#f97e72' },
      'cyberpunk': { bg: '#0a0014', keyword: '#ff006e', string: '#00f5ff', comment: '#7d5bff', number: '#ffbe0b' },
      'oceanic': { bg: '#03045e', keyword: '#00b4d8', string: '#90e0ef', comment: '#5fadcf', number: '#48cae4' },
      'sunset': { bg: '#2d1b2e', keyword: '#e76f51', string: '#f4d35e', comment: '#f4a261', number: '#ee964b' },
      'neon-dreams': { bg: '#10002b', keyword: '#9d4edd', string: '#ff006e', comment: '#b4a7d6', number: '#3a0ca3' },
      'forest': { bg: '#081c15', keyword: '#52b788', string: '#d8f3dc', comment: '#95d5b2', number: '#74c69d' },
      'vs-dark': { bg: '#1e1e1e', keyword: '#569cd6', string: '#ce9178', comment: '#6a9955', number: '#b5cea8' },
      'vs': { bg: '#ffffff', keyword: '#0000ff', string: '#a31515', comment: '#008000', number: '#098658' },
      'hc-black': { bg: '#000000', keyword: '#569cd6', string: '#ce9178', comment: '#7ca668', number: '#b5cea8' },
    };
    return colors[themeId] || colors['vs-dark'];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={onClose}>
      <div 
        className="rounded-lg w-[600px] max-h-[70vh] flex flex-col shadow-mixed-glow"
        style={{
          backgroundColor: 'var(--theme-background-secondary)',
          border: '1px solid color-mix(in srgb, var(--theme-primary) 40%, transparent)',
          boxShadow: '0 0 50px var(--theme-glow), 0 0 100px rgba(59, 130, 246, 0.3), 0 0 150px rgba(234, 179, 8, 0.2)',
          animation: 'pulseMixedGlow 3s ease-in-out infinite'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-4 rounded-t-lg relative" style={{
          backgroundColor: 'var(--theme-background-tertiary)',
          borderBottomColor: 'color-mix(in srgb, var(--theme-primary) 40%, transparent)'
        }}>
          <div className="absolute inset-0 rounded-t-lg pointer-events-none" style={{
            background: `linear-gradient(to right, 
              color-mix(in srgb, var(--theme-primary) 15%, transparent), 
              color-mix(in srgb, var(--theme-secondary) 15%, transparent), 
              transparent)`
          }}></div>
          
          <div className="flex items-center gap-2 relative z-10">
            <div className="shadow-blue-glow-strong p-1 rounded" style={{animation: 'pulseBlueGlow 2s ease-in-out infinite'}}>
              <Palette className="w-5 h-5" style={{color: 'var(--theme-primary)'}} />
            </div>
            <span className="text-sm font-medium" style={{color: 'var(--theme-text)'}}>Selector de Temas</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded transition-all border border-transparent hover:border-red-500/40 relative z-10"
            style={{color: '#ef4444'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ef444420'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info */}
        <div className="px-4 py-3 border-b" style={{
          backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)',
          borderBottomColor: 'var(--theme-border)'
        }}>
          <div className="flex flex-col gap-1">
            <p className="text-xs" style={{color: 'var(--theme-text-secondary)'}}>
              <kbd className="px-2 py-1 rounded border" style={{
                backgroundColor: 'var(--theme-background-tertiary)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-primary)'
              }}>Ctrl</kbd>
              {' + '}
              <kbd className="px-2 py-1 rounded border" style={{
                backgroundColor: 'var(--theme-background-tertiary)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-primary)'
              }}>Shift</kbd>
              {' + '}
              <kbd className="px-2 py-1 rounded border" style={{
                backgroundColor: 'var(--theme-background-tertiary)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-primary)'
              }}>T</kbd>
              {' '}para abrir/cerrar
            </p>
            <p className="text-xs" style={{color: 'var(--theme-text-secondary)'}}>
              O escribe <kbd className="px-2 py-1 rounded border" style={{
                backgroundColor: 'var(--theme-background-tertiary)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-accent)'
              }}>tema</kbd> en la terminal
            </p>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((theme, index) => (
              <div
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className="p-4 rounded-lg cursor-pointer transition-all border-2 relative group"
                style={{
                  borderColor: selectedTheme === theme.id ? 'var(--theme-primary)' : 'var(--theme-border)',
                  backgroundColor: selectedTheme === theme.id ? 'color-mix(in srgb, var(--theme-primary) 25%, transparent)' : 'var(--theme-background-tertiary)',
                  boxShadow: selectedTheme === theme.id ? '0 0 20px var(--theme-glow)' : 'none'
                }}
                onMouseEnter={(e) => {
                  setHoveredTheme(theme.id);
                  if (selectedTheme !== theme.id) {
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-primary) 60%, transparent)';
                    e.currentTarget.style.backgroundColor = 'var(--theme-surface)';
                  }
                }}
                onMouseLeave={(e) => {
                  setHoveredTheme(null);
                  if (selectedTheme !== theme.id) {
                    e.currentTarget.style.borderColor = 'var(--theme-border)';
                    e.currentTarget.style.backgroundColor = 'var(--theme-background-tertiary)';
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold" style={{color: 'var(--theme-text)'}}>{theme.name}</h3>
                  {selectedTheme === theme.id && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      backgroundColor: 'var(--theme-primary)',
                      color: 'white'
                    }}>
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{color: 'var(--theme-text-muted)'}}>{theme.description}</p>
                
                {/* Preview color bar */}
                <div className="mt-3 h-2 rounded-full overflow-hidden flex">
                  {theme.id === 'matrix' && (
                    <div className="flex-1 bg-gradient-to-r from-green-600 via-green-500 to-green-400"></div>
                  )}
                  {theme.id === 'tokyo-night' && (
                    <div className="flex-1 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400"></div>
                  )}
                  {theme.id === 'dracula' && (
                    <div className="flex-1 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400"></div>
                  )}
                  {theme.id === 'monokai' && (
                    <div className="flex-1 bg-gradient-to-r from-yellow-600 via-pink-500 to-purple-500"></div>
                  )}
                  {theme.id === 'github-dark' && (
                    <div className="flex-1 bg-gradient-to-r from-gray-700 via-blue-500 to-blue-400"></div>
                  )}
                  {theme.id === 'cobalt2' && (
                    <div className="flex-1 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400"></div>
                  )}
                  {theme.id === 'nord' && (
                    <div className="flex-1 bg-gradient-to-r from-blue-400 via-teal-400 to-cyan-300"></div>
                  )}
                  {theme.id === 'vs-dark' && (
                    <div className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400"></div>
                  )}
                  {theme.id === 'vs' && (
                    <div className="flex-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200"></div>
                  )}
                  {theme.id === 'hc-black' && (
                    <div className="flex-1 bg-gradient-to-r from-black via-gray-800 to-white"></div>
                  )}
                  {theme.id === 'one-dark-pro' && (
                    <div className="flex-1 bg-gradient-to-r from-slate-700 via-blue-600 to-cyan-500"></div>
                  )}
                  {theme.id === 'solarized-dark' && (
                    <div className="flex-1 bg-gradient-to-r from-slate-600 via-yellow-600 to-orange-500"></div>
                  )}
                  {theme.id === 'material-theme' && (
                    <div className="flex-1 bg-gradient-to-r from-indigo-600 via-teal-500 to-cyan-400"></div>
                  )}
                  {theme.id === 'ayu-dark' && (
                    <div className="flex-1 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500"></div>
                  )}
                  {theme.id === 'palenight' && (
                    <div className="flex-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500"></div>
                  )}
                  {theme.id === 'gruvbox-dark' && (
                    <div className="flex-1 bg-gradient-to-r from-orange-600 via-yellow-600 to-green-600"></div>
                  )}
                  {theme.id === 'synthwave' && (
                    <div className="flex-1 bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-400"></div>
                  )}
                  {theme.id === 'cyberpunk' && (
                    <div className="flex-1 bg-gradient-to-r from-purple-700 via-pink-600 to-cyan-400"></div>
                  )}
                  {theme.id === 'oceanic' && (
                    <div className="flex-1 bg-gradient-to-r from-blue-900 via-blue-600 to-cyan-400"></div>
                  )}
                  {theme.id === 'sunset' && (
                    <div className="flex-1 bg-gradient-to-r from-orange-700 via-red-500 to-yellow-400"></div>
                  )}
                  {theme.id === 'neon-dreams' && (
                    <div className="flex-1 bg-gradient-to-r from-purple-900 via-purple-600 to-pink-500"></div>
                  )}
                  {theme.id === 'forest' && (
                    <div className="flex-1 bg-gradient-to-r from-green-900 via-green-600 to-green-400"></div>
                  )}
                </div>

                {/* Preview de código al hover */}
                {hoveredTheme === theme.id && (
                  <div 
                    className={`absolute top-0 z-50 w-80 rounded-lg shadow-2xl border-2 overflow-hidden ${
                      index % 2 === 0 ? 'left-full ml-4' : 'right-full mr-4'
                    }`}
                    style={{ 
                      backgroundColor: getThemeColors(theme.id).bg,
                      borderColor: 'color-mix(in srgb, var(--theme-primary) 60%, transparent)'
                    }}
                  >
                    <div className="p-4 font-mono text-xs leading-relaxed">
                      <div className="flex items-center gap-2 mb-3 pb-2" style={{borderBottom: '1px solid var(--theme-border)'}}>
                        <Code2 className="w-4 h-4" style={{color: 'var(--theme-primary)'}} />
                        <span className="text-xs" style={{color: 'var(--theme-text-muted)'}}>Vista Previa</span>
                      </div>
                      <div>
                        <span style={{ color: getThemeColors(theme.id).comment }}>// Ejemplo de código</span>
                        <br />
                        <span style={{ color: getThemeColors(theme.id).keyword }}>function</span>
                        <span style={{ color: '#dcdcdc' }}> calcular</span>
                        <span style={{ color: '#dcdcdc' }}>(</span>
                        <span style={{ color: getThemeColors(theme.id).number }}>a</span>
                        <span style={{ color: '#dcdcdc' }}>, </span>
                        <span style={{ color: getThemeColors(theme.id).number }}>b</span>
                        <span style={{ color: '#dcdcdc' }}>) {'{'}</span>
                        <br />
                        <span style={{ color: '#dcdcdc' }}>  </span>
                        <span style={{ color: getThemeColors(theme.id).keyword }}>const</span>
                        <span style={{ color: '#dcdcdc' }}> mensaje = </span>
                        <span style={{ color: getThemeColors(theme.id).string }}>"¡Hola!"</span>
                        <span style={{ color: '#dcdcdc' }}>;</span>
                        <br />
                        <span style={{ color: '#dcdcdc' }}>  </span>
                        <span style={{ color: getThemeColors(theme.id).keyword }}>return</span>
                        <span style={{ color: '#dcdcdc' }}> a + b</span>
                        <span style={{ color: '#dcdcdc' }}>;</span>
                        <br />
                        <span style={{ color: '#dcdcdc' }}>{'}'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="h-10 border-t px-4 flex items-center justify-between rounded-b-lg text-xs" style={{
          backgroundColor: 'var(--theme-background-tertiary)',
          borderTopColor: 'var(--theme-border)',
          color: 'var(--theme-text-secondary)'
        }}>
          <span>Tema seleccionado: <span className="font-medium" style={{color: 'var(--theme-primary)'}}>{THEMES.find(t => t.id === selectedTheme)?.name}</span></span>
          <span>ESC para cerrar</span>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;
