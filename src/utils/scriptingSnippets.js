/**
 * Sistema de snippets para SQL, Shell, PowerShell y Batch
 */

export class ScriptingSnippetEngine {
  constructor() {
    this.snippets = new Map();
    this.initializeAllSnippets();
  }

  /**
   * Inicializa snippets para todos los lenguajes de scripting
   */
  initializeAllSnippets() {
    this.initializeSQLSnippets();
    this.initializeShellSnippets();
    this.initializePowerShellSnippets();
    this.initializeBatchSnippets();
  }

  /**
   * SQL SNIPPETS
   */
  initializeSQLSnippets() {
    // CONSULTAS BÁSICAS
    this.addSnippet('select', {
      patterns: ['SELECT', 'select'],
      snippet: 'SELECT ${1:column1}, ${2:column2}\nFROM ${3:table_name}\nWHERE ${4:condition};$0',
      description: 'SELECT statement',
      detail: 'SELECT columns FROM table WHERE condition',
      priority: 100,
      language: 'sql'
    });

    this.addSnippet('selectAll', {
      patterns: ['SELECT *', 'select *'],
      snippet: 'SELECT *\nFROM ${1:table_name};$0',
      description: 'SELECT all columns',
      detail: 'SELECT * FROM table',
      priority: 95,
      language: 'sql'
    });

    this.addSnippet('insert', {
      patterns: ['INSERT', 'insert'],
      snippet: 'INSERT INTO ${1:table_name} (${2:column1}, ${3:column2})\nVALUES (${4:value1}, ${5:value2});$0',
      description: 'INSERT statement',
      detail: 'INSERT INTO table (columns) VALUES (values)',
      priority: 95,
      language: 'sql'
    });

    this.addSnippet('update', {
      patterns: ['UPDATE', 'update'],
      snippet: 'UPDATE ${1:table_name}\nSET ${2:column1} = ${3:value1},\n    ${4:column2} = ${5:value2}\nWHERE ${6:condition};$0',
      description: 'UPDATE statement',
      detail: 'UPDATE table SET column = value WHERE condition',
      priority: 95,
      language: 'sql'
    });

    this.addSnippet('delete', {
      patterns: ['DELETE', 'delete'],
      snippet: 'DELETE FROM ${1:table_name}\nWHERE ${2:condition};$0',
      description: 'DELETE statement',
      detail: 'DELETE FROM table WHERE condition',
      priority: 90,
      language: 'sql'
    });

    // CREACIÓN DE TABLAS
    this.addSnippet('createTable', {
      patterns: ['CREATE TABLE', 'create table'],
      snippet: 'CREATE TABLE ${1:table_name} (\n    ${2:id} INT PRIMARY KEY AUTO_INCREMENT,\n    ${3:name} VARCHAR(255) NOT NULL,\n    ${4:email} VARCHAR(255) UNIQUE,\n    ${5:created_at} TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);$0',
      description: 'CREATE TABLE statement',
      detail: 'CREATE TABLE with common columns',
      priority: 90,
      language: 'sql'
    });

    this.addSnippet('alterTable', {
      patterns: ['ALTER TABLE', 'alter table'],
      snippet: 'ALTER TABLE ${1:table_name}\nADD COLUMN ${2:new_column} ${3:VARCHAR(255)};$0',
      description: 'ALTER TABLE statement',
      detail: 'ALTER TABLE ADD COLUMN',
      priority: 80,
      language: 'sql'
    });

    this.addSnippet('dropTable', {
      patterns: ['DROP TABLE', 'drop table'],
      snippet: 'DROP TABLE IF EXISTS ${1:table_name};$0',
      description: 'DROP TABLE statement',
      detail: 'DROP TABLE IF EXISTS',
      priority: 75,
      language: 'sql'
    });

    // JOINS
    this.addSnippet('innerJoin', {
      patterns: ['INNER JOIN', 'inner join'],
      snippet: 'SELECT ${1:t1.column}, ${2:t2.column}\nFROM ${3:table1} t1\nINNER JOIN ${4:table2} t2 ON t1.${5:id} = t2.${6:foreign_key}\nWHERE ${7:condition};$0',
      description: 'INNER JOIN query',
      detail: 'SELECT with INNER JOIN',
      priority: 85,
      language: 'sql'
    });

    this.addSnippet('leftJoin', {
      patterns: ['LEFT JOIN', 'left join'],
      snippet: 'SELECT ${1:t1.column}, ${2:t2.column}\nFROM ${3:table1} t1\nLEFT JOIN ${4:table2} t2 ON t1.${5:id} = t2.${6:foreign_key}\nWHERE ${7:condition};$0',
      description: 'LEFT JOIN query',
      detail: 'SELECT with LEFT JOIN',
      priority: 80,
      language: 'sql'
    });

    // ÍNDICES
    this.addSnippet('createIndex', {
      patterns: ['CREATE INDEX', 'create index'],
      snippet: 'CREATE INDEX ${1:idx_name}\nON ${2:table_name} (${3:column_name});$0',
      description: 'CREATE INDEX statement',
      detail: 'CREATE INDEX on table column',
      priority: 75,
      language: 'sql'
    });

    // FUNCIONES AGREGADAS
    this.addSnippet('count', {
      patterns: ['COUNT', 'count'],
      snippet: 'SELECT COUNT(${1:*})\nFROM ${2:table_name}\nWHERE ${3:condition};$0',
      description: 'COUNT function',
      detail: 'SELECT COUNT(*) FROM table',
      priority: 85,
      language: 'sql'
    });

    this.addSnippet('groupBy', {
      patterns: ['GROUP BY', 'group by'],
      snippet: 'SELECT ${1:column}, COUNT(*)\nFROM ${2:table_name}\nWHERE ${3:condition}\nGROUP BY ${1:column}\nHAVING COUNT(*) > ${4:1};$0',
      description: 'GROUP BY with HAVING',
      detail: 'SELECT with GROUP BY and HAVING',
      priority: 80,
      language: 'sql'
    });
  }

