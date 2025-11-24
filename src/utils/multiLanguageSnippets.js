/**
 * Sistema de snippets para PHP, Ruby, Go, Rust, Swift y Kotlin
 */

export class MultiLanguageSnippetEngine {
  constructor() {
    this.snippets = new Map();
    this.initializeAllSnippets();
  }

  /**
   * Inicializa snippets para todos los lenguajes
   */
  initializeAllSnippets() {
    this.initializePHPSnippets();
    this.initializeRubySnippets();
    this.initializeGoSnippets();
    this.initializeRustSnippets();
    this.initializeSwiftSnippets();
    this.initializeKotlinSnippets();
  }

  /**
   * PHP SNIPPETS
   */
  initializePHPSnippets() {
    this.addSnippet('phpTag', {
      patterns: ['<?php', 'php'],
      snippet: '<?php\n${1:// Your PHP code here}\n?>$0',
      description: 'PHP opening and closing tags',
      detail: '<?php code ?>',
      priority: 100,
      language: 'php'
    });

    this.addSnippet('echo', {
      patterns: ['echo'],
      snippet: 'echo "${1:message}";$0',
      description: 'echo statement',
      detail: 'echo "message"',
      priority: 100,
      language: 'php'
    });

    this.addSnippet('print', {
      patterns: ['print'],
      snippet: 'print "${1:message}";$0',
      description: 'print statement',
      detail: 'print "message"',
      priority: 95,
      language: 'php'
    });

    this.addSnippet('varDump', {
      patterns: ['var_dump', 'vardump'],
      snippet: 'var_dump(${1:variable});$0',
      description: 'var_dump debug',
      detail: 'var_dump(variable)',
      priority: 90,
      language: 'php'
    });

    this.addSnippet('phpFunction', {
      patterns: ['function', 'php function'],
      snippet: 'function ${1:functionName}(${2:$parameters}) {\n\t${3:// function body}\n\treturn ${4:$result};\n}$0',
      description: 'PHP function',
      detail: 'function name($params) { }',
      priority: 95,
      language: 'php'
    });

    this.addSnippet('phpClass', {
      patterns: ['class', 'php class'],
      snippet: 'class ${1:ClassName} {\n\tprivate $${2:property};\n\t\n\tpublic function __construct($${3:param}) {\n\t\t$this->${2:property} = $${3:param};\n\t}\n\t\n\tpublic function ${4:methodName}() {\n\t\treturn $this->${2:property};\n\t}\n}$0',
      description: 'PHP class',
      detail: 'class ClassName { constructor, methods }',
      priority: 90,
      language: 'php'
    });

    this.addSnippet('phpArray', {
      patterns: ['array', 'php array'],
      snippet: '$${1:array} = [${2:"value1", "value2", "value3"}];$0',
      description: 'PHP array',
      detail: '$array = [values]',
      priority: 85,
      language: 'php'
    });

    this.addSnippet('phpForeach', {
      patterns: ['foreach', 'php foreach'],
      snippet: 'foreach ($${1:array} as $${2:item}) {\n\t${3:echo $item;}\n}$0',
      description: 'PHP foreach loop',
      detail: 'foreach ($array as $item) { }',
      priority: 90,
      language: 'php'
    });

    this.addSnippet('phpIf', {
      patterns: ['if', 'php if'],
      snippet: 'if (${1:condition}) {\n\t${2:// if block}\n}$0',
      description: 'PHP if statement',
      detail: 'if (condition) { }',
      priority: 95,
      language: 'php'
    });
  }

