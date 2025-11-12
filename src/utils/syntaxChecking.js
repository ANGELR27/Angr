/**
 * Sistema avanzado de validación de sintaxis y diagnósticos para mejorar el IntelliSense
 */

/**
 * Tipos de diagnóstico
 */
export const DiagnosticType = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  HINT: 'hint'
};

/**
 * Diagnóstico para mostrar en el editor
 * @typedef {Object} Diagnostic
 * @property {string} message - Mensaje descriptivo
 * @property {number} startLineNumber - Línea de inicio
 * @property {number} startColumn - Columna de inicio
 * @property {number} endLineNumber - Línea de fin
 * @property {number} endColumn - Columna de fin
 * @property {string} type - Tipo de diagnóstico
 * @property {string} code - Código identificador del diagnóstico
 */

/**
 * Valida la sintaxis JavaScript y devuelve diagnósticos
 * @param {string} code - Código a validar
 * @returns {Array<Diagnostic>} - Lista de diagnósticos
 */
export const validateJavaScript = (code) => {
  const diagnostics = [];
  
  try {
    // Intentar parsear el código para detectar errores de sintaxis
    new Function(code);
  } catch (e) {
    // Extraer información del error
    const match = e.message.match(/(?:at line (\d+), column (\d+)|Unexpected token.*?(\d+):(\d+))/);
    let lineNumber = 1;
    let columnNumber = 1;
    
    if (match) {
      lineNumber = parseInt(match[1] || match[3], 10);
      columnNumber = parseInt(match[2] || match[4], 10);
    }
    
    // Límites para evitar errores
    lineNumber = Math.max(1, lineNumber);
    const lines = code.split('\n');
    const lineContent = lines[lineNumber - 1] || '';
    
    diagnostics.push({
      message: e.message,
      startLineNumber: lineNumber,
      startColumn: Math.min(columnNumber, lineContent.length + 1),
      endLineNumber: lineNumber,
      endColumn: Math.min(columnNumber + 1, lineContent.length + 2),
      type: DiagnosticType.ERROR,
      code: 'syntax-error'
    });
  }
  
  // Buscar problemas comunes usando expresiones regulares
  const lines = code.split('\n');
  
  lines.forEach((line, i) => {
    const lineNumber = i + 1;
    
    // Verificar console.log olvidados
    if (/console\.log\(/.test(line)) {
      diagnostics.push({
        message: 'Console.log encontrado, considere removerlo antes de producción',
        startLineNumber: lineNumber,
        startColumn: line.indexOf('console.log') + 1,
        endLineNumber: lineNumber,
        endColumn: line.indexOf('console.log') + 12,
        type: DiagnosticType.WARNING,
        code: 'console-log'
      });
    }
    
    // Verificar variables no utilizadas
    const varMatch = line.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/);
    if (varMatch) {
      const varName = varMatch[1];
      // Buscar uso de la variable en el resto del código
      const restCode = lines.slice(i + 1).join('\n');
      if (!new RegExp('\\b' + varName + '\\b').test(restCode)) {
        diagnostics.push({
          message: `La variable "${varName}" parece no ser utilizada`,
          startLineNumber: lineNumber,
          startColumn: line.indexOf(varName) + 1,
          endLineNumber: lineNumber,
          endColumn: line.indexOf(varName) + varName.length + 1,
          type: DiagnosticType.WARNING,
          code: 'unused-variable'
        });
      }
    }
  });
  
  return diagnostics;
};

/**
 * Valida HTML y devuelve diagnósticos
 * @param {string} code - Código HTML
 * @returns {Array<Diagnostic>} - Lista de diagnósticos
 */
