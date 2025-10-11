# 📚 Guía de Uso - Code Editor

## 🚀 Inicio Rápido

El servidor de desarrollo debería estar corriendo en **http://localhost:3000**

## ✨ Características Principales

### 🎨 **Editor de Código**
- **Monaco Editor** (mismo motor que VS Code)
- Syntax highlighting para HTML, CSS y JavaScript
- Números de línea
- Autocompletado inteligente
- Formateo automático

### 📁 **Explorador de Archivos**
- Navegación por carpetas
- Iconos de colores por tipo de archivo:
  - 🟠 HTML - Naranja
  - 🔵 CSS - Azul
  - 🟡 JavaScript - Amarillo
  - 🟢 JSON - Verde
- Click para abrir archivos
- Resaltado del archivo activo

### 📑 **Sistema de Pestañas**
- Múltiples archivos abiertos
- Pestañas con colores según el tipo
- Botón X para cerrar (aparece al hacer hover)
- Sombras de colores en pestañas activas

### 👁️ **Vista Previa en Vivo**
- Renderiza HTML/CSS/JS en tiempo real
- Botón de refrescar
- Toggle para mostrar/ocultar
- Ejecución automática de JavaScript

### 💻 **Terminal Integrada**
- Terminal funcional con comandos
- Botón toggle en la barra superior
- Maximizar/Minimizar
- Historial de comandos

### 🎭 **Efectos Visuales**
- Sombras de colores azul, amarillo y púrpura
- Efectos glow en botones y elementos
- Animaciones suaves
- Tema oscuro profesional

---

## 🔧 Funcionalidades Detalladas

### **1. Crear Archivos y Carpetas**

#### Nuevo Archivo:
1. Click en el botón **"Archivo"** en la barra superior
2. Escribe el nombre con extensión (ej: `page.html`, `style.css`, `app.js`)
3. El archivo aparecerá en el explorador

#### Nueva Carpeta:
1. Click en el botón **"Carpeta"** en la barra superior
2. Escribe el nombre de la carpeta
3. La carpeta aparecerá en el explorador

---

### **2. Autocompletado y Snippets**

#### ⚡ **Snippet Emmet "!"** (HTML)
Escribe `!` y presiona **TAB** o **ENTER** para crear la estructura HTML5 básica:
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```

#### 🏷️ **Etiquetas HTML con Autocerrado**
Escribe el nombre de la etiqueta y selecciona de las sugerencias:

- `div` → `<div></div>`
- `p` → `<p></p>`
- `button` → `<button></button>`
- `h1`, `h2`, `h3` → Encabezados cerrados
- `ul` → Lista con `<li>`
- `form` → Formulario completo
- `table` → Tabla con estructura
- `input` → Input con placeholder
- `img` → Imagen con src y alt
- `a` → Enlace con href

#### 🎨 **Snippets CSS**
- `flexbox` → Flexbox centrado completo
- `grid` → CSS Grid con columnas
- `transition` → Transición CSS

#### ⚡ **Snippets JavaScript**
- `log` → `console.log()`
- `func` → Función tradicional
- `arrow` → Arrow function
- `foreach` → Bucle forEach
- `map` → Array.map()
- `fetch` → Fetch API completo
- `async` → Función async con try-catch

---

### **3. Terminal**

#### Activar/Desactivar:
Click en el botón **"Terminal"** (icono verde) en la barra superior

#### Comandos Disponibles:
```bash
help          # Muestra todos los comandos
clear         # Limpia la terminal
date          # Muestra la fecha actual
time          # Muestra la hora actual
info          # Información del editor
theme         # Información del tema
echo [texto]  # Imprime un mensaje
```

#### Ejemplos:
```bash
$ echo ¡Hola Mundo!
¡Hola Mundo!

$ date
09/10/2025

