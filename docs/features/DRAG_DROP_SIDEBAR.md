# 🖼️ Drag & Drop de Imágenes al Sidebar

## ✨ Nueva Característica

El **sidebar (Explorador de Archivos)** ahora acepta imágenes arrastrando desde:
- 📁 Tu PC/computadora
- 🌐 Otra pestaña del navegador
- 📂 Explorador de archivos del sistema

---

## 🎯 Cómo Funciona

### **Arrastra y Suelta:**

1. **Desde tu PC:**
   - Abre el explorador de archivos de tu sistema
   - Selecciona una imagen (PNG, JPG, GIF, SVG, etc.)
   - Arrastra hacia el sidebar
   - ¡Suelta!

2. **Desde otra pestaña:**
   - Abre una imagen en el navegador
   - Arrastra la imagen hacia el sidebar
   - ¡Suelta!

3. **Resultado:**
   - Se crea un archivo en el sidebar
   - Ícono rosa 🖼️ indica que es imagen
   - Se agrega al gestor de imágenes
   - Disponible en autocompletado

---

## 🎨 Indicadores Visuales

### **Al Arrastrar sobre el Sidebar:**

```
┌────────────────────────────────┐
│                                │
│        ⬆️ (animado)            │
│                                │
│   Suelta la imagen aquí       │
│   Se agregará al explorador   │
│                                │
└────────────────────────────────┘
```

**Características del overlay:**
- ✅ Fondo azul semi-transparente
- ✅ Borde punteado azul animado
- ✅ Ícono de upload animado (bounce)
- ✅ Texto explicativo
- ✅ Backdrop blur

---

## 📝 Texto Informativo

En el header del explorador:
```
📂 EXPLORADOR
Arrastra imágenes aquí
```

---

## 🧪 Pruebas

### **Test 1: Desde PC**
```
1. Abre explorador de archivos
2. Busca una imagen (foto.png)
3. Arrastra hacia el sidebar
4. ¿Aparece overlay azul? ✅
5. Suelta
6. ¿Imagen aparece con ícono rosa? ✅
7. ¿Se puede abrir y ver? ✅
```

### **Test 2: Desde Navegador**
```
1. Abre Google Imágenes
2. Click en una imagen
3. Arrastra la imagen al sidebar
4. ¿Overlay azul visible? ✅
5. Suelta
6. ¿Imagen en explorador? ✅
```

### **Test 3: Múltiples Imágenes**
```
1. Selecciona 3 imágenes en PC
2. Arrastra todas al sidebar
3. Suelta
4. ¿Las 3 se agregan? ✅
```

### **Test 4: Autocompletado**
```
1. Arrastra imagen "logo.png"
2. Abre index.html
3. Escribe: <img src="
4. ¿Aparece "logo.png"? ✅
5. Selecciona
6. ¿Se inserta data URL? ✅
```

---

## 🔄 Integración Completa

### **1. Sidebar → Archivo**
La imagen se agrega como archivo en el explorador

### **2. Sidebar → Gestor**
La imagen también aparece en el gestor de imágenes

### **3. Sidebar → Autocompletado**
La ruta está disponible en sugerencias del editor

### **4. Sidebar → Persistencia**
Se guarda con localStorage automáticamente

---

## 💡 Usos Prácticos

### **Caso 1: Diseño Web Rápido**
```
1. Busca imágenes en Google
2. Arrastra al sidebar
3. Úsalas en tu HTML
4. ¡Sitio web listo!
```

### **Caso 2: Logos y Assets**
```
1. Arrastra logo de tu proyecto
2. Arrastra iconos necesarios
3. Arrastra banners
4. Todo organizado en el explorador
```

### **Caso 3: Prototipos Rápidos**
```
1. Arrastra mockups
2. Arrastra placeholders
3. Crea tu prototipo HTML
4. ¡Rápido y visual!
```

---

## 🎨 Workflow Completo

### **Ejemplo: Crear Galería de Imágenes**

```html
<!-- 1. Arrastra 5 imágenes al sidebar -->
<!-- foto1.jpg, foto2.jpg, foto3.jpg, foto4.jpg, foto5.jpg -->

<!-- 2. En index.html: -->
<!DOCTYPE html>
<html>
<head>
    <title>Mi Galería</title>
</head>
<body>
    <h1>Galería de Fotos</h1>
    <div class="gallery">
        <!-- 3. Escribe <img src=" y selecciona cada foto -->
        <img src="foto1.jpg" alt="Foto 1">
        <img src="foto2.jpg" alt="Foto 2">
        <img src="foto3.jpg" alt="Foto 3">
        <img src="foto4.jpg" alt="Foto 4">
        <img src="foto5.jpg" alt="Foto 5">
    </div>
</body>
</html>
```

