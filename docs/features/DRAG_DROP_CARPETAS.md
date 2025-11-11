# 📁 Drag & Drop de Carpetas Completas

## ✨ Funcionalidad Implementada

Ahora puedes arrastrar carpetas completas al editor y se importarán automáticamente con toda su estructura.

## 🚀 Cómo Usar

### Método 1: Arrastrar carpeta completa
1. Selecciona una carpeta desde tu explorador de archivos
2. Arrástrala al sidebar (FileExplorer) del editor
3. Suelta la carpeta en el área del sidebar
4. **¡Listo!** Se creará automáticamente:
   - ✅ Toda la estructura de carpetas
   - ✅ Todos los archivos compatibles (HTML, CSS, JS, JSON, TXT, MD)
   - ✅ Todas las imágenes (PNG, JPG, GIF, SVG, etc.)
   - ✅ Las carpetas se expandirán automáticamente

### Método 2: Arrastrar archivos individuales
1. Selecciona uno o varios archivos
2. Arrástralos al sidebar o a una carpeta específica
3. Se importarán en la ubicación seleccionada

### Método 3: Arrastrar a carpeta específica
1. Arrastra archivos/carpetas sobre una carpeta existente en el sidebar
2. Se importarán dentro de esa carpeta

## 📋 Formatos Soportados

### Archivos de Código
- HTML (`.html`)
- CSS (`.css`)
- JavaScript (`.js`, `.json`)
- Markdown (`.md`)
- Texto plano (`.txt`)

### Imágenes
- PNG, JPG, JPEG
- GIF, SVG, WebP
- BMP, ICO

## 💡 Ejemplos de Uso

### Importar un proyecto completo
```
mi-proyecto/
├── index.html
├── styles/
│   ├── main.css
│   └── reset.css
├── scripts/
│   └── app.js
└── images/
    └── logo.png
```

Al arrastrar la carpeta `mi-proyecto` al sidebar, se creará exactamente la misma estructura en el editor.

### Importar componentes
```
components/
├── Header.jsx
├── Footer.jsx
└── Button.jsx
```

Arrastra la carpeta `components` y todos los archivos se importarán con su estructura.

## 🎯 Características

1. **Preserva estructura**: Mantiene la jerarquía completa de carpetas
2. **Auto-expansión**: Las carpetas importadas se expanden automáticamente
3. **Nombres únicos**: Si existe un archivo con el mismo nombre, se agrega sufijo numérico
4. **Feedback visual**: 
   - Overlay animado mientras arrastras
   - Contador de archivos detectados
   - Toast de confirmación con resumen de importación
5. **Verificación de existencia**: No duplica carpetas que ya existen

## 🔄 Funcionalidad Existente Mejorada

### Antes
- Solo se importaban archivos individuales sin estructura de carpetas
- Las carpetas se "aplanaban" en la raíz

### Ahora
- Se crea la estructura completa de carpetas
- Se preserva la jerarquía original
- Se muestra en el toast cuántas carpetas se crearon
- Ejemplo: `✅ Importados: 3 carpetas, 5 archivos de código, 2 imágenes`

## 🛠️ Archivos Modificados

- **`src/components/FileExplorer.jsx`**
  - Añadida función `ensureFolderPath()` para crear carpetas recursivamente
  - Mejorada función `processFile()` para crear estructura antes de agregar archivos
  - Actualizado el overlay visual para indicar soporte de carpetas
  - Auto-expansión de carpetas importadas

## 🎨 Visual

El overlay de drag & drop ahora muestra:
```
📤 Suelta para importar
Archivos, carpetas e imágenes

📁 Carpetas | 🖼️ Imágenes | 📄 HTML/CSS/JS
```

## 💪 Compatibilidad

- ✅ Chrome, Edge, Opera (soporte completo con `webkitGetAsEntry`)
- ✅ Firefox (soporte limitado, solo archivos individuales)
- ✅ Safari (soporte completo)

## 🎉 ¡Pruébalo!

Arrastra tu carpeta de proyecto favorita al editor y ve cómo se importa mágicamente con toda su estructura. Funciona exactamente como en VS Code. 🚀
