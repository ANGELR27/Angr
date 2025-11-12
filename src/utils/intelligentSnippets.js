/**
 * Sistema de snippets contextuales súper inteligentes
 */

export class IntelligentSnippetProvider {
  constructor() {
    this.contextualSnippets = new Map();
    this.initializeSnippets();
  }

  /**
   * Inicializa snippets contextuales
   */
  initializeSnippets() {
    // React Hooks
    this.addContextualSnippet('useState', {
      trigger: ['useState', 'state'],
      context: 'react',
      snippet: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});',
      description: 'React useState hook',
      documentation: 'Hook para manejar estado local en componentes funcionales'
    });

    this.addContextualSnippet('useEffect', {
      trigger: ['useEffect', 'effect'],
      context: 'react',
      snippet: 'useEffect(() => {\n\t${1:// effect logic}\n\t${2:// cleanup (optional)}\n\treturn () => {\n\t\t${3:// cleanup}\n\t};\n}, [${4:dependencies}]);',
      description: 'React useEffect hook',
      documentation: 'Hook para efectos secundarios en componentes funcionales'
    });

    // Async/Await patterns
    this.addContextualSnippet('asyncFunction', {
      trigger: ['async', 'asyncfunc'],
      context: 'javascript',
      snippet: 'const ${1:functionName} = async (${2:params}) => {\n\ttry {\n\t\t${3:// async operation}\n\t\tconst result = await ${4:asyncCall};\n\t\treturn result;\n\t} catch (error) {\n\t\tconsole.error("Error in ${1}:", error);\n\t\tthrow error;\n\t}\n};',
      description: 'Async function with error handling',
      documentation: 'Función asíncrona con manejo de errores incluido'
    });

    // Fetch API patterns
    this.addContextualSnippet('fetchData', {
      trigger: ['fetch', 'api'],
      context: 'javascript',
      snippet: 'const ${1:fetchData} = async (${2:url}) => {\n\ttry {\n\t\tconst response = await fetch(${2:url});\n\t\t\n\t\tif (!response.ok) {\n\t\t\tthrow new Error(`HTTP error! status: ${response.status}`);\n\t\t}\n\t\t\n\t\tconst data = await response.json();\n\t\treturn data;\n\t} catch (error) {\n\t\tconsole.error("Fetch error:", error);\n\t\tthrow error;\n\t}\n};',
      description: 'Fetch API with error handling',
      documentation: 'Patrón completo para hacer peticiones HTTP con fetch'
    });

    // React Component patterns
    this.addContextualSnippet('reactComponent', {
      trigger: ['component', 'rc'],
      context: 'react',
      snippet: 'import React from "react";\n\nconst ${1:ComponentName} = ({ ${2:props} }) => {\n\t${3:// component logic}\n\t\n\treturn (\n\t\t<div className="${4:component-class}">\n\t\t\t${5:// JSX content}\n\t\t</div>\n\t);\n};\n\nexport default ${1:ComponentName};',
      description: 'React functional component',
      documentation: 'Componente funcional de React con estructura completa'
    });

    // Express route patterns
    this.addContextualSnippet('expressRoute', {
      trigger: ['route', 'express'],
      context: 'nodejs',
      snippet: 'app.${1|get,post,put,delete|}("${2:/api/endpoint}", async (req, res) => {\n\ttry {\n\t\t${3:// route logic}\n\t\tconst result = ${4:await someOperation()};\n\t\t\n\t\tres.status(200).json({\n\t\t\tsuccess: true,\n\t\t\tdata: result\n\t\t});\n\t} catch (error) {\n\t\tconsole.error("Route error:", error);\n\t\tres.status(500).json({\n\t\t\tsuccess: false,\n\t\t\terror: error.message\n\t\t});\n\t}\n});',
      description: 'Express route with error handling',
      documentation: 'Ruta Express con manejo completo de errores y respuestas'
    });

    // Test patterns
    this.addContextualSnippet('testSuite', {
      trigger: ['test', 'describe'],
      context: 'testing',
      snippet: 'describe("${1:Feature or Component}", () => {\n\tbeforeEach(() => {\n\t\t${2:// setup}\n\t});\n\t\n\tafterEach(() => {\n\t\t${3:// cleanup}\n\t});\n\t\n\tit("should ${4:behavior description}", () => {\n\t\t${5:// arrange}\n\t\tconst ${6:input} = ${7:testData};\n\t\t\n\t\t${8:// act}\n\t\tconst result = ${9:functionUnderTest}(${6:input});\n\t\t\n\t\t${10:// assert}\n\t\texpect(result).${11:toBe}(${12:expectedValue});\n\t});\n});',
      description: 'Test suite with setup and teardown',
      documentation: 'Suite de pruebas completa con configuración y limpieza'
    });

    // HTML semantic patterns
    this.addContextualSnippet('semanticHTML', {
      trigger: ['semantic', 'article'],
      context: 'html',
      snippet: '<article class="${1:article-class}">\n\t<header>\n\t\t<h${2:1}>${3:Article Title}</h${2:1}>\n\t\t<p class="meta">\n\t\t\t<time datetime="${4:2024-01-01}">${5:January 1, 2024}</time>\n\t\t\t<span class="author">By ${6:Author Name}</span>\n\t\t</p>\n\t</header>\n\t\n\t<main>\n\t\t${7:Article content}\n\t</main>\n\t\n\t<footer>\n\t\t${8:Article footer}\n\t</footer>\n</article>',
      description: 'Semantic HTML article structure',
      documentation: 'Estructura semántica HTML5 para artículos'
    });
  }

  /**
   * Agrega un snippet contextual
   */
  addContextualSnippet(name, config) {
    this.contextualSnippets.set(name, config);
  }

  /**
   * Obtiene snippets contextuales basados en el contexto actual
   */
  getContextualSnippets(line, language, fileAnalysis, projectAnalysis) {
    const context = this.detectFileContext(fileAnalysis, projectAnalysis);
    const relevantSnippets = [];

    for (const [name, snippet] of this.contextualSnippets) {
      if (this.isSnippetRelevant(snippet, context, language, line)) {
        relevantSnippets.push({
          name,
          ...snippet,
          sortOrder: this.calculateRelevanceScore(snippet, context, line)
        });
      }
    }

    // Ordenar por relevancia
    return relevantSnippets.sort((a, b) => b.sortOrder - a.sortOrder);
  }

  /**
   * Detecta el contexto del archivo actual
   */
  detectFileContext(fileAnalysis, projectAnalysis) {
    const context = {
      isReact: false,
      isNodejs: false,
      isTesting: false,
      isExpress: false,
      hasImports: [],
      frameworks: []
    };

    if (fileAnalysis && fileAnalysis.imports) {
      const importPaths = fileAnalysis.imports.map(imp => imp.modulePath);
      
      context.isReact = importPaths.some(path => 
        path === 'react' || path.startsWith('react/') || path.includes('jsx')
      );
      
      context.isNodejs = importPaths.some(path => 
        path === 'fs' || path === 'path' || path === 'http' || path === 'express'
      );
      
      context.isTesting = importPaths.some(path => 
        path.includes('jest') || path.includes('mocha') || path.includes('chai') || 
        path.includes('test') || path.includes('spec')
      );
      
      context.isExpress = importPaths.some(path => path === 'express');
      
      context.hasImports = importPaths;
    }

    return context;
  }

  /**
   * Determina si un snippet es relevante para el contexto actual
   */
  isSnippetRelevant(snippet, context, language, line) {
    // Verificar lenguaje
    if (snippet.context === 'react' && !context.isReact) return false;
    if (snippet.context === 'nodejs' && !context.isNodejs) return false;
    if (snippet.context === 'testing' && !context.isTesting) return false;
    if (snippet.context === 'html' && language !== 'html') return false;
    
    // Verificar si algún trigger coincide con lo que se está escribiendo
    const lineWords = line.toLowerCase().split(/\s+/);
    return snippet.trigger.some(trigger => 
      lineWords.some(word => word.includes(trigger.toLowerCase()))
    );
  }

  /**
   * Calcula un score de relevancia para ordenar snippets
   */
  calculateRelevanceScore(snippet, context, line) {
    let score = 0;
    
    // Puntuación base por contexto
    if (snippet.context === 'react' && context.isReact) score += 50;
    if (snippet.context === 'nodejs' && context.isNodejs) score += 50;
    if (snippet.context === 'testing' && context.isTesting) score += 50;
    
    // Puntuación por coincidencia de trigger
    const lineWords = line.toLowerCase().split(/\s+/);
    snippet.trigger.forEach(trigger => {
      lineWords.forEach(word => {
        if (word.includes(trigger.toLowerCase())) {
          score += 30;
        }
        if (word === trigger.toLowerCase()) {
          score += 50;
        }
      });
    });
    
    return score;
  }

  /**
   * Genera snippets dinámicos basados en el contexto del proyecto
   */
  generateDynamicSnippets(projectAnalysis) {
    const dynamicSnippets = [];
    
    if (projectAnalysis && projectAnalysis.symbols) {
      // Generar snippets para clases existentes
      const classes = projectAnalysis.symbols.filter(s => s.type === 'class');
      classes.forEach(cls => {
        dynamicSnippets.push({
          name: `new${cls.name}`,
          trigger: [`new${cls.name.toLowerCase()}`, cls.name.toLowerCase()],
          snippet: `const ${cls.name.toLowerCase()} = new ${cls.name}(${this.generateConstructorParams(cls)});`,
          description: `Create new instance of ${cls.name}`,
          documentation: `Crea una nueva instancia de la clase ${cls.name}`,
          sortOrder: 40
        });
      });

      // Generar snippets para funciones existentes
      const functions = projectAnalysis.symbols.filter(s => s.type === 'function');
      functions.forEach(func => {
        if (func.params && func.params.length > 0) {
          const params = func.params.map((p, i) => `\${${i + 1}:${p.name}}`).join(', ');
          dynamicSnippets.push({
            name: `call${func.name}`,
            trigger: [func.name.toLowerCase()],
            snippet: `${func.name}(${params})`,
            description: `Call ${func.name} function`,
            documentation: func.documentation?.description || `Llama a la función ${func.name}`,
            sortOrder: 30
          });
        }
      });
    }
    
    return dynamicSnippets;
  }

  /**
   * Genera parámetros de constructor basados en la clase
   */
  generateConstructorParams(classSymbol) {
    if (classSymbol.methods) {
      const constructor = classSymbol.methods.find(m => m.name === 'constructor');
      if (constructor && constructor.params) {
        return constructor.params.map((p, i) => `\${${i + 1}:${p.name}}`).join(', ');
      }
    }
    return '${1:params}';
  }

  /**
   * Convierte snippets a formato Monaco
   */
  convertToMonacoSnippets(snippets, range) {
    return snippets.map(snippet => ({
      label: snippet.name,
      kind: 27, // monaco.languages.CompletionItemKind.Snippet
      insertText: snippet.snippet,
      insertTextRules: 4, // monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      documentation: {
        value: `**${snippet.description}**\n\n${snippet.documentation}\n\n\`\`\`${snippet.context || 'javascript'}\n${snippet.snippet}\n\`\`\``
      },
      detail: snippet.description,
      sortText: String(1000 - snippet.sortOrder).padStart(4, '0'),
      range
    }));
  }
}
