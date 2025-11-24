/**
 * Sistema de snippets completos para Python
 */

export class PythonSnippetEngine {
  constructor() {
    this.snippets = new Map();
    this.initializePythonSnippets();
  }

  /**
   * Inicializa todos los snippets de Python
   */
  initializePythonSnippets() {
    // ======= PRINT Y DEBUG =======
    this.addSnippet('print', {
      patterns: ['print', 'pr'],
      snippet: 'print(${1:value})$0',
      description: 'print statement',
      detail: 'print(value)',
      priority: 100
    });

    this.addSnippet('printf', {
      patterns: ['printf', 'prf'],
      snippet: 'print(f"${1:text} {${2:variable}}")$0',
      description: 'print f-string',
      detail: 'print(f"text {variable}")',
      priority: 95
    });

    this.addSnippet('pprint', {
      patterns: ['pprint', 'pp'],
      snippet: 'import pprint\npprint.pprint(${1:data})$0',
      description: 'pretty print',
      detail: 'pprint.pprint(data)',
      priority: 90
    });

    // ======= VARIABLES Y TIPOS =======
    this.addSnippet('input', {
      patterns: ['input', 'inp'],
      snippet: '${1:variable} = input("${2:Enter value}: ")$0',
      description: 'input prompt',
      detail: 'variable = input("prompt")',
      priority: 95
    });

    this.addSnippet('inputInt', {
      patterns: ['int(input', 'inputint'],
      snippet: '${1:number} = int(input("${2:Enter number}: "))$0',
      description: 'integer input',
      detail: 'number = int(input("prompt"))',
      priority: 93
    });

    this.addSnippet('inputFloat', {
      patterns: ['float(input', 'inputfloat'],
      snippet: '${1:number} = float(input("${2:Enter number}: "))$0',
      description: 'float input',
      detail: 'number = float(input("prompt"))',
      priority: 90
    });

    // ======= ESTRUCTURAS DE CONTROL =======
    this.addSnippet('if', {
      patterns: ['if'],
      snippet: 'if ${1:condition}:\n    ${2:pass}$0',
      description: 'if statement',
      detail: 'if condition:',
      priority: 95
    });

    this.addSnippet('ifelse', {
      patterns: ['ifelse', 'ife'],
      snippet: 'if ${1:condition}:\n    ${2:pass}\nelse:\n    ${3:pass}$0',
      description: 'if-else statement',
      detail: 'if condition: else:',
      priority: 93
    });

    this.addSnippet('elif', {
      patterns: ['elif', 'elseif'],
      snippet: 'elif ${1:condition}:\n    ${2:pass}$0',
      description: 'elif statement',
      detail: 'elif condition:',
      priority: 90
    });

    this.addSnippet('for', {
      patterns: ['for'],
      snippet: 'for ${1:item} in ${2:iterable}:\n    ${3:pass}$0',
      description: 'for loop',
      detail: 'for item in iterable:',
      priority: 95
    });

    this.addSnippet('forRange', {
      patterns: ['for range', 'forr', 'range'],
      snippet: 'for ${1:i} in range(${2:start}, ${3:stop}):\n    ${4:pass}$0',
      description: 'for range loop',
      detail: 'for i in range(start, stop):',
      priority: 93
    });

    this.addSnippet('forEnumerate', {
      patterns: ['for enumerate', 'fore', 'enumerate'],
      snippet: 'for ${1:i}, ${2:item} in enumerate(${3:iterable}):\n    ${4:pass}$0',
      description: 'for enumerate loop',
      detail: 'for i, item in enumerate(iterable):',
      priority: 90
    });

    this.addSnippet('while', {
      patterns: ['while'],
      snippet: 'while ${1:condition}:\n    ${2:pass}$0',
      description: 'while loop',
      detail: 'while condition:',
      priority: 90
    });

    // ======= FUNCIONES =======
    this.addSnippet('def', {
      patterns: ['def', 'function'],
      snippet: 'def ${1:function_name}(${2:parameters}):\n    """${3:Description}"""\n    ${4:pass}\n    return ${5:None}$0',
      description: 'function definition',
      detail: 'def function_name(parameters):',
      priority: 95
    });

    this.addSnippet('defMain', {
      patterns: ['def main', 'main'],
      snippet: 'def main():\n    """Main function"""\n    ${1:pass}\n\nif __name__ == "__main__":\n    main()$0',
      description: 'main function with if __name__',
      detail: 'def main() with if __name__',
      priority: 90
    });

    this.addSnippet('lambda', {
      patterns: ['lambda', 'lam'],
      snippet: 'lambda ${1:x}: ${2:x + 1}$0',
      description: 'lambda function',
      detail: 'lambda x: expression',
      priority: 85
    });

    // ======= CLASES =======
    this.addSnippet('class', {
      patterns: ['class'],
      snippet: 'class ${1:ClassName}:\n    """${2:Class description}"""\n    \n    def __init__(self, ${3:parameters}):\n        """Initialize instance"""\n        ${4:pass}\n    \n    def ${5:method_name}(self, ${6:parameters}):\n        """${7:Method description}"""\n        ${8:pass}$0',
      description: 'class definition',
      detail: 'class ClassName: with __init__',
      priority: 90
    });

    this.addSnippet('classInherit', {
      patterns: ['class inherit', 'inherit'],
      snippet: 'class ${1:ChildClass}(${2:ParentClass}):\n    """${3:Child class description}"""\n    \n    def __init__(self, ${4:parameters}):\n        super().__init__(${5:parent_parameters})\n        ${6:pass}$0',
      description: 'class with inheritance',
      detail: 'class Child(Parent): with super()',
      priority: 85
    });

    this.addSnippet('init', {
      patterns: ['__init__', 'init'],
      snippet: 'def __init__(self, ${1:parameters}):\n    """Initialize instance"""\n    ${2:pass}$0',
      description: '__init__ method',
      detail: 'def __init__(self, params):',
      priority: 90
    });

    // ======= EXCEPCIONES =======
    this.addSnippet('try', {
      patterns: ['try', 'trycatch'],
      snippet: 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    print(f"Error: {${3:e}}")$0',
      description: 'try-except block',
      detail: 'try: except Exception as e:',
      priority: 90
    });

    this.addSnippet('tryFinally', {
      patterns: ['try finally', 'tryf'],
      snippet: 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    print(f"Error: {${3:e}}")\nfinally:\n    ${4:pass}$0',
      description: 'try-except-finally block',
      detail: 'try: except: finally:',
      priority: 85
    });

    this.addSnippet('raise', {
      patterns: ['raise', 'throw'],
      snippet: 'raise ${1:ValueError}("${2:error message}")$0',
      description: 'raise exception',
      detail: 'raise Exception("message")',
      priority: 80
    });

    // ======= LISTAS Y DICCIONARIOS =======
    this.addSnippet('listComp', {
      patterns: ['list comprehension', 'listcomp', 'lc'],
      snippet: '[${1:expression} for ${2:item} in ${3:iterable} if ${4:condition}]$0',
      description: 'list comprehension',
      detail: '[expr for item in iterable if condition]',
      priority: 88
    });

    this.addSnippet('dictComp', {
      patterns: ['dict comprehension', 'dictcomp', 'dc'],
      snippet: '{${1:key}: ${2:value} for ${3:item} in ${4:iterable} if ${5:condition}}$0',
      description: 'dict comprehension',
      detail: '{key: value for item in iterable if condition}',
      priority: 85
    });

    this.addSnippet('setComp', {
      patterns: ['set comprehension', 'setcomp', 'sc'],
      snippet: '{${1:expression} for ${2:item} in ${3:iterable} if ${4:condition}}$0',
      description: 'set comprehension',
      detail: '{expr for item in iterable if condition}',
      priority: 80
    });

    // ======= ARCHIVOS =======
    this.addSnippet('open', {
      patterns: ['open', 'file'],
      snippet: 'with open("${1:filename}", "${2:r}") as ${3:file}:\n    ${4:content} = ${3:file}.read()\n    print(${4:content})$0',
      description: 'open file with context manager',
      detail: 'with open(filename, mode) as file:',
      priority: 90
    });

    this.addSnippet('openWrite', {
      patterns: ['open write', 'write file'],
      snippet: 'with open("${1:filename}", "w") as ${2:file}:\n    ${2:file}.write("${3:content}")$0',
      description: 'write to file',
      detail: 'with open(filename, "w") as file:',
      priority: 88
    });

    this.addSnippet('openRead', {
      patterns: ['open read', 'read file'],
      snippet: 'with open("${1:filename}", "r") as ${2:file}:\n    ${3:lines} = ${2:file}.readlines()\n    for ${4:line} in ${3:lines}:\n        print(${4:line}.strip())$0',
      description: 'read file lines',
      detail: 'with open(filename, "r") as file:',
      priority: 85
    });

    // ======= IMPORTS =======
    this.addSnippet('import', {
      patterns: ['import'],
      snippet: 'import ${1:module}$0',
      description: 'import module',
      detail: 'import module',
      priority: 85
    });

    this.addSnippet('importFrom', {
      patterns: ['from import', 'fromimp'],
      snippet: 'from ${1:module} import ${2:function}$0',
      description: 'from module import',
      detail: 'from module import function',
      priority: 85
    });

    this.addSnippet('importAs', {
      patterns: ['import as', 'importas'],
      snippet: 'import ${1:module} as ${2:alias}$0',
      description: 'import module as alias',
      detail: 'import module as alias',
      priority: 80
    });

    // ======= LIBRERÍAS COMUNES =======
    this.addSnippet('requests', {
      patterns: ['requests', 'req'],
      snippet: 'import requests\n\n${1:response} = requests.get("${2:url}")\nif ${1:response}.status_code == 200:\n    ${3:data} = ${1:response}.json()\n    print(${3:data})\nelse:\n    print(f"Error: {${1:response}.status_code}")$0',
      description: 'requests HTTP GET',
      detail: 'requests.get(url) with error handling',
      priority: 85
    });

    this.addSnippet('json', {
      patterns: ['json'],
      snippet: 'import json\n\n${1:data} = json.loads(\'${2:{"key": "value"}}\')\nprint(${1:data})\n\n${3:json_string} = json.dumps(${1:data}, indent=2)\nprint(${3:json_string})$0',
      description: 'JSON parse and stringify',
      detail: 'json.loads() and json.dumps()',
      priority: 85
    });

    this.addSnippet('datetime', {
      patterns: ['datetime', 'date', 'time'],
      snippet: 'from datetime import datetime, date\n\n${1:now} = datetime.now()\nprint(f"Current time: {${1:now}}")\n\n${2:today} = date.today()\nprint(f"Today: {${2:today}}")$0',
      description: 'datetime usage',
      detail: 'datetime.now() and date.today()',
      priority: 80
    });

    this.addSnippet('os', {
      patterns: ['os', 'operating system'],
      snippet: 'import os\n\n# Get current directory\n${1:current_dir} = os.getcwd()\nprint(f"Current directory: {${1:current_dir}}")\n\n# List directory contents\n${2:files} = os.listdir(".")\nfor ${3:file} in ${2:files}:\n    print(${3:file})$0',
      description: 'os module usage',
      detail: 'os.getcwd() and os.listdir()',
      priority: 75
    });

    this.addSnippet('sys', {
      patterns: ['sys', 'system'],
      snippet: 'import sys\n\n# Command line arguments\n${1:args} = sys.argv[1:]\nprint(f"Arguments: {${1:args}}")\n\n# Exit program\n# sys.exit(0)$0',
      description: 'sys module usage',
      detail: 'sys.argv and sys.exit()',
      priority: 75
    });

    // ======= GENERADORES Y DECORADORES =======
    this.addSnippet('generator', {
      patterns: ['generator', 'yield'],
      snippet: 'def ${1:generator_name}(${2:parameters}):\n    """${3:Generator description}"""\n    for ${4:item} in ${5:iterable}:\n        yield ${6:item}$0',
      description: 'generator function',
      detail: 'def generator(): yield item',
      priority: 80
    });

    this.addSnippet('decorator', {
      patterns: ['decorator', 'deco'],
      snippet: 'def ${1:decorator_name}(func):\n    """${2:Decorator description}"""\n    def wrapper(*args, **kwargs):\n        # Before function call\n        ${3:print(f"Calling {func.__name__}")}\n        result = func(*args, **kwargs)\n        # After function call\n        ${4:print(f"Finished {func.__name__}")}\n        return result\n    return wrapper$0',
      description: 'decorator function',
      detail: 'def decorator(func): def wrapper():',
      priority: 75
    });

    // ======= TESTING =======
    this.addSnippet('unittest', {
      patterns: ['unittest', 'test'],
      snippet: 'import unittest\n\nclass Test${1:ClassName}(unittest.TestCase):\n    def setUp(self):\n        """Set up test fixtures before each test method."""\n        ${2:pass}\n    \n    def tearDown(self):\n        """Tear down test fixtures after each test method."""\n        ${3:pass}\n    \n    def test_${4:method_name}(self):\n        """${5:Test description}"""\n        ${6:# Arrange}\n        ${7:expected} = ${8:value}\n        \n        ${9:# Act}\n        ${10:result} = ${11:function_to_test()}\n        \n        ${12:# Assert}\n        self.assertEqual(${10:result}, ${7:expected})\n\nif __name__ == "__main__":\n    unittest.main()$0',
      description: 'unittest test class',
      detail: 'unittest.TestCase with setUp/tearDown',
      priority: 80
    });

    this.addSnippet('assert', {
      patterns: ['assert'],
      snippet: 'assert ${1:condition}, "${2:error message}"$0',
      description: 'assert statement',
      detail: 'assert condition, "message"',
      priority: 75
    });

    // ======= ASYNC/AWAIT =======
    this.addSnippet('async', {
      patterns: ['async', 'asyncio'],
      snippet: 'import asyncio\n\nasync def ${1:async_function}(${2:parameters}):\n    """${3:Async function description}"""\n    ${4:await asyncio.sleep(1)}\n    return ${5:result}\n\n# Run async function\n# asyncio.run(${1:async_function}())$0',
      description: 'async function',
      detail: 'async def function(): await',
      priority: 80
    });

    this.addSnippet('await', {
      patterns: ['await'],
      snippet: '${1:result} = await ${2:async_function}(${3:parameters})$0',
      description: 'await statement',
      detail: 'result = await async_function()',
      priority: 75
    });

    // ======= REGEX =======
    this.addSnippet('re', {
      patterns: ['re', 'regex'],
      snippet: 'import re\n\n${1:pattern} = r"${2:regex_pattern}"\n${3:text} = "${4:text_to_search}"\n\n${5:match} = re.search(${1:pattern}, ${3:text})\nif ${5:match}:\n    print(f"Found: {${5:match}.group()}")\nelse:\n    print("No match found")$0',
      description: 'regex pattern matching',
      detail: 're.search(pattern, text)',
      priority: 75
    });

    // ======= MATH =======
    this.addSnippet('math', {
      patterns: ['math'],
      snippet: 'import math\n\n${1:result} = math.${2|sqrt,ceil,floor,sin,cos,tan,log|}(${3:value})\nprint(f"Result: {${1:result}}")$0',
      description: 'math module usage',
      detail: 'math.function(value)',
      priority: 75
    });

    this.addSnippet('random', {
      patterns: ['random', 'rand'],
      snippet: 'import random\n\n# Random integer\n${1:rand_int} = random.randint(${2:1}, ${3:10})\nprint(f"Random integer: {${1:rand_int}}")\n\n# Random choice\n${4:items} = [${5:"a", "b", "c"}]\n${6:choice} = random.choice(${4:items})\nprint(f"Random choice: {${6:choice}}")$0',
      description: 'random module usage',
      detail: 'random.randint() and random.choice()',
      priority: 75
    });
  }

  /**
   * Agrega un snippet
   */
  addSnippet(name, config) {
    this.snippets.set(name, { ...config, language: 'python' });
  }

  /**
   * Obtiene sugerencias de Python basadas en input
   */
  getSnippetSuggestions(input) {
    const suggestions = [];
    const inputLower = input.toLowerCase().trim();
    
    for (const [name, snippet] of this.snippets) {
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
  convertToMonacoSuggestions(suggestions, range) {
    return suggestions.map((suggestion, index) => ({
      label: {
        label: suggestion.patterns[0],
        description: suggestion.description
      },
      kind: 27, // Snippet
      insertText: suggestion.snippet,
      insertTextRules: 4, // InsertAsSnippet
      documentation: {
        value: `**${suggestion.description}**\n\n${suggestion.detail}\n\n\`\`\`python\n${suggestion.snippet.replace(/\$\{?\d+:?([^}]*)\}?/g, '$1').replace(/\$0/g, '')}\n\`\`\``
      },
      detail: suggestion.detail,
      sortText: String(1000 - (suggestion.matchScore + (suggestion.priority || 0))).padStart(4, '0'),
      range,
      preselect: index === 0,
      commitCharacters: ['.', '(', ' ', '\t']
    }));
  }
}
