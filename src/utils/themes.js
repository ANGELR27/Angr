// Definiciones de temas personalizados para Monaco Editor
export const defineCustomThemes = (monaco) => {
  // Matrix Theme
  monaco.editor.defineTheme('matrix', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '00ff00', fontStyle: 'italic' },
      { token: 'keyword', foreground: '00ff41', fontStyle: 'bold' },
      { token: 'string', foreground: '39ff14' },
      { token: 'number', foreground: '00ff00' },
      { token: 'function', foreground: '00ff88' },
      { token: 'variable', foreground: '7fff00' },
      { token: 'type', foreground: '00ffaa' },
    ],
    colors: {
      'editor.background': '#0d0208',
      'editor.foreground': '#00ff41',
      'editorCursor.foreground': '#00ff00',
      'editor.lineHighlightBackground': '#003b00',
      'editorLineNumber.foreground': '#008f11',
      'editor.selectionBackground': '#00330033',
      'editor.inactiveSelectionBackground': '#00220022',
    }
  });

  // Tokyo Night Theme
  monaco.editor.defineTheme('tokyo-night', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '565f89', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'bb9af7', fontStyle: 'bold' },
      { token: 'string', foreground: '9ece6a' },
      { token: 'number', foreground: 'ff9e64' },
      { token: 'function', foreground: '7aa2f7' },
      { token: 'variable', foreground: 'c0caf5' },
      { token: 'type', foreground: '2ac3de' },
    ],
    colors: {
      'editor.background': '#1a1b26',
      'editor.foreground': '#c0caf5',
      'editorCursor.foreground': '#c0caf5',
      'editor.lineHighlightBackground': '#24283b',
      'editorLineNumber.foreground': '#3b4261',
      'editor.selectionBackground': '#28344a',
      'editor.inactiveSelectionBackground': '#1f2335',
    }
  });

  // Dracula Theme
  monaco.editor.defineTheme('dracula', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'function', foreground: '50fa7b' },
      { token: 'variable', foreground: 'f8f8f2' },
      { token: 'type', foreground: '8be9fd' },
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editorCursor.foreground': '#f8f8f0',
      'editor.lineHighlightBackground': '#44475a',
      'editorLineNumber.foreground': '#6272a4',
      'editor.selectionBackground': '#44475a',
      'editor.inactiveSelectionBackground': '#44475a75',
    }
  });

  // Monokai Theme
  monaco.editor.defineTheme('monokai', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f92672', fontStyle: 'bold' },
      { token: 'string', foreground: 'e6db74' },
      { token: 'number', foreground: 'ae81ff' },
      { token: 'function', foreground: 'a6e22e' },
      { token: 'variable', foreground: 'f8f8f2' },
      { token: 'type', foreground: '66d9ef' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editorCursor.foreground': '#f8f8f0',
      'editor.lineHighlightBackground': '#3e3d32',
      'editorLineNumber.foreground': '#90908a',
      'editor.selectionBackground': '#49483e',
      'editor.inactiveSelectionBackground': '#49483e75',
    }
  });

  // GitHub Dark Theme
  monaco.editor.defineTheme('github-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff7b72', fontStyle: 'bold' },
      { token: 'string', foreground: 'a5d6ff' },
      { token: 'number', foreground: '79c0ff' },
      { token: 'function', foreground: 'd2a8ff' },
      { token: 'variable', foreground: 'ffa657' },
      { token: 'type', foreground: '7ee787' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#c9d1d9',
      'editorCursor.foreground': '#58a6ff',
      'editor.lineHighlightBackground': '#161b22',
      'editorLineNumber.foreground': '#6e7681',
      'editor.selectionBackground': '#388bfd33',
      'editor.inactiveSelectionBackground': '#388bfd22',
    }
  });

  // Cobalt 2 Theme
  monaco.editor.defineTheme('cobalt2', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '0088ff', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff9d00', fontStyle: 'bold' },
      { token: 'string', foreground: '3ad900' },
      { token: 'number', foreground: 'ff628c' },
      { token: 'function', foreground: 'ffc600' },
      { token: 'variable', foreground: 'ffffff' },
      { token: 'type', foreground: '80ffbb' },
    ],
    colors: {
      'editor.background': '#193549',
      'editor.foreground': '#ffffff',
      'editorCursor.foreground': '#ffc600',
      'editor.lineHighlightBackground': '#1f4662',
      'editorLineNumber.foreground': '#007bbb',
      'editor.selectionBackground': '#0d3a58',
      'editor.inactiveSelectionBackground': '#1f456275',
    }
  });

  // Nord Theme
  monaco.editor.defineTheme('nord', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '616e88', fontStyle: 'italic' },
      { token: 'keyword', foreground: '81a1c1', fontStyle: 'bold' },
      { token: 'string', foreground: 'a3be8c' },
      { token: 'number', foreground: 'b48ead' },
      { token: 'function', foreground: '88c0d0' },
      { token: 'variable', foreground: 'd8dee9' },
      { token: 'type', foreground: '8fbcbb' },
    ],
    colors: {
      'editor.background': '#2e3440',
      'editor.foreground': '#d8dee9',
      'editorCursor.foreground': '#d8dee9',
      'editor.lineHighlightBackground': '#3b4252',
      'editorLineNumber.foreground': '#4c566a',
      'editor.selectionBackground': '#434c5e',
      'editor.inactiveSelectionBackground': '#434c5e75',
    }
  });

  // One Dark Pro Theme
  monaco.editor.defineTheme('one-dark-pro', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c678dd', fontStyle: 'bold' },
      { token: 'string', foreground: '98c379' },
      { token: 'number', foreground: 'd19a66' },
      { token: 'function', foreground: '61afef' },
      { token: 'variable', foreground: 'abb2bf' },
      { token: 'type', foreground: 'e5c07b' },
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
      'editorCursor.foreground': '#528bff',
      'editor.lineHighlightBackground': '#2c323c',
      'editorLineNumber.foreground': '#495162',
      'editor.selectionBackground': '#3e4451',
      'editor.inactiveSelectionBackground': '#3a3f4b',
    }
  });

  // Solarized Dark Theme
  monaco.editor.defineTheme('solarized-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '586e75', fontStyle: 'italic' },
      { token: 'keyword', foreground: '859900', fontStyle: 'bold' },
      { token: 'string', foreground: '2aa198' },
      { token: 'number', foreground: 'd33682' },
      { token: 'function', foreground: '268bd2' },
      { token: 'variable', foreground: '839496' },
      { token: 'type', foreground: 'b58900' },
    ],
    colors: {
      'editor.background': '#002b36',
      'editor.foreground': '#839496',
      'editorCursor.foreground': '#839496',
      'editor.lineHighlightBackground': '#073642',
      'editorLineNumber.foreground': '#586e75',
      'editor.selectionBackground': '#073642',
      'editor.inactiveSelectionBackground': '#073642',
    }
  });

  // Material Theme
  monaco.editor.defineTheme('material-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '546e7a', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c792ea', fontStyle: 'bold' },
      { token: 'string', foreground: 'c3e88d' },
      { token: 'number', foreground: 'f78c6c' },
      { token: 'function', foreground: '82aaff' },
      { token: 'variable', foreground: 'eeffff' },
      { token: 'type', foreground: 'ffcb6b' },
    ],
    colors: {
      'editor.background': '#263238',
      'editor.foreground': '#eeffff',
      'editorCursor.foreground': '#ffcc00',
      'editor.lineHighlightBackground': '#2c3b41',
      'editorLineNumber.foreground': '#37474f',
      'editor.selectionBackground': '#80cbc420',
      'editor.inactiveSelectionBackground': '#80cbc410',
    }
  });

  // Ayu Dark Theme
  monaco.editor.defineTheme('ayu-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'acb6bf8c', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff8f40', fontStyle: 'bold' },
      { token: 'string', foreground: 'aad94c' },
      { token: 'number', foreground: 'ffb454' },
      { token: 'function', foreground: 'ffb454' },
      { token: 'variable', foreground: 'bfbdb6' },
      { token: 'type', foreground: '59c2ff' },
    ],
    colors: {
      'editor.background': '#0a0e14',
      'editor.foreground': '#b3b1ad',
      'editorCursor.foreground': '#e6b450',
      'editor.lineHighlightBackground': '#131721',
      'editorLineNumber.foreground': '#2d3640',
      'editor.selectionBackground': '#253340',
      'editor.inactiveSelectionBackground': '#1f2733',
    }
  });

  // Palenight Theme
  monaco.editor.defineTheme('palenight', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '676e95', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c792ea', fontStyle: 'bold' },
      { token: 'string', foreground: 'c3e88d' },
      { token: 'number', foreground: 'f78c6c' },
      { token: 'function', foreground: '82aaff' },
      { token: 'variable', foreground: 'a6accd' },
      { token: 'type', foreground: 'ffcb6b' },
    ],
    colors: {
      'editor.background': '#292d3e',
      'editor.foreground': '#a6accd',
      'editorCursor.foreground': '#ffcc00',
      'editor.lineHighlightBackground': '#32374d',
      'editorLineNumber.foreground': '#3a3f58',
      'editor.selectionBackground': '#717cb440',
      'editor.inactiveSelectionBackground': '#717cb420',
    }
  });

  // Gruvbox Dark Theme
  monaco.editor.defineTheme('gruvbox-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '928374', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'fb4934', fontStyle: 'bold' },
      { token: 'string', foreground: 'b8bb26' },
      { token: 'number', foreground: 'd3869b' },
      { token: 'function', foreground: 'fabd2f' },
      { token: 'variable', foreground: 'ebdbb2' },
      { token: 'type', foreground: '8ec07c' },
    ],
    colors: {
      'editor.background': '#282828',
      'editor.foreground': '#ebdbb2',
      'editorCursor.foreground': '#ebdbb2',
      'editor.lineHighlightBackground': '#3c3836',
      'editorLineNumber.foreground': '#7c6f64',
      'editor.selectionBackground': '#504945',
      'editor.inactiveSelectionBackground': '#3c3836',
    }
  });

  // Synthwave 84 Theme
  monaco.editor.defineTheme('synthwave', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '848bbd', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff7edb', fontStyle: 'bold' },
      { token: 'string', foreground: 'fede5d' },
      { token: 'number', foreground: 'f97e72' },
      { token: 'function', foreground: '36f9f6' },
      { token: 'variable', foreground: 'ffffff' },
      { token: 'type', foreground: 'ff7edb' },
    ],
    colors: {
      'editor.background': '#262335',
      'editor.foreground': '#ffffff',
      'editorCursor.foreground': '#fede5d',
      'editor.lineHighlightBackground': '#2a2139',
      'editorLineNumber.foreground': '#495495',
      'editor.selectionBackground': '#34294f',
      'editor.inactiveSelectionBackground': '#34294f75',
    }
  });

  // Cyberpunk Theme
  monaco.editor.defineTheme('cyberpunk', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '7d5bff', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff006e', fontStyle: 'bold' },
      { token: 'string', foreground: '00f5ff' },
      { token: 'number', foreground: 'ffbe0b' },
      { token: 'function', foreground: '8338ec' },
      { token: 'variable', foreground: 'fcf6f5' },
      { token: 'type', foreground: 'fb5607' },
    ],
    colors: {
      'editor.background': '#0a0014',
      'editor.foreground': '#fcf6f5',
      'editorCursor.foreground': '#ff006e',
      'editor.lineHighlightBackground': '#1a0033',
      'editorLineNumber.foreground': '#7d5bff',
      'editor.selectionBackground': '#ff006e33',
      'editor.inactiveSelectionBackground': '#ff006e22',
    }
  });

  // Oceanic Theme
  monaco.editor.defineTheme('oceanic', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5fadcf', fontStyle: 'italic' },
      { token: 'keyword', foreground: '00b4d8', fontStyle: 'bold' },
      { token: 'string', foreground: '90e0ef' },
      { token: 'number', foreground: '48cae4' },
      { token: 'function', foreground: '0096c7' },
      { token: 'variable', foreground: 'caf0f8' },
      { token: 'type', foreground: '023e8a' },
    ],
    colors: {
      'editor.background': '#03045e',
      'editor.foreground': '#caf0f8',
      'editorCursor.foreground': '#00b4d8',
      'editor.lineHighlightBackground': '#023e8a',
      'editorLineNumber.foreground': '#0077b6',
      'editor.selectionBackground': '#0096c744',
      'editor.inactiveSelectionBackground': '#0096c733',
    }
  });

  // Sunset Theme
  monaco.editor.defineTheme('sunset', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'f4a261', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'e76f51', fontStyle: 'bold' },
      { token: 'string', foreground: 'f4d35e' },
      { token: 'number', foreground: 'ee964b' },
      { token: 'function', foreground: 'f95738' },
      { token: 'variable', foreground: 'fefae0' },
      { token: 'type', foreground: 'e63946' },
    ],
    colors: {
      'editor.background': '#2d1b2e',
      'editor.foreground': '#fefae0',
      'editorCursor.foreground': '#e76f51',
      'editor.lineHighlightBackground': '#48233c',
      'editorLineNumber.foreground': '#a05344',
      'editor.selectionBackground': '#e76f5144',
      'editor.inactiveSelectionBackground': '#e76f5133',
    }
  });

  // Neon Dreams Theme
  monaco.editor.defineTheme('neon-dreams', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'b4a7d6', fontStyle: 'italic' },
      { token: 'keyword', foreground: '9d4edd', fontStyle: 'bold' },
      { token: 'string', foreground: 'ff006e' },
      { token: 'number', foreground: '3a0ca3' },
      { token: 'function', foreground: '7209b7' },
      { token: 'variable', foreground: 'e0aaff' },
      { token: 'type', foreground: 'c77dff' },
    ],
    colors: {
      'editor.background': '#10002b',
      'editor.foreground': '#e0aaff',
      'editorCursor.foreground': '#ff006e',
      'editor.lineHighlightBackground': '#240046',
      'editorLineNumber.foreground': '#5a189a',
      'editor.selectionBackground': '#9d4edd44',
      'editor.inactiveSelectionBackground': '#9d4edd33',
    }
  });

  // Forest Theme
  monaco.editor.defineTheme('forest', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '95d5b2', fontStyle: 'italic' },
      { token: 'keyword', foreground: '52b788', fontStyle: 'bold' },
      { token: 'string', foreground: 'd8f3dc' },
      { token: 'number', foreground: '74c69d' },
      { token: 'function', foreground: '40916c' },
      { token: 'variable', foreground: 'e8f5e9' },
      { token: 'type', foreground: '2d6a4f' },
    ],
    colors: {
      'editor.background': '#081c15',
      'editor.foreground': '#e8f5e9',
      'editorCursor.foreground': '#52b788',
      'editor.lineHighlightBackground': '#1b4332',
      'editorLineNumber.foreground': '#2d6a4f',
      'editor.selectionBackground': '#52b78844',
      'editor.inactiveSelectionBackground': '#52b78833',
    }
  });

  monaco.editor.defineTheme('cyber-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5eead4', fontStyle: 'italic' },
      { token: 'keyword', foreground: '22d3ee', fontStyle: 'bold' },
      { token: 'string', foreground: '34d399' },
      { token: 'number', foreground: '67e8f9' },
      { token: 'function', foreground: '06b6d4' },
      { token: 'variable', foreground: 'e2e8f0' },
      { token: 'type', foreground: '2dd4bf' },
    ],
    colors: {
      'editor.background': '#0b0f14',
      'editor.foreground': '#e2e8f0',
      'editorCursor.foreground': '#22d3ee',
      'editor.lineHighlightBackground': '#10151d',
      'editorLineNumber.foreground': '#3f4b59',
      'editor.selectionBackground': '#0ea5e944',
      'editor.inactiveSelectionBackground': '#0ea5e933',
    }
  });

  monaco.editor.defineTheme('neon-cyan', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
      { token: 'keyword', foreground: '22d3ee', fontStyle: 'bold' },
      { token: 'string', foreground: 'a7f3d0' },
      { token: 'number', foreground: '67e8f9' },
      { token: 'function', foreground: '38bdf8' },
      { token: 'variable', foreground: 'e2e8f0' },
      { token: 'type', foreground: '5eead4' },
    ],
    colors: {
      'editor.background': '#0a0e13',
      'editor.foreground': '#e2e8f0',
      'editorCursor.foreground': '#67e8f9',
      'editor.lineHighlightBackground': '#0f141b',
      'editorLineNumber.foreground': '#475569',
      'editor.selectionBackground': '#22d3ee33',
      'editor.inactiveSelectionBackground': '#22d3ee22',
    }
  });

  monaco.editor.defineTheme('aqua-night', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '60a5fa', fontStyle: 'italic' },
      { token: 'keyword', foreground: '2dd4bf', fontStyle: 'bold' },
      { token: 'string', foreground: '86efac' },
      { token: 'number', foreground: '7dd3fc' },
      { token: 'function', foreground: '5eead4' },
      { token: 'variable', foreground: 'e5e7eb' },
      { token: 'type', foreground: '22d3ee' },
    ],
    colors: {
      'editor.background': '#0b1220',
      'editor.foreground': '#e5e7eb',
      'editorCursor.foreground': '#2dd4bf',
      'editor.lineHighlightBackground': '#0f192e',
      'editorLineNumber.foreground': '#3d4a63',
      'editor.selectionBackground': '#2dd4bf33',
      'editor.inactiveSelectionBackground': '#2dd4bf22',
    }
  });
};
