# Script final para crear instaladores de Electron
# Este script maneja errores comunes y crea ambos instaladores

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Code Editor Pro - Crear Instaladores" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js no esta instalado" -ForegroundColor Red
    exit 1
}

Write-Host "Node.js detectado" -ForegroundColor Green

# Limpiar build anterior
Write-Host ""
Write-Host "Limpiando builds anteriores..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "dist-electron" -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Verificar que el build web existe
if (-not (Test-Path "dist")) {
    Write-Host "ERROR: Carpeta dist no existe" -ForegroundColor Red
    Write-Host "Ejecutando build de Vite..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Fallo el build de Vite" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Build de Vite encontrado" -ForegroundColor Green
Write-Host ""

# Crear instaladores usando npm scripts directamente
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Creando Instaladores (puede tardar 5-10 min)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Creando instalador NSIS (con asistente)..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar electron-builder con target nsis
$env:DEBUG = "electron-builder"
npm exec -- electron-builder --win nsis --x64 2>&1 | Out-Host

$nsisSuccess = $LASTEXITCODE -eq 0

Write-Host ""
Write-Host "[2/2] Creando version portable (sin instalacion)..." -ForegroundColor Yellow
Write-Host ""

# Limpiar antes del segundo build
Start-Sleep -Seconds 2

# Ejecutar electron-builder con target portable
npm exec -- electron-builder --win portable --x64 2>&1 | Out-Host

$portableSuccess = $LASTEXITCODE -eq 0

# Mostrar resultados
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Resultado Final" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

if ($nsisSuccess) {
    Write-Host "[OK] Instalador NSIS creado" -ForegroundColor Green
} else {
    Write-Host "[FALLO] Instalador NSIS" -ForegroundColor Red
}

if ($portableSuccess) {
    Write-Host "[OK] Version portable creada" -ForegroundColor Green
} else {
    Write-Host "[FALLO] Version portable" -ForegroundColor Red
}

Write-Host ""

# Listar archivos creados
if (Test-Path "dist-electron") {
    Write-Host "Archivos en dist-electron:" -ForegroundColor Cyan
    Write-Host ""
    
    Get-ChildItem -Path "dist-electron" -Filter "*.exe" -ErrorAction SilentlyContinue | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  $($_.Name) - $sizeMB MB" -ForegroundColor White
    }
    
    if (-not (Get-ChildItem -Path "dist-electron" -Filter "*.exe" -ErrorAction SilentlyContinue)) {
        Write-Host "  No se encontraron archivos .exe" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Revisa los errores anteriores" -ForegroundColor Yellow
    }
} else {
    Write-Host "La carpeta dist-electron no fue creada" -ForegroundColor Red
}

Write-Host ""
Write-Host "Proceso completado" -ForegroundColor Cyan
Write-Host ""
