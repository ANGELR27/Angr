import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Terminal as TerminalIcon, X, Minus, Maximize2, Play } from 'lucide-react';

const Terminal = forwardRef(({ isOpen, onClose, onToggleSize, isMaximized, onExecuteCode, onOpenThemes }, ref) => {
  const [history, setHistory] = useState([
    { type: 'info', text: '> Terminal de Code Editor v1.0' },
    { type: 'success', text: '> ¡Bienvenido! Escribe "help" para ver comandos disponibles.' },
    { type: 'info', text: '> Los console.log de tu código aparecerán aquí' }
  ]);
  const [input, setInput] = useState('');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

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

    try {
      // Crear contexto de ejecución con console capturado
      const logs = [];
      const customConsole = {
        log: (...args) => {
          const text = args.map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch (e) {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ');
          logs.push({ type: 'console', text: `[${timestamp}] ${text}` });
        },
        error: (...args) => {
          const text = args.map(arg => String(arg)).join(' ');
          logs.push({ type: 'error', text: `[${timestamp}] ${text}` });
        },
        warn: (...args) => {
          const text = args.map(arg => String(arg)).join(' ');
          logs.push({ type: 'warning', text: `[${timestamp}] ${text}` });
        },
        info: (...args) => {
          const text = args.map(arg => String(arg)).join(' ');
          logs.push({ type: 'info', text: `[${timestamp}] ${text}` });
        },
        table: (...args) => {
          const text = args.map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch (e) {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ');
          logs.push({ type: 'console', text: `[${timestamp}] ${text}` });
        }
      };

      // Ejecutar código con console personalizado
      const wrappedCode = `
        (function() {
          const console = customConsole;
          ${code}
        })();
      `;
      
      // Usar Function para ejecutar el código
      const func = new Function('customConsole', wrappedCode);
      func(customConsole);
      
      // Agregar todos los logs
      if (logs.length > 0) {
        setHistory(prev => [...prev, ...logs]);
      } else {
        setHistory(prev => [...prev, 
          { type: 'success', text: `[${timestamp}] ✓ Código ejecutado correctamente (sin salida)` }
        ]);
      }
      
    } catch (error) {
      setHistory(prev => [...prev, 
        { type: 'error', text: `[${timestamp}] ✗ Error: ${error.message}` }
      ]);
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

  const getTextColor = (type) => {
    switch (type) {
      case 'command': return 'text-cyan-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-300';
      case 'console': return 'text-gray-100';
      default: return 'text-white';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${isMaximized ? 'fixed inset-0 z-50' : 'h-64'} bg-gray-900 border-t border-blue-500/30 flex flex-col`}>
      {/* Header */}
      <div className="h-10 bg-gray-800 border-b border-blue-500/30 flex items-center justify-between px-3 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent pointer-events-none"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <TerminalIcon className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-200 font-medium">Terminal</span>
        </div>
        
        <div className="flex items-center gap-1 relative z-10">
          <button
            onClick={onExecuteCode}
            className="px-2 py-1 hover:bg-green-500/20 rounded transition-all border border-transparent hover:border-green-500/40 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)] flex items-center gap-1.5"
            title="Ejecutar código JavaScript del archivo activo"
          >
            <Play className="w-3.5 h-3.5 text-green-400 fill-green-400" />
            <span className="text-xs text-green-300">Ejecutar</span>
          </button>
          <div className="w-px h-4 bg-border-color mx-1"></div>
          <button
            onClick={onToggleSize}
            className="p-1 hover:bg-blue-500/20 rounded transition-all border border-transparent hover:border-blue-500/40"
            title={isMaximized ? "Minimizar" : "Maximizar"}
          >
            {isMaximized ? <Minus className="w-4 h-4 text-blue-400" /> : <Maximize2 className="w-4 h-4 text-blue-400" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-500/20 rounded transition-all border border-transparent hover:border-red-500/40"
            title="Cerrar"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item, index) => (
          <div key={index} className={`${getTextColor(item.type)} mb-1`}>
            {item.text}
          </div>
        ))}
        
        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
          <span className="text-cyan-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
});

Terminal.displayName = 'Terminal';

export default Terminal;
