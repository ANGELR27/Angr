# 📁 Importar Archivos y Carpetas

## 🎯 Dos Formas de Importar

### 1. **Importación Manual (Recomendada)** ⭐

En la esquina superior derecha del explorador de archivos verás dos iconos sutiles:

- **📁 Icono de carpeta**: Importa una carpeta completa con toda su estructura
- **📤 Icono de subida**: Importa archivos individuales

#### Cómo usar:
1. Haz clic en el icono correspondiente
2. Se abrirá el diálogo de selección de Windows
3. Selecciona la carpeta o archivos que deseas importar
4. Los archivos se importarán automáticamente preservando la estructura

### 2. **Drag & Drop**

Arrastra archivos o carpetas directamente desde el explorador de Windows al área del sidebar.

⚠️ **Nota**: En Windows, el drag & drop tiene limitaciones del navegador. **Se recomienda usar la importación manual con los botones**.

## ✅ Formatos Soportados

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

## 🎨 Características Visuales

### Botones Sutiles
- **Sin fondo**: Transparentes por defecto
- **Sin texto**: Solo iconos
- **Hover sutil**: Al pasar el mouse, el icono se ilumina con el color del tema
- **Escala al hover**: Aumenta ligeramente de tamaño

### Feedback Visual
- **Toast de confirmación**: Muestra resumen de archivos importados
- **Expansión automática**: Las carpetas importadas se expanden automáticamente
- **Contador**: Muestra cuántas carpetas y archivos se importaron

## 🔧 Mejoras Implementadas

1. **Delays escalonados**: Los archivos se procesan con un pequeño delay entre cada uno para evitar conflictos
2. **Creación de carpetas primero**: Las carpetas se crean antes que los archivos
3. **Verificación de existencia**: No duplica carpetas que ya existen
4. **Nombres únicos**: Si un archivo existe, se agrega sufijo numérico automáticamente
5. **Logs de debug eliminados**: Código limpio sin console.log innecesarios

## 💡 Ejemplo de Uso

### Importar proyecto completo:
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

1. Click en el icono **📁**
2. Selecciona la carpeta `mi-proyecto`
3. Todo se importa con la misma estructura

### Resultado en el sidebar:
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

## 🚀 Ventajas del Sistema Actual

✅ **Funciona en todos los navegadores**  
✅ **Interfaz limpia y profesional**  
✅ **Sin distracciones visuales**  
✅ **Rápido y eficiente**  
✅ **Preserva estructura completa**  

## 🎯 Ubicación de los Botones

Los botones están ubicados en:
- **Esquina superior derecha** del header "EXPLORADOR"
- **Alineados a la derecha** para no interferir con el título
- **Opacidad 60%** por defecto, **100%** al hacer hover
