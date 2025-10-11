# 🚀 Code Editor - Editor Web Profesional

Un editor de código moderno tipo VS Code construido con React y Monaco Editor, con efectos visuales inspirados en Midudev y JSCamp.

## ✨ Características Principales

### 🎨 **Editor Avanzado**
- **Monaco Editor** (mismo motor que Visual Studio Code)
- Syntax highlighting para HTML, CSS y JavaScript
- **Autocompletado inteligente** con snippets personalizados
- **🚀 Autocompletado de rutas** - Detecta archivos del proyecto e imágenes
- **Emmet incorporado** - Escribe `!` para estructura HTML5
- **Autocerrado automático** de etiquetas, comillas y paréntesis
- Formateo automático al pegar y escribir
- Números de línea y resaltado de sintaxis

### 📁 **Explorador de Archivos**
- Navegación por árbol de carpetas
- Iconos de colores por tipo de archivo (HTML 🟠, CSS 🔵, JS 🟡, JSON 🟢)
- Creación de archivos y carpetas dinámicamente
- **🗑️ Eliminar archivos y carpetas** con click derecho
- Expansión/colapso de carpetas
- Resaltado del archivo activo
- **Menú contextual** con opciones

### 📑 **Sistema de Pestañas**
- Múltiples archivos abiertos simultáneamente
- Pestañas con **sombras de colores** según el tipo de archivo
- Cierre rápido con botón X (visible al hacer hover)
- Navegación fluida entre archivos

### 👁️ **Vista Previa en Vivo**
- Renderizado instantáneo de HTML/CSS/JS
- Ejecución automática de JavaScript
- Botón de refrescar manual
- Toggle para mostrar/ocultar
- Split view ajustable

### 💻 **Terminal Integrada**
- Terminal funcional con comandos
- Comandos disponibles: `help`, `clear`, `date`, `time`, `info`, `theme`, `echo`
- Historial de comandos con colores
- Maximizar/minimizar
- Toggle desde la barra superior

### 🎭 **Efectos Visuales**
- **Sombras de colores** azul, amarillo y púrpura (como Midudev/JSCamp)
- Efectos glow en botones y elementos interactivos
- Gradientes de colores en barras y bordes
- Animaciones suaves y transiciones
- Tema oscuro profesional con iluminación de neón

## 🎯 Snippets y Autocompletado

### HTML
- `!` → Estructura HTML5 completa (Emmet)
- `div`, `p`, `button`, `h1`-`h6` → Etiquetas con autocerrado
- `ul`, `ol` → Listas con items
- `form` → Formulario completo
- `table` → Tabla con estructura
- `input`, `img`, `a` → Con atributos predefinidos

### CSS
- `flexbox` → Display flex con centrado
- `grid` → CSS Grid con columnas
- `transition` → Transición CSS

### JavaScript
- `log` → console.log()
- `func` → Función tradicional
- `arrow` → Arrow function
- `foreach` → Array.forEach()
- `map` → Array.map()
- `fetch` → Fetch API completo
- `async` → Función async con try-catch

## 📦 Instalación

```bash
npm install
```

## 🚀 Desarrollo

```bash
npm run dev
```

El editor se abrirá automáticamente en **http://localhost:3000**

## 🏗️ Build para Producción

```bash
npm run build
```

## 📚 Documentación

Lee la [**Guía de Uso Completa**](./GUIA_DE_USO.md) para más detalles sobre todas las características.

## 🛠️ Tecnologías

- **React 18** - Framework UI moderno
- **Vite** - Build tool ultrarrápido
- **Monaco Editor** - Motor de VS Code
- **TailwindCSS** - Estilos utilitarios
- **Lucide Icons** - Iconos elegantes y ligeros

## 🎨 Estructura del Proyecto

```
editorr/
├── src/
│   ├── components/
│   │   ├── TopBar.jsx          # Barra superior con controles
│   │   ├── FileExplorer.jsx    # Explorador de archivos
│   │   ├── TabBar.jsx          # Sistema de pestañas
│   │   ├── CodeEditor.jsx      # Editor Monaco con snippets
│   │   ├── Preview.jsx         # Vista previa en vivo
│   │   └── Terminal.jsx        # Terminal integrada
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos globales + efectos
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── README.md
└── GUIA_DE_USO.md
```

## 🎮 Uso Rápido

1. **Abrir archivo**: Click en el explorador lateral
2. **Crear archivo**: Botón "Archivo" → Escribe nombre con extensión
3. **Usar Emmet**: Escribe `!` en HTML y presiona TAB
4. **Autocompletado**: Empieza a escribir y aparecen sugerencias
5. **Terminal**: Click en botón "Terminal" (verde)
6. **Preview**: Toggle con botón "Preview" (púrpura)

## 🌟 Características Especiales

- ✅ Autoguardado en tiempo real
- ✅ Etiquetas HTML se cierran automáticamente
- ✅ Comillas y paréntesis se autocompletan
- ✅ Formateo automático de código
- ✅ Sugerencias contextuales inteligentes
- ✅ Atajos de teclado estándar (Ctrl+Z, Ctrl+S, etc.)

## 🎨 Diseño

Inspirado en los diseños modernos de **Midudev** y **JSCamp** con:
- Sombras de colores neón (azul, amarillo, púrpura)
- Efectos glow en elementos interactivos
- Gradientes suaves
- Tema oscuro profesional
- Interfaz limpia y minimalista

---

**Hecho con ❤️ usando React + Monaco Editor**

¡Disfruta codificando! 🚀✨
