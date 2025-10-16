import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown, ChevronUp, Replace, ReplaceAll } from 'lucide-react';

/**
 * Widget de búsqueda y reemplazo para el editor
 * Se activa con Ctrl+F
 */
function SearchWidget({ isOpen, onClose, editor, currentTheme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [regex, setRegex] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const searchInputRef = useRef(null);
  const isLite = currentTheme === 'lite';

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.select();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!editor || !searchTerm) {
      setMatchCount(0);
      setCurrentMatch(0);
      return;
    }

    // Buscar y contar coincidencias
    const model = editor.getModel();
    if (!model) return;

    const matches = model.findMatches(
      searchTerm,
      true, // searchOnlyEditableRange
      regex, // isRegex
      caseSensitive, // matchCase
      wholeWord ? searchTerm : null, // wordSeparators
      false // captureMatches
    );

    setMatchCount(matches.length);
    
    if (matches.length > 0) {
      // Resaltar todas las coincidencias
      editor.deltaDecorations([], matches.map(match => ({
        range: match.range,
        options: {
          className: 'searchMatch',
          minimap: { color: '#fbbf24', position: 1 },
          overviewRuler: { color: '#fbbf24', position: 1 }
        }
      })));
    }
  }, [searchTerm, caseSensitive, wholeWord, regex, editor]);

  const findNext = () => {
    if (!editor || !searchTerm) return;

    const action = editor.getAction('actions.find');
    if (action) {
      action.run();
    }
  };

  const findPrevious = () => {
    if (!editor || !searchTerm) return;

    const action = editor.getAction('actions.findPrevious');
    if (action) {
      action.run();
    }
  };

  const replaceOne = () => {
    if (!editor || !searchTerm) return;

    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!model) return;

    const selectedText = model.getValueInRange(selection);
    
    // Verificar si la selección actual coincide con el término de búsqueda
    const matches = regex ? 
      selectedText.match(new RegExp(searchTerm, caseSensitive ? '' : 'i')) :
      (caseSensitive ? selectedText === searchTerm : selectedText.toLowerCase() === searchTerm.toLowerCase());

    if (matches) {
      editor.executeEdits('replace', [{
        range: selection,
        text: replaceTerm
      }]);
      findNext();
    } else {
      findNext();
    }
  };

  const replaceAll = () => {
    if (!editor || !searchTerm) return;

    const model = editor.getModel();
    if (!model) return;

    const matches = model.findMatches(
      searchTerm,
      true,
      regex,
      caseSensitive,
      wholeWord ? searchTerm : null,
      false
    );

    if (matches.length === 0) return;

    editor.executeEdits('replaceAll', matches.map(match => ({
      range: match.range,
      text: replaceTerm
    })));

    setMatchCount(0);
    setCurrentMatch(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        findPrevious();
      } else {
        findNext();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-0 right-4 z-50 rounded-lg shadow-2xl border"
      style={{
        backgroundColor: isLite ? '#ffffff' : 'var(--theme-background-secondary)',
        borderColor: isLite ? '#e5e7eb' : 'var(--theme-border)',
        minWidth: '400px'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
            {showReplace ? 'Buscar y Reemplazar' : 'Buscar'}
          </span>
          {matchCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded" style={{
              backgroundColor: isLite ? '#dbeafe' : 'rgba(59, 130, 246, 0.2)',
              color: isLite ? '#1e40af' : '#60a5fa'
            }}>
              {matchCount} resultados
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-opacity-10"
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar..."
              className="w-full px-3 py-1.5 rounded text-sm border outline-none"
              style={{
                backgroundColor: isLite ? '#f9fafb' : 'var(--theme-background-tertiary)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text)'
              }}
            />
          </div>
          <button
            onClick={findPrevious}
            disabled={!searchTerm || matchCount === 0}
            className="p-1.5 rounded transition-colors disabled:opacity-30"
            style={{
              backgroundColor: isLite ? '#f3f4f6' : 'var(--theme-surface)',
              color: 'var(--theme-text)'
            }}
            title="Anterior (Shift+Enter)"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={findNext}
            disabled={!searchTerm || matchCount === 0}
            className="p-1.5 rounded transition-colors disabled:opacity-30"
            style={{
              backgroundColor: isLite ? '#f3f4f6' : 'var(--theme-surface)',
              color: 'var(--theme-text)'
            }}
            title="Siguiente (Enter)"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Replace Input (conditional) */}
        {showReplace && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Reemplazar..."
                className="w-full px-3 py-1.5 rounded text-sm border outline-none"
                style={{
                  backgroundColor: isLite ? '#f9fafb' : 'var(--theme-background-tertiary)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text)'
                }}
              />
            </div>
            <button
              onClick={replaceOne}
              disabled={!searchTerm || matchCount === 0}
              className="p-1.5 rounded transition-colors disabled:opacity-30"
              style={{
                backgroundColor: isLite ? '#f3f4f6' : 'var(--theme-surface)',
                color: 'var(--theme-text)'
              }}
              title="Reemplazar uno"
            >
              <Replace className="w-4 h-4" />
            </button>
            <button
              onClick={replaceAll}
              disabled={!searchTerm || matchCount === 0}
              className="p-1.5 rounded transition-colors disabled:opacity-30"
              style={{
                backgroundColor: isLite ? '#f3f4f6' : 'var(--theme-surface)',
                color: 'var(--theme-text)'
              }}
              title="Reemplazar todo"
            >
              <ReplaceAll className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Options */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="rounded"
              />
              Aa (Coincidir mayúsculas)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="rounded"
              />
              Palabra completa
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
              <input
                type="checkbox"
                checked={regex}
                onChange={(e) => setRegex(e.target.checked)}
                className="rounded"
              />
              .*  Regex
            </label>
          </div>
          <button
            onClick={() => setShowReplace(!showReplace)}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{
              backgroundColor: showReplace ? 'var(--theme-primary)' : 'transparent',
              color: showReplace ? '#fff' : 'var(--theme-primary)'
            }}
          >
            {showReplace ? 'Ocultar' : 'Reemplazar'}
          </button>
        </div>
      </div>

      {/* Atajos de teclado */}
      <div className="px-3 py-2 border-t text-xs" style={{
        borderColor: 'var(--theme-border)',
        color: 'var(--theme-text-muted)',
        backgroundColor: isLite ? '#f9fafb' : 'rgba(0,0,0,0.2)'
      }}>
        <strong>Atajos:</strong> Enter = Siguiente | Shift+Enter = Anterior | Esc = Cerrar
      </div>
    </div>
  );
}

export default SearchWidget;
