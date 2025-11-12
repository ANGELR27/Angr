# Script para instalar solo dependencias de Electron de forma optimizada
# Ejecutar: .\install-electron.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Instalación Optimizada de Electron" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Limpiar caché de npm
Write-Host "🧹 Limpiando caché de npm..." -ForegroundColor Yellow
npm cache clean --force
Write-Host ""

# Configurar npm para mejor conexión
Write-Host "⚙️ Configurando npm..." -ForegroundColor Yellow
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
Write-Host ""

# Instalar dependencias en grupos
Write-Host "📦 Instalando dependencias críticas de Electron..." -ForegroundColor Yellow
Write-Host ""

# Grupo 1: Electron core
Write-Host "1/3: Instalando Electron..." -ForegroundColor Cyan
npm install electron@28.0.0 --save-dev --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Error al instalar Electron, reintentando..." -ForegroundColor Yellow
    npm install electron --save-dev --legacy-peer-deps --force
}

# Grupo 2: Builder
Write-Host "2/3: Instalando Electron Builder..." -ForegroundColor Cyan
npm install electron-builder@24.9.1 --save-dev --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Error al instalar Builder, reintentando..." -ForegroundColor Yellow
    npm install electron-builder --save-dev --legacy-peer-deps --force
}

# Grupo 3: Utilidades
Write-Host "3/3: Instalando utilidades..." -ForegroundColor Cyan
npm install concurrently wait-on --save-dev --legacy-peer-deps

Write-Host ""
Write-Host "✅ Dependencias de Electron instaladas" -ForegroundColor Green
Write-Host ""
Write-Host "Verificando instalación..." -ForegroundColor Yellow

# Verificar instalaciones
$electronInstalled = Test-Path "node_modules\electron"
$builderInstalled = Test-Path "node_modules\electron-builder"

if ($electronInstalled -and $builderInstalled) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  ✨ ¡Instalación Exitosa!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor Cyan
    Write-Host "  npm run electron:dev              - Probar app" -ForegroundColor White
    Write-Host "  .\build-electron.ps1              - Crear instalador" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️ Advertencia: Algunas dependencias pueden no estar completas" -ForegroundColor Yellow
    Write-Host "Intenta ejecutar manualmente: npm install" -ForegroundColor Yellow
    Write-Host ""
}
