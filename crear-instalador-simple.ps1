# Script para crear instaladores de Electron
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Creando Instaladores - Code Editor Pro" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar build
if (-not (Test-Path "dist")) {
    Write-Host "ERROR: No existe carpeta dist" -ForegroundColor Red
    Write-Host "Ejecuta primero: npm run build" -ForegroundColor Yellow
    exit 1
}

Write-Host "Build encontrado" -ForegroundColor Green
Write-Host ""

# Verificar electron-builder
$builderPath = "node_modules\.bin\electron-builder.cmd"
if (-not (Test-Path $builderPath)) {
    Write-Host "Instalando electron-builder..." -ForegroundColor Yellow
    npm install electron-builder app-builder-bin --save-dev --legacy-peer-deps
}

Write-Host "Creando instaladores para Windows..." -ForegroundColor Yellow
Write-Host ""

# Crear ambos tipos
Write-Host "[1/2] Creando instalador NSIS..." -ForegroundColor Cyan
& $builderPath --win nsis --x64

Write-Host ""
Write-Host "[2/2] Creando version portable..." -ForegroundColor Cyan
& $builderPath --win portable --x64

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Proceso Completado" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

if (Test-Path "dist-electron") {
    Write-Host "Archivos generados:" -ForegroundColor Cyan
    Get-ChildItem -Path "dist-electron" -Filter "*.exe" | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  $($_.Name) - $sizeMB MB" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Listo!" -ForegroundColor Green
