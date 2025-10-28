# 🚀 Soporte Completo para Java - Estilo IntelliJ IDEA

## ✨ Características Implementadas

### **1. Plantilla Automática al Crear Archivos .java**

Cuando creas un archivo `.java`, se genera automáticamente una estructura completa:

```java
public class NombreArchivo {
    
    // Constructor
    public NombreArchivo() {
        
    }
    
    // Método main (punto de entrada)
    public static void main(String[] args) {
        System.out.println("Hola desde NombreArchivo");
    }
    
}
```

**Ejemplo:**
- Crear archivo: `Main.java`
- Se genera automáticamente: `public class Main { ... }`

---

## ⚡ Atajos Estilo IntelliJ IDEA

El editor ahora incluye TODOS los snippets más usados de IntelliJ IDEA. Escribe el atajo y presiona `Tab` o `Enter`:

### **Atajos Principales (Los más usados)**

| Atajo | Resultado | Descripción |
|-------|-----------|-------------|
| `sout` | `System.out.println();` | Print a consola |
| `soutv` | `System.out.println("variable = " + variable);` | Print variable con nombre |
| `souf` | `System.out.printf("%s\n", );` | Print con formato |
| `serr` | `System.err.println();` | Print error |
| `psvm` | `public static void main(String[] args) { }` | Método main |
| `main` | `public static void main(String[] args) { }` | Método main (alternativo) |
| `fori` | `for (int i = 0; i < length; i++) { }` | For loop con índice |
| `iter` | `for (Type item : collection) { }` | Enhanced for loop |
| `ifn` | `if (variable == null) { }` | If null |
| `inn` | `if (variable != null) { }` | If not null |

### **Constantes y Modificadores**

| Atajo | Resultado |
|-------|-----------|
| `psf` | `public static final Type NAME = ` |
| `prsf` | `private static final Type NAME = ` |
| `psfi` | `public static final int NAME = 0;` |
| `psfs` | `public static final String NAME = "";` |
| `St` | `String name = "";` |

### **Loops y Iteraciones**

| Atajo | Descripción |
|-------|-------------|
| `fori` | For con índice (int i = 0...) |
| `iter` | Enhanced for (for-each) |
| `itar` | Iterar array con índice |
| `itli` | Iterar List con get(i) |
| `itco` | Iterar con Iterator |
| `ritar` | Iterar array en reverso |

### **Try-Catch y Excepciones**

| Atajo | Resultado |
|-------|-----------|
| `try` | Try-catch block |
| `trycatch` | Try-catch block |
| `tryf` | Try-catch-finally |
| `twr` | Try-with-resources |
| `thr` | `throw new Exception("");` |

### **Colecciones**

| Atajo | Resultado |
|-------|-----------|
| `lst` | `List<Type> list = new ArrayList<>();` |
| `map` | `Map<K,V> map = new HashMap<>();` |
| `set` | `Set<Type> set = new HashSet<>();` |

### **Getters y Setters**

| Atajo | Resultado |
|-------|-----------|
| `getter` | Generate getter method |
| `setter` | Generate setter method |
| `ctor` | Generate constructor |

### **Métodos Override**

| Atajo | Resultado |
|-------|-----------|
| `tostring` | Generate toString() |
| `equals` | Generate equals() |
| `hashcode` | Generate hashCode() |

### **Lambdas y Streams (Java 8+)**

| Atajo | Resultado |
|-------|-----------|
| `lambda` | `(params) -> expression` |
| `foreach` | `.forEach(item -> { })` |
| `stream` | Stream API con filter/collect |

### **Tests (JUnit)**

| Atajo | Resultado |
|-------|-----------|
| `test` | `@Test public void testName() { }` |
| `before` | `@Before public void setUp() { }` |
| `after` | `@After public void tearDown() { }` |

### **Estructuras Completas**

| Atajo | Descripción |
|-------|-------------|
| `class` | Clase completa con atributos, constructor, getters/setters |
| `interface` | Interface declaration |
| `enum` | Enum declaration |
| `singleton` | Singleton pattern completo |
| `switch` | Switch expression (Java 12+) |
| `scanner` | Scanner input setup completo |

### **Documentación**

| Atajo | Resultado |
|-------|-----------|
| `javadoc` | Javadoc comment completo |
| `author` | @author, @version, @since tags |

---

## 📝 Snippets Comunes de Java

### **Estructuras de Control**

#### **1. For Loop**
```java
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

#### **2. Enhanced For Loop**
```java
for (String item : items) {
    System.out.println(item);
}
```

#### **3. While Loop**
```java
while (condition) {
    // código
}
```

#### **4. Do-While Loop**
```java
do {
    // código
} while (condition);
```

#### **5. If-Else**
```java
if (condition) {
    // código
} else if (otherCondition) {
    // código
} else {
    // código
}
```

#### **6. Switch**
```java
switch (variable) {
    case 1:
        // código
        break;
    case 2:
        // código
        break;
    default:
        // código
        break;
}
```

---

### **Clases y Objetos**

#### **7. Clase Simple**
```java
public class MiClase {
    // Atributos
    private String nombre;
    private int edad;
    
    // Constructor
    public MiClase(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }
    
    // Getters y Setters
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    // Métodos
    public void mostrarInfo() {
        System.out.println("Nombre: " + nombre + ", Edad: " + edad);
    }
}
```

#### **8. Herencia**
```java
public class ClaseHija extends ClasePadre {
    
    public ClaseHija() {
        super(); // Llamar al constructor de la clase padre
    }
    
    @Override
    public void metodo() {
        // Sobreescribir método
    }
}
```

#### **9. Interfaz**
```java
public interface MiInterfaz {
    void metodo1();
    void metodo2();
}

