/**
 * Proveedor de información hover inteligente con documentación
 */

import { SemanticAnalyzer } from './semanticAnalysis.js';

export class HoverProvider {
  constructor() {
    this.analyzer = new SemanticAnalyzer();
    this.documentationCache = new Map();
  }

  /**
   * Proporciona información hover para una posición específica
   */
  provideHover(model, position, projectAnalysis) {
    const word = model.getWordAtPosition(position);
    if (!word) return null;

    const line = model.getLineContent(position.lineNumber);
    const context = this.getHoverContext(line, word, position.column);
    
    return this.generateHoverContent(word.word, context, projectAnalysis);
  }

  /**
   * Obtiene el contexto del hover
   */
  getHoverContext(line, word, column) {
    const beforeWord = line.substring(0, word.startColumn - 1);
    const afterWord = line.substring(word.endColumn - 1);

    // Detectar si es una propiedad de objeto
    if (beforeWord.endsWith('.')) {
      const objectMatch = beforeWord.match(/(\w+)\.$/);
      return {
        type: 'property',
        objectName: objectMatch ? objectMatch[1] : null,
        propertyName: word.word
      };
    }

    // Detectar si es una función siendo llamada
    if (afterWord.startsWith('(')) {
      return {
        type: 'function_call',
        functionName: word.word
      };
    }

    // Detectar si es un import
    if (beforeWord.includes('import') && beforeWord.includes('from')) {
      return {
        type: 'import',
        moduleName: word.word
      };
    }

    return {
      type: 'symbol',
      symbolName: word.word
    };
  }

  /**
   * Genera contenido de hover
   */
  generateHoverContent(word, context, projectAnalysis) {
    let content = [];

    switch (context.type) {
      case 'property':
        content = this.getPropertyHover(context.objectName, context.propertyName, projectAnalysis);
        break;
      
      case 'function_call':
        content = this.getFunctionHover(context.functionName, projectAnalysis);
        break;
      
      case 'import':
        content = this.getImportHover(context.moduleName);
        break;
      
      default:
        content = this.getSymbolHover(context.symbolName, projectAnalysis);
    }

    if (content.length === 0) {
      return null;
    }

    return {
      contents: content.map(item => ({ value: item }))
    };
  }

  /**
   * Hover para propiedades de objeto
   */
  getPropertyHover(objectName, propertyName, projectAnalysis) {
    const content = [];

    // Información básica
    content.push(`**${objectName}.${propertyName}**`);

    // Buscar tipo del objeto
    const objectSymbol = this.findSymbol(objectName, projectAnalysis);
    if (objectSymbol && objectSymbol.inferredType) {
      const propertyInfo = this.getTypePropertyInfo(objectSymbol.inferredType, propertyName);
      if (propertyInfo) {
        content.push(`*${propertyInfo.type}*`);
        content.push('---');
        content.push(propertyInfo.description);
        
        if (propertyInfo.example) {
          content.push('**Ejemplo:**');
          content.push(`\`\`\`javascript\n${propertyInfo.example}\n\`\`\``);
        }
      }
    }

    return content;
  }

  /**
   * Hover para funciones
   */
  getFunctionHover(functionName, projectAnalysis) {
    const content = [];
    const symbol = this.findSymbol(functionName, projectAnalysis);

    if (symbol && symbol.type === 'function') {
      // Signatura de la función
      const params = symbol.params.map(p => `${p.name}: ${p.type}`).join(', ');
      content.push(`**function ${functionName}**(${params}): ${symbol.returnType}`);
      
      // Documentación JSDoc
      if (symbol.documentation) {
        content.push('---');
        content.push(symbol.documentation.description);
        
        if (symbol.documentation.params && symbol.documentation.params.length > 0) {
          content.push('**Parámetros:**');
          symbol.documentation.params.forEach(param => {
            content.push(`• **${param.name}** *${param.type}* - ${param.description}`);
          });
        }
        
        if (symbol.documentation.returns) {
          content.push(`**Retorna:** ${symbol.documentation.returns}`);
        }
      }

      // Ejemplo de uso
      content.push('**Ejemplo:**');
      const exampleParams = symbol.params.map(p => this.generateExampleValue(p.type)).join(', ');
      content.push(`\`\`\`javascript\n${functionName}(${exampleParams})\n\`\`\``);
    }

    return content;
  }

