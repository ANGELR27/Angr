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

    // ======= ALERTS Y DIALOGS =======
    this.addBlockSnippet('alert', {
      patterns: ['alert', 'alrt'],
      snippet: 'alert("${1:message}");$0',
      description: 'alert dialog box',
      detail: 'alert(message)',
      insertText: 'alert("',
      suffix: '");',
      priority: 95
    });

    this.addBlockSnippet('prompt', {
      patterns: ['prompt', 'prmt'],
      snippet: 'const ${1:result} = prompt("${2:message}", "${3:default}");$0',
      description: 'prompt dialog box',
      detail: 'prompt(message, default)',
      insertText: 'const result = prompt("',
      suffix: '", "");',
      priority: 93
    });

    this.addBlockSnippet('confirm', {
      patterns: ['confirm', 'conf'],
      snippet: 'if (confirm("${1:message}")) {\n\t${2}\n}$0',
      description: 'confirm dialog with if',
      detail: 'if (confirm(message)) { }',
      insertText: 'if (confirm("',
      suffix: '")) {\n\t\n}',
      priority: 91
    });

    // ======= TIMERS =======
    this.addBlockSnippet('setTimeout', {
      patterns: ['setTimeout', 'timeout', 'delay'],
      snippet: 'setTimeout(() => {\n\t${1}\n}, ${2:1000});$0',
      description: 'setTimeout function',
      detail: 'setTimeout(() => {}, delay)',
      insertText: 'setTimeout(() => {\n\t',
      suffix: '\n}, 1000);',
      priority: 92
    });

    this.addBlockSnippet('setInterval', {
      patterns: ['setInterval', 'interval', 'timer'],
      snippet: 'const ${1:intervalId} = setInterval(() => {\n\t${2}\n}, ${3:1000});\n\n// Para detenerlo: clearInterval(${1:intervalId});$0',
      description: 'setInterval function',
      detail: 'setInterval(() => {}, delay)',
      insertText: 'const intervalId = setInterval(() => {\n\t',
      suffix: '\n}, 1000);',
      priority: 90
    });

    this.addBlockSnippet('clearTimeout', {
      patterns: ['clearTimeout', 'cleartimeout'],
      snippet: 'clearTimeout(${1:timeoutId});$0',
      description: 'clear timeout',
      detail: 'clearTimeout(timeoutId)',
      insertText: 'clearTimeout(',
      suffix: ');',
      priority: 80
    });

    this.addBlockSnippet('clearInterval', {
      patterns: ['clearInterval', 'clearinterval'],
      snippet: 'clearInterval(${1:intervalId});$0',
      description: 'clear interval',
      detail: 'clearInterval(intervalId)',
      insertText: 'clearInterval(',
      suffix: ');',
      priority: 80
    });

    // ======= DOM MANIPULATION =======
    this.addBlockSnippet('getElementById', {
      patterns: ['getElementById', 'getid', 'byid'],
      snippet: 'const ${1:element} = document.getElementById("${2:id}");$0',
      description: 'get element by ID',
      detail: 'document.getElementById(id)',
      insertText: 'const element = document.getElementById("',
      suffix: '");',
      priority: 88
    });

    this.addBlockSnippet('querySelector', {
      patterns: ['querySelector', 'qs'],
      snippet: 'const ${1:element} = document.querySelector("${2:selector}");$0',
      description: 'query selector',
      detail: 'document.querySelector(selector)',
      insertText: 'const element = document.querySelector("',
      suffix: '");',
      priority: 88
    });

    this.addBlockSnippet('querySelectorAll', {
      patterns: ['querySelectorAll', 'qsa'],
      snippet: 'const ${1:elements} = document.querySelectorAll("${2:selector}");$0',
      description: 'query selector all',
      detail: 'document.querySelectorAll(selector)',
      insertText: 'const elements = document.querySelectorAll("',
      suffix: '");',
      priority: 86
    });

    this.addBlockSnippet('createElement', {
      patterns: ['createElement', 'create'],
      snippet: 'const ${1:element} = document.createElement("${2:div}");\n${1}.textContent = "${3:content}";\n${4:parent}.appendChild(${1});$0',
      description: 'create and append element',
      detail: 'document.createElement(tag)',
      insertText: 'const element = document.createElement("',
      suffix: '");',
      priority: 85
    });

    this.addBlockSnippet('addEventListener', {
      patterns: ['addEventListener', 'listen', 'event'],
      snippet: '${1:element}.addEventListener("${2:click}", (event) => {\n\t${3}\n});$0',
      description: 'add event listener',
      detail: 'element.addEventListener(event, callback)',
      insertText: 'addEventListener("',
      suffix: '", (event) => {\n\t\n});',
      priority: 87
    });

    this.addBlockSnippet('removeEventListener', {
      patterns: ['removeEventListener', 'removelisten'],
      snippet: '${1:element}.removeEventListener("${2:click}", ${3:handler});$0',
      description: 'remove event listener',
      detail: 'element.removeEventListener(event, handler)',
      insertText: 'removeEventListener("',
      suffix: '", handler);',
      priority: 80
    });

    // ======= ARRAY METHODS =======
    this.addBlockSnippet('find', {
      patterns: ['find', 'arrayFind'],
      snippet: 'const ${1:found} = ${2:array}.find((${3:item}) => ${4:condition});$0',
      description: 'array find method',
      detail: 'array.find(callback)',
      insertText: 'find((item) => ',
      suffix: ');',
      priority: 86
    });

    this.addBlockSnippet('some', {
      patterns: ['some', 'arraySome'],
      snippet: 'const ${1:hasMatch} = ${2:array}.some((${3:item}) => ${4:condition});$0',
      description: 'array some method',
      detail: 'array.some(callback)',
      insertText: 'some((item) => ',
      suffix: ');',
      priority: 84
    });

    this.addBlockSnippet('every', {
      patterns: ['every', 'arrayEvery'],
      snippet: 'const ${1:allMatch} = ${2:array}.every((${3:item}) => ${4:condition});$0',
      description: 'array every method',
      detail: 'array.every(callback)',
      insertText: 'every((item) => ',
      suffix: ');',
      priority: 84
    });

    this.addBlockSnippet('reduce', {
      patterns: ['reduce', 'arrayReduce'],
      snippet: 'const ${1:result} = ${2:array}.reduce((${3:acc}, ${4:item}) => {\n\t${5:return acc + item;}\n}, ${6:0});$0',
      description: 'array reduce method',
      detail: 'array.reduce(callback, initialValue)',
      insertText: 'reduce((acc, item) => {\n\t',
      suffix: '\n}, 0);',
      priority: 84
    });

    this.addBlockSnippet('sort', {
      patterns: ['sort', 'arraySort'],
      snippet: 'const ${1:sorted} = ${2:array}.sort((a, b) => ${3:a - b});$0',
      description: 'array sort method',
      detail: 'array.sort(compareFunction)',
      insertText: 'sort((a, b) => ',
      suffix: ');',
      priority: 82
    });

    // ======= OBJECT METHODS =======
    this.addBlockSnippet('objectKeys', {
      patterns: ['Object.keys', 'keys'],
      snippet: 'Object.keys(${1:object}).forEach((${2:key}) => {\n\tconsole.log(${2:key}, ${1:object}[${2:key}]);\n});$0',
      description: 'Object.keys iteration',
      detail: 'Object.keys(object).forEach()',
      insertText: 'Object.keys(',
      suffix: ').forEach(key => {\n\t\n});',
      priority: 82
    });

    this.addBlockSnippet('objectEntries', {
      patterns: ['Object.entries', 'entries'],
      snippet: 'Object.entries(${1:object}).forEach(([${2:key}, ${3:value}]) => {\n\tconsole.log(${2:key}, ${3:value});\n});$0',
      description: 'Object.entries iteration',
      detail: 'Object.entries(object).forEach()',
      insertText: 'Object.entries(',
      suffix: ').forEach(([key, value]) => {\n\t\n});',
      priority: 82
    });

    this.addBlockSnippet('objectAssign', {
      patterns: ['Object.assign', 'assign'],
      snippet: 'const ${1:merged} = Object.assign({}, ${2:target}, ${3:source});$0',
      description: 'Object.assign merge',
      detail: 'Object.assign({}, target, source)',
      insertText: 'Object.assign({}, ',
      suffix: ');',
      priority: 80
    });

    // ======= DATE METHODS =======
    this.addBlockSnippet('newDate', {
      patterns: ['new Date', 'date'],
      snippet: 'const ${1:now} = new Date();\nconsole.log(${1:now}.toLocaleDateString());$0',
      description: 'create new Date',
      detail: 'new Date()',
      insertText: 'const now = new Date();',
      suffix: '',
      priority: 80
    });

    this.addBlockSnippet('dateFormat', {
      patterns: ['dateFormat', 'formatDate'],
      snippet: 'const ${1:formatted} = new Date(${2:date}).toLocaleDateString("${3:es-ES}", {\n\tday: "numeric",\n\tmonth: "long",\n\tyear: "numeric"\n});$0',
      description: 'format date locale',
      detail: 'date.toLocaleDateString(locale, options)',
      insertText: 'toLocaleDateString("es-ES", {\n\t',
      suffix: '\n});',
      priority: 78
    });

    // ======= MATH METHODS =======
    this.addBlockSnippet('mathRandom', {
      patterns: ['Math.random', 'random'],
      snippet: 'const ${1:randomNum} = Math.floor(Math.random() * ${2:10}) + ${3:1};$0',
      description: 'random number generator',
      detail: 'Math.floor(Math.random() * max) + min',
      insertText: 'Math.floor(Math.random() * ',
      suffix: ') + 1;',
      priority: 80
    });

    this.addBlockSnippet('mathMax', {
      patterns: ['Math.max', 'max'],
      snippet: 'const ${1:maximum} = Math.max(${2:...array});$0',
      description: 'Math.max method',
      detail: 'Math.max(...values)',
      insertText: 'Math.max(',
      suffix: ');',
      priority: 78
    });

    this.addBlockSnippet('mathMin', {
      patterns: ['Math.min', 'min'],
      snippet: 'const ${1:minimum} = Math.min(${2:...array});$0',
      description: 'Math.min method',
      detail: 'Math.min(...values)',
      insertText: 'Math.min(',
      suffix: ');',
      priority: 78
    });

    // ======= JSON METHODS =======
    this.addBlockSnippet('jsonParse', {
      patterns: ['JSON.parse', 'parse'],
      snippet: 'try {\n\tconst ${1:data} = JSON.parse(${2:jsonString});\n\tconsole.log(${1:data});\n} catch (error) {\n\tconsole.error("Error parsing JSON:", error);\n}$0',
      description: 'JSON.parse with error handling',
      detail: 'JSON.parse(string) with try-catch',
      insertText: 'JSON.parse(',
      suffix: ');',
      priority: 85
    });

    this.addBlockSnippet('jsonStringify', {
      patterns: ['JSON.stringify', 'stringify'],
      snippet: 'const ${1:jsonString} = JSON.stringify(${2:object}, null, 2);$0',
      description: 'JSON.stringify method',
      detail: 'JSON.stringify(object, null, 2)',
      insertText: 'JSON.stringify(',
      suffix: ', null, 2);',
      priority: 85
    });

    // ======= LOCALSTORAGE =======
    this.addBlockSnippet('localStorageSet', {
      patterns: ['localStorage.setItem', 'setItem', 'saveData'],
      snippet: 'localStorage.setItem("${1:key}", JSON.stringify(${2:data}));$0',
      description: 'localStorage set item',
      detail: 'localStorage.setItem(key, value)',
      insertText: 'localStorage.setItem("',
      suffix: '", JSON.stringify(data));',
      priority: 83
    });

    this.addBlockSnippet('localStorageGet', {
      patterns: ['localStorage.getItem', 'getItem', 'loadData'],
      snippet: 'const ${1:data} = JSON.parse(localStorage.getItem("${2:key}") || "null");$0',
      description: 'localStorage get item',
      detail: 'JSON.parse(localStorage.getItem(key))',
      insertText: 'JSON.parse(localStorage.getItem("',
      suffix: '") || "null");',
      priority: 83
    });

    this.addBlockSnippet('localStorageRemove', {
      patterns: ['localStorage.removeItem', 'removeItem'],
      snippet: 'localStorage.removeItem("${1:key}");$0',
      description: 'localStorage remove item',
      detail: 'localStorage.removeItem(key)',
      insertText: 'localStorage.removeItem("',
      suffix: '");',
      priority: 78
    });

    // ======= URL/WINDOW =======
    this.addBlockSnippet('windowOpen', {
      patterns: ['window.open', 'openWindow'],
      snippet: 'window.open("${1:url}", "${2:_blank}", "${3:width=800,height=600}");$0',
      description: 'open new window',
      detail: 'window.open(url, target, features)',
      insertText: 'window.open("',
      suffix: '", "_blank");',
      priority: 75
    });

    this.addBlockSnippet('windowLocation', {
      patterns: ['window.location', 'location', 'redirect'],
      snippet: 'window.location.href = "${1:url}";$0',
      description: 'redirect to URL',
      detail: 'window.location.href = url',
      insertText: 'window.location.href = "',
      suffix: '";',
      priority: 80
    });

    // ======= REGEX =======
    this.addBlockSnippet('regexTest', {
      patterns: ['regex', 'test', 'pattern'],
      snippet: 'const ${1:pattern} = /${2:regex}/g;\nconst ${3:isMatch} = ${1:pattern}.test(${4:string});$0',
      description: 'regex test pattern',
      detail: '/pattern/flags.test(string)',
      insertText: 'const pattern = /',
      suffix: '/g;\nconst isMatch = pattern.test(string);',
      priority: 78
    });

    this.addBlockSnippet('regexMatch', {
      patterns: ['match', 'regexMatch'],
      snippet: 'const ${1:matches} = ${2:string}.match(/${3:pattern}/g);$0',
      description: 'string match regex',
      detail: 'string.match(/pattern/flags)',
      insertText: 'match(/',
      suffix: '/g);',
      priority: 76
    });

    // ======= PERFORMANCE =======
    this.addBlockSnippet('performance', {
      patterns: ['performance', 'time'],
      snippet: 'const ${1:startTime} = performance.now();\n${2:// your code here}\nconst ${3:endTime} = performance.now();\nconsole.log(`Execution time: ${${3:endTime} - ${1:startTime}}ms`);$0',
      description: 'performance timing',
      detail: 'performance.now() timing',
      insertText: 'const startTime = performance.now();',
      suffix: '',
      priority: 75
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

  /**
   * Obtiene snippets específicos para un lenguaje
   */
  getLanguageSnippets(language) {
    const languageSnippets = new Map();
    
    // Filtrar snippets por lenguaje
    for (const [name, snippet] of this.blockSnippets) {
      if (!snippet.language || snippet.language === language || 
          (snippet.language === 'javascript' && ['javascript', 'typescript', 'jsx', 'tsx'].includes(language))) {
        languageSnippets.set(name, snippet);
      }
    }
    
    return languageSnippets;
  }
}
