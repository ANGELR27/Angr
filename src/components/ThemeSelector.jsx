import { useEffect, useMemo, useState } from 'react';
import { Palette, X, Code2, Search, Sparkles, Zap, Moon, Sun, Flame, Droplet, Wind, Star } from 'lucide-react';

const THEME_CATEGORIES = [
  { id: 'all', name: 'Todos', icon: Star, color: '#3b82f6' },
  { id: 'classic', name: 'Clásicos', icon: Moon, color: '#6366f1' },
  { id: 'modern', name: 'Modernos', icon: Sparkles, color: '#8b5cf6' },
  { id: 'neon', name: 'Neón', icon: Zap, color: '#ec4899' },
  { id: 'nature', name: 'Naturaleza', icon: Wind, color: '#10b981' },
  { id: 'warm', name: 'Cálidos', icon: Flame, color: '#f59e0b' },
  { id: 'cool', name: 'Fríos', icon: Droplet, color: '#06b6d4' },
  { id: 'light', name: 'Claros', icon: Sun, color: '#eab308' },
];

const THEMES = [
  // Clásicos
  { id: 'vs-dark', name: 'VS Dark', description: 'Tema oscuro por defecto', category: 'classic', tags: ['popular', 'profesional'] },
  { id: 'vs', name: 'VS Light', description: 'Tema claro estándar', category: 'light', tags: ['claro', 'profesional'] },
  { id: 'hc-black', name: 'High Contrast', description: 'Alto contraste para accesibilidad', category: 'classic', tags: ['accesible', 'legible'] },
  { id: 'monokai', name: 'Monokai', description: 'Clásico tema Monokai', category: 'classic', tags: ['popular', 'vibrante'] },
  { id: 'dracula', name: 'Dracula', description: 'Icónico tema Dracula', category: 'classic', tags: ['popular', 'oscuro'] },
  { id: 'github-dark', name: 'GitHub Dark', description: 'GitHub oficial oscuro', category: 'classic', tags: ['familiar', 'limpio'] },
  { id: 'solarized-dark', name: 'Solarized Dark', description: 'Solarized oscuro clásico', category: 'classic', tags: ['equilibrado', 'suave'] },
  
  // Modernos
  { id: 'lite', name: 'Lite', description: 'Compacto, limpio, negro con verde', category: 'modern', tags: ['minimalista', 'moderno'] },
  { id: 'feel', name: 'Feel', description: 'Minimalista con tipografía elegante', category: 'modern', tags: ['minimalista', 'tipografía'] },
  { id: 'fade', name: 'Fade', description: 'Minimalista para código rápido', category: 'modern', tags: ['minimalista', 'eficiente'] },
  { id: 'eclipse', name: 'Eclipse', description: 'Glass premium sobrio y elegante', category: 'modern', tags: ['glass', 'elegante', 'premium'] },
  { id: 'tokyo-night', name: 'Tokyo Night', description: 'Moderno tema Tokyo Night', category: 'modern', tags: ['popular', 'noche'] },
  { id: 'one-dark-pro', name: 'One Dark Pro', description: 'Atom One Dark profesional', category: 'modern', tags: ['popular', 'profesional'] },
  { id: 'material-theme', name: 'Material Theme', description: 'Material Design moderno', category: 'modern', tags: ['material', 'moderno'] },
  { id: 'ayu-dark', name: 'Ayu Dark', description: 'Ayu minimalista oscuro', category: 'modern', tags: ['minimalista', 'elegante'] },
  { id: 'palenight', name: 'Palenight', description: 'Material Palenight suave', category: 'modern', tags: ['suave', 'material'] },
  { id: 'gruvbox-dark', name: 'Gruvbox Dark', description: 'Retro pero moderno', category: 'modern', tags: ['retro', 'cálido'] },
  
  // Neón y Futuristas
  { id: 'matrix', name: 'Matrix', description: 'Estilo Matrix verde', category: 'neon', tags: ['icónico', 'verde'] },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neón futurista vibrante', category: 'neon', tags: ['futurista', 'vibrante'] },
  { id: 'synthwave', name: 'Synthwave 84', description: 'Synthwave retro-futurista', category: 'neon', tags: ['retro', 'vibrante'] },
  { id: 'neon-dreams', name: 'Neon Dreams', description: 'Sueños de neón púrpura', category: 'neon', tags: ['vibrante', 'púrpura'] },
  { id: 'neon-cyan', name: 'Neon Cyan', description: 'Cian eléctrico futurista', category: 'neon', tags: ['cian', 'eléctrico'] },
  { id: 'cyber-dark', name: 'Cyber Dark', description: 'Oscuro con acentos cian/verde', category: 'neon', tags: ['futurista', 'cian'] },
  
  // Naturaleza
  { id: 'forest', name: 'Forest', description: 'Bosque nocturno tranquilo', category: 'nature', tags: ['natural', 'verde'] },
  { id: 'nord', name: 'Nord', description: 'Tema ártico nórdico', category: 'cool', tags: ['ártico', 'suave'] },
  { id: 'aqua-night', name: 'Aqua Night', description: 'Noche aqua/menta', category: 'nature', tags: ['aqua', 'refrescante'] },
  
  // Cálidos
  { id: 'sunset', name: 'Sunset', description: 'Atardecer cálido vibrante', category: 'warm', tags: ['cálido', 'atardecer'] },
  
  // Fríos
  { id: 'oceanic', name: 'Oceanic', description: 'Profundidades del océano', category: 'cool', tags: ['océano', 'azul'] },
  { id: 'cobalt2', name: 'Cobalt 2', description: 'Cobalto azul intenso', category: 'cool', tags: ['azul', 'intenso'] },
];

