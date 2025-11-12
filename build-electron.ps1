# Script para compilar la aplicación de escritorio para Windows
# Ejecutar: .\build-electron.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Code Editor Pro - Build para Windows" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Node.js está instalado
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "Descarga Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Paso 1: Verificar dependencias críticas
Write-Host "🔍 Verificando dependencias..." -ForegroundColor Yellow

$electronExists = Test-Path "node_modules\electron"
$builderExists = Test-Path "node_modules\electron-builder"

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando todas las dependencias..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        Write-Host "💡 Intenta ejecutar: .\install-electron.ps1" -ForegroundColor Yellow
        exit 1
    }
} elseif (-not $electronExists -or -not $builderExists) {
    Write-Host "⚠️ Faltan dependencias de Electron" -ForegroundColor Yellow
    Write-Host "📦 Instalando dependencias faltantes..." -ForegroundColor Yellow
    npm install electron electron-builder concurrently wait-on --save-dev --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        Write-Host "💡 Intenta ejecutar: .\install-electron.ps1" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
}

Write-Host ""

# Paso 2: Construir aplicación web con Vite
Write-Host "🔨 Compilando aplicación web con Vite..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al compilar aplicación web" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Aplicación web compilada" -ForegroundColor Green
Write-Host ""

# Paso 3: Empaquetar con Electron Builder
Write-Host "📦 Empaquetando aplicación de escritorio..." -ForegroundColor Yellow
Write-Host ""

# Preguntar qué tipo de instalador crear
Write-Host "Selecciona el tipo de instalador:" -ForegroundColor Cyan
Write-Host "1. Instalador completo (NSIS) - Recomendado"
Write-Host "2. Versión portable (sin instalación)"
Write-Host "3. Ambos"
Write-Host ""
$choice = Read-Host "Opción (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Creando instalador NSIS..." -ForegroundColor Yellow
        npm run electron:build:win -- --config.win.target=nsis
    }
    "2" {
        Write-Host ""
        Write-Host "Creando versión portable..." -ForegroundColor Yellow
        npm run electron:build:win -- --config.win.target=portable
    }
    "3" {
        Write-Host ""
        Write-Host "Creando ambos tipos..." -ForegroundColor Yellow
        npm run electron:build:win
    }
    default {
        Write-Host "Opción no válida. Creando instalador completo..." -ForegroundColor Yellow
        npm run electron:build:win -- --config.win.target=nsis
    }
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error al empaquetar aplicación" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  ✨ ¡Compilación exitosa!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Los archivos se encuentran en:" -ForegroundColor Cyan
Write-Host "📂 dist-electron\" -ForegroundColor White
Write-Host ""
Write-Host "Archivos generados:" -ForegroundColor Cyan

# Listar archivos generados
Get-ChildItem -Path "dist-electron" -Filter "*.exe" | ForEach-Object {
    $size = [math]::Round($_.Length / 1MB, 2)
    Write-Host "  📦 $($_.Name) - $size MB" -ForegroundColor White
}

Write-Host ""
Write-Host "🎉 ¡Listo para distribuir!" -ForegroundColor Green
Write-Host ""
