# 🖼️ Preview con Soporte de Imágenes

## ✨ Nueva Característica

El **Preview HTML** ahora puede leer y mostrar correctamente todas las imágenes del proyecto, sin importar cómo las referencias.

---

## 🎯 Cómo Funciona

### **Sistema Inteligente de Resolución:**

El preview **automáticamente** reemplaza las rutas de imágenes por sus data URLs antes de renderizar el HTML.

**Soporta:**
- ✅ Imágenes por nombre: `<img src="logo.png">`
- ✅ Imágenes con ruta: `<img src="carpeta/imagen.jpg">`
- ✅ Imágenes con ./: `<img src="./foto.png">`
- ✅ Imágenes del gestor
- ✅ Imágenes en el sidebar
- ✅ CSS background: `url(imagen.jpg)`

---

## 💻 Ejemplos de Uso

### **Ejemplo 1: Imagen Simple**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Página</title>
</head>
<body>
    <h1>Galería</h1>
    <!-- Solo escribe el nombre -->
    <img src="logo.png" alt="Logo">
</body>
</html>
```

**Resultado en Preview:**
- ✅ La imagen se muestra correctamente
- ✅ No importa dónde esté la imagen en el proyecto
- ✅ Funciona automáticamente

---

### **Ejemplo 2: Múltiples Imágenes**

```html
<!DOCTYPE html>
<html>
<body>
    <div class="gallery">
        <img src="foto1.jpg" width="300">
        <img src="foto2.jpg" width="300">
        <img src="foto3.jpg" width="300">
    </div>
</body>
</html>
```

**Todas las imágenes se muestran automáticamente** ✅

---

### **Ejemplo 3: CSS Background**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .hero {
            background-image: url(banner.jpg);
            height: 400px;
            background-size: cover;
        }
    </style>
</head>
<body>
    <div class="hero"></div>
</body>
</html>
```

**El background se muestra correctamente** ✅

---

### **Ejemplo 4: Con Autocompletado**

```html
<!-- Escribes: -->
<img src="

<!-- Aparece en sugerencias: -->
🖼️ logo.png (imagen cargada) - 45.2 KB

<!-- Seleccionas y se completa: -->
<img src="logo.png"

<!-- En el preview: -->
✅ ¡La imagen se ve!
```

---

## 🔄 Flujo Completo

### **1. Agregar Imagen al Proyecto:**

**Opción A: Arrastrar al sidebar**
```
1. Arrastra logo.png al sidebar
2. ✅ Aparece con ícono rosa 🖼️
```

**Opción B: Gestor de imágenes**
```
1. Click en "Imágenes" 🟠
2. Sube logo.png
3. ✅ Aparece en el gestor
```

---

### **2. Usar en HTML:**

```html
<img src="logo.png">
```

**Autocompletado te ayuda:**
- Escribes `<img src="`
- Aparece "logo.png" en sugerencias
- Seleccionas
- ¡Listo!

---

### **3. Ver en Preview:**

```
✅ La imagen se muestra automáticamente
✅ Sin configuración adicional
✅ Funciona con cualquier ruta
```

---

## 🎨 Ejemplos Prácticos

