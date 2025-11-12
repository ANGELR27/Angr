# 🚀 Code Editor Pro - Guía Rápida

## 📌 Resumen

**Code Editor Pro** ahora está disponible en **DOS VERSIONES**:

1. ✅ **Versión Web** (navegador) - `npm run dev`
2. ✅ **Versión Escritorio** (Windows) - `npm run electron:dev`

**Todas las funcionalidades funcionan en ambas versiones sin cambios.**

---

## 🎯 Inicio Rápido

### Opción 1: Usar como App Web (Navegador)

```powershell
npm install
npm run dev
```

Abre `http://localhost:3000`

### Opción 2: Usar como App de Escritorio (Electron)

```powershell
npm install
npm run electron:dev
```

Se abrirá una ventana nativa de Windows.

### Opción 3: Crear Instalador para Windows

```powershell
npm install
.\build-electron.ps1
```

Crea un instalador `.exe` en `dist-electron/`

---

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor web (navegador) |
| `npm run build` | Build de producción web |
| `npm run electron:dev` | App de escritorio en desarrollo |
| `npm run electron:build` | Crear instalador |
| `npm run electron:build:win` | Instalador para Windows |
| `npm run electron:build:portable` | Versión portable (sin instalación) |

---

## 🆕 Nuevos Archivos Creados

### Archivos de Electron

- **`electron.cjs`** - Proceso principal de Electron
- **`preload.cjs`** - Script de seguridad (context bridge)
- **`build-electron.ps1`** - Script automatizado para crear instaladores

### Documentación

- **`ELECTRON_APP.md`** - Guía completa de la versión de escritorio
- **`README_ELECTRON.md`** - Este archivo (guía rápida)

---

## ✨ Ventajas de cada Versión

### Versión Web
- ✅ Sin instalación
- ✅ Funciona en cualquier navegador
- ✅ Colaboración en tiempo real
- ✅ Actualizaciones automáticas
- ✅ Multiplataforma (Windows/Mac/Linux)

### Versión Escritorio
- ✅ Ventana nativa de Windows
- ✅ Menús integrados
- ✅ Atajos de teclado del sistema
- ✅ Funciona offline (después de abrir una vez)
- ✅ Icono en el escritorio
- ✅ Mayor rendimiento
- ✅ No depende del navegador

---

## 🔧 Configuración

### Variables de Entorno (.env)

```env
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-key-de-supabase
```

**Funciona sin configuración** (muestra advertencia pero no rompe nada)

---

## 📊 Comparación Rápida

| Característica | Web | Escritorio |
|----------------|-----|------------|
| Instalación | No requiere | Instalador .exe |
| Tamaño | 0MB | ~250MB |
| Inicio | ~1s | ~2s |
| Offline | ❌ | ✅ (parcial) |
| Colaboración | ✅ | ✅ |
| Autocompletado | ✅ | ✅ |
| Git integrado | ✅ | ✅ |
| Terminal | ✅ | ✅ |
| Temas | ✅ | ✅ |
| Ventana nativa | ❌ | ✅ |
| Menús del sistema | ❌ | ✅ |

---

## 🎨 Funcionalidades Principales

- ✅ Editor Monaco (mismo de VS Code)
- ✅ Soporte para 20+ lenguajes
- ✅ Colaboración en tiempo real (estilo Google Docs)
- ✅ Sistema Git integrado
- ✅ Terminal integrada
- ✅ Live Preview de HTML/JS
- ✅ Snippets personalizados
- ✅ Split View (vista dividida)
- ✅ Múltiples temas
- ✅ Auto-guardado
- ✅ Atajos de teclado
- ✅ Gestión de archivos completa

---

## 📁 Estructura de Archivos

```
editorr/
├── src/               # Código fuente React
├── public/            # Assets estáticos
├── electron.cjs       # ⭐ Proceso principal Electron
├── preload.cjs        # ⭐ Preload script
├── vite.config.js     # ⭐ Actualizado para Electron
├── package.json       # ⭐ Scripts de Electron agregados
├── build-electron.ps1 # ⭐ Script de empaquetado
└── ELECTRON_APP.md    # ⭐ Documentación completa
```

---

## 🚀 Distribución

### Para distribuir a otros usuarios:

1. Ejecutar: `.\build-electron.ps1`
2. Elegir tipo de instalador
3. Compartir archivo de `dist-electron/`:
   - `Code Editor Pro Setup 1.0.0.exe` (instalador completo)
   - `Code Editor Pro 1.0.0.exe` (portable)

### Usuarios finales solo necesitan:

1. Descargar el `.exe`
2. Ejecutar el instalador
3. ¡Listo! App instalada

---

## 🐛 Troubleshooting

### Error: "No se puede encontrar electron"

```powershell
npm install
```

### La app no abre en modo Electron

```powershell
# Verificar que puerto 3000 esté libre
netstat -ano | findstr :3000

# Si está ocupado, matar proceso
taskkill /PID <PID> /F
```

### Build falla

```powershell
# Limpiar y recompilar
Remove-Item -Recurse -Force node_modules, dist, dist-electron
npm install
npm run electron:build:win
```

---

## 📚 Documentación Completa

- **`ELECTRON_APP.md`** - Guía detallada de la app de escritorio
- **`COLABORACION.md`** - Sistema colaborativo
- **`LENGUAJES_SOPORTADOS.md`** - Lenguajes disponibles
- **`MEJORAS_IMPLEMENTADAS.md`** - Log de mejoras

---

## ✅ Lo Importante

1. **NADA SE ROMPIÓ**: La versión web sigue funcionando exactamente igual
2. **TODO FUNCIONA**: Colaboración, Git, Terminal, etc. en ambas versiones
3. **FÁCIL DE USAR**: Un solo comando para cada versión
4. **LISTO PARA DISTRIBUIR**: Script automatizado para crear instaladores

---

## 🎉 ¡Eso es todo!

Ahora tienes un editor de código profesional disponible como:
- ✅ Aplicación web
- ✅ Aplicación de escritorio para Windows

**Siguiente paso**: Ejecuta `npm run electron:dev` para probarlo 🚀