  /**
   * SHELL SNIPPETS (Bash)
   */
  initializeShellSnippets() {
    // SHEBANG Y BÁSICOS
    this.addSnippet('shebang', {
      patterns: ['#!/bin/bash', 'shebang'],
      snippet: '#!/bin/bash\n\n# ${1:Script description}\n# Author: ${2:Your Name}\n# Date: ${3:$(date +%Y-%m-%d)}\n\n${4:# Your script here}$0',
      description: 'Bash script header',
      detail: '#!/bin/bash with header',
      priority: 100,
      language: 'sh'
    });

    this.addSnippet('echo', {
      patterns: ['echo'],
      snippet: 'echo "${1:message}"$0',
      description: 'echo command',
      detail: 'echo "message"',
      priority: 100,
      language: 'sh'
    });

    this.addSnippet('printf', {
      patterns: ['printf'],
      snippet: 'printf "${1:format}" ${2:args}$0',
      description: 'printf command',
      detail: 'printf "format" args',
      priority: 90,
      language: 'sh'
    });

    // VARIABLES
    this.addSnippet('variable', {
      patterns: ['var', 'variable'],
      snippet: '${1:VAR_NAME}="${2:value}"$0',
      description: 'variable assignment',
      detail: 'VAR="value"',
      priority: 90,
      language: 'sh'
    });

    this.addSnippet('readInput', {
      patterns: ['read', 'input'],
      snippet: 'read -p "${1:Enter value}: " ${2:variable_name}$0',
      description: 'read user input',
      detail: 'read -p "prompt: " variable',
      priority: 85,
      language: 'sh'
    });

    // ESTRUCTURAS DE CONTROL
    this.addSnippet('if', {
      patterns: ['if'],
      snippet: 'if [[ ${1:condition} ]]; then\n    ${2:# if block}\nfi$0',
      description: 'if statement',
      detail: 'if [[ condition ]]; then fi',
      priority: 95,
      language: 'sh'
    });

    this.addSnippet('ifelse', {
      patterns: ['if else', 'ifelse'],
      snippet: 'if [[ ${1:condition} ]]; then\n    ${2:# if block}\nelse\n    ${3:# else block}\nfi$0',
      description: 'if-else statement',
      detail: 'if-else-fi block',
      priority: 90,
      language: 'sh'
    });

    this.addSnippet('for', {
      patterns: ['for'],
      snippet: 'for ${1:item} in ${2:list}; do\n    ${3:# loop body}\ndone$0',
      description: 'for loop',
      detail: 'for item in list; do done',
      priority: 90,
      language: 'sh'
    });

    this.addSnippet('while', {
      patterns: ['while'],
      snippet: 'while [[ ${1:condition} ]]; do\n    ${2:# loop body}\ndone$0',
      description: 'while loop',
      detail: 'while [[ condition ]]; do done',
      priority: 85,
      language: 'sh'
    });

    // FUNCIONES
    this.addSnippet('function', {
      patterns: ['function', 'func'],
      snippet: '${1:function_name}() {\n    ${2:# function body}\n    echo "${3:result}"\n}$0',
      description: 'function definition',
      detail: 'function_name() { }',
      priority: 85,
      language: 'sh'
    });

    // ARCHIVOS Y DIRECTORIOS
    this.addSnippet('fileExists', {
      patterns: ['if file exists', 'file exists'],
      snippet: 'if [[ -f "${1:filename}" ]]; then\n    ${2:# file exists}\nelse\n    ${3:# file does not exist}\nfi$0',
      description: 'check if file exists',
      detail: 'if [[ -f "file" ]]; then fi',
      priority: 80,
      language: 'sh'
    });

    this.addSnippet('dirExists', {
      patterns: ['if dir exists', 'directory exists'],
      snippet: 'if [[ -d "${1:directory}" ]]; then\n    ${2:# directory exists}\nelse\n    ${3:# directory does not exist}\nfi$0',
      description: 'check if directory exists',
      detail: 'if [[ -d "dir" ]]; then fi',
      priority: 80,
      language: 'sh'
    });

    // MANEJO DE ERRORES
    this.addSnippet('errorHandling', {
      patterns: ['error handling', 'trap'],
      snippet: 'set -e  # Exit on error\nset -u  # Exit on undefined variable\nset -o pipefail  # Exit on pipe failure\n\ntrap \'echo "Error on line $LINENO"\' ERR$0',
      description: 'error handling setup',
      detail: 'set -euo pipefail with trap',
      priority: 75,
      language: 'sh'
    });
  }