  /**
   * Hover para imports
   */
  getImportHover(moduleName) {
    const content = [];
    const moduleInfo = this.getModuleInfo(moduleName);

    if (moduleInfo) {
      content.push(`**Módulo:** ${moduleName}`);
      content.push('---');
      content.push(moduleInfo.description);
      
      if (moduleInfo.exports && moduleInfo.exports.length > 0) {
        content.push('**Exports disponibles:**');
        moduleInfo.exports.slice(0, 10).forEach(exp => {
          content.push(`• ${exp}`);
        });
        
        if (moduleInfo.exports.length > 10) {
          content.push(`... y ${moduleInfo.exports.length - 10} más`);
        }
      }
    }

    return content;
  }

  /**
   * Hover para símbolos generales
   */
  getSymbolHover(symbolName, projectAnalysis) {
    const content = [];
    const symbol = this.findSymbol(symbolName, projectAnalysis);

    if (symbol) {
      // Tipo de símbolo
      content.push(`**(${symbol.type})** ${symbolName}`);
      
      // Tipo inferido/declarado
      if (symbol.declaredType || symbol.inferredType) {
        const type = symbol.declaredType || symbol.inferredType;
        content.push(`*Tipo:* ${type}`);
      }

      // Valor si es variable
      if (symbol.type === 'variable' && symbol.value) {
        content.push(`*Valor:* \`${symbol.value}\``);
      }

      // Documentación adicional
      const additionalInfo = this.getAdditionalSymbolInfo(symbolName, symbol.inferredType);
      if (additionalInfo) {
        content.push('---');
        content.push(additionalInfo);
      }
    }

    return content;
  }

  /**
   * Busca un símbolo en el análisis del proyecto
   */
  findSymbol(symbolName, projectAnalysis) {
    if (!projectAnalysis || !projectAnalysis.symbols) return null;
    return projectAnalysis.symbols.find(s => s.name === symbolName);
  }

  /**
   * Información de propiedades de tipos conocidos
   */
  getTypePropertyInfo(type, propertyName) {
    const typeInfo = {
      'string': {
        'length': {
          type: 'number',
          description: 'Devuelve la longitud de la cadena',
          example: 'const text = "hello";\nconsole.log(text.length); // 5'
        },
        'charAt': {
          type: '(index: number) => string',
          description: 'Devuelve el carácter en la posición especificada',
          example: 'const text = "hello";\nconsole.log(text.charAt(1)); // "e"'
        }
      },
      'array': {
        'length': {
          type: 'number',
          description: 'Devuelve el número de elementos en el array',
          example: 'const arr = [1, 2, 3];\nconsole.log(arr.length); // 3'
        },
        'push': {
          type: '(...items: T[]) => number',
          description: 'Agrega elementos al final del array y devuelve la nueva longitud',
          example: 'const arr = [1, 2];\narr.push(3); // arr: [1, 2, 3]'
        }
      }
    };

    return typeInfo[type]?.[propertyName];
  }

  /**
   * Información de módulos conocidos
   */
  getModuleInfo(moduleName) {
    const moduleInfo = {
      'react': {
        description: 'Biblioteca para construir interfaces de usuario con componentes',
        exports: ['useState', 'useEffect', 'useContext', 'Component', 'Fragment']
      },
      'lodash': {
        description: 'Biblioteca de utilidades JavaScript que proporciona funciones helper',
        exports: ['map', 'filter', 'reduce', 'find', 'forEach', 'some', 'every']
      },
      'axios': {
        description: 'Cliente HTTP basado en promesas para el navegador y Node.js',
        exports: ['get', 'post', 'put', 'delete', 'patch', 'request']
      }
    };

    return moduleInfo[moduleName];
  }

  /**
   * Genera valor de ejemplo para un tipo
   */
  generateExampleValue(type) {
    const examples = {
      'string': '"ejemplo"',
      'number': '42',
      'boolean': 'true',
      'array': '[1, 2, 3]',
      'object': '{ prop: "valor" }',
      'function': '() => {}',
      'any': 'valor'
    };

    return examples[type] || 'valor';
  }

  /**
   * Información adicional sobre símbolos conocidos
   */
  getAdditionalSymbolInfo(symbolName, type) {
    // Información para APIs del DOM
    if (symbolName === 'document') {
      return 'Objeto global que representa el documento HTML. Proporciona métodos para acceder y manipular elementos del DOM.';
    }
    
    if (symbolName === 'window') {
      return 'Objeto global que representa la ventana del navegador. Contiene propiedades y métodos para controlar la ventana.';
    }
    
    if (symbolName === 'console') {
      return 'Objeto que proporciona acceso a la consola de depuración del navegador.';
    }

    // Información para tipos comunes
    if (type === 'HTMLElement') {
      return 'Elemento HTML del DOM. Tiene propiedades y métodos para manipular el elemento.';
    }

    return null;
  }
}
