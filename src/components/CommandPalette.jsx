import { useState, useEffect, useRef } from 'react';
import { Command, X, Zap } from 'lucide-react';

/**
 * Panel de comandos estilo VS Code (Ctrl+Shift+P)
 * Acceso rápido a todas las acciones del editor
 */
function CommandPalette({ isOpen, onClose, editor, onExecuteCommand, currentTheme }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const isLite = currentTheme === 'lite';

  const commands = [
    { id: 'format', label: 'Formatear Documento', icon: '✨', shortcut: 'Ctrl+Shift+F', action: () => editor?.getAction('editor.action.formatDocument')?.run() },
    { id: 'find', label: 'Buscar', icon: '🔍', shortcut: 'Ctrl+F', action: () => onExecuteCommand?.('search') },
    { id: 'goto', label: 'Ir a Línea...', icon: '🎯', shortcut: 'Ctrl+G', action: () => editor?.getAction('editor.action.gotoLine')?.run() },
    { id: 'comment', label: 'Comentar/Descomentar Línea', icon: '💬', shortcut: 'Ctrl+/', action: () => editor?.getAction('editor.action.commentLine')?.run() },
    { id: 'duplicate', label: 'Duplicar Línea', icon: '📋', shortcut: 'Ctrl+D', action: () => editor?.getAction('editor.action.copyLinesDownAction')?.run() },
    { id: 'delete', label: 'Eliminar Línea', icon: '🗑️', shortcut: 'Ctrl+Shift+K', action: () => editor?.getAction('editor.action.deleteLines')?.run() },
    { id: 'moveup', label: 'Mover Línea Arriba', icon: '⬆️', shortcut: 'Alt+Up', action: () => editor?.getAction('editor.action.moveLinesUpAction')?.run() },
    { id: 'movedown', label: 'Mover Línea Abajo', icon: '⬇️', shortcut: 'Alt+Down', action: () => editor?.getAction('editor.action.moveLinesDownAction')?.run() },
    { id: 'selectall', label: 'Seleccionar Todo', icon: '📝', shortcut: 'Ctrl+A', action: () => editor?.getAction('editor.action.selectAll')?.run() },
    { id: 'undo', label: 'Deshacer', icon: '↩️', shortcut: 'Ctrl+Z', action: () => editor?.getAction('undo')?.run() },
    { id: 'redo', label: 'Rehacer', icon: '↪️', shortcut: 'Ctrl+Y', action: () => editor?.getAction('redo')?.run() },
    { id: 'fold', label: 'Plegar Región', icon: '➖', shortcut: '', action: () => editor?.getAction('editor.fold')?.run() },
    { id: 'unfold', label: 'Desplegar Región', icon: '➕', shortcut: '', action: () => editor?.getAction('editor.unfold')?.run() },
    { id: 'foldall', label: 'Plegar Todo', icon: '🔽', shortcut: '', action: () => editor?.getAction('editor.foldAll')?.run() },
    { id: 'unfoldall', label: 'Desplegar Todo', icon: '🔼', shortcut: '', action: () => editor?.getAction('editor.unfoldAll')?.run() },
    { id: 'trim', label: 'Eliminar Espacios al Final', icon: '✂️', shortcut: '', action: () => editor?.getAction('editor.action.trimTrailingWhitespace')?.run() },
    { id: 'sort-asc', label: 'Ordenar Líneas Ascendente', icon: '🔤', shortcut: '', action: () => editor?.getAction('editor.action.sortLinesAscending')?.run() },
    { id: 'sort-desc', label: 'Ordenar Líneas Descendente', icon: '🔡', shortcut: '', action: () => editor?.getAction('editor.action.sortLinesDescending')?.run() },
    { id: 'uppercase', label: 'Convertir a Mayúsculas', icon: '🔠', shortcut: '', action: () => editor?.getAction('editor.action.transformToUppercase')?.run() },
    { id: 'lowercase', label: 'Convertir a Minúsculas', icon: '🔡', shortcut: '', action: () => editor?.getAction('editor.action.transformToLowercase')?.run() },
    { id: 'minimap', label: 'Toggle Minimap', icon: '🗺️', shortcut: 'Ctrl+M', action: () => {
      const options = editor?.getOptions();
      if (options) {
        const enabled = options.get(57)?.enabled; // EditorOption.minimap
        editor?.updateOptions({ minimap: { enabled: !enabled } });
      }
    }},
    { id: 'wordwrap', label: 'Toggle Word Wrap', icon: '↔️', shortcut: '', action: () => {
      const options = editor?.getOptions();
      if (options) {
        const current = options.get(127); // wordWrap
        editor?.updateOptions({ wordWrap: current === 'on' ? 'off' : 'on' });
      }
    }},
    { id: 'whitespace', label: 'Toggle Espacios en Blanco', icon: '·', shortcut: '', action: () => {
      const options = editor?.getOptions();
      if (options) {
        const current = options.get(105); // renderWhitespace
        editor?.updateOptions({ renderWhitespace: current === 'none' ? 'all' : 'none' });
      }
    }},
  ];

  const filteredCommands = query
    ? commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.id.includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const executeCommand = (cmd) => {
    if (cmd.action) {
      cmd.action();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 backdrop-blur-sm"
      style={{ backgroundColor: isLite ? 'rgba(11, 18, 32, 0.55)' : 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-lg shadow-2xl border overflow-hidden ${isLite ? 'lite-glass-strong' : ''}`}
        style={{
          backgroundColor: isLite ? 'transparent' : 'var(--theme-background-secondary)',
          borderColor: isLite ? 'transparent' : 'var(--theme-border)',
          boxShadow: isLite ? 'none' : '0 20px 60px rgba(0,0,0,0.6)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con search */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--theme-border)' }}>
          <Command className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un comando..."
            className="flex-1 bg-transparent border-none outline-none text-base"
            style={{ color: 'var(--theme-text)' }}
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-opacity-10" style={{ color: 'var(--theme-text-secondary)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de comandos */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--theme-text-muted)' }}>
              <Zap className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No se encontraron comandos</p>
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                onClick={() => executeCommand(cmd)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-b"
                style={{
                  backgroundColor: index === selectedIndex 
                    ? (isLite ? 'color-mix(in srgb, var(--theme-secondary) 12%, transparent)' : 'rgba(59, 130, 246, 0.15)')
                    : 'transparent',
                  borderColor: 'var(--theme-border)'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cmd.icon}</span>
                  <span className="font-medium" style={{ color: 'var(--theme-text)' }}>
                    {cmd.label}
                  </span>
                </div>
                {cmd.shortcut && (
                  <span 
                    className="text-xs px-2 py-1 rounded font-mono"
                    style={{
                      backgroundColor: isLite ? 'color-mix(in srgb, var(--theme-border) 65%, transparent)' : 'rgba(255,255,255,0.1)',
                      color: 'var(--theme-text-secondary)'
                    }}
                  >
                    {cmd.shortcut}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer con ayuda */}
        <div className="px-4 py-2 border-t text-xs flex items-center justify-between" style={{
          borderColor: 'var(--theme-border)',
          backgroundColor: isLite ? 'color-mix(in srgb, var(--theme-background-tertiary) 85%, transparent)' : 'rgba(0,0,0,0.2)',
          color: 'var(--theme-text-muted)'
        }}>
          <span>↑↓ Navegar | ⏎ Ejecutar | Esc Cerrar</span>
          <span>{filteredCommands.length} comandos</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
