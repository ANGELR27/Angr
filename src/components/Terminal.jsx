import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Terminal as TerminalIcon, X, Minus, Maximize2, Play } from 'lucide-react';
import * as termCmd from '../utils/terminalCommands';

const Terminal = forwardRef(({ isOpen, onClose, onToggleSize, isMaximized, onExecuteCode, onOpenThemes, currentTheme, projectFiles, onFileSelect }, ref) => {
  const [history, setHistory] = useState([
    { type: 'info', text: '> Terminal de Code Editor v1.0' },
    { type: 'success', text: '> ¡Bienvenido! Escribe "help" para ver comandos disponibles.' },
    { type: 'info', text: '> Usa Tab para autocompletar, ↑↓ para historial' }
  ]);
  const [input, setInput] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [variables, setVariables] = useState({});
  const [aliases, setAliases] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  // Expandir variables en un string
  const expandVariables = (text) => {
    return text.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, varName) => {
      return variables[varName] || match;
    });
  };

  // Lista de comandos disponibles
  const availableCommands = [
    'help', 'clear', 'date', 'time', 'version', 'theme', 'tema',
    'ls', 'cat', 'find', 'grep', 'tree', 'stats',
    'calc', 'json', 'base64', 'base64d', 'hash',
    'env', 'set', 'unset', 'alias', 'unalias',
    'pwd', 'whoami', 'sysinfo', 'history', 'echo'
  ];

  const executeCommand = (cmd) => {
    if (!cmd.trim()) return;

    const originalCmd = cmd;
    
    // Expandir alias
    const firstWord = cmd.trim().split(' ')[0];
    if (aliases[firstWord]) {
      cmd = cmd.replace(firstWord, aliases[firstWord]);
    }
    
    // Expandir variables
    cmd = expandVariables(cmd);
    
    // Agregar al historial de comandos
    setCommandHistory(prev => [...prev, originalCmd]);
    setHistoryIndex(-1);
    
    setHistory(prev => [...prev, { type: 'command', text: `$ ${originalCmd}` }]);
    
    // Manejar pipes
    const pipes = termCmd.parsePipes(cmd);
    if (pipes.length > 1) {
      executeWithPipes(pipes);
      return;
    }
    
    // Manejar redirección
    const redirection = termCmd.parseRedirection(cmd);
    if (redirection) {
      // TODO: implementar redirección a archivo
      setHistory(prev => [...prev, { type: 'warning', text: 'Redirección a archivos aún no implementada' }]);
      return;
    }
    
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    switch (command) {
      case 'help':
        setHistory(prev => [...prev, 
          { type: 'info', text: '═══ Comandos Disponibles ═══' },
          { type: 'info', text: '' },
          { type: 'success', text: '📁 Archivos:' },
          { type: 'info', text: '  ls [ruta]        - Lista archivos y carpetas' },
          { type: 'info', text: '  cat <archivo>    - Muestra contenido de archivo' },
          { type: 'info', text: '  find <patrón>    - Busca archivos por nombre' },
          { type: 'info', text: '  grep <texto>     - Busca texto en archivos' },
          { type: 'info', text: '  tree             - Árbol de directorios' },
          { type: 'info', text: '  stats            - Estadísticas del proyecto' },
          { type: 'info', text: '' },
          { type: 'success', text: '🛠️  Utilidades:' },
          { type: 'info', text: '  calc <expr>      - Calculadora (ej: calc 2+2*3)' },
          { type: 'info', text: '  json <texto>     - Formatea JSON' },
          { type: 'info', text: '  base64 <texto>   - Codifica en base64' },
          { type: 'info', text: '  base64d <texto>  - Decodifica base64' },
          { type: 'info', text: '  hash <texto>     - Genera hash simple' },
          { type: 'info', text: '' },
          { type: 'success', text: '⚙️  Sistema:' },
          { type: 'info', text: '  env              - Variables de entorno' },
          { type: 'info', text: '  set VAR=valor    - Define variable' },
          { type: 'info', text: '  unset VAR        - Elimina variable' },
          { type: 'info', text: '  alias nom=cmd    - Define alias' },
          { type: 'info', text: '  history          - Historial de comandos' },
          { type: 'info', text: '  sysinfo          - Información del sistema' },
          { type: 'info', text: '' },
          { type: 'success', text: '🎨 General:' },
          { type: 'info', text: '  clear / cls      - Limpia terminal' },
          { type: 'info', text: '  echo <texto>     - Imprime texto (usa $VAR)' },
          { type: 'info', text: '  date / time      - Fecha y hora' },
          { type: 'info', text: '  version          - Versión del editor' },
          { type: 'info', text: '  theme            - Selector de temas' },
          { type: 'info', text: '' },
          { type: 'info', text: '💡 Usa Tab para autocompletar, ↑↓ para historial' }
        ]);
        break;
      
      case 'clear':
      case 'cls':
        setHistory([]);
        break;
      
      case 'ls':
        const lsResult = termCmd.listFiles(projectFiles || {}, args[0] || '', { sort: true });
        if (lsResult.error) {
          setHistory(prev => [...prev, { type: 'error', text: lsResult.error }]);
        } else {
          const items = lsResult.items.map(item => {
            if (item.type === 'folder') {
              return `📁 ${item.name}/ (${item.count} items)`;
            } else {
              const size = termCmd.formatBytes(item.size);
              return `📄 ${item.name} (${size}) [${item.language}]`;
            }
          });
          setHistory(prev => [...prev, 
            { type: 'success', text: `Total: ${items.length} items` },
            ...items.map(text => ({ type: 'info', text }))
          ]);
        }
        break;
      
      case 'cat':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: cat <archivo>' }]);
          break;
        }
        const catResult = termCmd.catFile(projectFiles || {}, args[0]);
        if (catResult.error) {
          setHistory(prev => [...prev, { type: 'error', text: catResult.error }]);
        } else {
          const lines = catResult.content.split('\n').slice(0, 100); // Límite 100 líneas
          setHistory(prev => [...prev,
            { type: 'info', text: `─── ${args[0]} (${catResult.language}) ───` },
            ...lines.map(line => ({ type: 'console', text: line })),
            ...(catResult.content.split('\n').length > 100 ? 
              [{ type: 'warning', text: `... (mostrando primeras 100 líneas de ${catResult.content.split('\n').length})` }] : []
            )
          ]);
        }
        break;
      
      case 'find':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: find <patrón>' }]);
          break;
        }
        const findResults = termCmd.findFiles(projectFiles || {}, args[0]);
        if (findResults.length === 0) {
          setHistory(prev => [...prev, { type: 'warning', text: 'No se encontraron archivos' }]);
        } else {
          setHistory(prev => [...prev,
            { type: 'success', text: `Encontrados ${findResults.length} resultados:` },
            ...findResults.map(r => ({ 
              type: 'info', 
              text: `${r.type === 'folder' ? '📁' : '📄'} ${r.path}`
            }))
          ]);
        }
        break;
      
      case 'grep':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: grep <texto>' }]);
          break;
        }
        const grepResults = termCmd.grepFiles(projectFiles || {}, args.join(' '), { caseInsensitive: false });
        if (grepResults.length === 0) {
          setHistory(prev => [...prev, { type: 'warning', text: 'No se encontraron coincidencias' }]);
        } else {
          const limited = grepResults.slice(0, 50);
          setHistory(prev => [...prev,
            { type: 'success', text: `Encontradas ${grepResults.length} coincidencias (mostrando ${limited.length}):` },
            ...limited.map(r => ({ 
              type: 'info', 
              text: `${r.file}:${r.line} | ${r.content}`
            }))
          ]);
        }
        break;
      
      case 'stats':
        const stats = termCmd.getProjectStats(projectFiles || {});
        setHistory(prev => [...prev,
          { type: 'success', text: '═══ Estadísticas del Proyecto ═══' },
          { type: 'info', text: `📁 Carpetas: ${stats.folders}` },
          { type: 'info', text: `📄 Archivos: ${stats.files}` },
          { type: 'info', text: `💾 Tamaño total: ${termCmd.formatBytes(stats.totalSize)}` },
          { type: 'info', text: `📦 Archivo más grande: ${stats.largestFile.name} (${termCmd.formatBytes(stats.largestFile.size)})` },
          { type: 'info', text: '' },
          { type: 'success', text: 'Por lenguaje:' },
          ...Object.entries(stats.byLanguage).map(([lang, data]) => ({
            type: 'info',
            text: `  ${lang}: ${data.count} archivos (${termCmd.formatBytes(data.size)})`
          }))
        ]);
        break;
      
      case 'calc':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: calc <expresión>' }]);
          break;
        }
        const calcResult = termCmd.calculate(args.join(' '));
        if (calcResult.error) {
          setHistory(prev => [...prev, { type: 'error', text: calcResult.error }]);
        } else {
          setHistory(prev => [...prev, { type: 'success', text: `= ${calcResult.result}` }]);
        }
        break;
      
      case 'json':
        const jsonResult = termCmd.formatJSON(args.join(' '));
        if (jsonResult.error) {
          setHistory(prev => [...prev, { type: 'error', text: jsonResult.error }]);
        } else {
          setHistory(prev => [...prev, 
            ...jsonResult.result.split('\n').map(line => ({ type: 'console', text: line }))
          ]);
        }
        break;
      
      case 'base64':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: base64 <texto>' }]);
          break;
        }
        const b64Result = termCmd.base64Encode(args.join(' '));
        if (b64Result.error) {
          setHistory(prev => [...prev, { type: 'error', text: b64Result.error }]);
        } else {
          setHistory(prev => [...prev, { type: 'success', text: b64Result.result }]);
        }
        break;
      
      case 'base64d':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: base64d <texto>' }]);
          break;
        }
        const b64dResult = termCmd.base64Decode(args.join(' '));
        if (b64dResult.error) {
          setHistory(prev => [...prev, { type: 'error', text: b64dResult.error }]);
        } else {
          setHistory(prev => [...prev, { type: 'success', text: b64dResult.result }]);
        }
        break;
      
      case 'hash':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: hash <texto>' }]);
          break;
        }
        const hashResult = termCmd.simpleHash(args.join(' '));
        setHistory(prev => [...prev, { type: 'success', text: hashResult.result }]);
        break;
      
      case 'env':
        if (Object.keys(variables).length === 0) {
          setHistory(prev => [...prev, { type: 'warning', text: 'No hay variables definidas' }]);
        } else {
          setHistory(prev => [...prev,
            { type: 'success', text: 'Variables:' },
            ...Object.entries(variables).map(([key, val]) => ({
              type: 'info',
              text: `  ${key}=${val}`
            }))
          ]);
        }
        break;
      
      case 'set':
        if (!args[0] || !args[0].includes('=')) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: set VAR=valor' }]);
          break;
        }
        const [varName, ...varValue] = args.join(' ').split('=');
        setVariables(prev => ({ ...prev, [varName.trim()]: varValue.join('=').trim() }));
        setHistory(prev => [...prev, { type: 'success', text: `Variable ${varName} definida` }]);
        break;
      
      case 'unset':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: unset VAR' }]);
          break;
        }
        setVariables(prev => {
          const newVars = { ...prev };
          delete newVars[args[0]];
          return newVars;
        });
        setHistory(prev => [...prev, { type: 'success', text: `Variable ${args[0]} eliminada` }]);
        break;
      
      case 'alias':
        if (!args[0]) {
          if (Object.keys(aliases).length === 0) {
            setHistory(prev => [...prev, { type: 'warning', text: 'No hay alias definidos' }]);
          } else {
            setHistory(prev => [...prev,
              { type: 'success', text: 'Alias:' },
              ...Object.entries(aliases).map(([key, val]) => ({
                type: 'info',
                text: `  ${key}='${val}'`
              }))
            ]);
          }
          break;
        }
        if (!args[0].includes('=')) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: alias nombre=comando' }]);
          break;
        }
        const [aliasName, ...aliasValue] = args.join(' ').split('=');
        setAliases(prev => ({ ...prev, [aliasName.trim()]: aliasValue.join('=').trim() }));
        setHistory(prev => [...prev, { type: 'success', text: `Alias ${aliasName} definido` }]);
        break;
      
      case 'unalias':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', text: 'Uso: unalias nombre' }]);
          break;
        }
        setAliases(prev => {
          const newAliases = { ...prev };
          delete newAliases[args[0]];
          return newAliases;
        });
        setHistory(prev => [...prev, { type: 'success', text: `Alias ${args[0]} eliminado` }]);
        break;
      
      case 'history':
        if (commandHistory.length === 0) {
          setHistory(prev => [...prev, { type: 'warning', text: 'Historial vacío' }]);
        } else {
          setHistory(prev => [...prev,
            ...commandHistory.slice(-50).map((cmd, i) => ({
              type: 'info',
              text: `${i + 1}. ${cmd}`
            }))
          ]);
        }
        break;
      
      case 'sysinfo':
        const sysInfo = termCmd.getSystemInfo();
        setHistory(prev => [...prev,
          { type: 'success', text: '═══ Información del Sistema ═══' },
          { type: 'info', text: `🖥️  Plataforma: ${sysInfo.platform}` },
          { type: 'info', text: `🌐 Idioma: ${sysInfo.language}` },
          { type: 'info', text: `🔌 Online: ${sysInfo.online ? 'Sí' : 'No'}` },
          { type: 'info', text: `⚙️  Núcleos: ${sysInfo.cores}` },
          { type: 'info', text: `💾 Memoria: ${sysInfo.memory}` },
          { type: 'info', text: `📺 Pantalla: ${sysInfo.screen}` },
          { type: 'info', text: `🎨 Color: ${sysInfo.colorDepth}` }
        ]);
        break;
      
      case 'date':
        setHistory(prev => [...prev, { type: 'success', text: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }]);
        break;
      
      case 'time':
        setHistory(prev => [...prev, { type: 'success', text: new Date().toLocaleTimeString('es-ES') }]);
        break;
      
      case 'pwd':
        setHistory(prev => [...prev, { type: 'success', text: '/' }]);
        break;
      
      case 'whoami':
        setHistory(prev => [...prev, { type: 'success', text: 'developer' }]);
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
      
      case 'echo':
        setHistory(prev => [...prev, { type: 'success', text: args.join(' ') }]);
        break;
      
      default:
        setHistory(prev => [...prev, 
          { type: 'error', text: `Comando no reconocido: ${command}` },
          { type: 'info', text: 'Escribe "help" para ver los comandos disponibles' }
        ]);
    }
  };

  const executeWithPipes = (pipes) => {
    // Placeholder para pipes - funcionalidad avanzada
    setHistory(prev => [...prev, { type: 'warning', text: 'Pipes detectados pero aún no completamente implementados' }]);
    // Ejecutar el primer comando por ahora
    executeCommand(pipes[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
      setShowSuggestions(false);
    }
  };

  // Manejar teclas especiales (flechas, tab)
  const handleKeyDown = (e) => {
    // Flecha arriba - navegar historial hacia atrás
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      
      const newIndex = historyIndex === -1 
        ? commandHistory.length - 1 
        : Math.max(0, historyIndex - 1);
      
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
      setShowSuggestions(false);
    }
    
    // Flecha abajo - navegar historial hacia adelante
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      
      const newIndex = historyIndex + 1;
      
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
      setShowSuggestions(false);
    }
    
    // Tab - autocompletado
    else if (e.key === 'Tab') {
      e.preventDefault();
      handleAutoComplete();
    }
    
    // Escape - cerrar sugerencias
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Autocompletado inteligente
  const handleAutoComplete = () => {
    if (!input.trim()) return;
    
    const parts = input.split(' ');
    
    // Autocompletar comando (primer palabra)
    if (parts.length === 1) {
      const cmdSuggestions = termCmd.getCommandSuggestions(parts[0], availableCommands);
      
      if (cmdSuggestions.length === 1) {
        setInput(cmdSuggestions[0] + ' ');
        setShowSuggestions(false);
      } else if (cmdSuggestions.length > 1) {
        setSuggestions(cmdSuggestions);
        setShowSuggestions(true);
        // Mostrar sugerencias en el historial
        setHistory(prev => [...prev,
          { type: 'info', text: `Sugerencias: ${cmdSuggestions.join(', ')}` }
        ]);
      }
    }
    // Autocompletar ruta de archivo (comandos que requieren archivos)
    else {
      const command = parts[0].toLowerCase();
      const fileCommands = ['cat', 'ls', 'find', 'grep'];
      
      if (fileCommands.includes(command) && projectFiles) {
        const currentPath = parts[parts.length - 1];
        const pathSuggestions = termCmd.getPathSuggestions(currentPath, projectFiles);
        
        if (pathSuggestions.length === 1) {
          parts[parts.length - 1] = pathSuggestions[0].path + (pathSuggestions[0].isFolder ? '/' : '');
          setInput(parts.join(' '));
          setShowSuggestions(false);
        } else if (pathSuggestions.length > 1) {
          const names = pathSuggestions.map(s => s.name).join(', ');
          setHistory(prev => [...prev,
            { type: 'info', text: `Sugerencias: ${names}` }
          ]);
        }
      }
    }
  };

  // Actualizar sugerencias mientras se escribe
  useEffect(() => {
    if (!input.trim()) {
      setShowSuggestions(false);
      return;
    }
    
    const parts = input.split(' ');
    if (parts.length === 1) {
      const cmdSuggestions = termCmd.getCommandSuggestions(parts[0], availableCommands);
      if (cmdSuggestions.length > 0 && cmdSuggestions.length < 10) {
        setSuggestions(cmdSuggestions);
      } else {
        setShowSuggestions(false);
      }
    }
  }, [input]);

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
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none"
              style={{ color: 'var(--theme-text)' }}
              autoFocus
              spellCheck={false}
              placeholder="Escribe un comando (Tab para autocompletar, ↑↓ para historial)"
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
