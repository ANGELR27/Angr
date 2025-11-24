/**
 * Sistema universal de snippets para TODOS los lenguajes soportados
 * Integra JavaScript, Python, Java, C++/C/C#, PHP, Ruby, Go, Rust, Swift, Kotlin, SQL, Shell, PowerShell, Batch
 */

import { AdvancedSnippetEngine } from './advancedSnippets.js';
import { PythonSnippetEngine } from './pythonSnippets.js';
import { JavaSnippetEngine } from './javaSnippets.js';
import { CppSnippetEngine } from './cppSnippets.js';
import { MultiLanguageSnippetEngine } from './multiLanguageSnippets.js';
import { ScriptingSnippetEngine } from './scriptingSnippets.js';

export class UniversalSnippetEngine {
  constructor() {
    this.engines = {
      javascript: new AdvancedSnippetEngine(),
      python: new PythonSnippetEngine(),
      java: new JavaSnippetEngine(),
      cpp: new CppSnippetEngine(),
      multiLang: new MultiLanguageSnippetEngine(),
      scripting: new ScriptingSnippetEngine()
    };
    
    // Mapeo de extensiones a lenguajes y engines
    this.languageMap = {
      // JavaScript/TypeScript/React
      'javascript': { engine: 'javascript', language: 'javascript' },
      'typescript': { engine: 'javascript', language: 'typescript' },
      'jsx': { engine: 'javascript', language: 'javascript' },
      'tsx': { engine: 'javascript', language: 'typescript' },
      
      // Python
      'python': { engine: 'python', language: 'python' },
      
      // Java
      'java': { engine: 'java', language: 'java' },
      
      // C/C++/C#
      'cpp': { engine: 'cpp', language: 'cpp' },
      'c': { engine: 'cpp', language: 'c' },
      'csharp': { engine: 'cpp', language: 'csharp' },
      
      // PHP
      'php': { engine: 'multiLang', language: 'php' },
      
      // Ruby
      'ruby': { engine: 'multiLang', language: 'ruby' },
      
      // Go
      'go': { engine: 'multiLang', language: 'go' },
      
      // Rust
      'rust': { engine: 'multiLang', language: 'rust' },
      
      // Swift
      'swift': { engine: 'multiLang', language: 'swift' },
      
      // Kotlin
      'kotlin': { engine: 'multiLang', language: 'kotlin' },
      
      // SQL
      'sql': { engine: 'scripting', language: 'sql' },
      
      // Shell
      'sh': { engine: 'scripting', language: 'sh' },
      'bash': { engine: 'scripting', language: 'sh' },
      
      // PowerShell
      'powershell': { engine: 'scripting', language: 'powershell' },
      'ps1': { engine: 'scripting', language: 'powershell' },
      
      // Batch
      'bat': { engine: 'scripting', language: 'batch' },
      'batch': { engine: 'scripting', language: 'batch' }
    };
  }

  /**
   * Obtiene sugerencias universales para cualquier lenguaje
   */
  getUniversalSuggestions(input, language, range) {
    const languageConfig = this.languageMap[language];
    
    if (!languageConfig) {
      // Fallback a JavaScript si no se encuentra el lenguaje
      languageConfig = { engine: 'javascript', language: 'javascript' };
    }
    
    const engine = this.engines[languageConfig.engine];
    let suggestions = [];
    
    try {
      // Obtener sugerencias del engine específico
      if (engine.getSnippetSuggestions) {
        // Para engines que usan getSnippetSuggestions (Python, Java, etc.)
        suggestions = engine.getSnippetSuggestions(input, languageConfig.language);
        return this.convertToMonacoFormat(suggestions, range, languageConfig.language);
      } else if (engine.getBlockSuggestions) {
        // Para JavaScript/AdvancedSnippetEngine que usa getBlockSuggestions
        suggestions = engine.getBlockSuggestions(input, languageConfig.language);
        return this.convertAdvancedToMonaco(suggestions, range);
      }
    } catch (error) {
      console.warn(`Error getting suggestions for ${language}:`, error);
      // Fallback a sugerencias básicas
      return this.getBasicSuggestions(input, language, range);
    }
    
    return [];
  }