### **Galería de Fotos:**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .gallery {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 20px;
        }
        .gallery img {
            width: 100%;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <h1>Mi Galería</h1>
    <div class="gallery">
        <img src="foto1.jpg" alt="Foto 1">
        <img src="foto2.jpg" alt="Foto 2">
        <img src="foto3.jpg" alt="Foto 3">
        <img src="foto4.jpg" alt="Foto 4">
        <img src="foto5.jpg" alt="Foto 5">
        <img src="foto6.jpg" alt="Foto 6">
    </div>
</body>
</html>
```

**Resultado:**
- ✅ Grid de 3 columnas
- ✅ Todas las imágenes visibles
- ✅ Con estilos aplicados

---

### **Hero Section con Background:**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .hero {
            background-image: url(hero-bg.jpg);
            height: 500px;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Bienvenido a Mi Sitio</h1>
    </div>
</body>
</html>
```

**Resultado:**
- ✅ Imagen de fondo visible
- ✅ Texto sobre la imagen
- ✅ Estilos aplicados

---

### **Tarjeta con Imagen:**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .card {
            max-width: 300px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin: 20px auto;
        }
        .card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .card-content {
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="card">
        <img src="product.jpg" alt="Producto">
        <div class="card-content">
            <h2>Producto Destacado</h2>
            <p>Descripción del producto</p>
        </div>
    </div>
</body>
</html>
```

**Resultado:**
- ✅ Tarjeta con imagen
- ✅ Imagen ajustada con object-fit
- ✅ Todo visible en preview

---

## 🔧 Funcionamiento Técnico

### **Sistema de Resolución:**

```javascript
1. Usuario escribe: <img src="logo.png">
   ↓
2. Preview detecta la referencia
   ↓
3. Busca "logo.png" en:
   - Imágenes del gestor
   - Archivos del sidebar
   ↓
4. Encuentra el data URL
   ↓
5. Reemplaza: <img src="data:image/png;base64,...">
   ↓
6. Renderiza en el iframe
   ↓
7. ✅ Imagen visible
```

---

### **Patrones Soportados:**

```javascript
// Por nombre
<img src="logo.png">
→ Reemplazado

// Con comillas simples
<img src='logo.png'>
→ Reemplazado

// Con ruta
<img src="images/logo.png">
→ Reemplazado

// Con ./
<img src="./logo.png">
→ Reemplazado

// En CSS
background: url(logo.png)
→ Reemplazado

// En href
<a href="logo.png">
→ Reemplazado
```

---

## 🧪 Pruebas

### **Test 1: Imagen Simple**
```html
1. Arrastra imagen al sidebar: foto.png
2. En HTML escribe: <img src="foto.png">
3. ¿Se ve en preview? ✅
```

### **Test 2: Múltiples Imágenes**
```html
1. Arrastra 3 imágenes
2. Úsalas en HTML
3. ¿Las 3 se ven? ✅
```

### **Test 3: CSS Background**
```css
1. Sube bg.jpg
2. CSS: background: url(bg.jpg)
3. ¿Se ve el fondo? ✅
```

### **Test 4: Autocompletado + Preview**
```html
1. Sube logo.png
2. <img src=" → Selecciona logo.png
3. ¿Aparece en preview? ✅
```

---

## 📊 Formatos Soportados

✅ **PNG** - Imágenes con transparencia
✅ **JPG/JPEG** - Fotografías
✅ **GIF** - Imágenes animadas
✅ **SVG** - Gráficos vectoriales
✅ **WebP** - Formato moderno
✅ **BMP** - Bitmap

---

## 💡 Tips y Consejos

### **Tip 1: Nombres Descriptivos**
```
✅ logo-empresa.png
✅ hero-background.jpg
✅ producto-1.png
❌ img1.png
❌ foto.jpg
```

### **Tip 2: Tamaño de Imágenes**
- Optimiza imágenes antes de subir
- localStorage tiene límite (~5-10 MB)
- Usa herramientas de compresión

### **Tip 3: Alt Text**
```html
<!-- Siempre incluye alt -->
<img src="logo.png" alt="Logo de la empresa">
```

### **Tip 4: Responsive**
```html
<img src="foto.png" style="max-width: 100%; height: auto;">
```

---

## ⚠️ Notas Importantes

### **Límites de localStorage:**
- ⚠️ ~5-10 MB total para todo el proyecto
- 💡 Usa imágenes optimizadas/pequeñas
- 💡 Considera servicios externos para proyectos grandes

### **Rutas Relativas:**
- ✅ Solo nombre: `logo.png`
- ✅ Con ./: `./logo.png`
- ✅ Carpetas: `images/logo.png`
- ❌ No usar rutas absolutas: `/Users/...`

---

## 📁 Archivos Modificados

```
✅ src/components/Preview.jsx
   - Función resolveImagePaths
   - Props projectFiles, projectImages
   - Resolución automática de rutas

✅ src/App.jsx
   - Pasar files e images a Preview
```

---

## 🎉 Resumen

### **Implementado:**
✅ Resolución automática de rutas de imágenes
✅ Soporte para múltiples patrones de referencia
✅ Compatible con gestor e imágenes del sidebar
✅ Funciona con CSS backgrounds
✅ Sin configuración necesaria

### **Cómo Usar:**
1. Agrega imagen al proyecto (sidebar o gestor)
2. Úsala en HTML con su nombre
3. ¡Se muestra automáticamente en preview!

---

**¡El preview ahora lee y muestra todas las imágenes correctamente!** 🖼️✨

**Pruébalo:**
```html
1. Arrastra imagen al sidebar
2. <img src="imagen.png">
3. ¡Mira el preview!
4. ✅ Funciona perfectamente
```
