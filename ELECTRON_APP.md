# 🖥️ Code Editor Pro - Aplicación de Escritorio para Windows

Esta documentación explica cómo ejecutar, desarrollar y crear instaladores de la versión de escritorio de **Code Editor Pro** usando Electron.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Modo Desarrollo](#modo-desarrollo)
4. [Crear Instalador](#crear-instalador)
5. [Características de la App](#características-de-la-app)
6. [Atajos de Teclado](#atajos-de-teclado)
7. [Distribución](#distribución)
8. [Solución de Problemas](#solución-de-problemas)

---

## ✅ Requisitos Previos

- **Node.js** v16 o superior ([Descargar aquí](https://nodejs.org/))
- **npm** (incluido con Node.js)
- **Windows** 10/11 (64-bit)
- Mínimo **4GB RAM**
- Espacio en disco: **500MB** para desarrollo, **200MB** para instalación

---

## 📦 Instalación

### 1. Clonar o tener el proyecto

```powershell
cd "C:\Users\angel\OneDrive\Escritorio\Wind apps\editorr"
```

### 2. Instalar dependencias

```powershell
npm install
```

Esto instalará:
- Electron 28.x
- Electron Builder (para crear instaladores)
- Todas las dependencias del editor web

---

## 🚀 Modo Desarrollo

### Opción A: Ejecutar en Electron directamente

```powershell
npm run electron:dev
```

Esto hará:
1. Iniciar servidor de desarrollo de Vite (puerto 3000)
2. Abrir la app en una ventana de Electron
3. DevTools abiertos automáticamente
4. Hot reload activado

### Opción B: Ejecutar en navegador (modo web)

```powershell
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

---

## 📦 Crear Instalador

### Método 1: Script Automatizado (Recomendado)

```powershell
.\build-electron.ps1
```

El script te preguntará qué tipo de instalador crear:
- **Opción 1**: Instalador completo (NSIS) - Setup.exe con instalación
- **Opción 2**: Versión portable - Sin instalación, ejecutable directo
- **Opción 3**: Ambos

### Método 2: Comandos NPM Directos

```powershell
# Instalador completo
npm run electron:build:win

# Solo instalador NSIS
npm run electron:build

# Solo portable
npm run electron:build:portable
```

### ⏱️ Tiempo de Compilación

- Primera compilación: **5-10 minutos**
- Compilaciones posteriores: **3-5 minutos**
- Requiere descargar binarios de Electron (~150MB) solo la primera vez

### 📂 Archivos Generados

Los instaladores se guardan en: `dist-electron/`

```
dist-electron/
├── Code Editor Pro Setup 1.0.0.exe      (~80MB) - Instalador completo
├── Code Editor Pro 1.0.0.exe            (~90MB) - Versión portable
└── win-unpacked/                        (~250MB) - Archivos sin empaquetar
```

---

## ✨ Características de la App

### Ventana Nativa
- Tamaño inicial: **1400x900**
- Tamaño mínimo: **800x600**
- Redimensionable y maximizable
- Tema oscuro por defecto

### Menús

#### Archivo
- `Ctrl+N` - Nuevo Proyecto
- `Ctrl+O` - Abrir Carpeta
- `Ctrl+S` - Guardar
- `Ctrl+Q` - Salir

#### Editar
- `Ctrl+Z` - Deshacer
- `Ctrl+Shift+Z` - Rehacer
- `Ctrl+X/C/V` - Cortar/Copiar/Pegar
- `Ctrl+A` - Seleccionar todo

#### Ver
- `Ctrl+R` - Recargar
- `F12` - DevTools
- `F11` - Pantalla completa
- `Ctrl++/-/0` - Zoom

### Seguridad
- **Context Isolation** activado
- **Node Integration** desactivado
- **Sandbox** habilitado
- Preload script para API segura

### Rendimiento
- Inicio rápido (~2 segundos)
- Consumo RAM: **150-300MB**
- Soporte multi-ventana
- Prevención de instancias múltiples

---

## ⌨️ Atajos de Teclado

### Generales
| Atajo | Acción |
|-------|--------|
| `Ctrl+S` | Guardar archivo actual |
| `Ctrl+N` | Nuevo archivo/proyecto |
| `Ctrl+O` | Abrir carpeta |
| `F12` | Abrir DevTools |
| `F11` | Pantalla completa |
| `Ctrl+R` | Recargar aplicación |

### Editor (Monaco)
| Atajo | Acción |
|-------|--------|
| `Ctrl+F` | Buscar |
| `Ctrl+H` | Reemplazar |
| `Ctrl+D` | Selección múltiple |
| `Alt+↑/↓` | Mover línea |
| `Ctrl+/` | Comentar línea |
| `Ctrl+Space` | Autocompletado |

---

## 📤 Distribución

### Instalador NSIS (Recomendado para usuarios finales)

**Ventajas:**
- Instalación guiada
- Crea acceso directo en escritorio
- Aparece en "Programas y características"
- Desinstalador incluido
- Auto-actualizaciones (si se configura)

**Instrucciones para usuarios:**
1. Descargar `Code Editor Pro Setup 1.0.0.exe`
2. Ejecutar el instalador
3. Seguir el asistente
4. ¡Listo! Buscar "Code Editor Pro" en el menú inicio

### Versión Portable

**Ventajas:**
- Sin instalación
- Ejecutable directo
- Portable en USB
- No requiere permisos de administrador

**Instrucciones para usuarios:**
1. Descargar `Code Editor Pro 1.0.0.exe`
2. Copiar a cualquier carpeta
3. Ejecutar directamente
4. Datos guardados en AppData local

---

## 🐛 Solución de Problemas

### Error: "No se puede encontrar el módulo electron"

```powershell
# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm install
```

### Error: "La compilación falla"

```powershell
# Limpiar caché y recompilar
npm run build
Remove-Item -Recurse -Force dist
Remove-Item -Recurse -Force dist-electron
npm run electron:build:win
```

### La app no abre o se cierra inmediatamente

1. Verificar que el puerto 3000 no esté en uso (modo dev)
2. Ejecutar desde PowerShell para ver errores:
   ```powershell
   .\dist-electron\win-unpacked\Code Editor Pro.exe
   ```
3. Revisar logs en: `%APPDATA%\code-editor\logs\`

### DevTools no se abren

En `electron.cjs` línea 119, descomentar:
```javascript
mainWindow.webContents.openDevTools();
```

### La app es muy grande

Esto es normal. Electron incluye:
- Runtime de Node.js (~50MB)
- Chromium (~100MB)
- Tu aplicación (~30MB)

Para reducir tamaño:
- Usar `asar` para empaquetar código
- Habilitar compresión NSIS
- Usar target `7z` para comprimir más

---

## 📊 Comparación de Tamaños

| Formato | Tamaño | Instalado |
|---------|---------|-----------|
| Instalador NSIS | ~80MB | ~250MB |
| Portable | ~90MB | ~90MB |
| Versión web | 0MB | Navegador |

---

## 🔧 Configuración Avanzada

### Cambiar icono de la app

1. Crear archivo `icon.ico` (256x256) en `public/`
2. Editar `package.json`:
   ```json
   "win": {
     "icon": "public/icon.ico"
   }
   ```

### Cambiar nombre de la app

En `package.json`:
```json
"build": {
  "productName": "Mi Editor"
}
```

### Auto-actualizaciones

Agregar a `package.json`:
```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "tu-usuario",
    "repo": "tu-repo"
  }
}
```

Y en `electron.cjs`:
```javascript
const { autoUpdater } = require('electron-updater');
autoUpdater.checkForUpdatesAndNotify();
```

---

## 📝 Notas Importantes

1. **Nada se rompe**: La app web sigue funcionando igual con `npm run dev`
2. **Compatibilidad**: Solo Windows por ahora (fácil agregar Mac/Linux)
3. **Supabase**: Funciona perfectamente en Electron
4. **Colaboración**: Requiere conexión a internet
5. **Permisos**: El instalador puede pedir permisos de administrador

---

## 🚀 Próximos Pasos

Una vez que tengas el instalador:

1. **Probar**: Instalar en máquina limpia
2. **Distribuir**: Subir a Google Drive, OneDrive, o GitHub Releases
3. **Documentar**: Crear README para usuarios finales
4. **Actualizar**: Usar electron-updater para auto-actualizaciones

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar esta documentación
2. Verificar logs en DevTools (F12)
3. Revisar archivo `electron.cjs` para debug
4. Limpiar caché y recompilar

---

## ✅ Checklist de Distribución

Antes de distribuir, verificar:

- [ ] App se ejecuta correctamente en modo dev
- [ ] Build de Vite completa sin errores
- [ ] Instalador se crea correctamente
- [ ] App instalada abre sin errores
- [ ] Todas las funcionalidades funcionan
- [ ] Iconos y menús se ven correctamente
- [ ] No hay errores en DevTools
- [ ] Permisos de escritura funcionan
- [ ] Colaboración funciona (si aplica)
- [ ] Documentación para usuarios lista

---

¡Listo! Ahora tienes una app de escritorio profesional para Windows. 🎉