  /**
   * POWERSHELL SNIPPETS
   */
  initializePowerShellSnippets() {
    // BÁSICOS
    this.addSnippet('writeHost', {
      patterns: ['Write-Host', 'echo'],
      snippet: 'Write-Host "${1:message}"$0',
      description: 'Write-Host command',
      detail: 'Write-Host "message"',
      priority: 100,
      language: 'powershell'
    });

    this.addSnippet('writeOutput', {
      patterns: ['Write-Output'],
      snippet: 'Write-Output "${1:message}"$0',
      description: 'Write-Output command',
      detail: 'Write-Output "message"',
      priority: 95,
      language: 'powershell'
    });

    // VARIABLES
    this.addSnippet('variable', {
      patterns: ['$var', 'variable'],
      snippet: '$${1:variableName} = "${2:value}"$0',
      description: 'variable assignment',
      detail: '$variable = "value"',
      priority: 90,
      language: 'powershell'
    });

    this.addSnippet('readHost', {
      patterns: ['Read-Host', 'input'],
      snippet: '$${1:input} = Read-Host "${2:Enter value}"$0',
      description: 'Read-Host input',
      detail: '$input = Read-Host "prompt"',
      priority: 85,
      language: 'powershell'
    });

    // ESTRUCTURAS DE CONTROL
    this.addSnippet('if', {
      patterns: ['if'],
      snippet: 'if (${1:condition}) {\n    ${2:# if block}\n}$0',
      description: 'if statement',
      detail: 'if (condition) { }',
      priority: 95,
      language: 'powershell'
    });

    this.addSnippet('ifelse', {
      patterns: ['if else', 'ifelse'],
      snippet: 'if (${1:condition}) {\n    ${2:# if block}\n} else {\n    ${3:# else block}\n}$0',
      description: 'if-else statement',
      detail: 'if (condition) { } else { }',
      priority: 90,
      language: 'powershell'
    });

    this.addSnippet('foreach', {
      patterns: ['ForEach', 'foreach'],
      snippet: 'ForEach (${1:$item} in ${2:$collection}) {\n    ${3:# loop body}\n}$0',
      description: 'ForEach loop',
      detail: 'ForEach ($item in $collection) { }',
      priority: 90,
      language: 'powershell'
    });

    this.addSnippet('for', {
      patterns: ['for'],
      snippet: 'for (${1:$i = 0}; ${2:$i -lt 10}; ${3:$i++}) {\n    ${4:# loop body}\n}$0',
      description: 'for loop',
      detail: 'for ($i = 0; $i -lt 10; $i++) { }',
      priority: 85,
      language: 'powershell'
    });

    this.addSnippet('while', {
      patterns: ['while'],
      snippet: 'while (${1:condition}) {\n    ${2:# loop body}\n}$0',
      description: 'while loop',
      detail: 'while (condition) { }',
      priority: 85,
      language: 'powershell'
    });

    // FUNCIONES
    this.addSnippet('function', {
      patterns: ['function', 'func'],
      snippet: 'function ${1:FunctionName} {\n    param(\n        [string]$${2:Parameter}\n    )\n    \n    ${3:# function body}\n    return ${4:$result}\n}$0',
      description: 'function definition',
      detail: 'function Name { param() }',
      priority: 85,
      language: 'powershell'
    });

    // ARCHIVOS Y DIRECTORIOS
    this.addSnippet('testPath', {
      patterns: ['Test-Path', 'file exists'],
      snippet: 'if (Test-Path "${1:path}") {\n    ${2:# path exists}\n} else {\n    ${3:# path does not exist}\n}$0',
      description: 'Test-Path check',
      detail: 'if (Test-Path "path") { }',
      priority: 80,
      language: 'powershell'
    });

    this.addSnippet('getContent', {
      patterns: ['Get-Content', 'read file'],
      snippet: '$${1:content} = Get-Content -Path "${2:filename}"$0',
      description: 'Get-Content read file',
      detail: '$content = Get-Content -Path "file"',
      priority: 80,
      language: 'powershell'
    });

    // TRY-CATCH
    this.addSnippet('try', {
      patterns: ['try', 'try catch'],
      snippet: 'try {\n    ${1:# try block}\n} catch {\n    Write-Error "Error: ${2:$_.Exception.Message}"\n}$0',
      description: 'try-catch block',
      detail: 'try { } catch { }',
      priority: 85,
      language: 'powershell'
    });
  }

