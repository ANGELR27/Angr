// Sistema de IntelliSense para autocompletado inteligente avanzado

/**
 * Extrae todas las clases CSS de un archivo CSS
 * @param {string} cssContent - Contenido del archivo CSS
 * @returns {Array<string>} - Array de nombres de clases
 */
export const extractCSSClasses = (cssContent) => {
  if (!cssContent) return [];
  
  const classes = new Set();
  
  // Regex para capturar nombres de clases .className
  const classRegex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g;
  let match;
  
  while ((match = classRegex.exec(cssContent)) !== null) {
    // Evitar pseudo-clases como :hover, :focus
    const fullMatch = match[0];
    const nextChar = cssContent[match.index + fullMatch.length];
    
    if (nextChar !== ':') {
      classes.add(match[1]);
    }
  }
  
  return Array.from(classes).sort();
};

/**
 * Extrae IDs CSS de un archivo
 * @param {string} cssContent - Contenido del archivo CSS
 * @returns {Array<string>} - Array de IDs
 */
export const extractCSSIds = (cssContent) => {
  if (!cssContent) return [];
  
  const ids = new Set();
  const idRegex = /#([a-zA-Z_-][a-zA-Z0-9_-]*)/g;
  let match;
  
  while ((match = idRegex.exec(cssContent)) !== null) {
    ids.add(match[1]);
  }
  
  return Array.from(ids).sort();
};

/**
 * Extrae todas las clases de todos los archivos CSS del proyecto
 * @param {Object} files - Árbol de archivos del proyecto
 * @returns {Object} - { classes: [], ids: [] }
 */
export const extractAllCSSClasses = (files) => {
  const allClasses = new Set();
  const allIds = new Set();
  
  const traverseFiles = (fileTree) => {
    Object.values(fileTree || {}).forEach(item => {
      if (item.type === 'file' && item.language === 'css' && item.content) {
        const classes = extractCSSClasses(item.content);
        const ids = extractCSSIds(item.content);
        
        classes.forEach(c => allClasses.add(c));
        ids.forEach(id => allIds.add(id));
      } else if (item.type === 'folder' && item.children) {
        traverseFiles(item.children);
      }
    });
  };
  
  traverseFiles(files);
  
  return {
    classes: Array.from(allClasses).sort(),
    ids: Array.from(allIds).sort()
  };
};

/**
 * Obtiene sugerencias de atributos HTML según la etiqueta
 * @param {string} tagName - Nombre de la etiqueta HTML
 * @returns {Array<Object>} - Array de sugerencias
 */
export const getHTMLAttributeSuggestions = (tagName) => {
  const commonAttrs = ['id', 'class', 'style', 'title', 'data-*'];
  
  const specificAttrs = {
    a: ['href', 'target', 'rel', 'download'],
    img: ['src', 'alt', 'width', 'height', 'loading'],
    input: ['type', 'name', 'value', 'placeholder', 'required', 'disabled', 'maxlength', 'min', 'max'],
    button: ['type', 'name', 'value', 'disabled'],
    form: ['action', 'method', 'enctype', 'target', 'autocomplete'],
    label: ['for'],
    select: ['name', 'multiple', 'size', 'required', 'disabled'],
    textarea: ['name', 'rows', 'cols', 'placeholder', 'maxlength', 'required'],
    link: ['rel', 'href', 'type', 'media'],
    script: ['src', 'type', 'async', 'defer'],
    meta: ['name', 'content', 'charset', 'http-equiv'],
    iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
    video: ['src', 'controls', 'autoplay', 'loop', 'muted', 'width', 'height'],
    audio: ['src', 'controls', 'autoplay', 'loop', 'muted'],
    source: ['src', 'type'],
    canvas: ['width', 'height'],
    table: ['border', 'cellpadding', 'cellspacing'],
    td: ['colspan', 'rowspan'],
    th: ['colspan', 'rowspan', 'scope']
  };
  
  const attrs = specificAttrs[tagName.toLowerCase()] || [];
  return [...new Set([...commonAttrs, ...attrs])];
};

/**
 * Obtiene valores sugeridos para un atributo específico
 * @param {string} attrName - Nombre del atributo
 * @returns {Array<string>} - Valores sugeridos
 */
