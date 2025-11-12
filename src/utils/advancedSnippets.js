/**
 * Sistema de snippets avanzados con autocompletado de bloques completos
 */

export class AdvancedSnippetEngine {
  constructor() {
    this.blockSnippets = new Map();
    this.initializeBlockSnippets();
  }

  /**
   * Inicializa snippets de bloques completos
   */
  initializeBlockSnippets() {
    // CONSOLE SNIPPETS - Autocompletado inteligente
    this.addBlockSnippet('console', {
      patterns: ['console', 'console.', 'con'],
      snippet: 'console.log(${1});$0',
      description: 'console.log() statement',
      detail: 'console.log(value)',
      insertText: 'console.log(',
      suffix: ');',
      priority: 100
    });

    this.addBlockSnippet('consoleError', {
      patterns: ['console.error', 'console.err', 'cerr'],
      snippet: 'console.error(${1});$0',
      description: 'console.error() statement',
      detail: 'console.error(error)',
      insertText: 'console.error(',
      suffix: ');',
      priority: 95
    });

    this.addBlockSnippet('consoleWarn', {
      patterns: ['console.warn', 'console.warning', 'cwarn'],
      snippet: 'console.warn(${1});$0',
      description: 'console.warn() statement',
      detail: 'console.warn(warning)',
      insertText: 'console.warn(',
      suffix: ');',
      priority: 90
    });

    // IF STATEMENTS - Bloques completos
    this.addBlockSnippet('if', {
      patterns: ['if', 'if('],
      snippet: 'if (${1:condition}) {\n\t${2}\n}$0',
      description: 'if statement block',
      detail: 'if (condition) { }',
      insertText: 'if (',
      suffix: ') {\n\t\n}',
      priority: 95
    });

    this.addBlockSnippet('ifelse', {
      patterns: ['ifelse', 'if else', 'ife'],
      snippet: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}$0',
      description: 'if-else statement block',
      detail: 'if (condition) { } else { }',
      insertText: 'if (',
      suffix: ') {\n\t\n} else {\n\t\n}',
      priority: 90
    });

