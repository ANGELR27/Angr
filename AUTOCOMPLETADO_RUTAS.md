# 🚀 Autocompletado Inteligente de Rutas

## ✨ Nueva Característica

El editor ahora tiene **autocompletado inteligente de rutas** que detecta automáticamente:
- 📁 Archivos del proyecto
- 🖼️ Imágenes cargadas en el gestor
- 📂 Rutas relativas en carpetas
- 🔗 Enlaces entre archivos

---

## 🎯 HTML - Atributos src, href, data

### Cómo funciona:
Cuando escribes en atributos `src=""`, `href=""` o `data=""`, el editor sugiere automáticamente:

#### 1. **Imágenes Cargadas** (Prioridad Alta)
```html
<img src=" ← Aquí aparecen las imágenes
```

**Sugerencias:**
```
🖼️ foto.png (imagen cargada) - 234.5 KB
🖼️ logo.svg (imagen cargada) - 12.3 KB
🖼️ banner.jpg (imagen cargada) - 456.7 KB
```

#### 2. **Archivos del Proyecto**
```html
<link href=" ← Aquí aparecen los archivos
```

**Sugerencias:**
```
📁 styles.css - Tipo: css
📁 script.js - Tipo: js
📁 components/header.html - Tipo: html
📁 examples/example.js - Tipo: js
```

### Ejemplos de uso:

#### Imagen cargada:
```html
<!-- Escribe: -->
<img src="
<!-- Aparece: foto.png (imagen cargada) -->
<!-- Resultado: -->
<img src="data:image/png;base64,iVBORw0KGg..." alt="foto">
```

#### Archivo CSS:
```html
<!-- Escribe: -->
<link rel="stylesheet" href="
<!-- Aparece: styles.css -->
<!-- Resultado: -->
<link rel="stylesheet" href="styles.css">
```

#### Archivo en carpeta:
```html
<!-- Escribe: -->
<script src="
<!-- Aparece: components/header.html -->
<!-- Resultado: -->
<script src="components/header.html"></script>
```

---

## 🎨 CSS - url() en background, font, etc.

### Cómo funciona:
Cuando escribes `url()` en CSS, el editor sugiere:

#### 1. **Imágenes y Fuentes**
```css
background-image: url( ← Aquí aparecen
```

**Sugerencias:**
```
🖼️ bg.jpg (cargada)
🖼️ pattern.png (cargada)
📁 images/logo.svg
📁 fonts/font.woff2
```

### Ejemplos de uso:

#### Background con imagen cargada:
```css
/* Escribe: */
.hero {
  background-image: url(
/* Aparece: bg.jpg (cargada) */
/* Resultado: */
.hero {
  background-image: url(data:image/jpeg;base64,...);
}
```

#### Font-face con archivo:
```css
/* Escribe: */
@font-face {
  src: url(
/* Aparece: fonts/font.woff2 */
/* Resultado: */
@font-face {
  src: url(fonts/font.woff2);
}
```

---

## 📦 JavaScript - import, require, fetch

### Cómo funciona:
Cuando escribes `import`, `require` o `fetch`, el editor sugiere módulos:

#### 1. **Imports de Módulos**
```javascript
import something from ' ← Aquí aparecen
```

**Sugerencias:**
```
📦 ./script.js
📦 ./styles.css
📦 ./components/header.html
📦 ./data.json
```

#### 2. **Fetch de Archivos**
```javascript
fetch(' ← Aquí aparecen
```

### Ejemplos de uso:

#### Import de módulo:
```javascript
// Escribe:
import utils from '
// Aparece: ./script.js
// Resultado:
import utils from './script.js';
```

#### Fetch de JSON:
```javascript
// Escribe:
fetch('
// Aparece: ./data.json
// Resultado:
fetch('./data.json')
  .then(res => res.json())
```

#### Require:
```javascript
// Escribe:
const module = require('
// Aparece: ./script.js
// Resultado:
const module = require('./script.js');
```

---

## 🗂️ Estructura de Archivos Detectada

El editor detecta automáticamente toda la estructura de tu proyecto:

### Ejemplo de proyecto:
```
proyecto/
├── index.html
├── styles.css
├── script.js
├── components/
│   ├── header.html
│   └── footer.html
├── images/
│   ├── logo.png
│   └── banner.jpg
└── examples/
    └── example.js
```

### Rutas sugeridas:
```
index.html
styles.css
script.js
components/header.html
components/footer.html
images/logo.png
images/banner.jpg
examples/example.js
```

---

## 🖼️ Imágenes del Gestor