export const validateHTML = (code) => {
  const diagnostics = [];
  const openTags = [];
  const lines = code.split('\n');
  
  // Regex para identificar etiquetas
  const openTagRegex = /<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>/g;
  const closeTagRegex = /<\/([a-zA-Z][a-zA-Z0-9]*)>/g;
  const selfClosingTags = ['img', 'br', 'hr', 'meta', 'link', 'input', 'area', 'base', 'col', 'command', 'embed', 'keygen', 'param', 'source', 'track', 'wbr'];
  
  lines.forEach((line, i) => {
    const lineNumber = i + 1;
    
    // Buscar etiquetas de apertura
    let match;
    while ((match = openTagRegex.exec(line)) !== null) {
      const tagName = match[1].toLowerCase();
      if (!selfClosingTags.includes(tagName)) {
        openTags.push({
          name: tagName,
          line: lineNumber,
          column: match.index + 1
        });
      }
    }
    
    // Buscar etiquetas de cierre
    while ((match = closeTagRegex.exec(line)) !== null) {
      const tagName = match[1].toLowerCase();
      
      if (openTags.length > 0 && openTags[openTags.length - 1].name === tagName) {
        // Etiqueta cerrada correctamente
        openTags.pop();
      } else {
        // Etiqueta cerrada incorrectamente
        let matchingOpenTagIndex = -1;
        for (let j = openTags.length - 1; j >= 0; j--) {
          if (openTags[j].name === tagName) {
            matchingOpenTagIndex = j;
            break;
          }
        }
        
        if (matchingOpenTagIndex >= 0) {
          // Hay etiquetas sin cerrar antes de esta
          const unclosedTags = openTags.slice(matchingOpenTagIndex + 1);
          unclosedTags.forEach(tag => {
            diagnostics.push({
              message: `Etiqueta <${tag.name}> no cerrada`,
              startLineNumber: tag.line,
              startColumn: tag.column,
              endLineNumber: tag.line,
              endColumn: tag.column + tag.name.length + 2,
              type: DiagnosticType.ERROR,
              code: 'unclosed-tag'
            });
          });
          
          // Remover todas las etiquetas hasta la que estamos cerrando
          openTags.splice(matchingOpenTagIndex);
        } else {
          // Etiqueta cerrada que nunca fue abierta
          diagnostics.push({
            message: `Etiqueta de cierre </>${tagName}</> sin etiqueta de apertura correspondiente`,
            startLineNumber: lineNumber,
            startColumn: match.index + 1,
            endLineNumber: lineNumber,
            endColumn: match.index + tagName.length + 4,
            type: DiagnosticType.ERROR,
            code: 'unmatched-close-tag'
          });
        }
      }
    }
    
    // Verificar si hay atributos sin comillas
    const attributeWithoutQuotesRegex = /<[a-zA-Z][a-zA-Z0-9]*\s+[^>]*?([a-zA-Z][a-zA-Z0-9]*)=([^\s"'][^\s>]*)/g;
    while ((match = attributeWithoutQuotesRegex.exec(line)) !== null) {
      diagnostics.push({
        message: `El atributo "${match[1]}" debería tener su valor entre comillas`,
        startLineNumber: lineNumber,
        startColumn: match.index + match[0].indexOf(match[1]) + 1,
        endLineNumber: lineNumber,
        endColumn: match.index + match[0].indexOf(match[2]) + match[2].length + 1,
        type: DiagnosticType.WARNING,
        code: 'attribute-quotes'
      });
    }
  });
  
  // Reportar etiquetas abiertas al final del documento
  openTags.forEach(tag => {
    diagnostics.push({
      message: `Etiqueta <${tag.name}> no cerrada al final del documento`,
      startLineNumber: tag.line,
      startColumn: tag.column,
      endLineNumber: tag.line,
      endColumn: tag.column + tag.name.length + 2,
      type: DiagnosticType.ERROR,
      code: 'unclosed-tag-eof'
    });
  });
  
  return diagnostics;
};

/**
 * Valida CSS y devuelve diagnósticos
 * @param {string} code - Código CSS
 * @returns {Array<Diagnostic>} - Lista de diagnósticos
 */
export const validateCSS = (code) => {
  const diagnostics = [];
  const lines = code.split('\n');
  
  // Contador para llaves
  let braceCount = 0;
  
  lines.forEach((line, i) => {
    const lineNumber = i + 1;
    
    // Contar llaves
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '{') braceCount++;
      else if (line[j] === '}') braceCount--;
      
      if (braceCount < 0) {
        diagnostics.push({
          message: 'Llave de cierre sin llave de apertura correspondiente',
          startLineNumber: lineNumber,
          startColumn: j + 1,
          endLineNumber: lineNumber,
          endColumn: j + 2,
          type: DiagnosticType.ERROR,
          code: 'unmatched-brace'
        });
        braceCount = 0; // Reiniciar para evitar errores en cascada
      }
    }
    
    // Verificar si falta punto y coma
    if (!line.trim().endsWith(';') && 
        !line.trim().endsWith('{') && 
        !line.trim().endsWith('}') &&
        !line.trim().endsWith(':') &&
        line.includes(':') &&
        !line.includes('{') &&
        !line.trim().startsWith('/*') &&
        !line.includes('*/')) {
      
      diagnostics.push({
        message: 'Posible punto y coma faltante al final de la línea',
        startLineNumber: lineNumber,
        startColumn: line.length,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        type: DiagnosticType.WARNING,
        code: 'missing-semicolon'
      });
    }
    
    // Verificar propiedades no estándar sin prefijo
    const nonPrefixedProps = /(?<!\-)(transform|animation|transition|user-select|box-shadow|border-radius):/;
    const match = line.match(nonPrefixedProps);
    if (match) {
      diagnostics.push({
        message: `Considere agregar prefijos de navegador para mayor compatibilidad: -webkit-${match[1]}, -moz-${match[1]}`,
        startLineNumber: lineNumber,
        startColumn: match.index + 1,
        endLineNumber: lineNumber,
        endColumn: match.index + match[1].length + 1,
        type: DiagnosticType.INFO,
        code: 'vendor-prefix'
      });
    }
  });
  
  // Verificar si quedaron llaves sin cerrar
  if (braceCount > 0) {
    diagnostics.push({
      message: `${braceCount} llave(s) de apertura sin cerrar al final del documento`,
      startLineNumber: lines.length,
      startColumn: lines[lines.length - 1].length,
      endLineNumber: lines.length,
      endColumn: lines[lines.length - 1].length + 1,
      type: DiagnosticType.ERROR,
      code: 'unclosed-brace-eof'
    });
  }
  
  return diagnostics;
};

