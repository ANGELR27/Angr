# 🎯 Cómo Crear el Instalador de Windows - Guía Simple

## ⚡ Método Rápido (Recomendado)

### Paso 1: Abrir PowerShell en la carpeta del proyecto

```powershell
cd "C:\Users\angel\OneDrive\Escritorio\Wind apps\editorr"
```

### Paso 2: Ejecutar el script automatizado

```powershell
.\build-electron.ps1
```

### Paso 3: Elegir tipo de instalador

El script te preguntará:
```
Selecciona el tipo de instalador:
1. Instalador completo (NSIS) - Recomendado
2. Versión portable (sin instalación)
3. Ambos
```

**Recomendación**: Opción **3** para tener ambos.

### Paso 4: Esperar

- Primera vez: **5-10 minutos** (descarga Electron)
- Siguientes veces: **3-5 minutos**

### Paso 5: ¡Listo!

Los archivos estarán en `dist-electron/`:

```
Code Editor Pro Setup 1.0.0.exe    - Instalador completo (~80MB)
Code Editor Pro 1.0.0.exe          - Versión portable (~90MB)
```

---

## 📦 Tipos de Instaladores

### 1. Instalador NSIS (Setup.exe)

**Características:**
- ✅ Instalación guiada paso a paso
- ✅ Crea acceso directo en escritorio
- ✅ Aparece en "Programas y características"
- ✅ Incluye desinstalador
- ✅ Usuarios pueden elegir carpeta de instalación

**Ideal para:** Distribución a usuarios finales

**Cómo compartir:**
1. Subir `Code Editor Pro Setup 1.0.0.exe` a Google Drive / OneDrive
2. Usuario descarga y ejecuta
3. Sigue el asistente de instalación
4. ¡Listo!

### 2. Versión Portable

**Características:**
- ✅ Sin instalación
- ✅ Ejecutable directo
- ✅ Portable en USB
- ✅ No requiere permisos de administrador
- ✅ No modifica registro de Windows

**Ideal para:** Uso personal, pruebas, USB

**Cómo usar:**
1. Copiar `Code Editor Pro 1.0.0.exe` a cualquier carpeta
2. Ejecutar directamente
3. ¡Funciona!

---

## 🔧 Métodos Alternativos

### Método Manual (sin script)

```powershell
# Instalar dependencias (solo primera vez)
npm install

# Crear instalador
npm run electron:build:win
```

### Solo instalador NSIS

```powershell
npm run electron:build
```

### Solo portable

```powershell
npm run electron:build:portable
```

---

## 📂 Estructura de Salida

Después de compilar, encontrarás en `dist-electron/`:

```
dist-electron/
│
├── Code Editor Pro Setup 1.0.0.exe      # Instalador NSIS
├── Code Editor Pro 1.0.0.exe            # Portable
│
├── win-unpacked/                         # Archivos sin empaquetar
│   ├── Code Editor Pro.exe
│   ├── resources/
│   └── ...
│
└── builder-effective-config.yaml         # Config de build
```

---

## ⚙️ Requisitos del Sistema

### Para compilar (tu PC):
- Windows 10/11
- Node.js v16+
- 4GB RAM
- 2GB espacio libre

### Para ejecutar la app (usuarios):
- Windows 10/11 (64-bit)
- 2GB RAM
- 300MB espacio libre

---

## 🚀 Distribución a Usuarios

### Opción 1: Google Drive / OneDrive

1. Compilar instalador
2. Subir `.exe` a tu carpeta compartida
3. Compartir enlace con usuarios
4. Usuarios descargan y ejecutan

### Opción 2: GitHub Releases

1. Crear release en GitHub
2. Subir archivos `.exe`
3. Usuarios descargan desde releases

### Opción 3: Servidor propio

1. Subir a tu servidor web
2. Crear página de descarga
3. Link directo al `.exe`

---

## 📝 Checklist Antes de Distribuir

Antes de compartir el instalador, verifica:

- [ ] La app abre correctamente en modo dev (`npm run electron:dev`)
- [ ] Build se completa sin errores
- [ ] Instalador se crea correctamente
- [ ] Probaste instalar en otra PC (o VM)
- [ ] Todas las funcionalidades funcionan
- [ ] No hay errores en consola (F12)
- [ ] Iconos y menús se ven bien
- [ ] Documentación lista (README para usuarios)

---

## 🐛 Solución de Problemas Comunes

### "El script está deshabilitado"

```powershell
# Habilitar ejecución de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "npm no se reconoce como comando"

1. Instalar Node.js desde https://nodejs.org/
2. Reiniciar PowerShell
3. Verificar: `node --version`

### "Error al compilar"

```powershell
# Limpiar y reinstalar
Remove-Item -Recurse -Force node_modules, dist, dist-electron
npm install
npm run electron:build:win
```

### "El instalador no se crea"

1. Verificar espacio en disco (mínimo 2GB)
2. Cerrar antivirus temporalmente
3. Ejecutar PowerShell como administrador
4. Intentar de nuevo

### "Error: Cannot find module 'electron'"

```powershell
npm install electron --save-dev
```

---

## 💡 Tips y Trucos

### Reducir tiempo de compilación

```powershell
# Solo crear portable (más rápido)
npm run electron:build:portable
```

### Compilar sin empaquetar (testing)

```powershell
npm run build
# Los archivos están en dist/
# Puedes probar con: npm run electron:dev
```

### Ver tamaño de archivos

```powershell
Get-ChildItem dist-electron/*.exe | Select-Object Name, @{Name="Size (MB)";Expression={[math]::Round($_.Length / 1MB, 2)}}
```

### Limpiar builds anteriores

```powershell
Remove-Item -Recurse -Force dist-electron
```

---

## 📊 Comparación de Tamaños

| Archivo | Tamaño | Comprimido (.zip) |
|---------|---------|-------------------|
| Instalador NSIS | ~80MB | ~70MB |
| Portable | ~90MB | ~75MB |
| win-unpacked | ~250MB | ~80MB |

---

## 🎯 Resumen Ultra-Rápido

```powershell
# 1. Instalar dependencias (solo primera vez)
npm install

# 2. Crear instalador
.\build-electron.ps1

# 3. Elegir opción 3 (ambos tipos)

# 4. Esperar 5-10 minutos

# 5. ¡Listo! Archivos en dist-electron/
```

---

## ✅ Confirmación Final

Si ves esto al final de la compilación:

```
================================================
  ✨ ¡Compilación exitosa!
================================================

Los archivos se encuentran en:
📂 dist-electron\

Archivos generados:
  📦 Code Editor Pro Setup 1.0.0.exe - XX MB
  📦 Code Editor Pro 1.0.0.exe - XX MB

🎉 ¡Listo para distribuir!
```

**¡Todo está perfecto!** Ya puedes compartir los archivos.

---

## 📞 Ayuda

Si algo no funciona:
1. Lee esta guía completamente
2. Revisa `ELECTRON_APP.md` para detalles técnicos
3. Ejecuta en modo dev primero: `npm run electron:dev`
4. Verifica que Node.js esté instalado: `node --version`

---

¡Eso es todo! 🚀 Ahora puedes crear tu instalador para Windows en minutos.