Las imágenes que subes al **Gestor de Imágenes** aparecen con:

### Información mostrada:
- 🖼️ **Nombre** de la imagen
- 📊 **Tamaño** en KB
- ⚡ **Etiqueta** "(imagen cargada)" o "(cargada)"
- 🔝 **Prioridad alta** (aparecen primero)

### Ventajas:
✅ No necesitas copiar/pegar el data URL
✅ Aparecen automáticamente al escribir
✅ Incluyen tamaño para elegir mejor
✅ Se actualizan al subir/eliminar imágenes

---

## 🎯 Detección Inteligente

El autocompletado detecta **automáticamente** cuándo estás:

### HTML:
- ✅ Dentro de `src="..."`
- ✅ Dentro de `href="..."`
- ✅ Dentro de `data="..."`

### CSS:
- ✅ Dentro de `url(...)`
- ✅ En `background-image`
- ✅ En `@font-face`

### JavaScript:
- ✅ Después de `import ... from '...'`
- ✅ Después de `require('...')`
- ✅ Después de `fetch('...')`
- ✅ Cuando escribes `./`

---

## 🧪 Pruebas Rápidas

### Test 1: Imagen en HTML
```html
1. Sube imagen al gestor: foto.png
2. En HTML escribe: <img src="
3. ¿Aparece "foto.png (imagen cargada)"? ✅
4. Selecciona con ENTER o TAB
5. ¿Se inserta el data URL? ✅
```

### Test 2: CSS en HTML
```html
1. Tienes archivo: styles.css
2. Escribe: <link href="
3. ¿Aparece "styles.css"? ✅
4. Selecciona
5. ¿Se inserta la ruta? ✅
```

### Test 3: Background en CSS
```css
1. Sube imagen: bg.jpg
2. Escribe: background: url(
3. ¿Aparece "bg.jpg (cargada)"? ✅
4. Selecciona
5. ¿Se inserta? ✅
```

### Test 4: Import en JavaScript
```javascript
1. Tienes archivo: script.js
2. Escribe: import X from '
3. ¿Aparece "./script.js"? ✅
4. Selecciona
5. ¿Se completa? ✅
```

---

## 💡 Tips de Uso

### Tip 1: Prioridad de Imágenes
Las imágenes cargadas aparecen **primero** en las sugerencias porque son las más usadas.

### Tip 2: Rutas Relativas
En JavaScript, todas las rutas se sugieren con `./` para imports correctos.

### Tip 3: Filtros Inteligentes
- HTML: Sugiere todos los archivos
- CSS `url()`: Solo imágenes y fuentes
- JavaScript: Solo archivos importables (js, json, css, html)

### Tip 4: Actualización Dinámica
Al crear/eliminar archivos o subir/eliminar imágenes, el autocompletado se actualiza automáticamente.

---

## 🔧 Características Técnicas

### Implementación:
- ✅ Análisis de contexto en tiempo real
- ✅ Regex para detectar atributos y funciones
- ✅ Escaneo recursivo de estructura de archivos
- ✅ Integración con gestor de imágenes
- ✅ Priorización por relevancia
- ✅ Documentación en sugerencias

### Performance:
- ⚡ Análisis en cliente (sin latencia)
- ⚡ Cache de rutas de archivos
- ⚡ Actualización incremental
- ⚡ Sugerencias instantáneas

---

## 📊 Resumen de Autocompletado

| Contexto | Trigger | Sugerencias |
|----------|---------|-------------|
| HTML `src=""` | Escribir en src | Imágenes + Archivos |
| HTML `href=""` | Escribir en href | Archivos + Imágenes |
| CSS `url()` | Escribir en url | Imágenes + Fuentes |
| JS `import ''` | Después de from | Módulos JS/JSON |
| JS `require()` | Dentro de string | Módulos JS/JSON |
| JS `fetch()` | Dentro de string | Todos los archivos |

---

## 🎉 Beneficios

### Para el Desarrollador:
✅ **Más rápido** - No necesitas recordar rutas
✅ **Menos errores** - Rutas correctas siempre
✅ **Mejor experiencia** - Como en un IDE profesional
✅ **Productividad** - Autocompletado inteligente

### Para el Proyecto:
✅ **Organización** - Estructura clara y navegable
✅ **Mantenimiento** - Fácil encontrar archivos
✅ **Escalabilidad** - Funciona con cualquier tamaño

---

**¡El autocompletado de rutas está completamente funcional!** 🚀

**Pruébalo ahora:**
1. Sube una imagen al gestor
2. En HTML escribe `<img src="`
3. ¡Verás tu imagen en las sugerencias!
