/**
 * Sistema de análisis semántico avanzado para IntelliSense súper inteligente
 */

/**
 * Clase para análisis semántico del código
 */
export class SemanticAnalyzer {
  constructor() {
    this.symbols = new Map(); // Símbolos definidos
    this.types = new Map(); // Tipos inferidos
    this.imports = new Map(); // Imports disponibles
    this.exports = new Map(); // Exports del proyecto
    this.references = new Map(); // Referencias entre símbolos
  }

  /**
   * Analiza un archivo y extrae información semántica
   */
  analyzeFile(content, filePath, language) {
    const analysis = {
      symbols: [],
      types: [],
      imports: [],
      exports: [],
      references: [],
      diagnostics: []
    };

    if (language === 'javascript' || language === 'typescript') {
      return this.analyzeJavaScript(content, filePath);
    } else if (language === 'html') {
      return this.analyzeHTML(content, filePath);
    } else if (language === 'css') {
      return this.analyzeCSS(content, filePath);
    }

    return analysis;
  }

  /**
   * Análisis JavaScript/TypeScript avanzado
   */
  analyzeJavaScript(content, filePath) {
    const analysis = { symbols: [], types: [], imports: [], exports: [], references: [] };
    const lines = content.split('\n');

    // Detectar imports
    const importRegex = /import\s+(?:(\w+)|{([^}]+)}|\*\s+as\s+(\w+))\s+from\s+['"]([^'"]+)['"]/g;
    let importMatch;
    while ((importMatch = importRegex.exec(content)) !== null) {
      const [fullMatch, defaultImport, namedImports, namespaceImport, modulePath] = importMatch;
      
      analysis.imports.push({
        type: 'import',
        defaultImport,
        namedImports: namedImports ? namedImports.split(',').map(n => n.trim()) : [],
        namespaceImport,
        modulePath,
        position: this.getPosition(content, importMatch.index)
      });
    }

