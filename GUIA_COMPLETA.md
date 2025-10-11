# 🎯 Guía Completa - Code Editor v3.0

## 🚀 Características Principales

### **1. 🖼️ Drag & Drop de Imágenes**

#### Cómo usar:
1. **Abre el Gestor de Imágenes**
   - Click en botón "Imágenes" 🟠 (naranja) en la barra superior

2. **Sube tus imágenes**
   - Click en el área de upload O arrastra archivos
   - Formatos soportados: JPG, PNG, GIF, SVG, WebP

3. **Arrastra la imagen al editor**
   - Haz click y mantén sobre la imagen en el gestor
   - Verás el icono de "mover" ↔️
   - Arrastra hacia el editor de código

4. **Indicador visual**
   - Al arrastrar sobre el editor, aparece:
     - ✨ **Overlay azul** con borde punteado
     - 📷 **Ícono de imagen** grande y animado
     - 💬 **Mensaje** explicando dónde se insertará

5. **Suelta para insertar**
   - La etiqueta `<img>` se inserta automáticamente
   - Se coloca en la posición actual del cursor
   - Incluye el src con data URL completo

#### Ejemplo:
```html
<!-- Se inserta automáticamente al soltar: -->
<img src="data:image/png;base64,iVBORw0K..." alt="nombre-imagen" width="300" />
```

---

### **2. ⚡ 70+ Snippets Robustos**

#### **HTML - 40 Snippets**

**Estructura:**
- `!` → HTML5 completo (Emmet)
- `div` → Div con clase
- `div.` → Div con clase (rápido)
- `div#` → Div con ID

**Semántica:**
- `section`, `article`, `header`, `footer`, `nav`, `main`, `aside`

**Listas:**
- `ul`, `ol` → Con items automáticos

**Formularios:**
- `form` → Formulario completo
- `input` → Input genérico
- `input:text` → Input de texto
- `input:email` → Input email con validación
- `input:password` → Input contraseña
- `input:number` → Input numérico
- `input:checkbox` → Checkbox con label
- `input:radio` → Radio con label
- `input:file` → Input file con accept
- `select` → Select con opciones
- `textarea` → Textarea con rows
- `label` → Label con for
- `button` → Botón con tipo

**Multimedia:**
- `img` → Imagen con width/height
- `video` → Video con controles
- `audio` → Audio con source
- `iframe` → Iframe embebido

**Meta:**
- `meta:description` → Meta description
- `meta:keywords` → Meta keywords
- `meta:og` → Open Graph completo

**Texto:**
- `p`, `h1-h6`, `span`
- `strong`, `em`, `code`, `pre`
- `blockquote` → Cita con cite
- `br`, `hr`

**Otros:**
- `table` → Tabla completa con thead/tbody
- `script` → Script externo
- `link:css` → Enlace CSS

---

#### **CSS - 19 Snippets**

**Layout:**
- `flex` → Flexbox centrado
- `flex:wrap` → Flexbox con wrap y gap
- `flex:column` → Flexbox columna
- `grid` → Grid básico 3 columnas
- `grid:responsive` → Grid auto-fit responsive

**Posicionamiento:**
- `center` → Centrado absoluto
- `transform:center` → Transform center
- `transform:scale` → Scale con hover
- `transform:rotate` → Rotate animado

**Animación:**
- `transition` → Transición suave
- `animation` → Animación con keyframes
- `keyframes` → @keyframes plantilla

**Efectos:**
- `gradient` → Gradiente lineal
- `shadow` → Box shadow con rgba
- `hover` → Estado hover
- `before` → Pseudo before
- `after` → Pseudo after

**Responsive:**
- `media:mobile` → @media 768px

**Otros:**
- `reset` → Reset CSS universal
- `font-face` → Fuente personalizada

---

#### **JavaScript - 33 Snippets**

**Console:**
- `log`, `error`, `warn`, `table`

**Funciones:**
- `func` → Función tradicional
- `arrow` → Arrow function
- `async` → Async con try/catch
- `promise` → new Promise

**Arrays:**
- `foreach` → Array.forEach
- `map` → Array.map
- `filter` → Array.filter
- `reduce` → Array.reduce

**Control:**
- `if` → If statement
- `ifelse` → If-else
- `for` → For loop
- `while` → While loop
- `switch` → Switch completo
- `try` → Try-catch
- `tryfinally` → Try-catch-finally

**Variables:**
- `const` → Const variable
- `let` → Let variable
- `destructure` → Destructuring
- `spread` → Spread operator

**DOM:**
- `querySelector` → Query selector
- `createElement` → Create element completo
- `eventListener` → addEventListener

**Timers:**
- `setTimeout` → setTimeout
- `setInterval` → setInterval

**Fetch:**
- `fetch` → Fetch API completo

**ES6:**
- `class` → Clase con constructor
- `import` → Import module
- `export` → Export

**Otros:**
- `ternary` → Operador ternario
- `template` → Template literal

---

### **3. 🎯 Autocompletado Ultra Robusto**

#### Opciones Activadas:

**Sugerencias:**
✅ `suggestOnTriggerCharacters: true` - Sugerencias al escribir
✅ `quickSuggestions` - Sugerencias rápidas en strings y código
✅ `tabCompletion: 'on'` - Completar con TAB
✅ `acceptSuggestionOnEnter: 'on'` - Aceptar con ENTER
✅ `wordBasedSuggestions: true` - Basado en palabras

**Hints Visuales:**
✅ `parameterHints` - Hints de parámetros
✅ `showKeywords, showSnippets, showClasses` - Mostrar todo
✅ `showFunctions, showVariables, showModules`
✅ `showProperties, showValues, showColors`