function ThemeSelector({ isOpen, onClose, currentTheme, onThemeChange }) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let themes = THEMES;
    
    // Filtrar por categoría
    if (activeCategory !== 'all') {
      themes = themes.filter(t => t.category === activeCategory);
    }
    
    // Filtrar por búsqueda
    if (q) {
      themes = themes.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }
    
    return themes;
  }, [query, activeCategory]);

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
      'lite': { bg: '#1B1718', keyword: '#D0FC01', string: '#D0FC01', comment: '#8ea06a', number: '#D0FC01' },
      'feel': { bg: '#10100E', keyword: '#FFFFE3', string: '#FFFFCC', comment: '#FFFFB3', number: '#FFFFE3' },
      'fade': { bg: '#05060a', keyword: '#2de2e6', string: '#ff4fd8', comment: '#8a93a6', number: '#7c3aed' },
      'eclipse': { bg: '#07080c', keyword: '#c9d4e3', string: '#d6b48a', comment: '#7b8698', number: '#a8c0dd' },
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
      'cyber-dark': { bg: '#0b0f14', keyword: '#22d3ee', string: '#34d399', comment: '#5eead4', number: '#67e8f9' },
      'neon-cyan': { bg: '#0a0e13', keyword: '#22d3ee', string: '#a7f3d0', comment: '#94a3b8', number: '#67e8f9' },
      'aqua-night': { bg: '#0b1220', keyword: '#2dd4bf', string: '#86efac', comment: '#60a5fa', number: '#7dd3fc' },
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
        className="rounded-lg w-[960px] max-h-[80vh] flex flex-col shadow-mixed-glow"
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

        {/* Búsqueda y Filtros */}
        <div className="px-5 py-4 border-b" style={{
          backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)',
          borderBottomColor: 'var(--theme-border)'
        }}>
          <div className="flex flex-col gap-3">
            {/* Barra de búsqueda */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{color: 'var(--theme-text-muted)'}}>
                <Search className="w-4 h-4" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, descripción o etiqueta..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: 'var(--theme-background-tertiary)',
                  border: '2px solid var(--theme-border)',
                  color: 'var(--theme-text)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--theme-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--theme-border)'}
              />
            </div>
            
            {/* Categorías */}
            <div className="flex items-center gap-2 flex-wrap">
              {THEME_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border"
                    style={{
                      backgroundColor: isActive ? `${cat.color}20` : 'var(--theme-background-tertiary)',
                      borderColor: isActive ? cat.color : 'var(--theme-border)',
                      color: isActive ? cat.color : 'var(--theme-text-secondary)',
                      boxShadow: isActive ? `0 0 12px ${cat.color}40` : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = `${cat.color}10`;
                        e.currentTarget.style.borderColor = `${cat.color}60`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--theme-background-tertiary)';
                        e.currentTarget.style.borderColor = 'var(--theme-border)';
                      }
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}</div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-xs" style={{color: 'var(--theme-text-muted)'}}>
              <div className="flex items-center gap-1.5">
                <span>Total:</span>
                <span className="px-2 py-0.5 rounded-full font-medium" style={{
                  backgroundColor: 'color-mix(in srgb, var(--theme-primary) 15%, transparent)',
                  color: 'var(--theme-primary)'
                }}>{THEMES.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Mostrando:</span>
                <span className="px-2 py-0.5 rounded-full font-medium" style={{
                  backgroundColor: 'color-mix(in srgb, var(--theme-secondary) 15%, transparent)',
                  color: 'var(--theme-secondary)'
                }}>{filtered.length}</span>
              </div>
              <div className="ml-auto text-[10px]">
                <kbd className="px-1.5 py-0.5 rounded border" style={{
                  backgroundColor: 'var(--theme-background-tertiary)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-primary)'
                }}>Ctrl+Shift+T</kbd> o escribe <kbd className="px-1.5 py-0.5 rounded border" style={{
                  backgroundColor: 'var(--theme-background-tertiary)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-accent)'
                }}>tema</kbd> en terminal
              </div>
            </div>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3" style={{color: 'var(--theme-text-muted)'}}>
              <Search className="w-12 h-12 opacity-40" />
              <p className="text-sm">No se encontraron temas</p>
              <button
                onClick={() => { setQuery(''); setActiveCategory('all'); }}
                className="px-4 py-2 rounded-lg text-xs border transition-all"
                style={{
                  backgroundColor: 'var(--theme-background-tertiary)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-primary)'
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((theme, index) => (
              <div
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className="p-4 rounded-xl cursor-pointer transition-all border-2 relative group"
                style={{
                  borderColor: selectedTheme === theme.id ? 'var(--theme-primary)' : 'var(--theme-border)',
                  backgroundColor: selectedTheme === theme.id ? 'color-mix(in srgb, var(--theme-primary) 25%, transparent)' : 'var(--theme-background-tertiary)',
                  boxShadow: selectedTheme === theme.id ? '0 0 24px var(--theme-glow)' : '0 0 0 rgba(0,0,0,0)',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  setHoveredTheme(theme.id);
                  if (selectedTheme !== theme.id) {
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-primary) 60%, transparent)';
                    e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 10%, var(--theme-background-tertiary))';
                  }
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  setHoveredTheme(null);
                  if (selectedTheme !== theme.id) {
                    e.currentTarget.style.borderColor = 'var(--theme-border)';
                    e.currentTarget.style.backgroundColor = 'var(--theme-background-tertiary)';
                  }
                  e.currentTarget.style.transform = 'translateY(0)';
                  if (selectedTheme !== theme.id) {
                    e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                  }
                }}
              >
                {/* Header con nombre y badge */}
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-1" style={{color: 'var(--theme-text)'}}>{theme.name}</h3>
                    <p className="text-[10px] leading-relaxed" style={{color: 'var(--theme-text-muted)'}}>{theme.description}</p>
                  </div>
                  {selectedTheme === theme.id && (
                    <span className="text-[10px] px-2 py-1 rounded-full font-medium shrink-0" style={{
                      backgroundColor: 'var(--theme-primary)',
                      color: 'white',
                      boxShadow: '0 0 8px var(--theme-glow)'
                    }}>
                      ✓ Activo
                    </span>
                  )}
                </div>
                
                {/* Tags */}
                {theme.tags && theme.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {theme.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] px-1.5 py-0.5 rounded border"
                        style={{
                          backgroundColor: 'var(--theme-background-secondary)',
                          borderColor: 'var(--theme-border)',
                          color: 'var(--theme-text-muted)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Preview color bar */}
                <div className="mt-3 h-2.5 rounded-full overflow-hidden flex">
                  {theme.id === 'matrix' && (
                    <div className="flex-1 bg-gradient-to-r from-green-600 via-green-500 to-green-400"></div>
                  )}
                  {theme.id === 'lite' && (
                    <div className="flex-1 bg-gradient-to-r from-[#1B1718] via-[#343031] to-[#D0FC01]"></div>
                  )}
                  {theme.id === 'feel' && (
                    <div className="flex-1 bg-gradient-to-r from-[#10100E] via-[#1C1C15] to-[#FFFFE3]"></div>
                  )}
                  {theme.id === 'fade' && (
                    <div className="flex-1 bg-gradient-to-r from-[#2de2e6] via-[#05060a] to-[#ff4fd8]"></div>
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
                  {theme.id === 'cyber-dark' && (
                    <div className="flex-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400"></div>
                  )}
                  {theme.id === 'neon-cyan' && (
                    <div className="flex-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300"></div>
                  )}
                  {theme.id === 'aqua-night' && (
                    <div className="flex-1 bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-300"></div>
                  )}
                </div>

                {/* Preview de código al hover */}
                {hoveredTheme === theme.id && (
                  <div 
                    className={`absolute top-0 z-50 w-96 rounded-xl shadow-2xl border-2 overflow-hidden ${
                      index % 2 === 0 ? 'left-full ml-4' : 'right-full mr-4'
                    }`}
                    style={{ 
                      backgroundColor: getThemeColors(theme.id).bg,
                      borderColor: 'color-mix(in srgb, var(--theme-primary) 60%, transparent)'
                    }}
                  >
                    <div className="p-5 font-mono text-xs leading-relaxed">
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
          )}
        </div>

        {/* Footer */}
        <div className="h-12 border-t px-5 flex items-center justify-between rounded-b-lg text-xs" style={{
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
