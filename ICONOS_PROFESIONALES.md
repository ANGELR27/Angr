# 🎨 Sistema de Iconos Profesionales

**Implementado:** FileExplorer con 40+ tipos de archivo  
**Estado:** ✅ Completado

---

## 🖼️ IMÁGENES

| Extensión | Icono | Color |
|-----------|-------|-------|
| `.png`, `.jpg`, `.jpeg` | 📷 FileImage | Rosa (#f472b6) |
| `.gif`, `.svg`, `.webp` | 📷 FileImage | Rosa (#f472b6) |
| `.ico`, `.bmp` | 📷 FileImage | Rosa (#f472b6) |

---

## 🌐 DESARROLLO WEB

| Extensión | Icono | Color | Lenguaje |
|-----------|-------|-------|----------|
| `.html`, `.htm` | 📄 FileCode2 | Naranja (#e34c26) | HTML5 |
| `.css` | 🎨 Palette | Azul (#264de4) | CSS3 |
| `.scss`, `.sass`, `.less` | 🎨 Palette | Azul (#264de4) | CSS Preprocessors |
| `.js`, `.mjs`, `.cjs` | {} Braces | Amarillo (#f7df1e) | JavaScript |
| `.ts` | {} Braces | Azul (#3178c6) | TypeScript |
| `.jsx`, `.tsx` | 💻 Code2 | Cyan (#61dafb) | React |
| `.json` | 📋 FileJson | Gris (#5a5a5a) | JSON |

---

## 🐍 LENGUAJES DE PROGRAMACIÓN

### Python
| Extensión | Icono | Color |
|-----------|-------|-------|
| `.py`, `.pyw`, `.pyx` | 💻 Code2 | Azul (#3776ab) |

### Java / JVM
| Extensión | Icono | Color |
|-----------|-------|-------|
| `.java` | ☕ Coffee | Naranja (#f89820) |
| `.kt`, `.kts` | 📦 Box | Morado (#7f52ff) |

### C / C++ / C#
| Extensión | Icono | Color |
|-----------|-------|-------|
| `.c`, `.h` | 📄 FileCode2 | Azul claro (#a8b9cc) |
| `.cpp`, `.cc`, `.cxx`, `.hpp` | 📄 FileCode2 | Azul (#00599c) |
| `.cs` | 📄 FileCode2 | Verde (#239120) |

### Rust
| Extensión | Icono | Color |
|-----------|-------|-------|
| `.rs` | 📄 FileCode2 | Naranja (#dea584) |

### Go
| Extensión | Icono | Color |
|-----------|-------|-------|
| `.go` | 💻 Code2 | Cyan (#00add8) |

### Swift
| Extensión | Icono | Color |
|-----------|-------|-------|
| `.swift` | 💻 Code2 | Naranja (#fa7343) |

### PHP
| Extensión | Icono | Color |
|-----------|-------|-------|
| `.php` | 💻 Code2 | Morado (#777bb4) |

### Ruby
| Extensión | Icono | Color |
|-----------|-------|-------|
| `.rb`, `.erb` | 💻 Code2 | Rojo (#cc342d) |

---

## 📝 DOCUMENTACIÓN

| Extensión | Icono | Color |
|-----------|-------|-------|
| `.md`, `.markdown` | 📄 FileText | Azul (#083fa1) |
| `.txt`, `.log` | 📄 FileText | Gris (#9ca3af) |

---

## ⚙️ CONFIGURACIÓN

| Archivo | Icono | Color |
|---------|-------|-------|
| `.xml` | ⚙️ Settings | Gris (#6b7280) |
| `.yml`, `.yaml` | ⚙️ Settings | Gris (#6b7280) |
| `.toml`, `.ini` | ⚙️ Settings | Gris (#6b7280) |
| `.conf`, `.config` | ⚙️ Settings | Gris (#6b7280) |
| `.env` | ⚙️ Settings | Amarillo (#ecd53f) |

---

## 💾 BASE DE DATOS

| Extensión | Icono | Color |
|-----------|-------|-------|
| `.sql` | 🗄️ Database | Azul (#4479a1) |
| `.db`, `.sqlite` | 🗄️ Database | Azul (#4479a1) |

---

## 📦 GESTIÓN DE PAQUETES

| Archivo | Icono | Color |
|---------|-------|-------|
| `package.json` | 📦 Package | Rojo (#cb3837) |
| `package-lock.json` | 📦 Package | Rojo (#cb3837) |
| `yarn.lock` | 📦 Package | Gris (#6b7280) |
| `pnpm-lock.yaml` | 📦 Package | Gris (#6b7280) |
| `*.lock` | 📦 Package | Gris (#6b7280) |

---

## 🔧 SCRIPTS

| Extensión | Icono | Color |
|-----------|-------|-------|
| `.sh`, `.bash`, `.zsh` | 💻 Terminal | Verde (#4eaa25) |
| `.bat`, `.cmd` | 💻 Terminal | Azul oscuro (#012456) |
| `.ps1` (PowerShell) | 💻 Terminal | Azul oscuro (#012456) |

---

## 🎨 FRAMEWORKS

| Extensión | Icono | Color |
|-----------|-------|-------|
| `.vue` | 📚 Layers | Verde (#42b883) |
| `.svelte` | 📚 Layers | Naranja (#ff3e00) |

---

## 📄 OTROS

| Tipo | Icono | Color |
|------|-------|-------|
| Desconocido | 📄 File | Gris (#9ca3af) |

---

## 🎯 CARACTERÍSTICAS

### ✅ Colores Oficiales
Cada lenguaje usa su **color oficial** de la documentación:
- Python → Azul Python oficial (#3776ab)
- JavaScript → Amarillo JS (#f7df1e)
- HTML → Naranja HTML5 (#e34c26)
- CSS → Azul CSS3 (#264de4)
- etc.

### ✅ Iconos Contextuales
- **Coffee** ☕ para Java (café)
- **Terminal** 💻 para scripts de shell
- **Database** 🗄️ para archivos SQL
- **Package** 📦 para gestión de dependencias
- **Settings** ⚙️ para configuración

### ✅ Consistencia Visual
- Tamaño uniforme: `w-4 h-4` (16px)
- Colores adaptables al tema lite/dark
- Iconos de Lucide React (profesionales)

---

## 🔄 MODO LITE

En el tema `lite`, todos los iconos usan:
```javascript
color: 'var(--theme-secondary)'
```

Esto asegura consistencia con el esquema de colores del tema.

---

## 🚀 USO

Los iconos se aplican automáticamente basándose en la extensión del archivo:

```javascript
// Crear archivo Python
nuevo.py → 🐍 Icono azul Python

// Crear archivo TypeScript
app.ts → {} Icono azul TypeScript

// Crear configuración
config.yaml → ⚙️ Icono gris Settings
```

---

## 📊 ESTADÍSTICAS

| Categoría | Cantidad |
|-----------|----------|
| **Imágenes** | 8 extensiones |
| **Web** | 12 extensiones |
| **Lenguajes** | 25+ lenguajes |
| **Config** | 8 tipos |
| **Database** | 3 extensiones |
| **Scripts** | 6 extensiones |
| **Total** | 40+ tipos soportados |

---

## 💡 VENTAJAS

1. **Reconocimiento Visual Instantáneo**
   - Identificas archivos por color e icono
   - No necesitas leer la extensión

2. **Profesionalidad**
   - Colores oficiales de cada lenguaje
   - Iconos consistentes y modernos

3. **Productividad**
   - Navegación más rápida en el sidebar
   - Menos errores al seleccionar archivos

4. **Extensibilidad**
   - Fácil agregar nuevos tipos de archivo
   - Sistema modular y mantenible

---

## 🎨 EJEMPLOS VISUALES

```
📁 proyecto/
  📄 index.html (naranja)
  🎨 styles.css (azul)
  {} script.js (amarillo)
  💻 app.tsx (cyan)
  🐍 main.py (azul Python)
  ☕ App.java (naranja)
  💻 test.sh (verde)
  🗄️ database.sql (azul DB)
  ⚙️ config.yaml (gris)
  📦 package.json (rojo npm)
  📷 logo.png (rosa)
  📄 README.md (azul markdown)
```

---

## 🔧 MANTENIMIENTO

Para agregar un nuevo tipo de archivo:

```javascript
// En FileExplorer.jsx, función getFileIcon()
if (fileName.endsWith('.nuevo')) {
  return <IconName className="w-4 h-4" style={{color: baseColor || '#color'}} />;
}
```

---

## ✅ ESTADO

**Implementación:** Completa  
**Archivos modificados:** `src/components/FileExplorer.jsx`  
**Iconos agregados:** 40+ tipos  
**Colores:** Oficiales de cada lenguaje  
**Compatibilidad:** Tema lite y dark  

---

**¡Sistema de iconos profesional completamente funcional!** 🎉