**Experiencia:**
✅ `smoothScrolling: true` - Scroll suave
✅ `cursorBlinking: 'smooth'` - Cursor suave
✅ `cursorSmoothCaretAnimation: 'on'` - Animación cursor
✅ `mouseWheelZoom: true` - Zoom con rueda
✅ `dragAndDrop: true` - Drag interno

---

### **4. 🔒 Autocierres Perfectos**

#### Autocerrado Completo:
✅ `autoClosingBrackets: 'always'` - Paréntesis ()
✅ `autoClosingQuotes: 'always'` - Comillas ""
✅ `autoClosingOvertype: 'always'` - Sobrescribir
✅ `autoClosingDelete: 'always'` - Borrar par
✅ `autoSurround: 'languageDefined'` - Rodear selección

#### Guías Visuales:
✅ `bracketPairColorization` - Colores de pares
✅ `guides.bracketPairs` - Guías de pares
✅ `guides.indentation` - Guías de indentación

#### Formateo Automático:
✅ `formatOnPaste: true` - Al pegar
✅ `formatOnType: true` - Al escribir

---

### **5. 🖨️ Terminal Inteligente**

#### Captura Console:
- ✅ `console.log()` → Gris claro
- ✅ `console.error()` → Rojo
- ✅ `console.warn()` → Amarillo
- ✅ `console.info()` → Azul

#### Características:
- Auto-apertura al detectar log
- Timestamp en cada mensaje
- Historial persistente
- Comandos de terminal (help, clear, date, etc.)

---

## 🎮 Pruebas de Funcionalidad

### **Test 1: Drag & Drop de Imágenes**
```
✅ Sube imagen al gestor
✅ Arrastra sobre el editor → Ver overlay azul
✅ Suelta → Etiqueta <img> insertada
✅ Imagen con data URL completo
```

### **Test 2: Snippet Emmet**
```
1. Archivo HTML nuevo
2. Escribe: !
3. Presiona: TAB
✅ Estructura HTML5 completa
```

### **Test 3: Autocerrado**
```
HTML: <div> → automático </div>
JavaScript: ( → automático )
JavaScript: " → automático "
CSS: { → automático }
✅ Todos funcionan
```

### **Test 4: Autocompletado**
```
HTML: Escribe "bu" → Sugerencia "button"
CSS: Escribe "fl" → Sugerencia "flex"
JS: Escribe "lo" → Sugerencia "log"
✅ Aparecen automáticamente
```

### **Test 5: Console.log en Terminal**
```javascript
// En script.js:
console.log('Test 1');
console.error('Error test');
console.warn('Warning');

// Terminal automática muestra:
[23:04:21] Test 1
[23:04:21] Error test
[23:04:21] Warning
✅ Captura todo
```

---

## 📊 Resumen Técnico

### **Snippets Totales: 92**
- HTML: 40 snippets
- CSS: 19 snippets
- JavaScript: 33 snippets

### **Características de Editor:**
- ✅ Monaco Editor (VS Code)
- ✅ Syntax highlighting
- ✅ Autocompletado robusto (20+ opciones)
- ✅ Autocierres automáticos
- ✅ Formateo al pegar y escribir
- ✅ Guías visuales de pares
- ✅ Colorización de brackets
- ✅ Smooth scrolling
- ✅ Zoom con rueda
- ✅ Drag & drop interno y externo

### **Sistema de Imágenes:**
- ✅ Upload múltiple
- ✅ Preview en grid
- ✅ Drag & drop al editor
- ✅ Indicador visual animado
- ✅ Data URL encoding
- ✅ Copiar src con un click
- ✅ Eliminar imágenes

### **Terminal:**
- ✅ Captura console.log/error/warn/info
- ✅ Auto-apertura inteligente
- ✅ Colores por tipo
- ✅ Timestamp
- ✅ Comandos propios
- ✅ Maximizar/minimizar

---

## 🎨 Esquema de Colores

| Elemento | Color | Hex |
|----------|-------|-----|
| Archivos | Azul | #3b82f6 |
| Carpetas | Amarillo | #eab308 |
| Preview | Púrpura | #9333ea |
| Terminal | Verde | #22c55e |
| Imágenes | Naranja | #f97316 |

---

## 💻 Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + Space` | Autocompletado |
| `Tab` | Aceptar snippet |
| `Ctrl + S` | Guardar |
| `Ctrl + Z` | Deshacer |
| `Ctrl + Y` | Rehacer |
| `Ctrl + F` | Buscar |
| `Ctrl + H` | Reemplazar |
| `Ctrl + /` | Comentar |
| `Alt + ↑/↓` | Mover línea |
| `Ctrl + D` | Selección múltiple |

---

## 🔥 Características Avanzadas

### **Bracket Pair Colorization**
Los pares de brackets tienen colores diferentes para identificarlos fácilmente.

### **Smooth Caret Animation**
El cursor se mueve suavemente entre posiciones.

### **Parameter Hints**
Muestra hints de parámetros al escribir funciones.

### **Word Based Suggestions**
Sugiere palabras ya escritas en el documento.

### **Auto Surround**
Selecciona texto y escribe `(` para rodearlo automáticamente.

---

## ✨ Notas Importantes

1. **Emmet `!`** solo funciona en archivos HTML
2. **Console.log** se captura automáticamente del preview
3. **Drag & drop** funciona desde el gestor al editor
4. **Snippets** aparecen al escribir los primeros caracteres
5. **TAB** acepta snippets, **ENTER** también funciona
6. **Autocierres** funcionan en HTML, CSS y JavaScript
7. **Formateo** se aplica al pegar código

---

**Editor completamente funcional y robusto** 🎉
**Versión: 3.0**
**Snippets: 92**
**Características: 30+**
