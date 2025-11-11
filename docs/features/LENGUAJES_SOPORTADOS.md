# Lenguajes Soportados 🌐

El editor ahora soporta múltiples lenguajes de programación con resaltado de sintaxis completo, autocompletado y validación en tiempo real gracias a Monaco Editor.

## Lenguajes Web 🌍

### HTML
- **Extensión:** `.html`
- **Características:** Autocompletado de etiquetas, atributos, snippets
- **Ejemplo:** `index.html`

### CSS
- **Extensión:** `.css`
- **Características:** Autocompletado de propiedades, valores, selectores
- **Ejemplo:** `styles.css`

### JavaScript
- **Extensión:** `.js`
- **Características:** IntelliSense, snippets, validación de sintaxis
- **Ejemplo:** `script.js`

## React & TypeScript ⚛️

### JavaScript React (JSX)
- **Extensión:** `.jsx`
- **Lenguaje:** `javascriptreact`
- **Características:** Soporte completo de JSX, componentes React, hooks
- **Ejemplo:** `App.jsx`, `Component.jsx`

### TypeScript
- **Extensión:** `.ts`
- **Lenguaje:** `typescript`
- **Características:** Tipado estático, IntelliSense avanzado
- **Ejemplo:** `utils.ts`, `types.ts`

### TypeScript React (TSX)
- **Extensión:** `.tsx`
- **Lenguaje:** `typescriptreact`
- **Características:** React con TypeScript
- **Ejemplo:** `App.tsx`, `Component.tsx`

## Lenguajes de Programación 💻

### Python 🐍
- **Extensión:** `.py`
- **Lenguaje:** `python`
- **Características:** Resaltado de sintaxis, indentación automática
- **Ejemplo:** `script.py`, `main.py`

### Java ☕
- **Extensión:** `.java`
- **Lenguaje:** `java`
- **Características:** Resaltado de clases, métodos, tipos
- **Ejemplo:** `Main.java`

### C++ 
- **Extensiones:** `.cpp`, `.cc`, `.cxx`
- **Lenguaje:** `cpp`
- **Características:** Soporte completo de C++
- **Ejemplo:** `main.cpp`

### C
- **Extensión:** `.c`
- **Lenguaje:** `c`
- **Características:** Resaltado de sintaxis C
- **Ejemplo:** `program.c`

### C# 
- **Extensión:** `.cs`
- **Lenguaje:** `csharp`
- **Características:** Soporte completo de C#
- **Ejemplo:** `Program.cs`

### PHP
- **Extensión:** `.php`
- **Lenguaje:** `php`
- **Características:** Resaltado PHP con HTML embebido
- **Ejemplo:** `index.php`

### Ruby 💎
- **Extensión:** `.rb`
- **Lenguaje:** `ruby`
- **Características:** Resaltado de sintaxis Ruby
- **Ejemplo:** `app.rb`

### Go 
- **Extensión:** `.go`
- **Lenguaje:** `go`
- **Características:** Resaltado de sintaxis Go
- **Ejemplo:** `main.go`

### Rust 🦀
- **Extensión:** `.rs`
- **Lenguaje:** `rust`
- **Características:** Resaltado de sintaxis Rust
- **Ejemplo:** `main.rs`

### Swift 🍎
- **Extensión:** `.swift`
- **Lenguaje:** `swift`
- **Características:** Resaltado de sintaxis Swift
- **Ejemplo:** `ViewController.swift`

### Kotlin
- **Extensión:** `.kt`
- **Lenguaje:** `kotlin`
- **Características:** Resaltado de sintaxis Kotlin
- **Ejemplo:** `MainActivity.kt`

## Lenguajes de Datos & Configuración 📄

### JSON
- **Extensión:** `.json`
- **Lenguaje:** `json`
- **Características:** Validación de sintaxis, formateo
- **Ejemplo:** `package.json`, `config.json`

### Markdown
- **Extensión:** `.md`
- **Lenguaje:** `markdown`
- **Características:** Vista previa, resaltado de sintaxis
- **Ejemplo:** `README.md`

### XML
- **Extensión:** `.xml`
- **Lenguaje:** `xml`
- **Características:** Validación de etiquetas
- **Ejemplo:** `config.xml`

### YAML
- **Extensiones:** `.yaml`, `.yml`
- **Lenguaje:** `yaml`
- **Características:** Validación de indentación
- **Ejemplo:** `config.yml`, `docker-compose.yaml`

### SQL
- **Extensión:** `.sql`
- **Lenguaje:** `sql`
- **Características:** Resaltado de consultas SQL
- **Ejemplo:** `schema.sql`

## Scripts & Shell 🖥️

### Bash/Shell
- **Extensión:** `.sh`
- **Lenguaje:** `shell`
- **Características:** Resaltado de comandos shell
- **Ejemplo:** `deploy.sh`

### Batch
- **Extensión:** `.bat`
- **Lenguaje:** `bat`
- **Características:** Resaltado de scripts Windows
- **Ejemplo:** `build.bat`

### PowerShell
- **Extensión:** `.ps1`
- **Lenguaje:** `powershell`
- **Características:** Resaltado de cmdlets PowerShell
- **Ejemplo:** `deploy.ps1`

## Cómo Usar 🚀

### Crear un nuevo archivo

1. **Desde el explorador de archivos:**
   - Clic derecho en una carpeta
   - Seleccionar "Nuevo Archivo"
   - Escribir el nombre con la extensión correcta (ej: `app.py`)
   - El editor detectará automáticamente el lenguaje

2. **El lenguaje se determina por la extensión:**
   ```
   ejemplo.py   → Python
   App.jsx      → React (JSX)
   Component.tsx → TypeScript React
   script.sh    → Shell
   config.yaml  → YAML
   ```

### Características Automáticas

- **Resaltado de sintaxis:** Automático según la extensión
- **Autocompletado:** Disponible para la mayoría de lenguajes
- **Validación:** Errores de sintaxis en tiempo real
- **Formateo:** Ctrl+Shift+F para formatear código
- **Comentarios:** Ctrl+/ para comentar/descomentar líneas

## Ejemplos Incluidos 📚

El proyecto incluye archivos de ejemplo en la carpeta `examples/`:
- `example.js` - JavaScript básico
- `App.jsx` - Componente React con hooks
- `script.py` - Python con funciones y list comprehensions

## Monaco Editor

Este editor utiliza **Monaco Editor**, el mismo motor que impulsa Visual Studio Code, por lo que tienes acceso a:

- ✅ Resaltado de sintaxis profesional
- ✅ IntelliSense y autocompletado
- ✅ Detección de errores en tiempo real
- ✅ Snippets de código
- ✅ Formateo automático
- ✅ Búsqueda y reemplazo avanzado
- ✅ Múltiples cursores
- ✅ Plegado de código

## Agregar Más Lenguajes

Para agregar soporte para más lenguajes, edita:

1. **`src/hooks/useFileSystem.js`** - Línea ~76
2. **`src/App.jsx`** - Línea ~836

Agrega la extensión y el nombre del lenguaje de Monaco:

```javascript
fileName.endsWith('.ext') ? 'lenguaje' :
```

Lista completa de lenguajes en Monaco: [Monaco Languages](https://microsoft.github.io/monaco-editor/)

---

**¡Disfruta codificando en múltiples lenguajes! 🎉**
