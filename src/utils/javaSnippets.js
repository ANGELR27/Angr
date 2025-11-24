/**
 * Sistema de snippets completos para Java
 */

export class JavaSnippetEngine {
  constructor() {
    this.snippets = new Map();
    this.initializeJavaSnippets();
  }

  /**
   * Inicializa todos los snippets de Java
   */
  initializeJavaSnippets() {
    // ======= PRINT Y DEBUG =======
    this.addSnippet('sout', {
      patterns: ['System.out.println', 'sout', 'println'],
      snippet: 'System.out.println(${1:value});$0',
      description: 'System.out.println',
      detail: 'System.out.println(value)',
      priority: 100
    });

    this.addSnippet('soutf', {
      patterns: ['System.out.printf', 'soutf', 'printf'],
      snippet: 'System.out.printf("${1:format}", ${2:args});$0',
      description: 'System.out.printf',
      detail: 'System.out.printf("format", args)',
      priority: 95
    });

    this.addSnippet('serr', {
      patterns: ['System.err.println', 'serr'],
      snippet: 'System.err.println(${1:error});$0',
      description: 'System.err.println',
      detail: 'System.err.println(error)',
      priority: 90
    });

    // ======= MAIN METHOD =======
    this.addSnippet('main', {
      patterns: ['public static void main', 'main', 'psvm'],
      snippet: 'public static void main(String[] args) {\n\t${1:// TODO: Add your code here}\n}$0',
      description: 'main method',
      detail: 'public static void main(String[] args)',
      priority: 100
    });

    // ======= CLASES =======
    this.addSnippet('class', {
      patterns: ['public class', 'class'],
      snippet: 'public class ${1:ClassName} {\n\t${2:// Class body}\n\t\n\tpublic ${1:ClassName}() {\n\t\t${3:// Constructor}\n\t}\n\t\n\tpublic static void main(String[] args) {\n\t\t${4:// Main method}\n\t}\n}$0',
      description: 'public class',
      detail: 'public class ClassName { }',
      priority: 95
    });

    this.addSnippet('classExtends', {
      patterns: ['class extends', 'extends'],
      snippet: 'public class ${1:ChildClass} extends ${2:ParentClass} {\n\t\n\tpublic ${1:ChildClass}() {\n\t\tsuper();\n\t\t${3:// Constructor}\n\t}\n\t\n\t@Override\n\tpublic ${4:void} ${5:method}() {\n\t\tsuper.${5:method}();\n\t\t${6:// Override implementation}\n\t}\n}$0',
      description: 'class with inheritance',
      detail: 'class Child extends Parent',
      priority: 88
    });

    this.addSnippet('interface', {
      patterns: ['interface', 'public interface'],
      snippet: 'public interface ${1:InterfaceName} {\n\t${2:// Method declarations}\n\t${3:void} ${4:methodName}(${5:parameters});\n}$0',
      description: 'interface declaration',
      detail: 'public interface InterfaceName',
      priority: 85
    });

    this.addSnippet('implements', {
      patterns: ['implements', 'class implements'],
      snippet: 'public class ${1:ClassName} implements ${2:InterfaceName} {\n\t\n\t@Override\n\tpublic ${3:void} ${4:methodName}(${5:parameters}) {\n\t\t${6:// Implementation}\n\t}\n}$0',
      description: 'class implementing interface',
      detail: 'class ClassName implements Interface',
      priority: 85
    });

    // ======= MÉTODOS =======
    this.addSnippet('method', {
      patterns: ['public', 'method'],
      snippet: 'public ${1:void} ${2:methodName}(${3:parameters}) {\n\t${4:// Method body}\n}$0',
      description: 'public method',
      detail: 'public void methodName()',
      priority: 90
    });

    this.addSnippet('privateMethod', {
      patterns: ['private', 'private method'],
      snippet: 'private ${1:void} ${2:methodName}(${3:parameters}) {\n\t${4:// Method body}\n}$0',
      description: 'private method',
      detail: 'private void methodName()',
      priority: 85
    });

    this.addSnippet('staticMethod', {
      patterns: ['public static', 'static'],
      snippet: 'public static ${1:void} ${2:methodName}(${3:parameters}) {\n\t${4:// Static method body}\n}$0',
      description: 'static method',
      detail: 'public static void methodName()',
      priority: 85
    });

    this.addSnippet('constructor', {
      patterns: ['constructor', 'ctor'],
      snippet: 'public ${1:ClassName}(${2:parameters}) {\n\t${3:// Constructor body}\n}$0',
      description: 'constructor',
      detail: 'public ClassName(params)',
      priority: 90
    });

    // ======= VARIABLES =======
    this.addSnippet('final', {
      patterns: ['final', 'constant'],
      snippet: 'public static final ${1:String} ${2:CONSTANT_NAME} = ${3:value};$0',
      description: 'final constant',
      detail: 'public static final TYPE NAME = value',
      priority: 80
    });

    this.addSnippet('private', {
      patterns: ['private field', 'field'],
      snippet: 'private ${1:String} ${2:fieldName};$0',
      description: 'private field',
      detail: 'private Type fieldName',
      priority: 80
    });

    // ======= ESTRUCTURAS DE CONTROL =======
    this.addSnippet('if', {
      patterns: ['if'],
      snippet: 'if (${1:condition}) {\n\t${2:// if block}\n}$0',
      description: 'if statement',
      detail: 'if (condition) { }',
      priority: 95
    });

    this.addSnippet('ifelse', {
      patterns: ['if else', 'ifelse'],
      snippet: 'if (${1:condition}) {\n\t${2:// if block}\n} else {\n\t${3:// else block}\n}$0',
      description: 'if-else statement',
      detail: 'if (condition) { } else { }',
      priority: 90
    });

    this.addSnippet('for', {
      patterns: ['for'],
      snippet: 'for (${1:int} ${2:i} = ${3:0}; ${2:i} < ${4:length}; ${2:i}++) {\n\t${5:// loop body}\n}$0',
      description: 'for loop',
      detail: 'for (int i = 0; i < length; i++)',
      priority: 95
    });

    this.addSnippet('foreach', {
      patterns: ['for each', 'foreach', 'enhanced for'],
      snippet: 'for (${1:String} ${2:item} : ${3:collection}) {\n\t${4:// loop body}\n}$0',
      description: 'enhanced for loop',
      detail: 'for (Type item : collection)',
      priority: 90
    });

    this.addSnippet('while', {
      patterns: ['while'],
      snippet: 'while (${1:condition}) {\n\t${2:// loop body}\n}$0',
      description: 'while loop',
      detail: 'while (condition) { }',
      priority: 85
    });

    this.addSnippet('dowhile', {
      patterns: ['do while', 'dowhile'],
      snippet: 'do {\n\t${1:// loop body}\n} while (${2:condition});$0',
      description: 'do-while loop',
      detail: 'do { } while (condition)',
      priority: 80
    });

    this.addSnippet('switch', {
      patterns: ['switch'],
      snippet: 'switch (${1:expression}) {\n\tcase ${2:value1}:\n\t\t${3:// case 1}\n\t\tbreak;\n\tcase ${4:value2}:\n\t\t${5:// case 2}\n\t\tbreak;\n\tdefault:\n\t\t${6:// default case}\n\t\tbreak;\n}$0',
      description: 'switch statement',
      detail: 'switch (expression) { case: break; }',
      priority: 85
    });

    // ======= EXCEPCIONES =======
    this.addSnippet('try', {
      patterns: ['try', 'try catch'],
      snippet: 'try {\n\t${1:// try block}\n} catch (${2:Exception} ${3:e}) {\n\t${4:e.printStackTrace();}\n}$0',
      description: 'try-catch block',
      detail: 'try { } catch (Exception e) { }',
      priority: 90
    });

    this.addSnippet('tryfinally', {
      patterns: ['try finally', 'tryfinally'],
      snippet: 'try {\n\t${1:// try block}\n} catch (${2:Exception} ${3:e}) {\n\t${4:e.printStackTrace();}\n} finally {\n\t${5:// finally block}\n}$0',
      description: 'try-catch-finally block',
      detail: 'try { } catch { } finally { }',
      priority: 85
    });

    this.addSnippet('throw', {
      patterns: ['throw'],
      snippet: 'throw new ${1:RuntimeException}("${2:error message}");$0',
      description: 'throw exception',
      detail: 'throw new Exception("message")',
      priority: 80
    });

    this.addSnippet('throws', {
      patterns: ['throws'],
      snippet: 'public ${1:void} ${2:methodName}() throws ${3:Exception} {\n\t${4:// method body}\n}$0',
      description: 'method with throws',
      detail: 'method() throws Exception',
      priority: 75
    });

    // ======= ARRAYS Y COLECCIONES =======
    this.addSnippet('array', {
      patterns: ['array', 'new array'],
      snippet: '${1:String}[] ${2:arrayName} = new ${1:String}[${3:size}];$0',
      description: 'array declaration',
      detail: 'Type[] array = new Type[size]',
      priority: 85
    });

    this.addSnippet('arrayList', {
      patterns: ['ArrayList', 'List'],
      snippet: 'List<${1:String}> ${2:listName} = new ArrayList<>();$0',
      description: 'ArrayList declaration',
      detail: 'List<Type> list = new ArrayList<>()',
      priority: 85
    });

    this.addSnippet('hashMap', {
      patterns: ['HashMap', 'Map'],
      snippet: 'Map<${1:String}, ${2:String}> ${3:mapName} = new HashMap<>();$0',
      description: 'HashMap declaration',
      detail: 'Map<Key, Value> map = new HashMap<>()',
      priority: 80
    });

    this.addSnippet('hashSet', {
      patterns: ['HashSet', 'Set'],
      snippet: 'Set<${1:String}> ${2:setName} = new HashSet<>();$0',
      description: 'HashSet declaration',
      detail: 'Set<Type> set = new HashSet<>()',
      priority: 75
    });

    // ======= SCANNER (INPUT) =======
    this.addSnippet('scanner', {
      patterns: ['Scanner', 'input', 'scanner input'],
      snippet: 'Scanner ${1:scanner} = new Scanner(System.in);\nSystem.out.print("${2:Enter value}: ");\n${3:String} ${4:input} = ${1:scanner}.${5|nextLine(),nextInt(),nextDouble()|};\n${1:scanner}.close();$0',
      description: 'Scanner for input',
      detail: 'Scanner scanner = new Scanner(System.in)',
      priority: 90
    });

    this.addSnippet('scannerInt', {
      patterns: ['Scanner int', 'nextInt'],
      snippet: 'Scanner ${1:scanner} = new Scanner(System.in);\nSystem.out.print("${2:Enter number}: ");\nint ${3:number} = ${1:scanner}.nextInt();\n${1:scanner}.close();$0',
      description: 'Scanner for integer input',
      detail: 'scanner.nextInt()',
      priority: 85
    });

    // ======= GETTERS Y SETTERS =======
    this.addSnippet('getter', {
      patterns: ['getter', 'get'],
      snippet: 'public ${1:String} get${2:PropertyName}() {\n\treturn ${3:propertyName};\n}$0',
      description: 'getter method',
      detail: 'public Type getProperty() { return property; }',
      priority: 80
    });

    this.addSnippet('setter', {
      patterns: ['setter', 'set'],
      snippet: 'public void set${1:PropertyName}(${2:String} ${3:propertyName}) {\n\tthis.${3:propertyName} = ${3:propertyName};\n}$0',
      description: 'setter method',
      detail: 'public void setProperty(Type property)',
      priority: 80
    });

    this.addSnippet('getterSetter', {
      patterns: ['getter setter', 'getset'],
      snippet: 'private ${1:String} ${2:propertyName};\n\npublic ${1:String} get${3:PropertyName}() {\n\treturn ${2:propertyName};\n}\n\npublic void set${3:PropertyName}(${1:String} ${2:propertyName}) {\n\tthis.${2:propertyName} = ${2:propertyName};\n}$0',
      description: 'getter and setter',
      detail: 'private field with getter and setter',
      priority: 85
    });

    // ======= ANOTACIONES =======
    this.addSnippet('override', {
      patterns: ['@Override', 'override'],
      snippet: '@Override\npublic ${1:void} ${2:methodName}(${3:parameters}) {\n\t${4:// Override implementation}\n}$0',
      description: '@Override annotation',
      detail: '@Override public void method()',
      priority: 85
    });

    this.addSnippet('deprecated', {
      patterns: ['@Deprecated', 'deprecated'],
      snippet: '@Deprecated\npublic ${1:void} ${2:methodName}(${3:parameters}) {\n\t${4:// Deprecated method}\n}$0',
      description: '@Deprecated annotation',
      detail: '@Deprecated method',
      priority: 70
    });

    // ======= THREAD Y LAMBDA =======
    this.addSnippet('thread', {
      patterns: ['Thread', 'new Thread'],
      snippet: 'Thread ${1:thread} = new Thread(() -> {\n\t${2:// Thread code}\n});\n${1:thread}.start();$0',
      description: 'Thread with lambda',
      detail: 'new Thread(() -> { })',
      priority: 75
    });

    this.addSnippet('lambda', {
      patterns: ['lambda', '->'],
      snippet: '${1:list}.${2:forEach}(${3:item} -> {\n\t${4:System.out.println(item);}\n});$0',
      description: 'lambda expression',
      detail: 'item -> { }',
      priority: 80
    });

    // ======= IMPORTS COMUNES =======
    this.addSnippet('importUtil', {
      patterns: ['import java.util', 'import util'],
      snippet: 'import java.util.*;$0',
      description: 'import java.util.*',
      detail: 'import java.util.*',
      priority: 75
    });

    this.addSnippet('importScanner', {
      patterns: ['import Scanner'],
      snippet: 'import java.util.Scanner;$0',
      description: 'import Scanner',
      detail: 'import java.util.Scanner',
      priority: 80
    });

    this.addSnippet('importList', {
      patterns: ['import List'],
      snippet: 'import java.util.List;\nimport java.util.ArrayList;$0',
      description: 'import List and ArrayList',
      detail: 'import List and ArrayList',
      priority: 75
    });

    // ======= TESTING (JUnit) =======
    this.addSnippet('test', {
      patterns: ['@Test', 'test'],
      snippet: '@Test\npublic void test${1:MethodName}() {\n\t// Arrange\n\t${2:String expected = "expected";}\n\t\n\t// Act\n\t${3:String actual = methodToTest();}\n\t\n\t// Assert\n\t${4:assertEquals(expected, actual);}\n}$0',
      description: 'JUnit test method',
      detail: '@Test public void testMethod()',
      priority: 80
    });

    this.addSnippet('assertEquals', {
      patterns: ['assertEquals', 'assert'],
      snippet: 'assertEquals(${1:expected}, ${2:actual});$0',
      description: 'assertEquals assertion',
      detail: 'assertEquals(expected, actual)',
      priority: 75
    });

    // ======= ENUM =======
    this.addSnippet('enum', {
      patterns: ['enum'],
      snippet: 'public enum ${1:EnumName} {\n\t${2:VALUE1},\n\t${3:VALUE2},\n\t${4:VALUE3};\n\t\n\tprivate ${5:String} ${6:description};\n\t\n\t${1:EnumName}(${5:String} ${6:description}) {\n\t\tthis.${6:description} = ${6:description};\n\t}\n\t\n\tpublic ${5:String} get${7:Description}() {\n\t\treturn ${6:description};\n\t}\n}$0',
      description: 'enum declaration',
      detail: 'public enum EnumName { }',
      priority: 75
    });

    // ======= RECORD (Java 14+) =======
    this.addSnippet('record', {
      patterns: ['record'],
      snippet: 'public record ${1:RecordName}(${2:String name}, ${3:int age}) {\n\t${4:// Additional methods if needed}\n}$0',
      description: 'record declaration',
      detail: 'public record RecordName(fields)',
      priority: 70
    });
  }

  /**
   * Agrega un snippet
   */
  addSnippet(name, config) {
    this.snippets.set(name, { ...config, language: 'java' });
  }

  /**
   * Obtiene sugerencias de Java basadas en input
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
        value: `**${suggestion.description}**\n\n${suggestion.detail}\n\n\`\`\`java\n${suggestion.snippet.replace(/\$\{?\d+:?([^}]*)\}?/g, '$1').replace(/\$0/g, '')}\n\`\`\``
      },
      detail: suggestion.detail,
      sortText: String(1000 - (suggestion.matchScore + (suggestion.priority || 0))).padStart(4, '0'),
      range,
      preselect: index === 0,
      commitCharacters: ['.', '(', ' ', '\t']
    }));
  }
}