public class MiClase implements MiInterfaz {
    @Override
    public void metodo1() {
        // implementación
    }
    
    @Override
    public void metodo2() {
        // implementación
    }
}
```

---

### **Entrada/Salida**

#### **10. Scanner (Leer input)**
```java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);
System.out.print("Ingresa tu nombre: ");
String nombre = scanner.nextLine();
System.out.println("Hola, " + nombre);
scanner.close();
```

#### **11. Leer archivo**
```java
import java.io.*;

try {
    BufferedReader reader = new BufferedReader(new FileReader("archivo.txt"));
    String linea;
    while ((linea = reader.readLine()) != null) {
        System.out.println(linea);
    }
    reader.close();
} catch (IOException e) {
    e.printStackTrace();
}
```

#### **12. Escribir archivo**
```java
import java.io.*;

try {
    BufferedWriter writer = new BufferedWriter(new FileWriter("archivo.txt"));
    writer.write("Hola mundo");
    writer.newLine();
    writer.close();
} catch (IOException e) {
    e.printStackTrace();
}
```

---

### **Colecciones**

#### **13. ArrayList**
```java
import java.util.ArrayList;

ArrayList<String> lista = new ArrayList<>();
lista.add("Elemento 1");
lista.add("Elemento 2");
lista.remove(0);
System.out.println(lista.get(0));
```

#### **14. HashMap**
```java
import java.util.HashMap;

HashMap<String, Integer> mapa = new HashMap<>();
mapa.put("clave1", 100);
mapa.put("clave2", 200);
System.out.println(mapa.get("clave1"));
```

#### **15. HashSet**
```java
import java.util.HashSet;

HashSet<String> conjunto = new HashSet<>();
conjunto.add("valor1");
conjunto.add("valor2");
System.out.println(conjunto.contains("valor1"));
```

---

### **Manejo de Excepciones**

#### **16. Try-Catch**
```java
try {
    // código que puede lanzar excepción
    int resultado = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Error: " + e.getMessage());
} finally {
    System.out.println("Esto siempre se ejecuta");
}
```

#### **17. Lanzar Excepción**
```java
public void metodo() throws Exception {
    if (error) {
        throw new Exception("Mensaje de error");
    }
}
```

---

### **Programación Funcional (Java 8+)**

#### **18. Lambda**
```java
lista.forEach(item -> System.out.println(item));
```

#### **19. Stream**
```java
import java.util.stream.Collectors;

List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> pares = numeros.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
```

---

## ⌨️ Atajos de Teclado en el Editor

| Atajo | Descripción |
|-------|-------------|
| `Ctrl + S` | Guardar y formatear código |
| `Ctrl + Shift + F` | Formatear código |
| `Ctrl + Space` | Autocompletado |
| `Ctrl + /` | Comentar/Descomentar línea |
| `Ctrl + D` | Duplicar línea |
| `Alt + ↑/↓` | Mover línea arriba/abajo |
| `Ctrl + F` | Buscar |
| `Ctrl + H` | Buscar y reemplazar |
| `F2` | Renombrar símbolo |

---

## 🎯 Características del Editor para Java

### **Autocompletado Inteligente**
- Completado de métodos y clases
- Sugerencias de imports
- Snippets personalizados

### **Resaltado de Sintaxis**
- Palabras clave
- Tipos de datos
- Comentarios
- Strings y números

### **Validación en Tiempo Real**
- Errores de sintaxis
- Advertencias
- Sugerencias de mejora

### **Code Folding**
- Colapsar/expandir métodos
- Colapsar/expandir clases
- Colapsar/expandir comentarios

---

## 💡 Ejemplos Prácticos

### **Ejemplo 1: Clase Completa**
```java
public class Persona {
    private String nombre;
    private int edad;
    
    public Persona(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public int getEdad() {
        return edad;
    }
    
    public void setEdad(int edad) {
        this.edad = edad;
    }
    
    @Override
    public String toString() {
        return "Persona{nombre='" + nombre + "', edad=" + edad + "}";
    }
    
    public static void main(String[] args) {
        Persona persona = new Persona("Juan", 25);
        System.out.println(persona);
    }
}
```

### **Ejemplo 2: Programa con ArrayList**
```java
import java.util.ArrayList;
import java.util.Scanner;

public class GestorTareas {
    private ArrayList<String> tareas;
    
    public GestorTareas() {
        this.tareas = new ArrayList<>();
    }
    
    public void agregarTarea(String tarea) {
        tareas.add(tarea);
        System.out.println("✅ Tarea agregada: " + tarea);
    }
    
    public void mostrarTareas() {
        System.out.println("\n📋 Lista de Tareas:");
        for (int i = 0; i < tareas.size(); i++) {
            System.out.println((i + 1) + ". " + tareas.get(i));
        }
    }
    
    public static void main(String[] args) {
        GestorTareas gestor = new GestorTareas();
        Scanner scanner = new Scanner(System.in);
        
        gestor.agregarTarea("Estudiar Java");
        gestor.agregarTarea("Hacer ejercicio");
        gestor.mostrarTareas();
        
        scanner.close();
    }
}
```

---

## 🚀 Próximas Mejoras

- [ ] Compilación y ejecución en el navegador (GraalVM)
- [ ] Debugging con breakpoints
- [ ] Refactoring automático
- [ ] Generador de tests unitarios
- [ ] Análisis de código estático

---

## 📚 Recursos Adicionales

- [Documentación oficial de Java](https://docs.oracle.com/javase/)
- [Java Tutorials](https://docs.oracle.com/javase/tutorial/)
- [Effective Java](https://www.oreilly.com/library/view/effective-java/9780134686097/)