  /**
   * RUBY SNIPPETS
   */
  initializeRubySnippets() {
    this.addSnippet('puts', {
      patterns: ['puts'],
      snippet: 'puts "${1:message}"$0',
      description: 'puts statement',
      detail: 'puts "message"',
      priority: 100,
      language: 'ruby'
    });

    this.addSnippet('rubyMethod', {
      patterns: ['def', 'ruby method'],
      snippet: 'def ${1:method_name}(${2:parameters})\n\t${3:# method body}\n\t${4:return_value}\nend$0',
      description: 'Ruby method',
      detail: 'def method_name(params) end',
      priority: 95,
      language: 'ruby'
    });

    this.addSnippet('rubyClass', {
      patterns: ['class', 'ruby class'],
      snippet: 'class ${1:ClassName}\n\tdef initialize(${2:parameters})\n\t\t@${3:instance_var} = ${4:value}\n\tend\n\t\n\tdef ${5:method_name}\n\t\t@${3:instance_var}\n\tend\nend$0',
      description: 'Ruby class',
      detail: 'class ClassName with initialize',
      priority: 90,
      language: 'ruby'
    });

    this.addSnippet('rubyEach', {
      patterns: ['each', 'ruby each'],
      snippet: '${1:array}.each do |${2:item}|\n\t${3:puts item}\nend$0',
      description: 'Ruby each loop',
      detail: 'array.each do |item| end',
      priority: 90,
      language: 'ruby'
    });

    this.addSnippet('rubyIf', {
      patterns: ['if', 'ruby if'],
      snippet: 'if ${1:condition}\n\t${2:# if block}\nend$0',
      description: 'Ruby if statement',
      detail: 'if condition end',
      priority: 95,
      language: 'ruby'
    });
  }

