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
      // HTML specific
      { token: 'tag', foreground: '00ff41', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '00ff41', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '00ff41' },
      { token: 'attribute.name', foreground: '00ff88' },
      { token: 'attribute.name.html', foreground: '00ff88' },
      { token: 'attribute.value', foreground: '39ff14' },
      { token: 'attribute.value.html', foreground: '39ff14' },
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
      // HTML specific
      { token: 'tag', foreground: '7aa2f7', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '7aa2f7', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '7aa2f7' },
      { token: 'attribute.name', foreground: 'bb9af7' },
      { token: 'attribute.name.html', foreground: 'bb9af7' },
      { token: 'attribute.value', foreground: '9ece6a' },
      { token: 'attribute.value.html', foreground: '9ece6a' },
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
      // HTML specific
      { token: 'tag', foreground: 'bd93f9', fontStyle: 'bold' },
      { token: 'tag.html', foreground: 'bd93f9', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: 'bd93f9' },
      { token: 'attribute.name', foreground: 'ff79c6' },
      { token: 'attribute.name.html', foreground: 'ff79c6' },
      { token: 'attribute.value', foreground: 'f1fa8c' },
      { token: 'attribute.value.html', foreground: 'f1fa8c' },
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
      // HTML specific
      { token: 'tag', foreground: 'a6e22e', fontStyle: 'bold' },
      { token: 'tag.html', foreground: 'a6e22e', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: 'a6e22e' },
      { token: 'attribute.name', foreground: 'ae81ff' },
      { token: 'attribute.name.html', foreground: 'ae81ff' },
      { token: 'attribute.value', foreground: 'e6db74' },
      { token: 'attribute.value.html', foreground: 'e6db74' },
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
      // HTML specific
      { token: 'tag', foreground: '58a6ff', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '58a6ff', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '58a6ff' },
      { token: 'attribute.name', foreground: 'ff7b72' },
      { token: 'attribute.name.html', foreground: 'ff7b72' },
      { token: 'attribute.value', foreground: 'a5d6ff' },
      { token: 'attribute.value.html', foreground: 'a5d6ff' },
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
      // HTML specific
      { token: 'tag', foreground: '0088ff', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '0088ff', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '0088ff' },
      { token: 'attribute.name', foreground: 'ff9d00' },
      { token: 'attribute.name.html', foreground: 'ff9d00' },
      { token: 'attribute.value', foreground: '3ad900' },
      { token: 'attribute.value.html', foreground: '3ad900' },
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
      // HTML specific
      { token: 'tag', foreground: '88c0d0', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '88c0d0', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '88c0d0' },
      { token: 'attribute.name', foreground: '81a1c1' },
      { token: 'attribute.name.html', foreground: '81a1c1' },
      { token: 'attribute.value', foreground: 'a3be8c' },
      { token: 'attribute.value.html', foreground: 'a3be8c' },
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
      // HTML specific
      { token: 'tag', foreground: '61afef', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '61afef', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '61afef' },
      { token: 'attribute.name', foreground: 'c678dd' },
      { token: 'attribute.name.html', foreground: 'c678dd' },
      { token: 'attribute.value', foreground: '98c379' },
      { token: 'attribute.value.html', foreground: '98c379' },
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
      // HTML specific
      { token: 'tag', foreground: '268bd2', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '268bd2', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '268bd2' },
      { token: 'attribute.name', foreground: '859900' },
      { token: 'attribute.name.html', foreground: '859900' },
      { token: 'attribute.value', foreground: '2aa198' },
      { token: 'attribute.value.html', foreground: '2aa198' },
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
      // HTML specific
      { token: 'tag', foreground: '82aaff', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '82aaff', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '82aaff' },
      { token: 'attribute.name', foreground: 'c792ea' },
      { token: 'attribute.name.html', foreground: 'c792ea' },
      { token: 'attribute.value', foreground: 'c3e88d' },
      { token: 'attribute.value.html', foreground: 'c3e88d' },
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
      // HTML specific
      { token: 'tag', foreground: '59c2ff', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '59c2ff', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '59c2ff' },
      { token: 'attribute.name', foreground: 'ff8f40' },
      { token: 'attribute.name.html', foreground: 'ff8f40' },
      { token: 'attribute.value', foreground: 'aad94c' },
      { token: 'attribute.value.html', foreground: 'aad94c' },
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
      // HTML specific
      { token: 'tag', foreground: '82aaff', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '82aaff', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '82aaff' },
      { token: 'attribute.name', foreground: 'c792ea' },
      { token: 'attribute.name.html', foreground: 'c792ea' },
      { token: 'attribute.value', foreground: 'c3e88d' },
      { token: 'attribute.value.html', foreground: 'c3e88d' },
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
      // HTML specific
      { token: 'tag', foreground: 'fabd2f', fontStyle: 'bold' },
      { token: 'tag.html', foreground: 'fabd2f', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: 'fabd2f' },
      { token: 'attribute.name', foreground: 'fb4934' },
      { token: 'attribute.name.html', foreground: 'fb4934' },
      { token: 'attribute.value', foreground: 'b8bb26' },
      { token: 'attribute.value.html', foreground: 'b8bb26' },
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
      // HTML specific
      { token: 'tag', foreground: '36f9f6', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '36f9f6', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '36f9f6' },
      { token: 'attribute.name', foreground: 'ff7edb' },
      { token: 'attribute.name.html', foreground: 'ff7edb' },
      { token: 'attribute.value', foreground: 'fede5d' },
      { token: 'attribute.value.html', foreground: 'fede5d' },
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
      // HTML specific
      { token: 'tag', foreground: '00f5ff', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '00f5ff', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '00f5ff' },
      { token: 'attribute.name', foreground: 'ff006e' },
      { token: 'attribute.name.html', foreground: 'ff006e' },
      { token: 'attribute.value', foreground: 'ffbe0b' },
      { token: 'attribute.value.html', foreground: 'ffbe0b' },
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
      // HTML specific
      { token: 'tag', foreground: '00b4d8', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '00b4d8', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '00b4d8' },
      { token: 'attribute.name', foreground: '48cae4' },
      { token: 'attribute.name.html', foreground: '48cae4' },
      { token: 'attribute.value', foreground: '90e0ef' },
      { token: 'attribute.value.html', foreground: '90e0ef' },
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
      // HTML specific
      { token: 'tag', foreground: 'f4d35e', fontStyle: 'bold' },
      { token: 'tag.html', foreground: 'f4d35e', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: 'f4d35e' },
      { token: 'attribute.name', foreground: 'e76f51' },
      { token: 'attribute.name.html', foreground: 'e76f51' },
      { token: 'attribute.value', foreground: 'f4d35e' },
      { token: 'attribute.value.html', foreground: 'f4d35e' },
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
      // HTML specific
      { token: 'tag', foreground: '9d4edd', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '9d4edd', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '9d4edd' },
      { token: 'attribute.name', foreground: 'ff006e' },
      { token: 'attribute.name.html', foreground: 'ff006e' },
      { token: 'attribute.value', foreground: 'e0aaff' },
      { token: 'attribute.value.html', foreground: 'e0aaff' },
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
      // HTML specific
      { token: 'tag', foreground: '52b788', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '52b788', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: '52b788' },
      { token: 'attribute.name', foreground: '74c69d' },
      { token: 'attribute.name.html', foreground: '74c69d' },
      { token: 'attribute.value', foreground: 'd8f3dc' },
      { token: 'attribute.value.html', foreground: 'd8f3dc' },
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
      // HTML specific
      { token: 'tag', foreground: '22d3ee', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '22d3ee', fontStyle: 'bold' },
      { token: 'metatag.html', foreground: '22d3ee' },
      { token: 'metatag.content.html', foreground: '7dd3fc' },
      { token: 'delimiter.html', foreground: '22d3ee' },
      { token: 'delimiter', foreground: '22d3ee' },
      { token: 'attribute.name', foreground: '7dd3fc' },
      { token: 'attribute.name.html', foreground: '7dd3fc' },
      { token: 'attribute.value', foreground: '34d399' },
      { token: 'attribute.value.html', foreground: '34d399' },
      { token: 'string.html', foreground: '34d399' },
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
      // HTML specific
      { token: 'tag', foreground: '38bdf8', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '38bdf8', fontStyle: 'bold' },
      { token: 'metatag.html', foreground: '38bdf8' },
      { token: 'metatag.content.html', foreground: '67e8f9' },
      { token: 'delimiter.html', foreground: '38bdf8' },
      { token: 'delimiter', foreground: '38bdf8' },
      { token: 'attribute.name', foreground: '67e8f9' },
      { token: 'attribute.name.html', foreground: '67e8f9' },
      { token: 'attribute.value', foreground: 'a7f3d0' },
      { token: 'attribute.value.html', foreground: 'a7f3d0' },
      { token: 'string.html', foreground: 'a7f3d0' },
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
      // HTML specific
      { token: 'tag', foreground: '2dd4bf', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '2dd4bf', fontStyle: 'bold' },
      { token: 'metatag.html', foreground: '2dd4bf' },
      { token: 'metatag.content.html', foreground: '7dd3fc' },
      { token: 'delimiter.html', foreground: '2dd4bf' },
      { token: 'delimiter', foreground: '2dd4bf' },
      { token: 'attribute.name', foreground: '7dd3fc' },
      { token: 'attribute.name.html', foreground: '7dd3fc' },
      { token: 'attribute.value', foreground: '86efac' },
      { token: 'attribute.value.html', foreground: '86efac' },
      { token: 'string.html', foreground: '86efac' },
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

  // Lite Theme (compacto, limpio, verde primario + morado secundario + blanco)
  monaco.editor.defineTheme('lite', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8ea06a', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'D0FC01', fontStyle: 'bold' },
      { token: 'string', foreground: '8F68F9' },
      { token: 'number', foreground: 'a78bfa' },
      { token: 'function', foreground: 'D0FC01' },
      { token: 'variable', foreground: 'EAEAEA' },
      { token: 'type', foreground: 'c4fc64' },
      { token: 'operator', foreground: 'D0FC01' },
      { token: 'class', foreground: 'c4fc64' },
      // HTML
      { token: 'tag', foreground: 'D0FC01', fontStyle: 'bold' },
      { token: 'tag.html', foreground: 'D0FC01', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: 'D0FC01' },
      { token: 'attribute.name', foreground: 'c4fc64' },
      { token: 'attribute.name.html', foreground: 'c4fc64' },
      { token: 'attribute.value', foreground: '8F68F9' },
      { token: 'attribute.value.html', foreground: '8F68F9' },
      // CSS
      { token: 'attribute.name.css', foreground: 'D0FC01' },
      { token: 'attribute.value.css', foreground: '8F68F9' },
      { token: 'property.css', foreground: 'c4fc64' },
      // JavaScript
      { token: 'identifier', foreground: 'EAEAEA' },
      { token: 'delimiter.bracket', foreground: 'D0FC01' },
      { token: 'delimiter.parenthesis', foreground: 'D0FC01' },
    ],
    colors: {
      'editor.background': '#1B1718',
      'editor.foreground': '#EAEAEA',
      'editorCursor.foreground': '#D0FC01',
      'editor.lineHighlightBackground': '#211D1E',
      'editorLineNumber.foreground': '#6b6b6b',
      'editor.selectionBackground': '#D0FC0133',
      'editor.inactiveSelectionBackground': '#D0FC011A',
      'editor.selectionHighlightBackground': '#D0FC011A',
      'editor.wordHighlightBackground': '#D0FC011A',
      'editorIndentGuide.activeBackground': '#343031',
      'editorIndentGuide.background': '#2a2627',
    }
  });

  // Feel Theme (minimalista, cómico, crema sobre negro)
  monaco.editor.defineTheme('feel', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'FFFFB3', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'FFFFE3', fontStyle: 'bold' },
      { token: 'string', foreground: 'FFFFCC' },
      { token: 'number', foreground: 'FFFFE3' },
      { token: 'function', foreground: 'FFFFE3' },
      { token: 'variable', foreground: 'FFFFCC' },
      { token: 'type', foreground: 'FFFFE3' },
      { token: 'operator', foreground: 'FFFFE3' },
      { token: 'class', foreground: 'FFFFE3' },
      // HTML
      { token: 'tag', foreground: 'FFFFE3', fontStyle: 'bold' },
      { token: 'tag.html', foreground: 'FFFFE3', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: 'FFFFE3' },
      { token: 'attribute.name', foreground: 'FFFFCC' },
      { token: 'attribute.name.html', foreground: 'FFFFCC' },
      { token: 'attribute.value', foreground: 'FFFFB3' },
      { token: 'attribute.value.html', foreground: 'FFFFB3' },
      // CSS
      { token: 'attribute.name.css', foreground: 'FFFFE3' },
      { token: 'attribute.value.css', foreground: 'FFFFCC' },
      { token: 'property.css', foreground: 'FFFFCC' },
      // JavaScript
      { token: 'identifier', foreground: 'FFFFCC' },
      { token: 'delimiter.bracket', foreground: 'FFFFE3' },
      { token: 'delimiter.parenthesis', foreground: 'FFFFE3' },
    ],
    colors: {
      'editor.background': '#10100E',
      'editor.foreground': '#FFFFE3',
      'editorCursor.foreground': '#FFFFE3',
      'editor.lineHighlightBackground': '#16160F',
      'editorLineNumber.foreground': '#FFFFB3',
      'editor.selectionBackground': '#FFFFE333',
      'editor.inactiveSelectionBackground': '#FFFFE31A',
      'editor.selectionHighlightBackground': '#FFFFE31A',
      'editor.wordHighlightBackground': '#FFFFE31A',
      'editorIndentGuide.activeBackground': '#FFFFE3',
      'editorIndentGuide.background': '#1C1C15',
    }
  });

  // Fade Theme (minimalista, centrado, azul y amarillo)
  monaco.editor.defineTheme('fade', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8a93a6', fontStyle: 'italic' },
      { token: 'keyword', foreground: '2de2e6', fontStyle: 'bold' },
      { token: 'string', foreground: 'ff4fd8' },
      { token: 'number', foreground: '7c3aed' },
      { token: 'function', foreground: '2de2e6' },
      { token: 'variable', foreground: 'e7e9ee' },
      { token: 'type', foreground: '7c3aed' },
      { token: 'operator', foreground: 'a78bfa' },
      { token: 'class', foreground: '2de2e6' },
      // HTML
      { token: 'tag', foreground: '2de2e6', fontStyle: 'bold' },
      { token: 'tag.html', foreground: '2de2e6', fontStyle: 'bold' },
      { token: 'delimiter.html', foreground: 'c9d0dc' },
      { token: 'attribute.name', foreground: 'ff4fd8' },
      { token: 'attribute.name.html', foreground: 'ff4fd8' },
      { token: 'attribute.value', foreground: '7c3aed' },
      { token: 'attribute.value.html', foreground: '7c3aed' },
      // CSS
      { token: 'attribute.name.css', foreground: '2de2e6' },
      { token: 'attribute.value.css', foreground: 'ff4fd8' },
      { token: 'property.css', foreground: '2de2e6' },
      // JavaScript
      { token: 'identifier', foreground: 'e7e9ee' },
      { token: 'delimiter.bracket', foreground: 'c9d0dc' },
      { token: 'delimiter.parenthesis', foreground: 'c9d0dc' },
    ],
    colors: {
      'editor.background': '#05060a',
      'editor.foreground': '#e7e9ee',
      'editorCursor.foreground': '#2de2e6',
      'editor.lineHighlightBackground': '#0b0c14',
      'editorLineNumber.foreground': '#5b6475',
      'editor.selectionBackground': '#2de2e633',
      'editor.inactiveSelectionBackground': '#2de2e61A',
      'editor.selectionHighlightBackground': '#2de2e61A',
      'editor.wordHighlightBackground': '#2de2e61A',
      'editorIndentGuide.activeBackground': '#2de2e6',
      'editorIndentGuide.background': '#141529',
    }
  });
};