export const getAttributeValueSuggestions = (attrName) => {
  const valueSuggestions = {
    type: {
      input: ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'checkbox', 'radio', 'file', 'submit', 'button', 'reset'],
      button: ['button', 'submit', 'reset']
    },
    target: ['_blank', '_self', '_parent', '_top'],
    rel: ['nofollow', 'noopener', 'noreferrer', 'alternate', 'author', 'bookmark', 'external', 'help', 'license', 'next', 'prev', 'search', 'tag'],
    method: ['get', 'post'],
    enctype: ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'],
    autocomplete: ['on', 'off'],
    loading: ['lazy', 'eager'],
    scope: ['row', 'col', 'rowgroup', 'colgroup']
  };
  
  return valueSuggestions[attrName.toLowerCase()] || [];
};

/**
 * Extrae funciones JavaScript definidas en el código con soporte mejorado para métodos
 * @param {string} jsContent - Contenido JavaScript
 * @returns {Array<Object>} - Array de funciones { name, params, type, returnComment }
 */
export const extractJSFunctions = (jsContent) => {
  if (!jsContent) return [];
  
  const functions = [];
  
  // Funciones tradicionales: function name(params)
  const funcRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)/g;
  let match;
  
  while ((match = funcRegex.exec(jsContent)) !== null) {
    functions.push({
      name: match[1],
      params: match[2].split(',').map(p => p.trim()).filter(Boolean),
      type: 'function'
    });
  }
  
  // Arrow functions: const name = (params) => 
  const arrowRegex = /(?:const|let|var|export const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:\(([^)]*)\)|([a-zA-Z_$][a-zA-Z0-9_$]*))\s*=>/g;
  
  // Class methods: methodName() { }
  const methodRegex = /(?:async\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)\s*{/g;
  
  // JSDoc return comments
  const returnCommentRegex = /\/\*\*[\s\S]*?@return\s+{([^}]*)}([^*]*?)\*\//g;
  
  while ((match = arrowRegex.exec(jsContent)) !== null) {
    const params = match[2] ? match[2].split(',').map(p => p.trim()).filter(Boolean) : (match[3] ? [match[3]] : []);
    functions.push({
      name: match[1],
      params,
      type: 'arrow',
      returnComment: ''
    });
  }
  
  // Agregar métodos de clase
  let methodMatch;
  while ((methodMatch = methodRegex.exec(jsContent)) !== null) {
    // Evitar duplicados con funciones ya detectadas
    if (!functions.some(f => f.name === methodMatch[1])) {
      functions.push({
        name: methodMatch[1],
        params: methodMatch[2].split(',').map(p => p.trim()).filter(Boolean),
        type: 'method',
        returnComment: ''
      });
    }
  }
  
  // Extraer comentarios de retorno de JSDoc
  let returnMatch;
  while ((returnMatch = returnCommentRegex.exec(jsContent)) !== null) {
    // Buscar a qué función corresponde este comentario
    const commentPosition = returnMatch.index;
    const functionAfterComment = jsContent.substring(commentPosition);
    const functionNameMatch = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g.exec(functionAfterComment) ||
                          /(?:const|let|var|export const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g.exec(functionAfterComment);
    
    if (functionNameMatch) {
      const functionName = functionNameMatch[1];
      const funcIndex = functions.findIndex(f => f.name === functionName);
      
      if (funcIndex >= 0) {
        functions[funcIndex].returnComment = `${returnMatch[1].trim()} - ${returnMatch[2].trim()}`;
      }
    }
  }
  
  return functions;
};

/**
 * Extrae variables JavaScript con tipo inferido cuando es posible
 * @param {string} jsContent - Contenido JavaScript
 * @returns {Array<Object>} - Array de variables { name, type, value }
 */
