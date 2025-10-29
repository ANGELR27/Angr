import { X, FileCode2, Braces, Palette, FileJson } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';

const TabBar = memo(function TabBar({ tabs, activeTab, onTabClick, onTabClose, getFileByPath }) {
  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.html')) {
      return <FileCode2 className="w-4 h-4 text-orange-400" />;
    }
    if (fileName.endsWith('.css')) {
      return <Palette className="w-4 h-4 text-blue-400" />;
    }
    if (fileName.endsWith('.js')) {
      return <Braces className="w-4 h-4 text-yellow-400" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-4 h-4 text-green-400" />;
    }
    return <FileCode2 className="w-4 h-4 text-gray-400" />;
  };

  const getFileName = (path) => {
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  const getFileColor = (fileName) => {
    if (fileName.endsWith('.html')) return 'blue';
    if (fileName.endsWith('.css')) return 'purple';
    if (fileName.endsWith('.js')) return 'yellow';
    return 'gray';
  };

  const getColorClasses = (fileName, isActive) => {
    const color = getFileColor(fileName);
    
    if (color === 'blue') {
      return isActive 
        ? 'bg-blue-500/20 border-b-2 border-b-blue-500 shadow-blue-glow-strong'
        : 'hover:bg-blue-500/10 hover:border-b-2 hover:border-b-blue-500/50 hover:shadow-blue-glow';
    }
    if (color === 'purple') {
      return isActive 
        ? 'bg-purple-500/20 border-b-2 border-b-purple-500 shadow-mixed-glow'
        : 'hover:bg-purple-500/10 hover:border-b-2 hover:border-b-purple-500/50';
    }
    if (color === 'yellow') {
      return isActive 
        ? 'bg-yellow-500/20 border-b-2 border-b-yellow-500 shadow-yellow-glow-strong'
        : 'hover:bg-yellow-500/10 hover:border-b-2 hover:border-b-yellow-500/50 hover:shadow-yellow-glow';
    }
    return isActive ? 'bg-editor-bg' : 'hover:bg-editor-bg/50';
  };

  return (
    <div className="h-10 bg-tab-bg border-b border-border-color flex items-center overflow-x-auto relative shadow-mixed-glow">
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-yellow-500/50" style={{
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(234, 179, 8, 0.3)',
        animation: 'pulseMixedGlow 3s ease-in-out infinite'
      }}></div>
      
      {tabs.map((tabPath) => {
        const fileName = getFileName(tabPath);
        const isActive = activeTab === tabPath;

        return (
          <div
            key={tabPath}
            className={`flex items-center gap-2 px-4 h-full border-r border-border-color/50 cursor-pointer group transition-all relative ${
              getColorClasses(fileName, isActive)
            }`}
            onClick={() => onTabClick(tabPath)}
            style={{ userSelect: 'none' }}
          >
            {getFileIcon(fileName)}
            <span 
              className={`text-sm transition-colors ${isActive ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}
              style={{ userSelect: 'none', cursor: 'pointer' }}
            >
              {fileName}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tabPath);
              }}
              className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 rounded p-0.5 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
});

export default TabBar;