/**
 * Valida código según el lenguaje
 * @param {string} code - Código a validar
 * @param {string} language - Lenguaje del código
 * @returns {Array<Diagnostic>} - Lista de diagnósticos
 */
export const validateCode = (code, language) => {
  switch (language) {
    case 'javascript':
    case 'typescript':
    case 'javascriptreact':
    case 'typescriptreact':
      return validateJavaScript(code);
    case 'html':
    case 'handlebars':
    case 'razor':
      return validateHTML(code);
    case 'css':
    case 'scss':
    case 'less':
      return validateCSS(code);
    default:
      return [];
  }
};

/**
 * Configura la validación de sintaxis para Monaco Editor
 * @param {Object} monaco - Instancia de monaco
 * @param {Object} editor - Instancia del editor
 */
export const setupSyntaxValidation = (monaco, editor) => {
  const model = editor.getModel();
  const language = model.getLanguageId();
  
  // Crear nueva colección de marcadores para diagnósticos
  // Los marcadores se crearán según sea necesario
  
  // Validar inicialmente
  updateDiagnostics();
  
  // Validar en cada cambio (con debounce)
  let validationTimeout = null;
  model.onDidChangeContent(() => {
    clearTimeout(validationTimeout);
    validationTimeout = setTimeout(updateDiagnostics, 500); // Debounce 500ms
  });
  
  function updateDiagnostics() {
    const code = model.getValue();
    const diagnostics = validateCode(code, language);
    
    // Convertir diagnósticos a marcadores Monaco
    const markers = diagnostics.map(d => ({
      severity: getSeverity(d.type),
      message: d.message,
      startLineNumber: d.startLineNumber,
      startColumn: d.startColumn,
      endLineNumber: d.endLineNumber,
      endColumn: d.endColumn,
      code: d.code
    }));
    
    // Establecer marcadores
    monaco.editor.setModelMarkers(model, 'syntax-validation', markers);
  }
  
  // Mapear tipos de diagnóstico a severidades de Monaco
  function getSeverity(type) {
    switch (type) {
      case DiagnosticType.ERROR:
        return monaco.MarkerSeverity.Error;
      case DiagnosticType.WARNING:
        return monaco.MarkerSeverity.Warning;
      case DiagnosticType.INFO:
        return monaco.MarkerSeverity.Info;
      case DiagnosticType.HINT:
        return monaco.MarkerSeverity.Hint;
      default:
        return monaco.MarkerSeverity.Info;
    }
  }
};
