import { Terminal, Search, Code, FileJson, Wrench, Network } from 'lucide-react';
import { useState } from 'react';

const FadeSidebar = ({ onSelectTool, activeTool }) => {
  const tools = [
    { id: 'terminal', icon: Terminal, label: 'Terminal' },
    { id: 'search', icon: Search, label: 'Buscar' },
    { id: 'files', icon: Code, label: 'Archivos' },
  ];

  return (
    <div 
      className="flex flex-col items-center gap-3 py-4 border-r fade-glass-panel"
      style={{
        width: '60px',
        backgroundColor: 'var(--theme-background-secondary)',
        borderColor: 'var(--theme-border)',
        backdropFilter: 'blur(12px)'
      }}
    >
      {/* Logo/Home */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
        style={{
          backgroundColor: 'var(--theme-background-tertiary)',
          border: '1px solid var(--theme-border)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
        }}
        title="Home"
      >
        <Code className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
      </button>

      <div 
        className="w-8 h-px"
        style={{ backgroundColor: 'color-mix(in srgb, var(--theme-border) 70%, transparent)' }}
      />

      {/* Tools */}
      {tools.map(tool => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        
        return (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{
              backgroundColor: isActive ? 'color-mix(in srgb, var(--theme-surface) 85%, transparent)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--theme-border)' : 'transparent'}`
            }}
            title={tool.label}
          >
            <Icon 
              className="w-5 h-5" 
              style={{ color: isActive ? 'var(--theme-primary)' : 'var(--theme-text-muted)' }} 
            />
          </button>
        );
      })}
    </div>
  );
};

export default FadeSidebar;
