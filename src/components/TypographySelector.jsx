import { useEffect, useMemo, useState } from 'react';
import { Type, Code2, Search, X } from 'lucide-react';

const APP_FONTS = [
  { id: 'theme-default', name: 'Por tema (default)', value: 'var(--theme-font-family)' },
  { id: 'system-ui', name: 'System UI', value: 'system-ui, -apple-system, sans-serif' },
  { id: 'segoe-ui', name: 'Segoe UI', value: '"Segoe UI", system-ui, -apple-system, sans-serif' },
  { id: 'inter', name: 'Inter', value: '"Inter", system-ui, -apple-system, sans-serif', google: 'Inter:wght@300;400;500;600;700' },
  { id: 'dm-sans', name: 'DM Sans', value: '"DM Sans", system-ui, -apple-system, sans-serif', google: 'DM+Sans:wght@300;400;500;600;700' },
  { id: 'manrope', name: 'Manrope', value: '"Manrope", system-ui, -apple-system, sans-serif', google: 'Manrope:wght@300;400;500;600;700' },
  { id: 'space-grotesk', name: 'Space Grotesk', value: '"Space Grotesk", system-ui, -apple-system, sans-serif', google: 'Space+Grotesk:wght@300;400;500;600;700' },
  { id: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', google: 'Plus+Jakarta+Sans:wght@300;400;500;600;700' },
  { id: 'poppins', name: 'Poppins', value: '"Poppins", system-ui, -apple-system, sans-serif', google: 'Poppins:wght@300;400;500;600;700' },
  { id: 'montserrat', name: 'Montserrat', value: '"Montserrat", system-ui, -apple-system, sans-serif', google: 'Montserrat:wght@300;400;500;600;700' },
  { id: 'raleway', name: 'Raleway', value: '"Raleway", system-ui, -apple-system, sans-serif', google: 'Raleway:wght@300;400;500;600;700' },
  { id: 'nunito', name: 'Nunito', value: '"Nunito", system-ui, -apple-system, sans-serif', google: 'Nunito:wght@300;400;500;600;700' },
  { id: 'rubik', name: 'Rubik', value: '"Rubik", system-ui, -apple-system, sans-serif', google: 'Rubik:wght@300;400;500;600;700' },
  { id: 'work-sans', name: 'Work Sans', value: '"Work Sans", system-ui, -apple-system, sans-serif', google: 'Work+Sans:wght@300;400;500;600;700' },
  { id: 'sora', name: 'Sora', value: '"Sora", system-ui, -apple-system, sans-serif', google: 'Sora:wght@300;400;500;600;700' },
  { id: 'urbanist', name: 'Urbanist', value: '"Urbanist", system-ui, -apple-system, sans-serif', google: 'Urbanist:wght@300;400;500;600;700' },
  { id: 'playfair', name: 'Playfair Display', value: '"Playfair Display", serif', google: 'Playfair+Display:wght@400;500;600;700' },
  { id: 'merriweather', name: 'Merriweather', value: '"Merriweather", serif', google: 'Merriweather:wght@300;400;700;900' },
  { id: 'cormorant', name: 'Cormorant Garamond', value: '"Cormorant Garamond", serif', google: 'Cormorant+Garamond:wght@300;400;500;600;700' },
  { id: 'cinzel', name: 'Cinzel', value: '"Cinzel", serif', google: 'Cinzel:wght@400;500;600;700' },
  { id: 'abril-fatface', name: 'Abril Fatface', value: '"Abril Fatface", cursive', google: 'Abril+Fatface' },
  { id: 'bebas-neue', name: 'Bebas Neue', value: '"Bebas Neue", system-ui, sans-serif', google: 'Bebas+Neue' },
  { id: 'oswald', name: 'Oswald', value: '"Oswald", system-ui, sans-serif', google: 'Oswald:wght@300;400;500;600;700' },
  { id: 'orbitron', name: 'Orbitron', value: '"Orbitron", system-ui, sans-serif', google: 'Orbitron:wght@400;500;600;700' },
  { id: 'audiowide', name: 'Audiowide', value: '"Audiowide", system-ui, sans-serif', google: 'Audiowide' },
  { id: 'bungee', name: 'Bungee', value: '"Bungee", system-ui, sans-serif', google: 'Bungee' },
  { id: 'vt323', name: 'VT323', value: '"VT323", monospace', google: 'VT323' },
  { id: 'press-start-2p', name: 'Press Start 2P', value: '"Press Start 2P", system-ui, sans-serif', google: 'Press+Start+2P' },
];

const CODE_FONTS = [
  { id: 'consolas', name: 'Consolas (default)', value: "'Consolas', 'Courier New', monospace" },
  { id: 'sf-mono', name: 'SF Mono', value: '"SF Mono", Menlo, Consolas, monospace' },
  { id: 'menlo', name: 'Menlo', value: 'Menlo, Consolas, monospace' },
  { id: 'cascadia-code', name: 'Cascadia Code', value: '"Cascadia Code", Consolas, monospace' },
  { id: 'courier-prime', name: 'Courier Prime', value: '"Courier Prime", Consolas, monospace', google: 'Courier+Prime:wght@400;700' },
  { id: 'dm-mono', name: 'DM Mono', value: '"DM Mono", Consolas, monospace', google: 'DM+Mono:wght@300;400;500' },
  { id: 'fira-mono', name: 'Fira Mono', value: '"Fira Mono", Consolas, monospace', google: 'Fira+Mono:wght@400;500;700' },
  { id: 'cousine', name: 'Cousine', value: '"Cousine", Consolas, monospace', google: 'Cousine:wght@400;700' },
  { id: 'anonymous-pro', name: 'Anonymous Pro', value: '"Anonymous Pro", Consolas, monospace', google: 'Anonymous+Pro:wght@400;700' },
  { id: 'pt-mono', name: 'PT Mono', value: '"PT Mono", Consolas, monospace', google: 'PT+Mono' },
  { id: 'oxygen-mono', name: 'Oxygen Mono', value: '"Oxygen Mono", Consolas, monospace', google: 'Oxygen+Mono' },
  { id: 'overpass-mono', name: 'Overpass Mono', value: '"Overpass Mono", Consolas, monospace', google: 'Overpass+Mono:wght@300;400;500;600;700' },
  { id: 'red-hat-mono', name: 'Red Hat Mono', value: '"Red Hat Mono", Consolas, monospace', google: 'Red+Hat+Mono:wght@300;400;500;600;700' },
  { id: 'noto-sans-mono', name: 'Noto Sans Mono', value: '"Noto Sans Mono", Consolas, monospace', google: 'Noto+Sans+Mono:wght@300;400;500;600;700' },
  { id: 'spline-sans-mono', name: 'Spline Sans Mono', value: '"Spline Sans Mono", Consolas, monospace', google: 'Spline+Sans+Mono:wght@300;400;500;600;700' },
  { id: 'share-tech-mono', name: 'Share Tech Mono', value: '"Share Tech Mono", Consolas, monospace', google: 'Share+Tech+Mono' },
  { id: 'major-mono-display', name: 'Major Mono Display', value: '"Major Mono Display", Consolas, monospace', google: 'Major+Mono+Display' },
  { id: 'cutive-mono', name: 'Cutive Mono', value: '"Cutive Mono", Consolas, monospace', google: 'Cutive+Mono' },
  { id: 'nova-mono', name: 'Nova Mono', value: '"Nova Mono", Consolas, monospace', google: 'Nova+Mono' },
  { id: 'syne-mono', name: 'Syne Mono', value: '"Syne Mono", Consolas, monospace', google: 'Syne+Mono' },
  { id: 'lekton', name: 'Lekton', value: '"Lekton", Consolas, monospace', google: 'Lekton:wght@400;700' },
  { id: 'b612-mono', name: 'B612 Mono', value: '"B612 Mono", Consolas, monospace', google: 'B612+Mono:wght@400;700' },
  { id: 'fragment-mono', name: 'Fragment Mono', value: '"Fragment Mono", Consolas, monospace', google: 'Fragment+Mono:wght@400' },
  { id: 'martian-mono', name: 'Martian Mono', value: '"Martian Mono", Consolas, monospace', google: 'Martian+Mono:wght@300;400;500;600;700' },
  { id: 'sono', name: 'Sono', value: '"Sono", Consolas, monospace', google: 'Sono:wght@200;300;400;500;600;700;800' },
  { id: 'jetbrains-mono', name: 'JetBrains Mono', value: '"JetBrains Mono", Consolas, monospace', google: 'JetBrains+Mono:wght@300;400;500;600;700' },
  { id: 'fira-code', name: 'Fira Code', value: '"Fira Code", Consolas, monospace', google: 'Fira+Code:wght@300;400;500;600;700' },
  { id: 'source-code-pro', name: 'Source Code Pro', value: '"Source Code Pro", Consolas, monospace', google: 'Source+Code+Pro:wght@300;400;500;600;700' },
  { id: 'ibm-plex-mono', name: 'IBM Plex Mono', value: '"IBM Plex Mono", Consolas, monospace', google: 'IBM+Plex+Mono:wght@300;400;500;600;700' },
  { id: 'roboto-mono', name: 'Roboto Mono', value: '"Roboto Mono", Consolas, monospace', google: 'Roboto+Mono:wght@300;400;500;600;700' },
  { id: 'inconsolata', name: 'Inconsolata', value: '"Inconsolata", Consolas, monospace', google: 'Inconsolata:wght@300;400;500;600;700' },
  { id: 'space-mono', name: 'Space Mono', value: '"Space Mono", Consolas, monospace', google: 'Space+Mono:wght@400;700' },
  { id: 'ubuntu-mono', name: 'Ubuntu Mono', value: '"Ubuntu Mono", Consolas, monospace', google: 'Ubuntu+Mono:wght@400;700' },
];

function ensureGoogleFontLoaded(googleSpec) {
  if (!googleSpec || typeof document === 'undefined') return;
  const id = `google-font-${googleSpec.replace(/[^a-z0-9_-]/gi, '_')}`;
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${googleSpec}&display=swap`;
  document.head.appendChild(link);
}

function TypographySelector({ isOpen, onClose, appFont, codeFont, onChangeAppFont, onChangeCodeFont }) {
  const [query, setQuery] = useState('');

  const filteredAppFonts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return APP_FONTS;
    return APP_FONTS.filter((f) => f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q));
  }, [query]);

  const filteredCodeFonts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CODE_FONTS;
    return CODE_FONTS.filter((f) => f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} onClick={onClose}>
      <div
        className="rounded-lg w-[980px] max-h-[82vh] flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--theme-background-secondary)', border: '1px solid var(--theme-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-14 border-b flex items-center justify-between px-4" style={{ borderBottomColor: 'var(--theme-border)', backgroundColor: 'var(--theme-background-tertiary)' }}>
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Tipografía</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded transition-all border border-transparent hover:border-red-500/40"
            style={{ color: '#ef4444' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b" style={{ borderBottomColor: 'var(--theme-border)' }}>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--theme-text-muted)' }}>
              <Search className="w-4 h-4" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar tipografías..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg outline-none transition-all"
              style={{ backgroundColor: 'var(--theme-background-tertiary)', border: '2px solid var(--theme-border)', color: 'var(--theme-text)' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--theme-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--theme-border)')}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-lg p-4 border" style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-background-tertiary)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4" style={{ color: 'var(--theme-accent)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>Fuente de la App</span>
              </div>

              <div className="space-y-2">
                {filteredAppFonts.map((f) => {
                  const selected = appFont?.id === f.id;
                  return (
                    <button
                      key={f.id}
                      className="w-full text-left px-3 py-2 rounded-lg transition-all border"
                      style={{
                        borderColor: selected ? 'color-mix(in srgb, var(--theme-primary) 60%, transparent)' : 'var(--theme-border)',
                        backgroundColor: selected ? 'color-mix(in srgb, var(--theme-primary) 15%, transparent)' : 'transparent',
                      }}
                      onClick={() => {
                        if (f.google) ensureGoogleFontLoaded(f.google);
                        onChangeAppFont(f);
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{f.name}</div>
                          <div className="text-xs mt-1" style={{ color: 'var(--theme-text-secondary)', fontFamily: f.value }}>
                            El zorro rápido salta sobre el perro perezoso
                          </div>
                        </div>
                        {selected && (
                          <div className="text-xs font-semibold" style={{ color: 'var(--theme-primary)' }}>ACTIVA</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg p-4 border" style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-background-tertiary)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="w-4 h-4" style={{ color: 'var(--theme-accent)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>Fuente del Código</span>
              </div>

              <div className="space-y-2">
                {filteredCodeFonts.map((f) => {
                  const selected = codeFont?.id === f.id;
                  return (
                    <button
                      key={f.id}
                      className="w-full text-left px-3 py-2 rounded-lg transition-all border"
                      style={{
                        borderColor: selected ? 'color-mix(in srgb, var(--theme-primary) 60%, transparent)' : 'var(--theme-border)',
                        backgroundColor: selected ? 'color-mix(in srgb, var(--theme-primary) 15%, transparent)' : 'transparent',
                      }}
                      onClick={() => {
                        if (f.google) ensureGoogleFontLoaded(f.google);
                        onChangeCodeFont(f);
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{f.name}</div>
                          <pre className="text-xs mt-1 whitespace-pre-wrap" style={{ color: 'var(--theme-text-secondary)', fontFamily: f.value }}>
{`const sum = (a, b) => a + b;\nconsole.log(sum(2, 3));`}
                          </pre>
                        </div>
                        {selected && (
                          <div className="text-xs font-semibold" style={{ color: 'var(--theme-primary)' }}>ACTIVA</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderTopColor: 'var(--theme-border)', backgroundColor: 'var(--theme-background-tertiary)' }}>
          <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
            Cambia la tipografía de toda la interfaz y del editor.
          </div>
          <button
            className="px-3 py-1.5 rounded text-sm font-medium"
            style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}
            onClick={onClose}
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}

export default TypographySelector;
