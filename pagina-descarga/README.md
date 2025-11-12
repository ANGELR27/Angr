# 🎨 Página de Presentación y Descarga - Code Editor Pro

Esta es la página web oficial de presentación y descarga para **Code Editor Pro**.

## 📁 Archivos

```
pagina-descarga/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── favicon.svg         # Icono
└── README.md          # Este archivo
```

## 🚀 Cómo Usar

### Opción 1: Abrir Localmente

1. Abre `index.html` directamente en tu navegador
2. Navega por la página para ver todas las secciones

### Opción 2: Servidor Local

```bash
# Usando Python
cd pagina-descarga
python -m http.server 8000

# Usando Node.js
npx serve

# Usando PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

### Opción 3: Desplegar en Hosting

Puedes subir la carpeta completa a cualquier hosting web:

- **GitHub Pages**: Sube a un repositorio y activa GitHub Pages
- **Netlify**: Arrastra la carpeta a netlify.com
- **Vercel**: Conecta el repositorio o arrastra la carpeta
- **Servidor propio**: Sube vía FTP

## 📦 Configurar Enlaces de Descarga

Antes de desplegar, actualiza las rutas de descarga en `index.html`:

```html
<!-- Línea ~280 -->
<a href="TU_RUTA_AQUI/Code Editor Pro Setup 1.0.0.exe" class="btn btn-download" download>

<!-- Línea ~308 -->
<a href="TU_RUTA_AQUI/Code Editor Pro 1.0.0.exe" class="btn btn-download-secondary" download>
```

### Opciones de Hosting para Archivos .exe

1. **GitHub Releases**:
   - Crea un release en tu repositorio
   - Sube los archivos .exe
   - Copia las URLs y úsalas en la página

2. **Google Drive**:
   - Sube los .exe a Drive
   - Obtén enlace compartido
   - Úsalo en los botones de descarga

3. **Dropbox/OneDrive**:
   - Similar a Google Drive
   - Obtén enlace directo

4. **CDN/Servidor Propio**:
   - Sube a tu servidor
   - Usa la URL completa

## 🎨 Personalización

### Cambiar Colores

En `styles.css`, modifica las variables CSS:

```css
:root {
    --primary: #6366f1;        /* Color principal */
    --secondary: #8b5cf6;      /* Color secundario */
    --dark: #0f172a;          /* Color oscuro */
}
```

### Cambiar Textos

Edita `index.html` directamente. Busca las secciones:

- **Hero**: Título y descripción principal
- **Features**: Características del editor
- **Download**: Textos de descarga
- **Footer**: Información de contacto

### Agregar Screenshots

1. Toma capturas de pantalla del editor
2. Guárdalas en `pagina-descarga/images/`
3. Agrégalas en el HTML donde desees

## 📊 Secciones de la Página

1. **Header/Nav**: Navegación fija superior
2. **Hero**: Presentación principal con CTA
3. **Features**: 6 características principales
4. **Download**: Dos opciones de descarga
5. **Installation**: Pasos de instalación
6. **Footer**: Enlaces y copyright

## ✨ Características de la Página

- ✅ Diseño moderno y profesional
- ✅ Responsive (se adapta a móviles)
- ✅ Animaciones suaves
- ✅ Mockup de código animado
- ✅ Botones de descarga destacados
- ✅ Gradientes y efectos visuales
- ✅ SEO optimizado
- ✅ Sin dependencias externas

## 🔧 Integración con GitHub Pages

```bash
# Desde la raíz del proyecto
git add pagina-descarga/
git commit -m "Add download page"
git push

# Configurar GitHub Pages
# Repositorio → Settings → Pages
# Source: main branch / pagina-descarga folder
```

URL será: `https://tu-usuario.github.io/tu-repo/`

## 📱 Preview

La página incluye:

- **Hero Section**: Título impactante con estadísticas
- **Features Grid**: 6 características en tarjetas
- **Download Cards**: 2 opciones de descarga claramente diferenciadas
- **Installation Steps**: Proceso simple en 3 pasos
- **Mockup de Editor**: Vista previa del código con sintaxis

## 🎯 Próximos Pasos

1. **Actualizar enlaces de descarga** con las rutas reales
2. **Agregar screenshots** del editor en uso
3. **Configurar analytics** (Google Analytics, Plausible, etc.)
4. **Agregar testimonios** de usuarios (opcional)
5. **Crear página de documentación** enlazada desde el nav

## 📞 Soporte

Si necesitas ayuda para personalizar o desplegar:

1. Revisa este README
2. Consulta la documentación del hosting elegido
3. Los estilos están bien comentados en `styles.css`

---

**¡Tu página de presentación está lista para ser publicada!** 🎉

Simplemente actualiza los enlaces de descarga y súbela a tu hosting favorito.
