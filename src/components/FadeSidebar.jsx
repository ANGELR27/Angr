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
      className="flex flex-col items-center gap-3 py-4 border-r"
      style={{
        width: '60px',
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a'
      }}
    >
      {/* Logo/Home */}
      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
        style={{
          backgroundColor: '#2a2a2a',
          border: '1px solid #3a3a3a'
        }}
        title="Home"
      >
        <Code className="w-5 h-5" style={{ color: '#60a5fa' }} />
      </button>

      <div 
        className="w-8 h-px"
        style={{ backgroundColor: '#2a2a2a' }}
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
              backgroundColor: isActive ? '#3f3f46' : 'transparent',
              border: `1px solid ${isActive ? '#52525b' : 'transparent'}`
            }}
            title={tool.label}
          >
            <Icon 
              className="w-5 h-5" 
              style={{ color: isActive ? '#60a5fa' : '#71717a' }} 
            />
          </button>
        );
      })}
    </div>
  );
};

export default FadeSidebar;