  /**
   * GO SNIPPETS
   */
  initializeGoSnippets() {
    this.addSnippet('goMain', {
      patterns: ['main', 'go main', 'func main'],
      snippet: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t${1:// Your Go code here}\n}$0',
      description: 'Go main function',
      detail: 'package main with func main()',
      priority: 100,
      language: 'go'
    });

    this.addSnippet('fmt', {
      patterns: ['fmt.Println', 'fmt', 'println'],
      snippet: 'fmt.Println(${1:value})$0',
      description: 'fmt.Println',
      detail: 'fmt.Println(value)',
      priority: 100,
      language: 'go'
    });

    this.addSnippet('goFunc', {
      patterns: ['func', 'go function'],
      snippet: 'func ${1:functionName}(${2:parameters}) ${3:returnType} {\n\t${4:// function body}\n\treturn ${5:value}\n}$0',
      description: 'Go function',
      detail: 'func name(params) returnType { }',
      priority: 95,
      language: 'go'
    });

    this.addSnippet('goStruct', {
      patterns: ['type', 'struct', 'go struct'],
      snippet: 'type ${1:StructName} struct {\n\t${2:Field1} ${3:string}\n\t${4:Field2} ${5:int}\n}$0',
      description: 'Go struct',
      detail: 'type StructName struct { fields }',
      priority: 90,
      language: 'go'
    });

    this.addSnippet('goSlice', {
      patterns: ['slice', 'go slice'],
      snippet: '${1:slice} := []${2:int}{${3:1, 2, 3}}$0',
      description: 'Go slice',
      detail: 'slice := []type{values}',
      priority: 85,
      language: 'go'
    });

    this.addSnippet('goFor', {
      patterns: ['for', 'go for'],
      snippet: 'for ${1:i} := ${2:0}; ${1:i} < ${3:n}; ${1:i}++ {\n\t${4:// loop body}\n}$0',
      description: 'Go for loop',
      detail: 'for i := 0; i < n; i++ { }',
      priority: 95,
      language: 'go'
    });

    this.addSnippet('goIf', {
      patterns: ['if', 'go if'],
      snippet: 'if ${1:condition} {\n\t${2:// if block}\n}$0',
      description: 'Go if statement',
      detail: 'if condition { }',
      priority: 95,
      language: 'go'
    });

    this.addSnippet('goError', {
      patterns: ['if err', 'error handling'],
      snippet: 'if err != nil {\n\t${1:log.Fatal(err)}\n}$0',
      description: 'Go error handling',
      detail: 'if err != nil { }',
      priority: 90,
      language: 'go'
    });
  }

  /**
   * RUST SNIPPETS
   */
  initializeRustSnippets() {
    this.addSnippet('rustMain', {
      patterns: ['main', 'rust main', 'fn main'],
      snippet: 'fn main() {\n\t${1:// Your Rust code here}\n}$0',
      description: 'Rust main function',
      detail: 'fn main() { }',
      priority: 100,
      language: 'rust'
    });

    this.addSnippet('println', {
      patterns: ['println!', 'println'],
      snippet: 'println!("${1:message}");$0',
      description: 'println! macro',
      detail: 'println!("message")',
      priority: 100,
      language: 'rust'
    });

    this.addSnippet('rustFn', {
      patterns: ['fn', 'rust function'],
      snippet: 'fn ${1:function_name}(${2:parameters}) -> ${3:return_type} {\n\t${4:// function body}\n\t${5:return_value}\n}$0',
      description: 'Rust function',
      detail: 'fn name(params) -> type { }',
      priority: 95,
      language: 'rust'
    });

    this.addSnippet('rustStruct', {
      patterns: ['struct', 'rust struct'],
      snippet: 'struct ${1:StructName} {\n\t${2:field1}: ${3:String},\n\t${4:field2}: ${5:i32},\n}$0',
      description: 'Rust struct',
      detail: 'struct StructName { fields }',
      priority: 90,
      language: 'rust'
    });

    this.addSnippet('rustImpl', {
      patterns: ['impl', 'rust impl'],
      snippet: 'impl ${1:StructName} {\n\tfn ${2:method_name}(&self) -> ${3:return_type} {\n\t\t${4:// method body}\n\t}\n}$0',
      description: 'Rust impl block',
      detail: 'impl StructName { fn method() }',
      priority: 85,
      language: 'rust'
    });

    this.addSnippet('rustVec', {
      patterns: ['vec!', 'vector', 'rust vec'],
      snippet: 'let ${1:vec} = vec![${2:1, 2, 3}];$0',
      description: 'Rust vector',
      detail: 'let vec = vec![values]',
      priority: 85,
      language: 'rust'
    });

    this.addSnippet('rustFor', {
      patterns: ['for', 'rust for'],
      snippet: 'for ${1:item} in ${2:collection} {\n\t${3:// loop body}\n}$0',
      description: 'Rust for loop',
      detail: 'for item in collection { }',
      priority: 95,
      language: 'rust'
    });

    this.addSnippet('rustMatch', {
      patterns: ['match', 'rust match'],
      snippet: 'match ${1:expression} {\n\t${2:pattern1} => ${3:result1},\n\t${4:pattern2} => ${5:result2},\n\t_ => ${6:default_result},\n}$0',
      description: 'Rust match expression',
      detail: 'match expr { pattern => result }',
      priority: 90,
      language: 'rust'
    });
  }

  /**
   * SWIFT SNIPPETS
   */
  initializeSwiftSnippets() {
    this.addSnippet('print', {
      patterns: ['print', 'swift print'],
      snippet: 'print("${1:message}")$0',
      description: 'Swift print',
      detail: 'print("message")',
      priority: 100,
      language: 'swift'
    });

    this.addSnippet('swiftFunc', {
      patterns: ['func', 'swift function'],
      snippet: 'func ${1:functionName}(${2:parameters}) -> ${3:ReturnType} {\n\t${4:// function body}\n\treturn ${5:value}\n}$0',
      description: 'Swift function',
      detail: 'func name(params) -> Type { }',
      priority: 95,
      language: 'swift'
    });

    this.addSnippet('swiftClass', {
      patterns: ['class', 'swift class'],
      snippet: 'class ${1:ClassName} {\n\tvar ${2:property}: ${3:String}\n\t\n\tinit(${4:parameters}) {\n\t\tself.${2:property} = ${5:value}\n\t}\n\t\n\tfunc ${6:methodName}() -> ${7:String} {\n\t\treturn self.${2:property}\n\t}\n}$0',
      description: 'Swift class',
      detail: 'class ClassName with init and methods',
      priority: 90,
      language: 'swift'
    });

    this.addSnippet('swiftStruct', {
      patterns: ['struct', 'swift struct'],
      snippet: 'struct ${1:StructName} {\n\tvar ${2:property1}: ${3:String}\n\tvar ${4:property2}: ${5:Int}\n\t\n\tfunc ${6:methodName}() -> ${7:String} {\n\t\treturn ${2:property1}\n\t}\n}$0',
      description: 'Swift struct',
      detail: 'struct StructName with properties',
      priority: 85,
      language: 'swift'
    });

    this.addSnippet('swiftVar', {
      patterns: ['var', 'swift var'],
      snippet: 'var ${1:variableName}: ${2:String} = "${3:value}"$0',
      description: 'Swift variable',
      detail: 'var name: Type = value',
      priority: 80,
      language: 'swift'
    });

    this.addSnippet('swiftLet', {
      patterns: ['let', 'swift let'],
      snippet: 'let ${1:constantName}: ${2:String} = "${3:value}"$0',
      description: 'Swift constant',
      detail: 'let name: Type = value',
      priority: 80,
      language: 'swift'
    });

    this.addSnippet('swiftFor', {
      patterns: ['for', 'swift for'],
      snippet: 'for ${1:item} in ${2:collection} {\n\t${3:// loop body}\n}$0',
      description: 'Swift for-in loop',
      detail: 'for item in collection { }',
      priority: 95,
      language: 'swift'
    });

    this.addSnippet('swiftIf', {
      patterns: ['if', 'swift if'],
      snippet: 'if ${1:condition} {\n\t${2:// if block}\n}$0',
      description: 'Swift if statement',
      detail: 'if condition { }',
      priority: 95,
      language: 'swift'
    });
  }

  /**
   * KOTLIN SNIPPETS
   */
  initializeKotlinSnippets() {
    this.addSnippet('kotlinMain', {
      patterns: ['main', 'kotlin main', 'fun main'],
      snippet: 'fun main() {\n\t${1:// Your Kotlin code here}\n}$0',
      description: 'Kotlin main function',
      detail: 'fun main() { }',
      priority: 100,
      language: 'kotlin'
    });

    this.addSnippet('kotlinPrint', {
      patterns: ['println', 'kotlin print'],
      snippet: 'println("${1:message}")$0',
      description: 'Kotlin println',
      detail: 'println("message")',
      priority: 100,
      language: 'kotlin'
    });

    this.addSnippet('kotlinFun', {
      patterns: ['fun', 'kotlin function'],
      snippet: 'fun ${1:functionName}(${2:parameters}): ${3:ReturnType} {\n\t${4:// function body}\n\treturn ${5:value}\n}$0',
      description: 'Kotlin function',
      detail: 'fun name(params): Type { }',
      priority: 95,
      language: 'kotlin'
    });

    this.addSnippet('kotlinClass', {
      patterns: ['class', 'kotlin class'],
      snippet: 'class ${1:ClassName}(${2:val property: String}) {\n\t${3:// class body}\n\t\n\tfun ${4:methodName}(): ${5:String} {\n\t\treturn ${2:property}\n\t}\n}$0',
      description: 'Kotlin class',
      detail: 'class ClassName(property) { }',
      priority: 90,
      language: 'kotlin'
    });

    this.addSnippet('kotlinDataClass', {
      patterns: ['data class', 'kotlin data'],
      snippet: 'data class ${1:DataClassName}(\n\tval ${2:property1}: ${3:String},\n\tval ${4:property2}: ${5:Int}\n)$0',
      description: 'Kotlin data class',
      detail: 'data class ClassName(properties)',
      priority: 85,
      language: 'kotlin'
    });

    this.addSnippet('kotlinVal', {
      patterns: ['val', 'kotlin val'],
      snippet: 'val ${1:constantName}: ${2:String} = "${3:value}"$0',
      description: 'Kotlin val (immutable)',
      detail: 'val name: Type = value',
      priority: 80,
      language: 'kotlin'
    });

    this.addSnippet('kotlinVar', {
      patterns: ['var', 'kotlin var'],
      snippet: 'var ${1:variableName}: ${2:String} = "${3:value}"$0',
      description: 'Kotlin var (mutable)',
      detail: 'var name: Type = value',
      priority: 80,
      language: 'kotlin'
    });

    this.addSnippet('kotlinFor', {
      patterns: ['for', 'kotlin for'],
      snippet: 'for (${1:item} in ${2:collection}) {\n\t${3:// loop body}\n}$0',
      description: 'Kotlin for loop',
      detail: 'for (item in collection) { }',
      priority: 95,
      language: 'kotlin'
    });

    this.addSnippet('kotlinIf', {
      patterns: ['if', 'kotlin if'],
      snippet: 'if (${1:condition}) {\n\t${2:// if block}\n}$0',
      description: 'Kotlin if statement',
      detail: 'if (condition) { }',
      priority: 95,
      language: 'kotlin'
    });

    this.addSnippet('kotlinWhen', {
      patterns: ['when', 'kotlin when'],
      snippet: 'when (${1:expression}) {\n\t${2:value1} -> ${3:result1}\n\t${4:value2} -> ${5:result2}\n\telse -> ${6:defaultResult}\n}$0',
      description: 'Kotlin when expression',
      detail: 'when (expr) { value -> result }',
      priority: 90,
      language: 'kotlin'
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
