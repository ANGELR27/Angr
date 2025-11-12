/**
 * Utilidades para manejar el autocerrado inteligente de paréntesis, corchetes y llaves
 */

/**
 * Mapeo de caracteres de apertura a cierre
 */
export const PAIRS = {
  '(': ')',
  '{': '}',
  '[': ']',
  '"': '"',
  "'": "'",
  '`': '`',
  '<': '>'
};

/**
 * Verifica si un carácter de apertura debe autocerrar automáticamente
 * @param {string} openChar - Carácter de apertura
 * @param {string} line - Línea actual
 * @param {string} language - Lenguaje actual
 * @returns {boolean} - True si se debe autocerrar
 */
export const shouldAutoClose = (openChar, line, language = 'javascript') => {
  // Si no es un carácter de apertura conocido, no hacer nada
  if (!PAIRS[openChar]) return false;
  
  const closeChar = PAIRS[openChar];
  const remainingLine = line.slice(line.lastIndexOf(openChar) + 1).trim();
  
  // No cerrar si el próximo carácter ya es el de cierre
  if (remainingLine.startsWith(closeChar)) return false;
  
  // Reglas específicas por lenguaje
  if (language === 'html') {
    // En HTML, no cerrar automáticamente < si parece ser el inicio de un comentario
    if (openChar === '<' && remainingLine.startsWith('!--')) return false;
  }
  
  // No cerrar si estamos dentro de un string (excepto al abrir un nuevo string)
  const inString = /['"](?:[^'"\\]|\\.)*$/.test(line.slice(0, line.lastIndexOf(openChar)));
  if (inString && (openChar !== '"' && openChar !== "'" && openChar !== '`')) return false;
  
  return true;
};

/**
 * Autocompleta estructuras completas como if, for, función, etc.
 * @param {string} text - Texto actual antes del cursor
 * @param {string} language - Lenguaje actual
 * @returns {string|null} - Texto a insertar o null si no hay sugerencia
 */
export const getStructureCompletion = (text, language) => {
  if (language === 'javascript' || language === 'typescript') {
    // Patrones comunes que necesitan estructuras completas
    const patterns = [
      {
        regex: /(^|\s)if\s*\(\s*([^)]*)\s*\)\s*$/,
        completion: ' {\n\t$0\n}'
      },
      {
        regex: /(^|\s)for\s*\(\s*([^)]*)\s*\)\s*$/,
        completion: ' {\n\t$0\n}'
      },
      {
        regex: /(^|\s)while\s*\(\s*([^)]*)\s*\)\s*$/,
        completion: ' {\n\t$0\n}'
      },
      {
        regex: /(^|\s)function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(\s*([^)]*)\s*\)\s*$/,
        completion: ' {\n\t$0\n}'
      },
      {
        regex: /(^|\s)(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\(\s*([^)]*)\s*\)\s*=>\s*$/,
        completion: ' {\n\t$0\n}'
      },
      {
        regex: /(^|\s)class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*$/,
        completion: ' {\n\tconstructor() {\n\t\t$0\n\t}\n}'
      },
      {
        regex: /(^|\s)switch\s*\(\s*([^)]*)\s*\)\s*$/,
        completion: ' {\n\tcase $1:\n\t\t$0\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}'
      },
      {
        regex: /(^|\s)try\s*$/,
        completion: ' {\n\t$0\n} catch (error) {\n\t\n}'
      }
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(text)) {
        return pattern.completion;
      }
    }
  } else if (language === 'html') {
    // Autocompletar etiquetas HTML
    const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)(?:\s+[^>]*)?>\s*$/;
    const match = text.match(tagRegex);
    if (match) {
      const tagName = match[1];
      // No cerrar etiquetas que no necesitan cierre
      const selfClosing = ['img', 'br', 'hr', 'meta', 'link', 'input', 'area', 'base', 'col', 'command', 'embed', 'keygen', 'param', 'source', 'track', 'wbr'];
      if (!selfClosing.includes(tagName.toLowerCase())) {
        return `\n\t$0\n</${tagName}>`;
      }
    }
  }

  return null;
};

/**
 * Verifica si debe insertar un par completo (como comillas o paréntesis)
 * @param {string} char - Carácter ingresado
 * @param {string} line - Línea actual
 * @param {number} position - Posición del cursor
 * @param {string} language - Lenguaje actual
 * @returns {string|null} - Par completo a insertar o null
 */
export const shouldInsertPair = (char, line, position, language) => {
  const pairs = {
    '"': '""',
    "'": "''",
    '`': '``',
    '(': '()',
    '[': '[]',
    '{': '{}'
  };

  if (!pairs[char]) return null;

  // Si hay texto seleccionado, envolver la selección
  // (Esto sería manejado por Monaco directamente)
  
  // Para paréntesis/corchetes al escribir funciones/arrays/objetos
  const beforeCursor = line.substring(0, position);
  const afterCursor = line.substring(position);
  
  // No insertar pares si ya existe el cierre
  if (afterCursor.trim().startsWith(PAIRS[char])) return null;
  
  // Reglas específicas por lenguaje
  if (language === 'javascript') {
    // No insertar cierre de comillas si estamos en un comentario
    if ((char === '"' || char === "'" || char === '`') && beforeCursor.trimEnd().endsWith('//')) return null;
  }
  
  // Insertar par completo posicionando el cursor en el medio
  return pairs[char].charAt(0) + '|' + pairs[char].charAt(1);
};

/**
 * Integra estas funciones con Monaco Editor
 * @param {Object} monaco - Instancia de monaco
 * @param {Object} editor - Instancia del editor
 */
export const setupAutoclosing = (monaco, editor) => {
  const editorModel = editor.getModel();
  const language = editorModel.getLanguageId();
  
  // Configurar opciones de autocerrrado
  editor.updateOptions({
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    autoIndent: 'full',
    autoSurround: 'languageDefined'
  });
  
  // Agregar detección de estructura
  editor.onKeyUp((e) => {
    // Detectar si se completó una estructura (if, for, etc. seguido de paréntesis)
    if (e.keyCode === monaco.KeyCode.RightParenthesis || 
        e.keyCode === monaco.KeyCode.Enter) {
      
      const position = editor.getPosition();
      const lineContent = editorModel.getLineContent(position.lineNumber);
      const textBeforeCursor = lineContent.substring(0, position.column - 1);
      
      // Verificar si debemos completar una estructura
      const completion = getStructureCompletion(textBeforeCursor, language);
      if (completion) {
        // Insertar la estructura completa
        editor.trigger('autoclosing', 'editor.action.insertSnippet', {
          snippet: completion
        });
      }
    }
  });
};
