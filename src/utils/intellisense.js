// Sistema de IntelliSense para autocompletado inteligente

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
 * Extrae funciones JavaScript definidas en el código
 * @param {string} jsContent - Contenido JavaScript
 * @returns {Array<Object>} - Array de funciones { name, params }
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
  const arrowRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:\(([^)]*)\)|([a-zA-Z_$][a-zA-Z0-9_$]*))\s*=>/g;
  
  while ((match = arrowRegex.exec(jsContent)) !== null) {
    const params = match[2] ? match[2].split(',').map(p => p.trim()).filter(Boolean) : (match[3] ? [match[3]] : []);
    functions.push({
      name: match[1],
      params,
      type: 'arrow'
    });
  }
  
  return functions;
};

/**
 * Extrae variables JavaScript
 * @param {string} jsContent - Contenido JavaScript
 * @returns {Array<Object>} - Array de variables { name, type }
 */
export const extractJSVariables = (jsContent) => {
  if (!jsContent) return [];
  
  const variables = new Set();
  
  // const, let, var declaraciones
  const varRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  let match;
  
  while ((match = varRegex.exec(jsContent)) !== null) {
    variables.add(match[1]);
  }
  
  return Array.from(variables).sort();
};

/**
 * Genera sugerencias inteligentes basadas en el contexto
 * @param {string} line - Línea actual
 * @param {string} language - Lenguaje del archivo
 * @param {Object} projectData - Datos del proyecto (clases, funciones, etc.)
 * @returns {Array<Object>} - Sugerencias
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
    // Sugerir funciones disponibles
    if (projectData.functions) {
      projectData.functions.forEach(func => {
        suggestions.push({
          label: func.name,
          kind: 'function',
          detail: `Function(${func.params.join(', ')})`,
          insertText: `${func.name}(${func.params.map((_, i) => `\${${i + 1}}`).join(', ')})`
        });
      });
    }
    
    // Sugerir variables
    if (projectData.variables) {
      projectData.variables.forEach(varName => {
        suggestions.push({
          label: varName,
          kind: 'variable',
          detail: 'Variable',
          insertText: varName
        });
      });
    }
  }
  
  return suggestions;
};

/**
 * Analiza todo el proyecto y extrae datos útiles para IntelliSense
 * @param {Object} files - Árbol de archivos
 * @returns {Object} - Datos del proyecto
 */
export const analyzeProject = (files) => {
  const cssData = extractAllCSSClasses(files);
  const jsData = {
    functions: [],
    variables: []
  };
  
  // Extraer datos de archivos JS
  const traverseForJS = (fileTree) => {
    Object.values(fileTree || {}).forEach(item => {
      if (item.type === 'file' && item.language === 'javascript' && item.content) {
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
  
  // Eliminar duplicados en variables
  jsData.variables = Array.from(new Set(jsData.variables));
  
  return {
    cssClasses: cssData.classes,
    cssIds: cssData.ids,
    functions: jsData.functions,
    variables: jsData.variables
  };
};