  /**
   * Convierte sugerencias al formato Monaco
   */
  convertToMonacoFormat(suggestions, range, language) {
    return suggestions.map((suggestion, index) => ({
      label: {
        label: suggestion.patterns ? suggestion.patterns[0] : suggestion.name,
        description: suggestion.description
      },
      kind: 27, // monaco.languages.CompletionItemKind.Snippet
      insertText: suggestion.snippet,
      insertTextRules: 4, // monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      documentation: {
        value: `**${suggestion.description}**\n\n${suggestion.detail}\n\n\`\`\`${language}\n${this.cleanSnippet(suggestion.snippet)}\n\`\`\``
      },
      detail: suggestion.detail,
      sortText: String(1000 - (suggestion.matchScore + (suggestion.priority || 0))).padStart(4, '0'),
      range,
      preselect: index === 0,
      commitCharacters: ['.', '(', ' ', '\t'],
      command: {
        id: 'editor.action.triggerSuggest',
        title: 'Re-trigger completions...'
      }
    }));
  }

  /**
   * Convierte sugerencias avanzadas (JavaScript) al formato Monaco
   */
  convertAdvancedToMonaco(suggestions, range) {
    return suggestions.map((suggestion, index) => ({
      label: {
        label: suggestion.patterns[0],
        description: suggestion.description
      },
      kind: 27, // Snippet
      insertText: suggestion.snippet,
      insertTextRules: 4, // InsertAsSnippet
      documentation: {
        value: `**${suggestion.description}**\n\n${suggestion.detail}\n\n\`\`\`javascript\n${this.cleanSnippet(suggestion.snippet)}\n\`\`\``
      },
      detail: suggestion.detail,
      sortText: String(1000 - (suggestion.matchScore + (suggestion.priority || 0))).padStart(4, '0'),
      range,
      preselect: index === 0,
      commitCharacters: ['.', '(', ' ', '\t']
    }));
  }

  /**
   * Limpia el snippet para documentación
   */
  cleanSnippet(snippet) {
    return snippet
      .replace(/\$\{?\d+:?([^}]*)\}?/g, '$1')
      .replace(/\$\d+/g, '')
      .replace(/\$0/g, '');
  }

  /**
   * Sugerencias básicas de fallback
   */
  getBasicSuggestions(input, language, range) {
    const basicSnippets = {
      python: [
        {
          label: 'print',
          insertText: 'print(${1:value})',
          description: 'print statement',
          detail: 'print(value)'
        }
      ],
      java: [
        {
          label: 'sout',
          insertText: 'System.out.println(${1:value});',
          description: 'System.out.println',
          detail: 'System.out.println(value)'
        }
      ],
      cpp: [
        {
          label: 'cout',
          insertText: 'cout << ${1:value} << endl;',
          description: 'cout statement',
          detail: 'cout << value << endl'
        }
      ]
    };

    const snippets = basicSnippets[language] || [];
    return snippets
      .filter(snippet => 
        snippet.label.toLowerCase().includes(input.toLowerCase()) ||
        input.toLowerCase().includes(snippet.label.toLowerCase())
      )
      .map((snippet, index) => ({
        label: {
          label: snippet.label,
          description: snippet.description
        },
        kind: 27,
        insertText: snippet.insertText,
        insertTextRules: 4,
        documentation: {
          value: `**${snippet.description}**\n\n${snippet.detail}\n\n\`\`\`${language}\n${this.cleanSnippet(snippet.insertText)}\n\`\`\``
        },
        detail: snippet.detail,
        sortText: String(100 + index).padStart(4, '0'),
        range,
        preselect: index === 0
      }));
  }

  /**
   * Detecta el lenguaje basándose en la extensión del archivo
   */
  detectLanguageFromPath(filePath) {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    const extensionMap = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'cc': 'cpp',
      'cxx': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'kts': 'kotlin',
      'sql': 'sql',
      'sh': 'sh',
      'bash': 'sh',
      'ps1': 'powershell',
      'bat': 'batch',
      'cmd': 'batch'
    };

    return extensionMap[extension] || 'javascript';
  }

  /**
   * Verifica si un lenguaje está soportado
   */
  isSupportedLanguage(language) {
    return this.languageMap.hasOwnProperty(language);
  }

  /**
   * Obtiene todos los lenguajes soportados
   */
  getSupportedLanguages() {
    return Object.keys(this.languageMap);
  }

  /**
   * Obtiene estadísticas de snippets por lenguaje
   */
  getSnippetStats() {
    const stats = {};
    
    for (const [language, config] of Object.entries(this.languageMap)) {
      const engine = this.engines[config.engine];
      let count = 0;
      
      if (engine.snippets) {
        count = engine.snippets.size;
      } else if (engine.blockSnippets) {
        count = engine.blockSnippets.size;
      }
      
      stats[language] = {
        engine: config.engine,
        snippetCount: count
      };
    }
    
    return stats;
  }

  /**
   * Método de utilidad para debugging
   */
  debugLanguageSupport() {
    console.log('🚀 Universal Snippets - Lenguajes soportados:');
    const stats = this.getSnippetStats();
    
    for (const [language, info] of Object.entries(stats)) {
      console.log(`  ${language}: ${info.snippetCount} snippets (engine: ${info.engine})`);
    }
    
    console.log(`\nTotal: ${Object.keys(stats).length} lenguajes soportados`);
    return stats;
  }
}
