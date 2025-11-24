/**
 * Sistema de snippets completos para C++, C y C#
 */

export class CppSnippetEngine {
  constructor() {
    this.snippets = new Map();
    this.initializeCppSnippets();
  }

  /**
   * Inicializa todos los snippets de C++/C/C#
   */
  initializeCppSnippets() {
    // ======= C++ SNIPPETS =======
    
    // MAIN Y INCLUDES
    this.addSnippet('cppMain', {
      patterns: ['main', 'cpp main', 'int main'],
      snippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n\t${1:// Your code here}\n\treturn 0;\n}$0',
      description: 'C++ main function',
      detail: 'int main() with iostream',
      priority: 100,
      language: 'cpp'
    });

    this.addSnippet('include', {
      patterns: ['#include', 'include'],
      snippet: '#include <${1:iostream}>$0',
      description: 'include header',
      detail: '#include <header>',
      priority: 95,
      language: 'cpp'
    });

    this.addSnippet('includeVector', {
      patterns: ['include vector', '#include <vector>'],
      snippet: '#include <vector>$0',
      description: 'include vector',
      detail: '#include <vector>',
      priority: 90,
      language: 'cpp'
    });

    this.addSnippet('includeString', {
      patterns: ['include string', '#include <string>'],
      snippet: '#include <string>$0',
      description: 'include string',
      detail: '#include <string>',
      priority: 90,
      language: 'cpp'
    });

    // PRINT Y DEBUG
    this.addSnippet('cout', {
      patterns: ['cout', 'std::cout'],
      snippet: 'cout << ${1:value} << endl;$0',
      description: 'cout statement',
      detail: 'cout << value << endl',
      priority: 100,
      language: 'cpp'
    });

    this.addSnippet('coutString', {
      patterns: ['cout string', 'cout text'],
      snippet: 'cout << "${1:text}" << endl;$0',
      description: 'cout string',
      detail: 'cout << "text" << endl',
      priority: 95,
      language: 'cpp'
    });

    this.addSnippet('cin', {
      patterns: ['cin', 'std::cin'],
      snippet: 'cin >> ${1:variable};$0',
      description: 'cin input',
      detail: 'cin >> variable',
      priority: 95,
      language: 'cpp'
    });

    this.addSnippet('cerr', {
      patterns: ['cerr', 'std::cerr'],
      snippet: 'cerr << "${1:error message}" << endl;$0',
      description: 'cerr error output',
      detail: 'cerr << "error" << endl',
      priority: 85,
      language: 'cpp'
    });

    // VARIABLES Y TIPOS
    this.addSnippet('vector', {
      patterns: ['vector', 'std::vector'],
      snippet: 'vector<${1:int}> ${2:vec} = {${3:1, 2, 3}};$0',
      description: 'vector declaration',
      detail: 'vector<type> vec = {values}',
      priority: 90,
      language: 'cpp'
    });

    this.addSnippet('string', {
      patterns: ['string', 'std::string'],
      snippet: 'string ${1:str} = "${2:value}";$0',
      description: 'string declaration',
      detail: 'string str = "value"',
      priority: 85,
      language: 'cpp'
    });

    this.addSnippet('array', {
      patterns: ['array'],
      snippet: '${1:int} ${2:arr}[${3:size}] = {${4:values}};$0',
      description: 'array declaration',
      detail: 'type arr[size] = {values}',
      priority: 85,
      language: 'cpp'
    });

    this.addSnippet('const', {
      patterns: ['const'],
      snippet: 'const ${1:int} ${2:CONSTANT} = ${3:value};$0',
      description: 'const variable',
      detail: 'const type CONSTANT = value',
      priority: 80,
      language: 'cpp'
    });

    // ESTRUCTURAS DE CONTROL
    this.addSnippet('if', {
      patterns: ['if'],
      snippet: 'if (${1:condition}) {\n\t${2:// if block}\n}$0',
      description: 'if statement',
      detail: 'if (condition) { }',
      priority: 95,
      language: 'cpp'
    });

    this.addSnippet('ifelse', {
      patterns: ['if else', 'ifelse'],
      snippet: 'if (${1:condition}) {\n\t${2:// if block}\n} else {\n\t${3:// else block}\n}$0',
      description: 'if-else statement',
      detail: 'if (condition) { } else { }',
      priority: 90,
      language: 'cpp'
    });

    this.addSnippet('for', {
      patterns: ['for'],
      snippet: 'for (int ${1:i} = ${2:0}; ${1:i} < ${3:n}; ${1:i}++) {\n\t${4:// loop body}\n}$0',
      description: 'for loop',
      detail: 'for (int i = 0; i < n; i++)',
      priority: 95,
      language: 'cpp'
    });

    this.addSnippet('forRange', {
      patterns: ['for range', 'range-based for'],
      snippet: 'for (${1:auto} ${2:item} : ${3:container}) {\n\t${4:// loop body}\n}$0',
      description: 'range-based for loop',
      detail: 'for (auto item : container)',
      priority: 90,
      language: 'cpp'
    });

    this.addSnippet('while', {
      patterns: ['while'],
      snippet: 'while (${1:condition}) {\n\t${2:// loop body}\n}$0',
      description: 'while loop',
      detail: 'while (condition) { }',
      priority: 85,
      language: 'cpp'
    });

    this.addSnippet('dowhile', {
      patterns: ['do while', 'dowhile'],
      snippet: 'do {\n\t${1:// loop body}\n} while (${2:condition});$0',
      description: 'do-while loop',
      detail: 'do { } while (condition)',
      priority: 80,
      language: 'cpp'
    });

    this.addSnippet('switch', {
      patterns: ['switch'],
      snippet: 'switch (${1:expression}) {\n\tcase ${2:value1}:\n\t\t${3:// case 1}\n\t\tbreak;\n\tcase ${4:value2}:\n\t\t${5:// case 2}\n\t\tbreak;\n\tdefault:\n\t\t${6:// default case}\n\t\tbreak;\n}$0',
      description: 'switch statement',
      detail: 'switch (expression) { case: break; }',
      priority: 85,
      language: 'cpp'
    });

    // FUNCIONES
    this.addSnippet('function', {
      patterns: ['function', 'func'],
      snippet: '${1:int} ${2:functionName}(${3:parameters}) {\n\t${4:// function body}\n\treturn ${5:value};\n}$0',
      description: 'function definition',
      detail: 'type functionName(params) { }',
      priority: 90,
      language: 'cpp'
    });

    this.addSnippet('voidFunction', {
      patterns: ['void function', 'void'],
      snippet: 'void ${1:functionName}(${2:parameters}) {\n\t${3:// function body}\n}$0',
      description: 'void function',
      detail: 'void functionName(params) { }',
      priority: 85,
      language: 'cpp'
    });

    // CLASES Y POO
    this.addSnippet('class', {
      patterns: ['class'],
      snippet: 'class ${1:ClassName} {\nprivate:\n\t${2:// private members}\n\npublic:\n\t${1:ClassName}() {\n\t\t${3:// constructor}\n\t}\n\t\n\t~${1:ClassName}() {\n\t\t${4:// destructor}\n\t}\n\t\n\t${5:// public methods}\n};$0',
      description: 'class definition',
      detail: 'class ClassName { private: public: }',
      priority: 85,
      language: 'cpp'
    });

    this.addSnippet('struct', {
      patterns: ['struct'],
      snippet: 'struct ${1:StructName} {\n\t${2:int member1};\n\t${3:string member2};\n\t\n\t${1:StructName}(${4:parameters}) : ${2:member1}(${5:value}), ${3:member2}(${6:value}) {}\n};$0',
      description: 'struct definition',
      detail: 'struct StructName { members }',
      priority: 80,
      language: 'cpp'
    });

    // MANEJO DE MEMORIA
    this.addSnippet('new', {
      patterns: ['new'],
      snippet: '${1:int}* ${2:ptr} = new ${1:int}(${3:value});\n// Don\'t forget: delete ${2:ptr};$0',
      description: 'dynamic memory allocation',
      detail: 'type* ptr = new type(value)',
      priority: 80,
      language: 'cpp'
    });

    this.addSnippet('smartPointer', {
      patterns: ['unique_ptr', 'smart pointer'],
      snippet: 'unique_ptr<${1:int}> ${2:ptr} = make_unique<${1:int}>(${3:value});$0',
      description: 'unique_ptr smart pointer',
      detail: 'unique_ptr<type> ptr = make_unique<type>()',
      priority: 85,
      language: 'cpp'
    });

    // TRY-CATCH
    this.addSnippet('try', {
      patterns: ['try', 'try catch'],
      snippet: 'try {\n\t${1:// try block}\n} catch (const ${2:exception}& ${3:e}) {\n\t${4:cerr << "Error: " << e.what() << endl;}\n}$0',
      description: 'try-catch block',
      detail: 'try { } catch (exception& e) { }',
      priority: 85,
      language: 'cpp'
    });

    // ======= C SNIPPETS =======
    
    this.addSnippet('cMain', {
      patterns: ['c main', 'main c'],
      snippet: '#include <stdio.h>\n\nint main() {\n\t${1:// Your code here}\n\treturn 0;\n}$0',
      description: 'C main function',
      detail: 'int main() with stdio.h',
      priority: 100,
      language: 'c'
    });

    this.addSnippet('printf', {
      patterns: ['printf'],
      snippet: 'printf("${1:format}", ${2:args});$0',
      description: 'printf statement',
      detail: 'printf("format", args)',
      priority: 100,
      language: 'c'
    });

    this.addSnippet('scanf', {
      patterns: ['scanf'],
      snippet: 'scanf("${1:format}", &${2:variable});$0',
      description: 'scanf input',
      detail: 'scanf("format", &variable)',
      priority: 95,
      language: 'c'
    });

    this.addSnippet('malloc', {
      patterns: ['malloc'],
      snippet: '${1:int}* ${2:ptr} = (${1:int}*)malloc(${3:size} * sizeof(${1:int}));\nif (${2:ptr} == NULL) {\n\tfprintf(stderr, "Memory allocation failed\\n");\n\texit(1);\n}\n// Don\'t forget: free(${2:ptr});$0',
      description: 'malloc memory allocation',
      detail: 'ptr = malloc(size * sizeof(type))',
      priority: 85,
      language: 'c'
    });

    // ======= C# SNIPPETS =======
    
    this.addSnippet('csMain', {
      patterns: ['c# main', 'csharp main'],
      snippet: 'using System;\n\nnamespace ${1:ProgramName}\n{\n\tclass Program\n\t{\n\t\tstatic void Main(string[] args)\n\t\t{\n\t\t\t${2:// Your code here}\n\t\t}\n\t}\n}$0',
      description: 'C# main method',
      detail: 'C# main with namespace and class',
      priority: 100,
      language: 'csharp'
    });

    this.addSnippet('console', {
      patterns: ['Console.WriteLine', 'console'],
      snippet: 'Console.WriteLine(${1:value});$0',
      description: 'Console.WriteLine',
      detail: 'Console.WriteLine(value)',
      priority: 100,
      language: 'csharp'
    });

    this.addSnippet('consoleRead', {
      patterns: ['Console.ReadLine', 'readLine'],
      snippet: 'string ${1:input} = Console.ReadLine();$0',
      description: 'Console.ReadLine',
      detail: 'string input = Console.ReadLine()',
      priority: 95,
      language: 'csharp'
    });

    this.addSnippet('csClass', {
      patterns: ['c# class', 'csharp class'],
      snippet: 'public class ${1:ClassName}\n{\n\t${2:// Fields}\n\tprivate ${3:string} ${4:field};\n\t\n\t${5:// Constructor}\n\tpublic ${1:ClassName}(${6:parameters})\n\t{\n\t\t${7:// Constructor body}\n\t}\n\t\n\t${8:// Methods}\n\tpublic ${9:void} ${10:MethodName}(${11:parameters})\n\t{\n\t\t${12:// Method body}\n\t}\n}$0',
      description: 'C# class definition',
      detail: 'public class ClassName { }',
      priority: 90,
      language: 'csharp'
    });

    this.addSnippet('csProperty', {
      patterns: ['c# property', 'property'],
      snippet: 'public ${1:string} ${2:PropertyName} { get; set; }$0',
      description: 'C# auto-property',
      detail: 'public type PropertyName { get; set; }',
      priority: 85,
      language: 'csharp'
    });

    this.addSnippet('csList', {
      patterns: ['List<>', 'c# list'],
      snippet: 'List<${1:string}> ${2:list} = new List<${1:string}>();$0',
      description: 'C# List declaration',
      detail: 'List<type> list = new List<type>()',
      priority: 85,
      language: 'csharp'
    });

    this.addSnippet('csArray', {
      patterns: ['c# array', 'csharp array'],
      snippet: '${1:string}[] ${2:array} = new ${1:string}[${3:size}];$0',
      description: 'C# array declaration',
      detail: 'type[] array = new type[size]',
      priority: 80,
      language: 'csharp'
    });

    this.addSnippet('csTryCatch', {
      patterns: ['c# try', 'csharp try'],
      snippet: 'try\n{\n\t${1:// try block}\n}\ncatch (${2:Exception} ${3:ex})\n{\n\t${4:Console.WriteLine($"Error: {ex.Message}");}\n}$0',
      description: 'C# try-catch block',
      detail: 'try { } catch (Exception ex) { }',
      priority: 85,
      language: 'csharp'
    });
  }

  /**
   * Agrega un snippet
   */
  addSnippet(name, config) {
    this.snippets.set(name, config);
  }

  /**
   * Obtiene sugerencias basadas en input y lenguaje
   */
  getSnippetSuggestions(input, language = 'cpp') {
    const suggestions = [];
    const inputLower = input.toLowerCase().trim();
    
    for (const [name, snippet] of this.snippets) {
      // Filtrar por lenguaje
      if (snippet.language && snippet.language !== language) {
        continue;
      }
      
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

    return suggestions.sort((a, b) => {
      const scoreA = a.matchScore + (a.priority || 0);
      const scoreB = b.matchScore + (b.priority || 0);
      return scoreB - scoreA;
    });
  }

  /**
   * Calcula score de coincidencia
   */
  calculateMatchScore(input, patterns) {
    let maxScore = 0;
    
    patterns.forEach(pattern => {
      const patternLower = pattern.toLowerCase();
      let score = 0;
      
      if (input === patternLower) {
        score = 100;
      } else if (patternLower.startsWith(input)) {
        score = 80 + (input.length / patternLower.length) * 20;
      } else if (patternLower.includes(input)) {
        score = 60 + (input.length / patternLower.length) * 15;
      }
      
      maxScore = Math.max(maxScore, score);
    });
    
    return maxScore;
  }

  /**
   * Convierte a formato Monaco
   */
  convertToMonacoSuggestions(suggestions, range, language) {
    return suggestions.map((suggestion, index) => ({
      label: {
        label: suggestion.patterns[0],
        description: suggestion.description
      },
      kind: 27, // Snippet
      insertText: suggestion.snippet,
      insertTextRules: 4, // InsertAsSnippet
      documentation: {
        value: `**${suggestion.description}**\n\n${suggestion.detail}\n\n\`\`\`${language}\n${suggestion.snippet.replace(/\$\{?\d+:?([^}]*)\}?/g, '$1').replace(/\$0/g, '')}\n\`\`\``
      },
      detail: suggestion.detail,
      sortText: String(1000 - (suggestion.matchScore + (suggestion.priority || 0))).padStart(4, '0'),
      range,
      preselect: index === 0,
      commitCharacters: ['.', '(', ' ', '\t']
    }));
  }
}
