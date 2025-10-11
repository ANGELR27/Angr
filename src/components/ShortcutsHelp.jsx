import { useState } from 'react';
import { Keyboard, X, Command, Zap, Code, Search, FileText } from 'lucide-react';

function ShortcutsHelp({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Edición',
      icon: <Code className="w-4 h-4" />,
      items: [
        { keys: ['Ctrl', '+'], description: 'Aumentar zoom' },
        { keys: ['Ctrl', '-'], description: 'Disminuir zoom' },
        { keys: ['Ctrl', '0'], description: 'Resetear zoom' },
        { keys: ['Ctrl', 'D'], description: 'Duplicar línea' },
        { keys: ['Ctrl', 'Shift', 'L'], description: 'Seleccionar todas las ocurrencias' },
        { keys: ['Ctrl', '/'], description: 'Comentar/Descomentar' },
        { keys: ['Alt', '↑/↓'], description: 'Mover línea arriba/abajo' },
        { keys: ['Ctrl', 'Shift', 'K'], description: 'Eliminar línea' },
      ]
    },
    {
      category: 'Formateo',
      icon: <FileText className="w-4 h-4" />,
      items: [
        { keys: ['Ctrl', 'Shift', 'F'], description: 'Formatear código' },
        { keys: ['Ctrl', 'S'], description: 'Mensaje de guardado (auto-guardado activo)' },
        { keys: ['Tab'], description: 'Indentar' },
        { keys: ['Shift', 'Tab'], description: 'Des-indentar' },
      ]
    },
    {
      category: 'Búsqueda',
      icon: <Search className="w-4 h-4" />,
      items: [
        { keys: ['Ctrl', 'F'], description: 'Buscar en archivo' },
        { keys: ['Ctrl', 'H'], description: 'Buscar y reemplazar' },
        { keys: ['F3'], description: 'Buscar siguiente' },
        { keys: ['Shift', 'F3'], description: 'Buscar anterior' },
      ]
    },
    {
      category: 'Terminal & Ejecución',
      icon: <Zap className="w-4 h-4" />,
      items: [
        { keys: ['Ctrl', 'Shift', 'T'], description: 'Abrir selector de temas' },
        { keys: ['Ctrl', '`'], description: 'Toggle terminal (Monaco default)' },
      ]
    },
    {
      category: 'Múltiples Cursores',
      icon: <Command className="w-4 h-4" />,
      items: [
        { keys: ['Alt', 'Click'], description: 'Agregar cursor' },
        { keys: ['Ctrl', 'Alt', '↑/↓'], description: 'Agregar cursor arriba/abajo' },
        { keys: ['Ctrl', 'U'], description: 'Deshacer última selección de cursor' },
      ]
    }
  ];

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm" 
      style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}
      onClick={onClose}
    >
      <div 
        className="rounded-lg w-[700px] max-h-[80vh] overflow-hidden flex flex-col shadow-mixed-glow"
        style={{
          backgroundColor: 'var(--theme-background-secondary)',
          border: '1px solid color-mix(in srgb, var(--theme-primary) 40%, transparent)',
          boxShadow: '0 0 60px var(--theme-glow), 0 0 120px rgba(59, 130, 246, 0.3)',
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="h-14 border-b flex items-center justify-between px-4 relative"
          style={{
            backgroundColor: 'var(--theme-background-tertiary)',
            borderBottomColor: 'color-mix(in srgb, var(--theme-primary) 40%, transparent)'
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `linear-gradient(to right, 
              color-mix(in srgb, var(--theme-primary) 15%, transparent), 
              color-mix(in srgb, var(--theme-secondary) 15%, transparent), 
              transparent)`
          }}></div>
          
          <div className="flex items-center gap-2 relative z-10">
            <div className="shadow-blue-glow p-1 rounded" style={{animation: 'pulseBlueGlow 2s ease-in-out infinite'}}>
              <Keyboard className="w-5 h-5" style={{color: 'var(--theme-primary)'}} />
            </div>
            <span className="text-sm font-medium" style={{color: 'var(--theme-text)'}}>
              Atajos de Teclado
            </span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {shortcuts.map((category, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded" style={{
                    backgroundColor: 'color-mix(in srgb, var(--theme-primary) 20%, transparent)'
                  }}>
                    {category.icon}
                  </div>
                  <h3 className="text-sm font-semibold" style={{color: 'var(--theme-text)'}}>
                    {category.category}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {category.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between px-3 py-2 rounded transition-colors"
                      style={{
                        backgroundColor: 'var(--theme-background-tertiary)',
                        borderLeft: '2px solid color-mix(in srgb, var(--theme-primary) 40%, transparent)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {item.keys.map((key, keyIdx) => (
                          <span key={keyIdx} className="flex items-center gap-1">
                            <kbd 
                              className="px-2 py-1 text-xs font-mono rounded border"
                              style={{
                                backgroundColor: 'var(--theme-surface)',
                                borderColor: 'var(--theme-border)',
                                color: 'var(--theme-primary)',
                                minWidth: '32px',
                                textAlign: 'center'
                              }}
                            >
                              {key}
                            </kbd>
                            {keyIdx < item.keys.length - 1 && (
                              <span style={{color: 'var(--theme-text-muted)'}}>+</span>
                            )}
                          </span>
                        ))}
                      </div>
                      
                      <span className="text-sm" style={{color: 'var(--theme-text-secondary)'}}>
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="h-10 border-t px-4 flex items-center justify-between text-xs"
          style={{
            backgroundColor: 'var(--theme-background-tertiary)',
            borderTopColor: 'var(--theme-border)',
            color: 'var(--theme-text-secondary)'
          }}
        >
          <span>Presiona <kbd className="px-2 py-0.5 rounded border" style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-accent)'
          }}>?</kbd> en el editor para abrir esta ayuda</span>
          <span>ESC para cerrar</span>
        </div>
      </div>
    </div>
  );
}

export default ShortcutsHelp;