export const extractJSVariables = (jsContent) => {
  if (!jsContent) return [];
  
  const variables = [];
  
  // const, let, var declaraciones con captura de valor
  const varRegex = /(?:const|let|var|export const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*=\s*([^;]+))?/g;
  let match;
  
  while ((match = varRegex.exec(jsContent)) !== null) {
    const varName = match[1];
    let varType = 'unknown';
    const varValue = match[2] ? match[2].trim() : undefined;
    
    // Intentar inferir el tipo
    if (varValue) {
      if (varValue.startsWith('"') || varValue.startsWith('\'')) varType = 'string';
      else if (!isNaN(Number(varValue))) varType = 'number';
      else if (varValue === 'true' || varValue === 'false') varType = 'boolean';
      else if (varValue.startsWith('[')) varType = 'array';
      else if (varValue.startsWith('{')) varType = 'object';
      else if (varValue.includes('=>')) varType = 'function';
      else if (varValue.startsWith('new ')) {
        const classMatch = /new\s+([A-Za-z_$][A-Za-z0-9_$]*)/g.exec(varValue);
        if (classMatch) varType = classMatch[1];
      }
    }
    
    // Evitar duplicados
    if (!variables.some(v => v.name === varName)) {
      variables.push({
        name: varName,
        type: varType,
        value: varValue
      });
    }
  }
  
  // Buscar propiedades de objetos para mejorar autocompletado
  const objPropRegex = /([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
  let propMatch;
  
  while ((propMatch = objPropRegex.exec(jsContent)) !== null) {
    const objName = propMatch[1];
    const propName = propMatch[2];
    
    // Encontrar el objeto padre
    const parentObj = variables.find(v => v.name === objName);
    if (parentObj) {
      if (!parentObj.properties) parentObj.properties = [];
      if (!parentObj.properties.includes(propName)) {
        parentObj.properties.push(propName);
      }
    }
  }
  
  return variables;
};

/**
 * Genera sugerencias inteligentes basadas en el contexto
 * @param {string} line - Línea actual
 * @param {string} language - Lenguaje del archivo
 * @param {Object} projectData - Datos del proyecto (clases, funciones, etc.)
 * @returns {Array<Object>} - Sugerencias
 */
/**
 * Genera sugerencias inteligentes basadas en el contexto actual
 * @param {string} line - Línea actual
 * @param {string} language - Lenguaje del archivo
 * @param {Object} projectData - Datos del proyecto (clases, funciones, etc.)
 * @returns {Array<Object>} - Sugerencias formateadas para Monaco
 */
export const getContextualSuggestions = (line, language, projectData = {}) => {
  const suggestions = [];
  
  if (language === 'html') {
    // Detectar si estamos en class="
    if (line.includes('class="') && projectData.cssClasses) {
      return projectData.cssClasses.map(className => ({
        label: className,
        kind: 'class',
        detail: 'CSS Class',
        insertText: className
      }));
    }
    
    // Detectar si estamos en id="
    if (line.includes('id="') && projectData.cssIds) {
      return projectData.cssIds.map(id => ({
        label: id,
        kind: 'id',
        detail: 'CSS ID',
        insertText: id
      }));
    }
  }
  
  if (language === 'javascript') {
    // Detectar si estamos después de un punto (propiedad de objeto)
    const isDotCompletion = /\.(\w*)$/.test(line);
    const objectPrefix = isDotCompletion ? line.match(/(\w+)\.(\w*)$/)?.[1] : null;
    
    // Sugerir propiedades si estamos después de un punto
    if (isDotCompletion && objectPrefix && projectData.variables) {
      const objVar = projectData.variables.find(v => v.name === objectPrefix);
      if (objVar && objVar.properties) {
        objVar.properties.forEach(prop => {
          suggestions.push({
            label: prop,
            kind: 'property',
            detail: `Propiedad de ${objectPrefix}`,
            insertText: prop
          });
        });
        
        // Si el objeto es de un tipo conocido, sugerir métodos nativos
        if (objVar.type) {
          const nativeMethods = getNativeMethodsForType(objVar.type);
          nativeMethods.forEach(method => {
            suggestions.push({
              label: method.name,
              kind: 'method',
              detail: `${method.description} - ${objVar.type}.${method.name}`,
              insertText: method.insertText || method.name
            });
          });
        }
      }
      return suggestions;
    }
    
    // Sugerir funciones disponibles con formato mejorado
    if (projectData.functions) {
      projectData.functions.forEach(func => {
        suggestions.push({
          label: func.name,
          kind: 'function',
          detail: `${func.type === 'arrow' ? '→' : ''}Function(${func.params.join(', ')})${func.returnComment ? ` returns ${func.returnComment}` : ''}`,
          insertText: `${func.name}(${func.params.map((p, i) => `\${${i + 1}:${p}}`).join(', ')})$0`,
          insertTextRules: 4, // InsertAsSnippet
          documentation: `${func.type === 'arrow' ? 'Arrow function' : 'Function'} with ${func.params.length} parameter(s)${func.returnComment ? `\nReturns: ${func.returnComment}` : ''}`
        });
      });
    }
    
    // Sugerir variables con tipo inferido
    if (projectData.variables) {
      projectData.variables.forEach(variable => {
        suggestions.push({
          label: variable.name,
          kind: 'variable',
          detail: `${variable.type !== 'unknown' ? variable.type : 'Variable'} ${variable.value ? `= ${variable.value}` : ''}`,
          insertText: variable.name,
          documentation: `${variable.type !== 'unknown' ? `Type: ${variable.type}` : ''}
${variable.properties ? `Properties: ${variable.properties.join(', ')}` : ''}`,
        });
      });
    }
  }
  
  // Sugerir keywords según el lenguaje
  if (language === 'javascript') {
    const keywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 
                    'return', 'function', 'const', 'let', 'var', 'class', 'import', 'export', 
                    'try', 'catch', 'finally', 'async', 'await', 'new', 'this', 'super', 'extends'];
    
    // Buscar patrones comunes que necesitan snippets
    const needsIfSnippet = /(^|\s)if$/.test(line);
    const needsForSnippet = /(^|\s)for$/.test(line);
    const needsFunctionSnippet = /(^|\s)function$/.test(line);
    const needsArrowSnippet = /(^|\s)(const|let|var)\s+\w+\s*=$/.test(line);
    
    if (needsIfSnippet) {
      suggestions.push({
        label: 'if statement',
        kind: 'snippet',
        insertText: 'if (${1:condition}) {\n\t${0}\n}',
        insertTextRules: 4, // InsertAsSnippet
        detail: 'if statement with block',
        documentation: 'Complete if statement structure'
      });
    } else if (needsForSnippet) {
      suggestions.push({
        label: 'for loop',
        kind: 'snippet',
        insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array.length}; ${1:i}++) {\n\t${0}\n}',
        insertTextRules: 4, // InsertAsSnippet
        detail: 'for loop with counter',
        documentation: 'Standard for loop structure'
      });
    } else if (needsFunctionSnippet) {
      suggestions.push({
        label: 'function declaration',
        kind: 'snippet',
        insertText: 'function ${1:name}(${2:params}) {\n\t${0}\n}',
        insertTextRules: 4, // InsertAsSnippet
        detail: 'function declaration with block',
        documentation: 'Complete function declaration'
      });
    } else if (needsArrowSnippet) {
      suggestions.push({
        label: 'arrow function',
        kind: 'snippet',
        insertText: ' (${1:params}) => {\n\t${0}\n}',
        insertTextRules: 4, // InsertAsSnippet
        detail: 'arrow function with block',
        documentation: 'ES6 arrow function'
      });
    }
  }
  
  return suggestions;
};