    // FOR LOOPS - Bloques completos
    this.addBlockSnippet('for', {
      patterns: ['for', 'for(', 'fori'],
      snippet: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3}\n}$0',
      description: 'for loop block',
      detail: 'for (let i = 0; i < length; i++) { }',
      insertText: 'for (let i = 0; i < ',
      suffix: '.length; i++) {\n\t\n}',
      priority: 95
    });

    this.addBlockSnippet('forEach', {
      patterns: ['forEach', 'foreach', 'fore'],
      snippet: '${1:array}.forEach((${2:item}) => {\n\t${3}\n});$0',
      description: 'forEach loop block',
      detail: 'array.forEach((item) => { })',
      insertText: 'forEach((item) => {\n\t',
      suffix: '\n});',
      priority: 90
    });

    this.addBlockSnippet('forof', {
      patterns: ['forof', 'for of', 'fofo'],
      snippet: 'for (const ${1:item} of ${2:array}) {\n\t${3}\n}$0',
      description: 'for...of loop block',
      detail: 'for (const item of array) { }',
      insertText: 'for (const item of ',
      suffix: ') {\n\t\n}',
      priority: 88
    });

    // FUNCTIONS - Bloques completos
    this.addBlockSnippet('function', {
      patterns: ['function', 'func', 'fn'],
      snippet: 'function ${1:name}(${2:params}) {\n\t${3}\n}$0',
      description: 'function declaration block',
      detail: 'function name(params) { }',
      insertText: 'function ',
      suffix: '() {\n\t\n}',
      priority: 95
    });

    this.addBlockSnippet('arrow', {
      patterns: ['arrow', '=>', 'const function'],
      snippet: 'const ${1:name} = (${2:params}) => {\n\t${3}\n};$0',
      description: 'arrow function block',
      detail: 'const name = (params) => { }',
      insertText: 'const name = (',
      suffix: ') => {\n\t\n};',
      priority: 92
    });

    this.addBlockSnippet('async', {
      patterns: ['async', 'asyncfunc', 'af'],
      snippet: 'const ${1:name} = async (${2:params}) => {\n\ttry {\n\t\t${3}\n\t} catch (error) {\n\t\tconsole.error(error);\n\t}\n};$0',
      description: 'async function with error handling',
      detail: 'async function with try-catch',
      insertText: 'const name = async (',
      suffix: ') => {\n\ttry {\n\t\t\n\t} catch (error) {\n\t\tconsole.error(error);\n\t}\n};',
      priority: 88
    });

    // TRY-CATCH - Bloques completos
    this.addBlockSnippet('try', {
      patterns: ['try', 'trycatch', 'tc'],
      snippet: 'try {\n\t${1}\n} catch (${2:error}) {\n\tconsole.error(${2:error});\n}$0',
      description: 'try-catch block',
      detail: 'try { } catch (error) { }',
      insertText: 'try {\n\t',
      suffix: '\n} catch (error) {\n\tconsole.error(error);\n}',
      priority: 92
    });

    // SWITCH - Bloques completos
    this.addBlockSnippet('switch', {
      patterns: ['switch', 'sw'],
      snippet: 'switch (${1:expression}) {\n\tcase ${2:value}:\n\t\t${3}\n\t\tbreak;\n\tdefault:\n\t\t${4}\n}$0',
      description: 'switch statement block',
      detail: 'switch (expression) { case: break; }',
      insertText: 'switch (',
      suffix: ') {\n\tcase value:\n\t\t\n\t\tbreak;\n\tdefault:\n\t\t\n}',
      priority: 85
    });

    // WHILE - Bloques completos
    this.addBlockSnippet('while', {
      patterns: ['while', 'wh'],
      snippet: 'while (${1:condition}) {\n\t${2}\n}$0',
      description: 'while loop block',
      detail: 'while (condition) { }',
      insertText: 'while (',
      suffix: ') {\n\t\n}',
      priority: 85
    });

    // CLASS - Bloques completos
    this.addBlockSnippet('class', {
      patterns: ['class', 'cl'],
      snippet: 'class ${1:Name} {\n\tconstructor(${2:params}) {\n\t\t${3}\n\t}\n\t\n\t${4:method}() {\n\t\t${5}\n\t}\n}$0',
      description: 'class declaration block',
      detail: 'class Name { constructor() { } }',
      insertText: 'class Name {\n\tconstructor(',
      suffix: ') {\n\t\t\n\t}\n}',
      priority: 80
    });

    // IMPORT/EXPORT - Bloques completos
    this.addBlockSnippet('import', {
      patterns: ['import', 'imp'],
      snippet: 'import ${1:module} from "${2:path}";$0',
      description: 'import statement',
      detail: 'import module from "path"',
      insertText: 'import ',
      suffix: ' from "";',
      priority: 85
    });

    this.addBlockSnippet('importNamed', {
      patterns: ['import{', 'import {', 'impn'],
      snippet: 'import { ${1:exports} } from "${2:path}";$0',
      description: 'named import statement',
      detail: 'import { exports } from "path"',
      insertText: 'import { ',
      suffix: ' } from "";',
      priority: 83
    });

    // FETCH API - Bloques completos
    this.addBlockSnippet('fetch', {
      patterns: ['fetch', 'api'],
      snippet: 'fetch("${1:url}")\n\t.then(response => response.json())\n\t.then(data => {\n\t\t${2}\n\t})\n\t.catch(error => {\n\t\tconsole.error("Error:", error);\n\t});$0',
      description: 'fetch API with error handling',
      detail: 'fetch(url).then().catch()',
      insertText: 'fetch("',
      suffix: '")\n\t.then(response => response.json())\n\t.then(data => {\n\t\t\n\t})\n\t.catch(error => console.error(error));',
      priority: 90
    });

    this.addBlockSnippet('asyncFetch', {
      patterns: ['asyncfetch', 'afetch', 'awaitfetch'],
      snippet: 'const ${1:response} = await fetch("${2:url}");\nconst ${3:data} = await ${1:response}.json();\nconsole.log(${3:data});$0',
      description: 'async fetch with await',
      detail: 'await fetch() with response.json()',
      insertText: 'const response = await fetch("',
      suffix: '");\nconst data = await response.json();',
      priority: 88
    });
  }

  /**
   * Agrega un snippet de bloque
   */
  addBlockSnippet(name, config) {
    this.blockSnippets.set(name, config);
  }

  /**
   * Obtiene sugerencias de bloques completos basadas en lo que se está escribiendo
   */
  getBlockSuggestions(input, language = 'javascript') {
    const suggestions = [];
    const inputLower = input.toLowerCase().trim();
    
    for (const [name, snippet] of this.blockSnippets) {
      // Verificar si algún pattern coincide
      const matches = snippet.patterns.some(pattern => {
        return inputLower === pattern.toLowerCase() || 
               inputLower.startsWith(pattern.toLowerCase()) ||
               pattern.toLowerCase().includes(inputLower);
      });

      if (matches) {
        const score = this.calculateMatchScore(inputLower, snippet.patterns);
        suggestions.push({
          name,
          ...snippet,
          matchScore: score
        });
      }
    }

    // Ordenar por score de coincidencia y prioridad
    return suggestions.sort((a, b) => {
      const scoreA = a.matchScore + (a.priority || 0);
      const scoreB = b.matchScore + (b.priority || 0);
      return scoreB - scoreA;
    });
  }

  /**
   * Calcula score de coincidencia para un input
   */
  calculateMatchScore(input, patterns) {
    let maxScore = 0;
    
    patterns.forEach(pattern => {
      const patternLower = pattern.toLowerCase();
      let score = 0;
      
      if (input === patternLower) {
        score = 100; // Coincidencia exacta
      } else if (patternLower.startsWith(input)) {
        score = 80 + (input.length / patternLower.length) * 20; // Prefijo
      } else if (patternLower.includes(input)) {
        score = 60 + (input.length / patternLower.length) * 15; // Contiene
      } else if (input.length > 2) {
        // Fuzzy matching básico
        let fuzzyScore = 0;
        let inputIndex = 0;
        for (let i = 0; i < patternLower.length && inputIndex < input.length; i++) {
          if (patternLower[i] === input[inputIndex]) {
            fuzzyScore++;
            inputIndex++;
          }
        }
        if (inputIndex === input.length) {
          score = 40 + (fuzzyScore / patternLower.length) * 20;
        }
      }
      
      maxScore = Math.max(maxScore, score);
    });
    
    return maxScore;
  }

  /**
   * Convierte sugerencias a formato Monaco
   */
  convertToMonacoSuggestions(suggestions, range, replaceLength = 0) {
    return suggestions.map((suggestion, index) => {
      // Ajustar el rango para reemplazar el texto existente
      const adjustedRange = replaceLength > 0 ? {
        ...range,
        endColumn: range.startColumn + replaceLength
      } : range;

      return {
        label: {
          label: suggestion.patterns[0], // Mostrar el pattern principal
          description: suggestion.description
        },
        kind: 27, // CompletionItemKind.Snippet
        insertText: suggestion.snippet,
        insertTextRules: 4, // InsertAsSnippet
        documentation: {
          value: `**${suggestion.description}**\n\n${suggestion.detail}\n\n\`\`\`javascript\n${suggestion.snippet.replace(/\$\{?\d+:?([^}]*)\}?/g, '$1').replace(/\$0/g, '')}\n\`\`\``
        },
        detail: suggestion.detail,
        sortText: String(1000 - (suggestion.matchScore + (suggestion.priority || 0))).padStart(4, '0'),
        range: adjustedRange,
        preselect: index === 0, // Preseleccionar el mejor match
        commitCharacters: ['.', '(', ' ', '\t'] // Caracteres que confirman la sugerencia
      };
    });
  }

  /**
   * Detecta si se debe activar autocompletado de bloques
   */
  shouldTriggerBlockCompletion(line, position) {
    const beforeCursor = line.substring(0, position);
    const word = this.extractCurrentWord(beforeCursor);
    
    // Activar si hay una palabra de al menos 2 caracteres
    return word.length >= 2;
  }

  /**
   * Extrae la palabra actual que se está escribiendo
   */
  extractCurrentWord(text) {
    const match = text.match(/\w+$/);
    return match ? match[0] : '';
  }

  /**
   * Obtiene sugerencias específicas para un contexto
   */
  getContextualBlockSuggestions(line, position, fileContent) {
    const word = this.extractCurrentWord(line.substring(0, position));
    
    if (!word || word.length < 2) {
      return [];
    }

    // Obtener sugerencias básicas
    let suggestions = this.getBlockSuggestions(word);

    // Filtrar por contexto adicional
    const context = this.analyzeContext(line, fileContent);
    
    if (context.isInFunction && suggestions.find(s => s.name === 'function')) {
      // Si ya estamos en una función, reducir prioridad de snippets de función
      suggestions = suggestions.map(s => 
        s.name === 'function' ? { ...s, priority: (s.priority || 0) - 20 } : s
      );
    }

    if (context.hasReact && word.toLowerCase().includes('use')) {
      // Si es un proyecto React y se escribe algo con "use", priorizar hooks
      suggestions.unshift({
        name: 'useState',
        patterns: ['useState', 'use', 'state'],
        snippet: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});$0',
        description: 'React useState hook',
        detail: 'const [state, setState] = useState(initialValue)',
        priority: 95,
        matchScore: 90
      });
    }

    return suggestions;
  }

  /**
   * Analiza el contexto del código
   */
  analyzeContext(line, fileContent) {
    return {
      isInFunction: /function\s+\w+\s*\([^)]*\)\s*{[^}]*$/.test(fileContent),
      hasReact: fileContent.includes('import React') || fileContent.includes('from "react"'),
      isInClass: /class\s+\w+\s*{[^}]*$/.test(fileContent),
      hasAsync: fileContent.includes('async') || fileContent.includes('await')
    };
  }
}
