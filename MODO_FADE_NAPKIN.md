# 🎨 Modo Fade - Diseño Estilo Napkin

## 📋 Resumen

Se implementó un diseño completo estilo **Napkin.io** para el modo Fade, con un sidebar compacto de iconos, barra de herramientas de desarrollador, y soporte completo para Java con Scanner y System.out.

---

## 🚀 Componentes Creados

### 1. **FadeSidebar.jsx** - Sidebar Compacto con Iconos

**Ubicación:** `src/components/FadeSidebar.jsx`

**Características:**
- Width: 60px
- Background: `#1a1a1a`
- Iconos verticales con hover effects
- Herramientas disponibles:
  - 🖥️ **Terminal** - Abre la terminal integrada
  - 🔍 **Buscar** - Panel de búsqueda en archivos
  - 📄 **Archivos** - Vista de archivos (futuro)

**Estilo:**
- Iconos: 20x20px
- Hover: Scale 1.1
- Activo: Background `#3f3f46`, border `#52525b`, color azul `#60a5fa`
- Inactivo: Color gris `#71717a`

---

### 2. **DevToolsBar.jsx** - Barra de Herramientas de Desarrollador

**Ubicación:** `src/components/DevToolsBar.jsx`

**Herramientas Implementadas:**

#### 📡 **API Tester**
- Métodos: GET, POST, PUT, DELETE
- Input de URL
- Botón "Enviar" con loading state
- Respuesta con:
  - Status code (verde si <400, rojo si >=400)
  - Status text
  - JSON formateado
  - Botón copiar respuesta
- Manejo de errores

#### 🔧 **JSON Formatter**
- Input JSON (textarea)
- Botón "Formatear"
- Output formateado con indentación
- Botón copiar resultado
- Detección de errores de sintaxis
- Grid de 2 columnas (input/output)

**Estilo:**
- Background: `#1a1a1a`
- Tabs con indicador de color (azul para API, amarillo para JSON)
- Inputs/textareas: Background `#2a2a2a`, border `#3f3f46`
- Botones: Colores temáticos con hover effects

---

### 3. **FadeSearch.jsx** - Panel de Búsqueda en Archivos

**Ubicación:** `src/components/FadeSearch.jsx`

**Características:**
- Width: 350px
- Búsqueda en:
  - ✅ Nombres de archivos
  - ✅ Contenido de archivos
- Muestra:
  - Nombre del archivo
  - Número de línea (si es en contenido)
  - Preview del match
- Click para abrir archivo
- Límite: 50 resultados
- Contador de resultados

**UI:**
- Input con icono de búsqueda
- Lista scrollable de resultados
- Icono de archivo con color azul
- Hover effect en resultados
- Estado vacío con mensaje informativo

---

## ☕ Soporte Completo para Java

### 4. **executeJavaCode()** - Ejecutor de Java Simulado

**Ubicación:** `src/utils/terminalCommands.js`

**Capacidades:**

#### ✅ **System.out**
```java
System.out.println("Hola Mundo");  // Con salto de línea
System.out.print("Sin salto");      // Sin salto de línea
```

#### ✅ **Scanner (Entrada de Usuario)**
```java
Scanner scanner = new Scanner(System.in);
String nombre = scanner.nextLine();
int edad = scanner.nextInt();
double precio = scanner.nextDouble();
```
- Detecta automáticamente cuántos inputs necesita
- Muestra prompts al usuario
- Soporta: `nextLine()`, `nextInt()`, `nextDouble()`, `nextFloat()`, `nextBoolean()`

#### ✅ **Variables**
```java
int edad = 25;
String nombre = "Juan";
double salario = 50000.50;
boolean activo = true;
```

#### ✅ **Operaciones Matemáticas**
```java
int suma = 10 + 5;
int producto = 4 * 3;
System.out.println("Resultado: " + suma);
```

#### ✅ **Validaciones**
- Verifica `public class`
- Verifica `public static void main`
- Valida llaves balanceadas
- Mensajes de error descriptivos

---

### 5. **compileJava()** - Compilador Java Simulado

**Ubicación:** `src/utils/terminalCommands.js`

**Validaciones:**
- ✅ Clase pública requerida
- ✅ Método main requerido
- ✅ Sintaxis de llaves
- ✅ Mensajes de error claros

---

### 6. **Terminal.jsx - Integración de Java**

**Función:** `executeJavaCode(code)`

**Flujo:**
1. Importa `executeJavaCode` de terminalCommands
2. Crea función `onInput` con prompts
3. Ejecuta el código Java
4. Muestra resultados en terminal:
   - ✅ Success: Nombre de clase
   - ❌ Error: Mensaje y detalles
   - 📝 Output: Cada System.out

**Logs en Terminal:**
- Info: "▸ Compilando y ejecutando código Java..."
- Success: "✓ Ejecución completada (NombreClase)"
- Error: "❌ Error de compilación: mensaje"

---

## 🔗 Integración en App.jsx

### Estados Agregados

```javascript
const [fadeSidebarTool, setFadeSidebarTool] = useState('terminal');
const [showFadeSearch, setShowFadeSearch] = useState(false);
const [showDevTools, setShowDevTools] = useState(true);
```

### Layout del Modo Fade