/**
 * Devuelve métodos nativos para un tipo específico
 * @param {string} type - Tipo de variable (string, array, etc)
 * @returns {Array<Object>} - Lista de métodos nativos
 */
const getNativeMethodsForType = (type) => {
  switch(type.toLowerCase()) {
    case 'string':
      return [
        { name: 'charAt', description: 'Devuelve el carácter en posición especificada', insertText: 'charAt(${1:pos})' },
        { name: 'concat', description: 'Combina el texto de dos o más cadenas', insertText: 'concat(${1:str})' },
        { name: 'includes', description: 'Determina si una cadena puede encontrarse dentro de otra', insertText: 'includes(${1:str})' },
        { name: 'indexOf', description: 'Devuelve el índice de la primera aparición del valor especificado', insertText: 'indexOf(${1:str})' },
        { name: 'toLowerCase', description: 'Convierte a minúsculas', insertText: 'toLowerCase()' },
        { name: 'toUpperCase', description: 'Convierte a mayúsculas', insertText: 'toUpperCase()' },
        { name: 'trim', description: 'Elimina espacios en blanco iniciales y finales', insertText: 'trim()' },
        { name: 'split', description: 'Divide la cadena por el separador especificado', insertText: 'split(${1:separator})' },
        { name: 'replace', description: 'Reemplaza texto en una cadena', insertText: 'replace(${1:search}, ${2:replace})' },
      ];
    case 'array':
      return [
        { name: 'map', description: 'Crea un nuevo array con los resultados', insertText: 'map((${1:item}) => ${2})' },
        { name: 'filter', description: 'Filtra elementos que cumplen una condición', insertText: 'filter((${1:item}) => ${2})' },
        { name: 'find', description: 'Encuentra el primer elemento que cumple condición', insertText: 'find((${1:item}) => ${2})' },
        { name: 'forEach', description: 'Ejecuta una función por cada elemento', insertText: 'forEach((${1:item}) => {\n\t${2}\n})' },
        { name: 'reduce', description: 'Reduce el array a un único valor', insertText: 'reduce((${1:acc}, ${2:curr}) => ${3}, ${4:initial})' },
        { name: 'push', description: 'Agrega elementos al final del array', insertText: 'push(${1:element})' },
        { name: 'pop', description: 'Elimina el último elemento', insertText: 'pop()' },
        { name: 'shift', description: 'Elimina el primer elemento', insertText: 'shift()' },
        { name: 'unshift', description: 'Agrega elementos al inicio del array', insertText: 'unshift(${1:element})' },
      ];
    case 'number':
      return [
        { name: 'toFixed', description: 'Formatea con número específico de decimales', insertText: 'toFixed(${1:2})' },
        { name: 'toPrecision', description: 'Formatea a precisión especificada', insertText: 'toPrecision(${1:2})' },
        { name: 'toString', description: 'Convierte a cadena de texto', insertText: 'toString()' },
      ];
    default:
      return [];
  }
};

