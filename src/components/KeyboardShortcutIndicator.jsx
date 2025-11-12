import { useState, useEffect } from 'react';
import { Command, Keyboard } from 'lucide-react';

function KeyboardShortcutIndicator({ shortcut, action, onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete && onComplete(), 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{
        pointerEvents: 'none'
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl border"
        style={{
          backgroundColor: 'var(--theme-background-secondary)',
          borderColor: 'var(--theme-accent)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--theme-accent)'
        }}
      >
        <Keyboard 
          size={20} 
          style={{ color: 'var(--theme-accent)' }} 
        />
        <div className="flex flex-col">
          <span 
            className="text-sm font-semibold"
            style={{ color: 'var(--theme-text)' }}
          >
            {action}
          </span>
          <span 
            className="text-xs"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            {shortcut}
          </span>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutIndicator;
