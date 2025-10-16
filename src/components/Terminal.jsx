import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Terminal as TerminalIcon, X, Minus, Maximize2, Play } from 'lucide-react';

const Terminal = forwardRef(({ isOpen, onClose, onToggleSize, isMaximized, onExecuteCode, onOpenThemes, currentTheme }, ref) => {
  const [history, setHistory] = useState([
    { type: 'info', text: '> Terminal de Code Editor v1.0' },
    { type: 'success', text: '> ¡Bienvenido! Escribe "help" para ver comandos disponibles.' },
    { type: 'info', text: '> Los console.log de tu código aparecerán aquí' }
  ]);
  const [input, setInput] = useState('');
  const [fontSize, setFontSize] = useState(14); // Siempre inicia en 14px al recargar
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Resetear zoom al abrir/cerrar la terminal
  useEffect(() => {
    if (isOpen) {
      setFontSize(14); // Resetear al valor por defecto cuando se abre
    }
  }, [isOpen]);

  // Exponer método para agregar logs desde fuera
  useImperativeHandle(ref, () => ({
    addLog: (method, args) => {
      const timestamp = new Date().toLocaleTimeString('es-ES');
      const text = `[${timestamp}] ${args.join(' ')}`;
      
      let type = 'console';
      if (method === 'error') type = 'error';
      else if (method === 'warn') type = 'warning';
      else if (method === 'info') type = 'info';
      else type = 'console';
      
      setHistory(prev => [...prev, { type, text }]);
    },
    clear: () => {
      setHistory([]);
    },
    executeJS: (code) => {
      executeJavaScript(code);
    }
  }));

  const executeJavaScript = (code) => {
    const timestamp = new Date().toLocaleTimeString('es-ES');
    
    setHistory(prev => [...prev, 
      { type: 'command', text: `$ Ejecutando código JavaScript...` }
    ]);

    // Validar que el código no esté vacío
    if (!code || code.trim() === '') {
      setHistory(prev => [...prev, 
        { type: 'warning', text: `[${timestamp}] ⚠ No hay código para ejecutar` }
      ]);
      return;
    }

    try {
      // Crear contexto de ejecución con console capturado
      const logs = [];
      const errors = [];
      
      const customConsole = {
        log: (...args) => {
          try {
            const text = args.map(arg => {
              if (typeof arg === 'object' && arg !== null) {
                try {
                  return JSON.stringify(arg, null, 2);
                } catch (e) {
                  return String(arg);
                }
              }
              return String(arg);
            }).join(' ');
            logs.push({ type: 'console', text: `[${timestamp}] ${text}` });
          } catch (e) {
            errors.push(`Error al procesar log: ${e.message}`);
          }
        },
        error: (...args) => {
          try {
            const text = args.map(arg => String(arg)).join(' ');
            logs.push({ type: 'error', text: `[${timestamp}] ${text}` });
          } catch (e) {
            errors.push(`Error al procesar error: ${e.message}`);
          }
        },
        warn: (...args) => {
          try {
            const text = args.map(arg => String(arg)).join(' ');
            logs.push({ type: 'warning', text: `[${timestamp}] ${text}` });
          } catch (e) {
            errors.push(`Error al procesar warning: ${e.message}`);
          }
        },
        info: (...args) => {
          try {
            const text = args.map(arg => String(arg)).join(' ');
            logs.push({ type: 'info', text: `[${timestamp}] ${text}` });
          } catch (e) {
            errors.push(`Error al procesar info: ${e.message}`);
          }
        },
        table: (...args) => {
          try {
            const text = args.map(arg => {
              if (typeof arg === 'object' && arg !== null) {
                try {
                  return JSON.stringify(arg, null, 2);
                } catch (e) {
                  return String(arg);
                }
              }
              return String(arg);
            }).join(' ');
            logs.push({ type: 'console', text: `[${timestamp}] TABLE:\n${text}` });
          } catch (e) {
            errors.push(`Error al procesar table: ${e.message}`);
          }
        }
      };

      // Ejecutar código con console personalizado en un contexto aislado
      const wrappedCode = `
        (function() {
          'use strict';
          const console = customConsole;
          ${code}
        })();
      `;
      
      // Usar Function para ejecutar el código de forma segura
      const func = new Function('customConsole', wrappedCode);
      func(customConsole);
      
      // Agregar errores internos si los hay
      if (errors.length > 0) {
        errors.forEach(err => {
          logs.push({ type: 'error', text: `[${timestamp}] ⚠ ${err}` });
        });
      }
      
      // Agregar todos los logs
      if (logs.length > 0) {
        setHistory(prev => [...prev, ...logs]);
      } else {
        setHistory(prev => [...prev, 
          { type: 'success', text: `[${timestamp}] ✓ Código ejecutado correctamente (sin salida)` }
        ]);
      }
      
    } catch (error) {
      // Capturar errores de sintaxis o ejecución
      const errorMessage = error.message || 'Error desconocido';
      const errorName = error.name || 'Error';
      
      setHistory(prev => [...prev, 
        { type: 'error', text: `[${timestamp}] ✗ ${errorName}: ${errorMessage}` }
      ]);
      
      // Log adicional en modo desarrollo
      if (import.meta.env.DEV) {
        console.error('Error al ejecutar JavaScript en Terminal:', error);
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd) => {
    const command = cmd.trim().toLowerCase();
    
    setHistory(prev => [...prev, { type: 'command', text: `$ ${cmd}` }]);
    
    switch (command) {
      case 'help':
        setHistory(prev => [...prev, 
          { type: 'info', text: 'Comandos disponibles:' },
          { type: 'info', text: '  help    - Muestra esta ayuda' },
          { type: 'info', text: '  clear   - Limpia la terminal' },
          { type: 'info', text: '  date    - Muestra la fecha y hora' },
          { type: 'info', text: '  echo    - Imprime un mensaje' },
          { type: 'info', text: '  version - Muestra la versión del editor' },
          { type: 'info', text: '  tema    - Abre el selector de temas' },
          { type: 'info', text: '  theme   - Abre el selector de temas (alternativa)' }
        ]);
        break;
      
      case 'clear':
        setHistory([]);
        break;
      
      case 'date':
        setHistory(prev => [...prev, { type: 'success', text: new Date().toLocaleDateString('es-ES') }]);
        break;
      
      case 'time':
        setHistory(prev => [...prev, { type: 'success', text: new Date().toLocaleTimeString('es-ES') }]);
        break;
      
      case 'version':
        setHistory(prev => [...prev, 
          { type: 'success', text: 'Code Editor v1.0' },
          { type: 'info', text: 'Editor de código web con Monaco Editor' }
        ]);
        break;

      case 'tema':
      case 'theme':
        setHistory(prev => [...prev, 
          { type: 'success', text: '🎨 Abriendo selector de temas...' }
        ]);
        if (onOpenThemes) {
          onOpenThemes();
        }
        break;
      
      case '':
        // No hacer nada si está vacío
        break;
      
      default:
        if (command.startsWith('echo ')) {
          const message = cmd.substring(5);
          setHistory(prev => [...prev, { type: 'success', text: message }]);
        } else {
          setHistory(prev => [...prev, 
            { type: 'error', text: `Comando no reconocido: ${command}` },
            { type: 'info', text: 'Escribe "help" para ver los comandos disponibles' }
          ]);
        }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  const getTextColor = (type, isLite) => {
    if (isLite) {
      switch (type) {
        case 'command': return 'text-cyan-600';
        case 'success': return 'text-green-600';
        case 'error': return 'text-red-600';
        case 'warning': return 'text-yellow-600';
        case 'info': return 'text-blue-600';
        case 'console': return 'text-gray-700';
        default: return 'text-gray-800';
      }
    } else {
      switch (type) {
        case 'command': return 'text-cyan-400';
        case 'success': return 'text-green-400';
        case 'error': return 'text-red-400';
        case 'warning': return 'text-yellow-300';
        case 'info': return 'text-blue-300';
        case 'console': return 'text-gray-100';
        default: return 'text-white';
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Ctrl + '+' o Ctrl + '=' para aumentar
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        setFontSize(prev => Math.min(prev + 2, 32));
      }
      // Ctrl + '-' para disminuir
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        setFontSize(prev => Math.max(prev - 2, 8));
      }
      // Ctrl + '0' para resetear
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setFontSize(14);
      }
    };

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          // Scroll up = zoom in
          setFontSize(prev => Math.min(prev + 1, 32));
        } else {
          // Scroll down = zoom out
          setFontSize(prev => Math.max(prev - 1, 8));
        }
      }
    };

    const terminalElement = terminalRef.current;
    
    window.addEventListener('keydown', handleKeyDown);
    terminalElement?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      terminalElement?.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isLite = currentTheme === 'lite';

  return (
    <div
      className={`${isMaximized ? 'fixed inset-0 z-50' : 'h-64'} flex flex-col`}
      style={{
        backgroundColor: 'var(--theme-background)',
        borderTop: '1px solid var(--theme-border)'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between relative"
        style={{
          height: isLite ? '34px' : '40px',
          backgroundColor: isLite ? 'var(--theme-background-secondary)' : undefined,
          borderBottom: isLite ? '1px solid var(--theme-border)' : undefined,
          padding: isLite ? '0 8px' : '0 12px'
        }}
      >
        {!isLite && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent pointer-events-none"></div>
        )}

        <div className="flex items-center gap-2 relative z-10">
          <TerminalIcon className="w-4 h-4" style={{ color: isLite ? 'var(--theme-secondary)' : '#60a5fa' }} />
          <span className="text-sm font-medium" style={{ color: isLite ? 'var(--theme-text)' : '#bfdbfe' }}>Terminal</span>
        </div>

        <div className="flex items-center gap-1 relative z-10">
          <button
            onClick={onExecuteCode}
            className="flex items-center gap-1.5 rounded"
            style={{
              padding: isLite ? '2px 6px' : '4px 8px',
              backgroundColor: isLite ? 'transparent' : undefined,
              border: isLite ? '1px solid var(--theme-border)' : '1px solid transparent',
              color: isLite ? 'var(--theme-secondary)' : '#86efac'
            }}
            title="Ejecutar código JavaScript del archivo activo"
          >
            <Play className="w-3.5 h-3.5" style={{ color: isLite ? 'var(--theme-secondary)' : '#4ade80' }} />
            {!isLite && <span className="text-xs text-green-300">Ejecutar</span>}
          </button>
          <div className="w-px h-4 mx-1" style={{ background: isLite ? 'var(--theme-border)' : 'var(--theme-border)' }}></div>
          <button
            onClick={onToggleSize}
            className="rounded"
            style={{ padding: isLite ? '2px' : '4px', border: isLite ? '1px solid var(--theme-border)' : '1px solid transparent' }}
            title={isMaximized ? 'Minimizar' : 'Maximizar'}
          >
            {isMaximized ? <Minus className="w-4 h-4" style={{ color: isLite ? 'var(--theme-text)' : '#60a5fa' }} /> : <Maximize2 className="w-4 h-4" style={{ color: isLite ? 'var(--theme-text)' : '#60a5fa' }} />}
          </button>
          <button
            onClick={onClose}
            className="rounded"
            style={{ padding: isLite ? '2px' : '4px', border: isLite ? '1px solid var(--theme-border)' : '1px solid transparent' }}
            title="Cerrar"
          >
            <X className="w-4 h-4" style={{ color: isLite ? 'var(--theme-text)' : '#f87171' }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={terminalRef}
          className="h-full overflow-y-auto font-mono"
          style={{ 
            padding: isLite ? '8px' : '12px', 
            paddingBottom: '24px',
            fontSize: `${fontSize}px`, 
            color: 'var(--theme-text)' 
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, index) => (
            <div key={index} className={`${getTextColor(item.type, isLite)} mb-1`}>
              {item.text}
            </div>
          ))}

          {/* Input line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <span style={{ color: isLite ? 'var(--theme-secondary)' : '#22d3ee' }}>$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              style={{ color: 'var(--theme-text)' }}
              autoFocus
              spellCheck={false}
            />
          </form>
        </div>

        {/* Gradiente de fade en la parte inferior */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '40px',
            background: isLite 
              ? 'linear-gradient(to bottom, transparent, var(--theme-background))' 
              : 'linear-gradient(to bottom, transparent, var(--theme-background))'
          }}
        />
      </div>
    </div>
  );
});

Terminal.displayName = 'Terminal';

export default Terminal;