$ info
📝 Code Editor - Editor web profesional
⚡ Powered by Monaco Editor
🎨 React + Vite + TailwindCSS
```

#### Características:
- ✅ Historial de comandos
- ✅ Colores por tipo (comando, éxito, error, info)
- ✅ Maximizar/Minimizar con el botón
- ✅ Cerrar con la X

---

### **4. Vista Previa**

#### Toggle Preview:
Click en el botón **"Preview"** (icono púrpura)

#### Características:
- Actualización automática al escribir
- Botón de refrescar manual
- Ejecuta JavaScript automáticamente
- Inyecta CSS y JS inline en el HTML

#### Uso:
1. Edita `index.html`, `styles.css` o `script.js`
2. Los cambios se reflejan instantáneamente
3. Si algo no funciona, presiona el botón de refrescar

---

### **5. Atajos y Tips**

#### Navegación:
- **Click en archivo**: Abre en nueva pestaña
- **Click en pestaña**: Cambia a ese archivo
- **Hover en pestaña + X**: Cierra la pestaña
- **Click en carpeta**: Expande/colapsa

#### Editor:
- **Ctrl + Space**: Mostrar autocompletado
- **Tab**: Aceptar sugerencia
- **Ctrl + S**: Guardar (auto-guardado activo)
- **Ctrl + Z**: Deshacer
- **Ctrl + Y**: Rehacer
- **Ctrl + F**: Buscar
- **Ctrl + H**: Reemplazar

#### Autocompletado Avanzado:
- El editor sugiere automáticamente al escribir
- Las etiquetas HTML se cierran solas
- Las comillas se cierran automáticamente
- Los paréntesis se cierran solos

---

## 🎨 Colores y Efectos

### **Sombras por Tipo:**
- 🔵 **Azul**: Archivos HTML, botones de archivo
- 🟡 **Amarillo**: Carpetas, archivos JavaScript
- 🟣 **Púrpura**: Archivos CSS, vista previa
- 🟢 **Verde**: Terminal
- 🟠 **Naranja**: Elementos HTML

### **Efectos Hover:**
- Todos los botones tienen sombras de colores al pasar el mouse
- Los archivos se iluminan al hacer hover
- Las pestañas muestran borde de color al activarse

---

## 🐛 Solución de Problemas

### El preview no se actualiza:
- Presiona el botón de refrescar (icono circular)
- Verifica que los archivos `index.html`, `styles.css` y `script.js` existan

### El autocompletado no aparece:
- Presiona **Ctrl + Space** manualmente
- Asegúrate de estar en un archivo HTML/CSS/JS

### La terminal no responde:
- Verifica que hayas presionado Enter después del comando
- Escribe `help` para ver comandos disponibles

### Los cambios no se guardan:
- El editor guarda automáticamente al escribir
- Los cambios están en memoria (no persisten al recargar)

---

## 🎓 Ejemplo Completo

1. **Crear nuevo archivo HTML:**
   - Click en "Archivo"
   - Nombre: `miproyecto.html`

2. **Usar Emmet:**
   - Escribe `!` y presiona TAB
   - Se genera la estructura HTML

3. **Agregar contenido:**
   ```html
   <body>
       <div class="container">
           <h1>Mi Proyecto</h1>
           <p>¡Hola desde el editor!</p>
       </div>
   </body>
   ```

4. **Crear CSS:**
   - Click en "Archivo"
   - Nombre: `estilos.css`
   - Agregar estilos

5. **Crear JS:**
   - Click en "Archivo"
   - Nombre: `script.js`
   - Escribe: `log` + TAB para console.log

6. **Ver resultado:**
   - Los cambios se ven automáticamente en el preview

---

## 🌟 Características Avanzadas

### **Formateo Automático:**
- Al pegar código, se formatea automáticamente
- Al escribir, mantiene la indentación

### **Múltiples Archivos:**
- Trabaja con varios archivos simultáneamente
- Cada uno mantiene su estado independiente

### **Syntax Highlighting:**
- Colores específicos por lenguaje
- Detección automática de sintaxis

---

¡Disfruta codificando! 🚀✨