  /**
   * BATCH SNIPPETS
   */
  initializeBatchSnippets() {
    // BÁSICOS
    this.addSnippet('echo', {
      patterns: ['echo'],
      snippet: 'echo ${1:message}$0',
      description: 'echo command',
      detail: 'echo message',
      priority: 100,
      language: 'batch'
    });

    this.addSnippet('echoOff', {
      patterns: ['@echo off', 'echo off'],
      snippet: '@echo off\nsetlocal EnableDelayedExpansion\n\nREM ${1:Script description}\nREM Author: ${2:Your Name}\nREM Date: ${3:%date%}\n\n${4:REM Your script here}\n\npause$0',
      description: 'batch script header',
      detail: '@echo off with header',
      priority: 100,
      language: 'batch'
    });

    // VARIABLES
    this.addSnippet('set', {
      patterns: ['set'],
      snippet: 'set ${1:VARIABLE}=${2:value}$0',
      description: 'set variable',
      detail: 'set VARIABLE=value',
      priority: 90,
      language: 'batch'
    });

    this.addSnippet('setInput', {
      patterns: ['set /p', 'input'],
      snippet: 'set /p ${1:variable}="${2:Enter value}: "$0',
      description: 'set input variable',
      detail: 'set /p variable="prompt"',
      priority: 85,
      language: 'batch'
    });

    // ESTRUCTURAS DE CONTROL
    this.addSnippet('if', {
      patterns: ['if'],
      snippet: 'if "${1:condition}" == "${2:value}" (\n    ${3:REM if block}\n)$0',
      description: 'if statement',
      detail: 'if "condition" == "value" ( )',
      priority: 95,
      language: 'batch'
    });

    this.addSnippet('ifelse', {
      patterns: ['if else', 'ifelse'],
      snippet: 'if "${1:condition}" == "${2:value}" (\n    ${3:REM if block}\n) else (\n    ${4:REM else block}\n)$0',
      description: 'if-else statement',
      detail: 'if-else block',
      priority: 90,
      language: 'batch'
    });

    this.addSnippet('for', {
      patterns: ['for'],
      snippet: 'for %%${1:i} in (${2:list}) do (\n    ${3:REM loop body}\n)$0',
      description: 'for loop',
      detail: 'for %%i in (list) do ( )',
      priority: 90,
      language: 'batch'
    });

    this.addSnippet('forFiles', {
      patterns: ['for files', 'for /f'],
      snippet: 'for /f "tokens=*" %%${1:i} in (\'dir /b "${2:*.txt}"\') do (\n    ${3:REM process file %%i}\n)$0',
      description: 'for files loop',
      detail: 'for /f files processing',
      priority: 85,
      language: 'batch'
    });

    // FUNCIONES (SUBRUTINAS)
    this.addSnippet('call', {
      patterns: ['call', 'function'],
      snippet: 'call :${1:FunctionName} ${2:parameters}\ngoto :eof\n\n:${1:FunctionName}\n${3:REM function body}\ngoto :eof$0',
      description: 'call function/subroutine',
      detail: 'call :function with definition',
      priority: 80,
      language: 'batch'
    });

    // ARCHIVOS
    this.addSnippet('ifExist', {
      patterns: ['if exist', 'file exists'],
      snippet: 'if exist "${1:filename}" (\n    ${2:REM file exists}\n) else (\n    ${3:REM file does not exist}\n)$0',
      description: 'if exist file check',
      detail: 'if exist "file" ( )',
      priority: 80,
      language: 'batch'
    });

    this.addSnippet('copy', {
      patterns: ['copy'],
      snippet: 'copy "${1:source}" "${2:destination}"$0',
      description: 'copy file',
      detail: 'copy "source" "destination"',
      priority: 75,
      language: 'batch'
    });

    this.addSnippet('move', {
      patterns: ['move'],
      snippet: 'move "${1:source}" "${2:destination}"$0',
      description: 'move file',
      detail: 'move "source" "destination"',
      priority: 75,
      language: 'batch'
    });

    this.addSnippet('del', {
      patterns: ['del', 'delete'],
      snippet: 'del "${1:filename}"$0',
      description: 'delete file',
      detail: 'del "filename"',
      priority: 70,
      language: 'batch'
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
  getSnippetSuggestions(input, language) {
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
