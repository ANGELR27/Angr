import { X } from 'lucide-react';

function DiffViewer({ isOpen, onClose, filePath, oldContent, newContent, currentTheme }) {
  if (!isOpen) return null;

  const isLite = currentTheme === 'lite';
  const oldLines = (oldContent || '').split('\n');
  const newLines = (newContent || '').split('\n');
  const maxLines = Math.max(oldLines.length, newLines.length);

  const getDiff = () => {
    const diff = [];
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === undefined) {
        diff.push({ line: i + 1, type: 'added', content: newLine });
      } else if (newLine === undefined) {
        diff.push({ line: i + 1, type: 'deleted', content: oldLine });
      } else if (oldLine !== newLine) {
        diff.push({ line: i + 1, type: 'modified', oldContent: oldLine, newContent: newLine });
      } else {
        diff.push({ line: i + 1, type: 'unchanged', content: oldLine });
      }
    }
    return diff;
  };

  const diff = getDiff();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: isLite ? 'rgba(11, 18, 32, 0.55)' : 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div
        className={`relative rounded-lg shadow-2xl overflow-hidden ${isLite ? 'lite-glass-strong' : ''}`}
        style={{
          backgroundColor: isLite ? 'transparent' : '#1e1e1e',
          width: '95%',
          maxWidth: '1400px',
          maxHeight: '90vh',
          border: isLite ? 'none' : '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: isLite ? 'none' : undefined
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{
            backgroundColor: isLite ? 'var(--theme-background-tertiary)' : '#252526',
            borderColor: isLite ? 'var(--theme-border)' : 'rgba(139, 92, 246, 0.2)'
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: isLite ? 'var(--theme-text)' : '#e0e0e0' }}>
            📊 Comparación: {filePath}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-red-500/20 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: isLite ? '#ef4444' : '#f87171' }} />
          </button>
        </div>

        {/* Diff Content */}
        <div className="flex h-full" style={{ maxHeight: 'calc(90vh - 70px)' }}>
          {/* Versión Anterior */}
          <div className="w-1/2 border-r overflow-y-auto" style={{ borderColor: isLite ? 'var(--theme-border)' : 'rgba(139, 92, 246, 0.2)' }}>
            <div className="sticky top-0 z-10 p-2 font-semibold text-center border-b" style={{
              backgroundColor: isLite ? 'color-mix(in srgb, #ef4444 12%, var(--theme-background-secondary))' : '#3f1d1d',
              borderColor: isLite ? 'var(--theme-border)' : 'rgba(139, 92, 246, 0.2)',
              color: isLite ? 'color-mix(in srgb, #ef4444 75%, var(--theme-text))' : '#fca5a5'
            }}>
              Versión Anterior
            </div>
            <div className="font-mono text-sm">
              {diff.map((item, idx) => {
                if (item.type === 'added') return null;
                const bgColor = item.type === 'deleted' ? (isLite ? 'color-mix(in srgb, #ef4444 14%, transparent)' : '#3f1d1d') :
                               item.type === 'modified' ? (isLite ? 'color-mix(in srgb, var(--theme-accent) 10%, transparent)' : '#3d2b1f') :
                               'transparent';
                return (
                  <div
                    key={idx}
                    className="px-3 py-0.5 flex"
                    style={{ backgroundColor: bgColor }}
                  >
                    <span className="inline-block w-10 text-right mr-3" style={{ 
                      color: isLite ? 'var(--theme-text-muted)' : '#6b7280',
                      userSelect: 'none'
                    }}>
                      {item.type !== 'added' ? item.line : ''}
                    </span>
                    <span style={{ color: isLite ? 'var(--theme-text)' : '#e0e0e0' }}>
                      {item.type === 'modified' ? item.oldContent : item.content}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Versión Nueva */}
          <div className="w-1/2 overflow-y-auto">
            <div className="sticky top-0 z-10 p-2 font-semibold text-center border-b" style={{
              backgroundColor: isLite ? 'color-mix(in srgb, var(--theme-secondary) 12%, var(--theme-background-secondary))' : '#1f3d1f',
              borderColor: isLite ? 'var(--theme-border)' : 'rgba(139, 92, 246, 0.2)',
              color: isLite ? 'var(--theme-text)' : '#86efac'
            }}>
              Versión Nueva
            </div>
            <div className="font-mono text-sm">
              {diff.map((item, idx) => {
                if (item.type === 'deleted') return null;
                const bgColor = item.type === 'added' ? (isLite ? 'color-mix(in srgb, var(--theme-secondary) 14%, transparent)' : '#1f3d1f') :
                               item.type === 'modified' ? (isLite ? 'color-mix(in srgb, var(--theme-accent) 10%, transparent)' : '#3d2b1f') :
                               'transparent';
                return (
                  <div
                    key={idx}
                    className="px-3 py-0.5 flex"
                    style={{ backgroundColor: bgColor }}
                  >
                    <span className="inline-block w-10 text-right mr-3" style={{ 
                      color: isLite ? 'var(--theme-text-muted)' : '#6b7280',
                      userSelect: 'none'
                    }}>
                      {item.type !== 'deleted' ? item.line : ''}
                    </span>
                    <span style={{ color: isLite ? 'var(--theme-text)' : '#e0e0e0' }}>
                      {item.type === 'modified' ? item.newContent : item.content}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiffViewer;