**Resultado:**
- ✅ 5 imágenes en el sidebar
- ✅ Todas en el HTML con rutas correctas
- ✅ Preview funciona inmediatamente
- ✅ Todo guardado automáticamente

---

## 🔧 Características Técnicas

### **Detección de Imágenes:**
```javascript
if (file.type.startsWith('image/')) {
  // Aceptar imagen
}
```

**Formatos aceptados:**
- ✅ PNG (image/png)
- ✅ JPG/JPEG (image/jpeg)
- ✅ GIF (image/gif)
- ✅ SVG (image/svg+xml)
- ✅ WebP (image/webp)
- ✅ BMP (image/bmp)

### **Lectura de Archivos:**
```javascript
const reader = new FileReader();
reader.readAsDataURL(file);
// Convierte a base64 para almacenar
```

### **Estados Visuales:**
```javascript
isDraggingOver → Muestra overlay azul
handleDrop → Procesa archivos
handleAddImageFile → Agrega al sistema
```

---

## 📊 Flujo de Datos

```
1. Usuario arrastra imagen
   ↓
2. handleDragOver → isDraggingOver = true
   ↓
3. Overlay azul aparece
   ↓
4. Usuario suelta → handleDrop
   ↓
5. FileReader lee archivo
   ↓
6. Convierte a data URL
   ↓
7. handleAddImageFile en App.jsx
   ↓
8. Se crea archivo en sidebar
   ↓
9. Se agrega a gestor de imágenes
   ↓
10. Se agrega a autocompletado
   ↓
11. Se guarda en localStorage
```

---

## 🎯 Autocompletado de Rutas

### **Funcionamiento Automático:**

Una vez que arrastras una imagen al sidebar:

1. **Aparece en sidebar** con ícono rosa 🖼️
2. **Se detecta en autocompletado** del editor
3. **Aparece en sugerencias** al escribir

### **Ejemplo:**
```html
<!-- Arrastraste: logo.png, banner.jpg -->

<!-- Al escribir: -->
<img src="

<!-- Aparecen sugerencias: -->
🖼️ logo.png (imagen cargada) - 45.2 KB
🖼️ banner.jpg (imagen cargada) - 123.5 KB
📁 index.html - Tipo: html
📁 styles.css - Tipo: css
```

### **En CSS:**
```css
/* Al escribir: */
background: url(

/* Aparecen: */
🖼️ logo.png (cargada)
🖼️ banner.jpg (cargada)
```

### **En JavaScript:**
```javascript
// Al escribir:
const img = './

// Aparecen:
📦 ./logo.png
📦 ./banner.jpg
```

---

## 💾 Persistencia

### **Auto-guardado:**
- ✅ Las imágenes arrastradas se guardan automáticamente
- ✅ Permanecen al recargar la página
- ✅ Se mantienen en el sidebar
- ✅ Disponibles en autocompletado siempre

---

## 📁 Archivos Modificados

```
✅ src/components/FileExplorer.jsx
   - handleDragOver, handleDragLeave, handleDrop
   - Overlay visual
   - Integración con onAddImageFile
   - Texto "Arrastra imágenes aquí"

✅ src/App.jsx
   - Prop onAddImageFile pasada a FileExplorer
   - Función ya existente reutilizada

✅ DRAG_DROP_SIDEBAR.md
   - Documentación completa
```

---

## ⚠️ Notas Importantes

### **Archivos No-Imagen:**
Si arrastras un archivo que no es imagen (PDF, TXT, etc.):
- ❌ No se agregará
- 💡 Solo se aceptan imágenes

### **Tamaño de Archivos:**
- ⚠️ localStorage tiene límite (~5-10 MB)
- 💡 Usa imágenes optimizadas/pequeñas
- 💡 Considera comprimir imágenes grandes

### **Nombres Duplicados:**
Si arrastras una imagen con nombre existente:
- ✅ Se sobrescribirá el archivo anterior
- 💡 Usa nombres únicos para evitar conflictos

---

## 🎉 Resumen

### **Implementado:**
✅ Drag & drop desde PC al sidebar
✅ Drag & drop desde navegador al sidebar
✅ Overlay visual animado
✅ Ícono rosa para imágenes
✅ Integración con gestor
✅ Autocompletado automático de rutas
✅ Persistencia con localStorage
✅ Múltiples imágenes simultáneas

### **Cómo Usar:**
1. Arrastra imagen al sidebar
2. ¡Listo! Ya está disponible
3. Úsala en HTML con autocompletado
4. Se guarda automáticamente

---

**¡El sidebar ahora acepta imágenes por drag & drop!** 🖼️✨

**Pruébalo:**
1. Busca una imagen en tu PC
2. Arrástrala al sidebar del editor
3. ¡Ve el overlay azul!
4. Suelta
5. Úsala en tu código con autocompletado 🎨