    // Detectar funciones con JSDoc
    const functionRegex = /(?:\/\*\*[\s\S]*?\*\/)?\s*(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*{/g;
    let funcMatch;
    while ((funcMatch = functionRegex.exec(content)) !== null) {
      const [fullMatch, name, params, returnType] = funcMatch;
      const position = this.getPosition(content, funcMatch.index);
      
      analysis.symbols.push({
        name,
        type: 'function',
        params: this.parseParameters(params),
        returnType: returnType ? returnType.trim() : 'unknown',
        position,
        documentation: this.extractJSDoc(content, funcMatch.index)
      });
    }

    // Detectar variables con tipos inferidos
    const varRegex = /(?:const|let|var)\s+(\w+)(?:\s*:\s*([^=]+))?\s*=\s*([^;\n]+)/g;
    let varMatch;
    while ((varMatch = varRegex.exec(content)) !== null) {
      const [fullMatch, name, declaredType, value] = varMatch;
      const position = this.getPosition(content, varMatch.index);
      const inferredType = this.inferType(value.trim());
      
      analysis.symbols.push({
        name,
        type: 'variable',
        declaredType: declaredType ? declaredType.trim() : null,
        inferredType,
        value: value.trim(),
        position
      });
    }

    // Detectar clases
    const classRegex = /(?:export\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?\s*{/g;
    let classMatch;
    while ((classMatch = classRegex.exec(content)) !== null) {
      const [fullMatch, name, parentClass] = classMatch;
      const position = this.getPosition(content, classMatch.index);
      
      analysis.symbols.push({
        name,
        type: 'class',
        parentClass,
        position,
        methods: this.extractClassMethods(content, classMatch.index),
        properties: this.extractClassProperties(content, classMatch.index)
      });
    }

    return analysis;
  }

  /**
   * Infiere el tipo de una expresión
   */
  inferType(expression) {
    // Tipos literales
    if (/^['"`]/.test(expression)) return 'string';
    if (/^\d+$/.test(expression)) return 'number';
    if (/^\d*\.\d+$/.test(expression)) return 'number';
    if (expression === 'true' || expression === 'false') return 'boolean';
    if (expression === 'null') return 'null';
    if (expression === 'undefined') return 'undefined';
    
    // Arrays
    if (expression.startsWith('[')) return 'array';
    
    // Objetos
    if (expression.startsWith('{')) return 'object';
    
    // Funciones arrow
    if (expression.includes('=>')) return 'function';
    
    // Constructores
    if (expression.startsWith('new ')) {
      const constructorMatch = expression.match(/new\s+(\w+)/);
      return constructorMatch ? constructorMatch[1] : 'object';
    }
    
    // Llamadas a funciones conocidas
    if (expression.includes('document.querySelector')) return 'HTMLElement';
    if (expression.includes('document.getElementById')) return 'HTMLElement';
    if (expression.includes('Math.')) return 'number';
    
    return 'unknown';
  }

  /**
   * Extrae JSDoc de una función
   */
  extractJSDoc(content, position) {
    const beforeFunction = content.substring(0, position);
    const jsdocMatch = beforeFunction.match(/\/\*\*([\s\S]*?)\*\/\s*$/);
    
    if (jsdocMatch) {
      const jsdoc = jsdocMatch[1];
      return {
        description: jsdoc.match(/@description\s+(.*?)(?=@|$)/s)?.[1]?.trim() || 
                    jsdoc.split('@')[0].replace(/\*\s?/g, '').trim(),
        params: this.parseJSDocParams(jsdoc),
        returns: jsdoc.match(/@returns?\s+{([^}]+)}\s+(.*?)(?=@|$)/s)?.[2]?.trim()
      };
    }
    
    return null;
  }

  /**
   * Parsea parámetros JSDoc
   */
  parseJSDocParams(jsdoc) {
    const paramRegex = /@param\s+{([^}]+)}\s+(\w+)\s*-?\s*(.*?)(?=@|$)/gs;
    const params = [];
    let match;
    
    while ((match = paramRegex.exec(jsdoc)) !== null) {
      params.push({
        type: match[1],
        name: match[2],
        description: match[3].trim()
      });
    }
    
    return params;
  }

  /**
   * Obtiene posición línea/columna desde índice
   */
  getPosition(content, index) {
    const lines = content.substring(0, index).split('\n');
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    };
  }

  /**
   * Parsea parámetros de función
   */
  parseParameters(paramString) {
    if (!paramString.trim()) return [];
    
    return paramString.split(',').map(param => {
      const trimmed = param.trim();
      const typeMatch = trimmed.match(/(\w+)(?:\s*:\s*([^=]+))?(?:\s*=\s*(.+))?/);
      
      if (typeMatch) {
        return {
          name: typeMatch[1],
          type: typeMatch[2] ? typeMatch[2].trim() : 'any',
          defaultValue: typeMatch[3] ? typeMatch[3].trim() : null
        };
      }
      
      return { name: trimmed, type: 'any', defaultValue: null };
    });
  }

  /**
   * Genera sugerencias inteligentes basadas en contexto
   */
  getIntelligentSuggestions(line, position, fileAnalysis, projectAnalysis) {
    const suggestions = [];
    
    // Detectar contexto actual
    const context = this.detectContext(line, position);
    
    switch (context.type) {
      case 'object_property':
        return this.getObjectPropertySuggestions(context.objectName, fileAnalysis, projectAnalysis);
      
      case 'function_call':
        return this.getFunctionCallSuggestions(context.functionName, fileAnalysis, projectAnalysis);
      
      case 'import_statement':
        return this.getImportSuggestions(context.modulePath, projectAnalysis);
      
      case 'type_annotation':
        return this.getTypeSuggestions(fileAnalysis, projectAnalysis);
      
      default:
        return this.getGeneralSuggestions(line, fileAnalysis, projectAnalysis);
    }
  }

  /**
   * Detecta el contexto actual del cursor
   */
  detectContext(line, position) {
    const beforeCursor = line.substring(0, position);
    
    // Detectar acceso a propiedades: objeto.
    const objectAccessMatch = beforeCursor.match(/(\w+)\.(\w*)$/);
    if (objectAccessMatch) {
      return {
        type: 'object_property',
        objectName: objectAccessMatch[1],
        partial: objectAccessMatch[2]
      };
    }
    
    // Detectar llamada a función: function(
    const functionCallMatch = beforeCursor.match(/(\w+)\s*\(\s*$/);
    if (functionCallMatch) {
      return {
        type: 'function_call',
        functionName: functionCallMatch[1]
      };
    }
    
    // Detectar import: import ... from '
    const importMatch = beforeCursor.match(/import.*from\s+['"]([^'"]*)\s*$/);
    if (importMatch) {
      return {
        type: 'import_statement',
        modulePath: importMatch[1]
      };
    }
    
    return { type: 'general' };
  }

  /**
   * Sugerencias para propiedades de objeto
   */
  getObjectPropertySuggestions(objectName, fileAnalysis, projectAnalysis) {
    const suggestions = [];
    
    // Buscar el objeto en símbolos locales
    const symbol = fileAnalysis.symbols.find(s => s.name === objectName);
    if (symbol) {
      if (symbol.type === 'variable') {
        // Sugerir propiedades basadas en el tipo inferido
        const nativeProps = this.getNativeProperties(symbol.inferredType);
        suggestions.push(...nativeProps);
      } else if (symbol.type === 'class') {
        // Sugerir métodos y propiedades de la clase
        suggestions.push(...symbol.methods);
        suggestions.push(...symbol.properties);
      }
    }
    
    return suggestions;
  }

  /**
   * Obtiene propiedades nativas de tipos conocidos
   */
  getNativeProperties(type) {
    const nativeProps = {
      'string': [
        { name: 'length', type: 'property', returnType: 'number' },
        { name: 'charAt', type: 'method', returnType: 'string', params: ['index: number'] },
        { name: 'substring', type: 'method', returnType: 'string', params: ['start: number', 'end?: number'] },
        { name: 'toLowerCase', type: 'method', returnType: 'string', params: [] },
        { name: 'toUpperCase', type: 'method', returnType: 'string', params: [] },
        { name: 'trim', type: 'method', returnType: 'string', params: [] },
        { name: 'split', type: 'method', returnType: 'string[]', params: ['separator: string'] },
        { name: 'replace', type: 'method', returnType: 'string', params: ['searchValue: string', 'replaceValue: string'] },
        { name: 'includes', type: 'method', returnType: 'boolean', params: ['searchString: string'] },
        { name: 'indexOf', type: 'method', returnType: 'number', params: ['searchValue: string'] }
      ],
      'array': [
        { name: 'length', type: 'property', returnType: 'number' },
        { name: 'push', type: 'method', returnType: 'number', params: ['...items: T[]'] },
        { name: 'pop', type: 'method', returnType: 'T | undefined', params: [] },
        { name: 'map', type: 'method', returnType: 'U[]', params: ['callbackfn: (value: T) => U'] },
        { name: 'filter', type: 'method', returnType: 'T[]', params: ['predicate: (value: T) => boolean'] },
        { name: 'find', type: 'method', returnType: 'T | undefined', params: ['predicate: (value: T) => boolean'] },
        { name: 'forEach', type: 'method', returnType: 'void', params: ['callbackfn: (value: T) => void'] },
        { name: 'reduce', type: 'method', returnType: 'U', params: ['callbackfn: (prev: U, curr: T) => U', 'initialValue: U'] },
        { name: 'slice', type: 'method', returnType: 'T[]', params: ['start?: number', 'end?: number'] },
        { name: 'join', type: 'method', returnType: 'string', params: ['separator?: string'] }
      ],
      'HTMLElement': [
        { name: 'innerHTML', type: 'property', returnType: 'string' },
        { name: 'textContent', type: 'property', returnType: 'string' },
        { name: 'classList', type: 'property', returnType: 'DOMTokenList' },
        { name: 'style', type: 'property', returnType: 'CSSStyleDeclaration' },
        { name: 'addEventListener', type: 'method', returnType: 'void', params: ['type: string', 'listener: EventListener'] },
        { name: 'removeEventListener', type: 'method', returnType: 'void', params: ['type: string', 'listener: EventListener'] },
        { name: 'querySelector', type: 'method', returnType: 'Element | null', params: ['selectors: string'] },
        { name: 'appendChild', type: 'method', returnType: 'Node', params: ['node: Node'] }
      ]
    };
    
    return nativeProps[type] || [];
  }
}

/**
 * Sistema de auto-imports inteligente
 */
export class AutoImportSystem {
  constructor() {
    this.availableModules = new Map();
    this.projectExports = new Map();
  }

  /**
   * Registra módulos disponibles para auto-import
   */
  registerModule(moduleName, exports) {
    this.availableModules.set(moduleName, exports);
  }

  /**
   * Sugiere imports automáticos para un símbolo
   */
  suggestImports(symbolName, currentImports = []) {
    const suggestions = [];
    
    // Buscar en módulos registrados
    for (const [moduleName, exports] of this.availableModules) {
      if (exports.includes(symbolName)) {
        // Verificar si ya está importado
        const alreadyImported = currentImports.some(imp => 
          imp.modulePath === moduleName && 
          (imp.defaultImport === symbolName || imp.namedImports.includes(symbolName))
        );
        
        if (!alreadyImported) {
          suggestions.push({
            type: 'auto-import',
            symbolName,
            moduleName,
            importStatement: `import { ${symbolName} } from '${moduleName}';`
          });
        }
      }
    }
    
    return suggestions;
  }

  /**
   * Inicializa con módulos comunes
   */
  initializeCommonModules() {
    // React
    this.registerModule('react', ['useState', 'useEffect', 'useContext', 'useMemo', 'useCallback', 'Component']);
    
    // Lodash
    this.registerModule('lodash', ['map', 'filter', 'reduce', 'find', 'forEach', 'some', 'every', 'uniq']);
    
    // Date-fns
    this.registerModule('date-fns', ['format', 'addDays', 'subDays', 'isAfter', 'isBefore', 'parseISO']);
    
    // Axios
    this.registerModule('axios', ['get', 'post', 'put', 'delete', 'patch']);
  }
}