/**
 * Analiza todo el proyecto y extrae datos útiles para IntelliSense
 * @param {Object} files - Árbol de archivos
 * @returns {Object} - Datos del proyecto
 */
/**
 * Analiza todo el proyecto y extrae datos útiles para mejorar el IntelliSense
 * @param {Object} files - Árbol de archivos
 * @returns {Object} - Datos completos del proyecto para autocompletado
 */
export const analyzeProject = (files) => {
  const cssData = extractAllCSSClasses(files);
  const jsData = {
    functions: [],
    variables: []
  };
  
  // Extraer datos de archivos JS/TS/JSX/TSX
  const traverseForJS = (fileTree) => {
    Object.values(fileTree || {}).forEach(item => {
      if (item.type === 'file' && ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(item.language) && item.content) {
        const functions = extractJSFunctions(item.content);
        const variables = extractJSVariables(item.content);
        
        jsData.functions.push(...functions);
        jsData.variables.push(...variables);
      } else if (item.type === 'folder' && item.children) {
        traverseForJS(item.children);
      }
    });
  };
  
  traverseForJS(files);
  
  // Eliminar duplicados en variables (ahora basado en nombre ya que variables son objetos)
  jsData.variables = jsData.variables.filter((v, i, self) => 
    i === self.findIndex(t => t.name === v.name)
  );
  
  // Eliminar duplicados en funciones (basado en nombre)
  jsData.functions = jsData.functions.filter((f, i, self) => 
    i === self.findIndex(t => t.name === f.name)
  );
  
  return {
    cssClasses: cssData.classes,
    cssIds: cssData.ids,
    functions: jsData.functions,
    variables: jsData.variables
  };
};

/**
 * Comprueba si un carácter debe iniciar el autocompletado
 * @param {string} char - Carácter a comprobar
 * @param {string} language - Lenguaje actual
 * @returns {boolean} - True si debe iniciar autocompletado
 */
export const shouldTriggerCompletion = (char, language) => {
  // Caracteres que inician autocompletado en cualquier lenguaje
  const commonTriggers = ['.', ':', '<', '@', '#', '$', '-', '>', '"', "'"];
  
  // Caracteres específicos por lenguaje
  const languageTriggers = {
    'javascript': ['(', '{', '[', '=', '/'],
    'html': ['<', ' ', '/', '"', "'", '='],
    'css': ['.', '#', ':', '{', ' '],
    'java': ['.', '(', '{', '<', ' '],
  };
  
  return commonTriggers.includes(char) || 
         (languageTriggers[language] && languageTriggers[language].includes(char));
};

/**
 * Comprueba si el carácter introducido debe autocerrar paréntesis, llaves o corchetes
 * @param {string} openChar - Carácter de apertura
 * @param {string} line - Línea actual
 * @returns {boolean} - True si se debe autocerrar
 */
export const shouldAutoClose = (openChar, line) => {
  const pairs = {
    '(': ')',
    '{': '}',
    '[': ']',
    '"': '"',
    "'": "'",
    '`': '`',
    '<': '>'
  };
  
  // No cerrar si ya existe el carácter de cierre después
  if (!pairs[openChar]) return false;
  
  const closeChar = pairs[openChar];
  const remainingLine = line.slice(line.lastIndexOf(openChar) + 1).trim();
  
  // No cerrar si el próximo carácter ya es el de cierre
  if (remainingLine.startsWith(closeChar)) return false;
  
  // No cerrar si estamos dentro de un string (excepto al abrir un nuevo string)
  const inString = /['"](?:[^'"\\]|\\.)*$/.test(line.slice(0, line.lastIndexOf(openChar)));
  if (inString && (openChar !== '"' && openChar !== "'" && openChar !== '`')) return false;
  
  return true;
};