```
┌─────────┬──────────┬────────────────────────┐
│         │          │   DevToolsBar          │
│  Fade   │  Fade    ├────────────────────────┤
│ Sidebar │  Search  │                        │
│ (60px)  │ (350px)  │   Editor (Compacto)    │
│         │(opcional)│   maxWidth: 850px      │
│         │          │   maxHeight: 550px     │
└─────────┴──────────┴────────────────────────┘
                     │   Terminal (Compacto)  │
                     └────────────────────────┘
```

### handleExecuteCode() Actualizado

Ahora soporta:
- ✅ JavaScript (.js)
- ✅ Python (.py)
- ✅ **Java (.java)** ← NUEVO

```javascript
else if (fileName.endsWith('.java')) {
  if (!showTerminal) setShowTerminal(true);
  setTimeout(() => {
    if (terminalRef.current) {
      terminalRef.current.executeJava(activeFile.content);
    }
  }, showTerminal ? 0 : 100);
}
```

---

## 📁 Archivo de Ejemplo: HelloJava.java

**Ubicación:** `examples/HelloJava.java`

**Contenido:**
- Declaración de clase y main
- Variables (String, int, double)
- System.out.println()
- Scanner con nextLine() y nextInt()
- Operaciones matemáticas
- Concatenación de strings

**Ejecutar:**
1. Abrir HelloJava.java en el editor
2. Presionar botón "Ejecutar" o Ctrl+Enter
3. Terminal se abre automáticamente
4. Aparecen prompts para ingresar datos
5. Se muestra el resultado

---

## 🎨 Colores y Estilos del Modo Fade

### Paleta de Colores

```css
Background Principal: #171717
Background Secundario: #1a1a1a, #1f1f1f
Background Terciario: #262626, #2a2a2a

Borders: #2a2a2a, #3f3f46
Texto Primario: #e4e4e7 (blanco hueso)
Texto Secundario: #a1a1aa (gris medio)
Texto Terciario: #71717a (gris opaco)

Azul (Código): #60a5fa
Amarillo (Código): #fbbf24, #facc15
```

### Tamaños

```
Sidebar: 60px width
Search Panel: 350px width
Editor: max 850px width, 550px height
Terminal: max 850px width, 550px height
Border Radius: 16px
Box Shadow: 0 20px 60px rgba(0, 0, 0, 0.5)
```

---

## 🚀 Características Adicionales

### DevToolsBar

**API Tester:**
- ⚡ Fetch real a APIs
- 🎨 Color coding de status
- 📋 Copiar respuesta
- ⏳ Loading state
- ❌ Error handling

**JSON Formatter:**
- ✨ Formateo con indentación
- 📋 Copiar resultado
- ⚠️ Validación de sintaxis
- 🎨 Syntax highlighting (verde)

### FadeSearch

- 🔍 Búsqueda en tiempo real
- 📁 Por nombre de archivo
- 📝 Por contenido
- 📊 Contador de resultados
- ⚡ Límite de 50 para performance

---

## 📚 Archivos Modificados

```
src/
├── components/
│   ├── FadeSidebar.jsx          ← NUEVO
│   ├── DevToolsBar.jsx          ← NUEVO
│   ├── FadeSearch.jsx           ← NUEVO
│   ├── Terminal.jsx             ← MODIFICADO (executeJavaCode)
│   └── TopBar.jsx               ← MODIFICADO (colores Fade)
├── utils/
│   ├── terminalCommands.js      ← MODIFICADO (+Java)
│   └── globalThemes.js          ← MODIFICADO (colores)
├── App.jsx                      ← MODIFICADO (layout Fade)
└── index.css                    ← MODIFICADO (estilos Fade)

examples/
└── HelloJava.java               ← NUEVO
```

---

## ✅ TODO Completado

- [x] Sidebar compacto estilo Napkin (60px)
- [x] DevToolsBar con API Tester
- [x] DevToolsBar con JSON Formatter
- [x] Panel de búsqueda en archivos
- [x] Soporte completo para Java
- [x] System.out.println() y print()
- [x] Scanner con todos los tipos
- [x] Variables Java (int, String, double, etc.)
- [x] Operaciones matemáticas
- [x] Validación de sintaxis Java
- [x] Integración en Terminal.jsx
- [x] Integración en App.jsx
- [x] Archivo de ejemplo HelloJava.java
- [x] Colores sólidos en TopBar (grises)
- [x] Layout compacto y centrado
- [x] Documentación completa

---

## 🎯 Uso

### Activar Modo Fade

1. Click en botón "Modos" en TopBar
2. Seleccionar "Fade"

### Usar Sidebar

- Click en icono Terminal → Abre/cierra terminal
- Click en icono Buscar → Abre panel de búsqueda
- Click en icono Archivos → (Futuro)

### Usar DevTools

**API Tester:**
1. Seleccionar método (GET/POST/etc.)
2. Ingresar URL
3. Click "Enviar"
4. Ver respuesta

**JSON Formatter:**
1. Pegar JSON en input
2. Click "Formatear"
3. Copiar resultado

### Ejecutar Java

1. Abrir archivo .java
2. Escribir código con main
3. Click "Ejecutar" o Ctrl+Enter
4. Ingresar datos cuando se soliciten
5. Ver resultado en terminal

---

## 🔮 Futuro

- [ ] Compilador Java real (GraalVM o similar)
- [ ] Debugger para Java
- [ ] Más herramientas en DevToolsBar (Base64, Hash, etc.)
- [ ] Panel de archivos completo en sidebar
- [ ] Breakpoints en código Java
- [ ] REPL interactivo para Java

---

**Implementado exitosamente** ✨
