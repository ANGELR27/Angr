# Script simplificado para crear instaladores
# Ejecutar: .\crear-instaladores.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Creando Instaladores - Code Editor Pro" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# El build de Vite ya está hecho, solo necesitamos empaquetar
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: No existe carpeta dist/" -ForegroundColor Red
    Write-Host "Ejecuta primero: npm run build" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Build de Vite encontrado" -ForegroundColor Green
Write-Host ""

# Verificar electron-builder
$builderPath = "node_modules\.bin\electron-builder.cmd"
if (-not (Test-Path $builderPath)) {
    Write-Host "⚠️ electron-builder no encontrado, instalando..." -ForegroundColor Yellow
    npm install electron-builder app-builder-bin --save-dev --legacy-peer-deps --no-audit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar electron-builder" -ForegroundColor Red
        exit 1
    }
}

Write-Host "📦 Creando instaladores para Windows..." -ForegroundColor Yellow
Write-Host ""

# Crear ambos tipos
Write-Host "[1/2] Creando instalador NSIS (con instalación)..." -ForegroundColor Cyan
& $builderPath --win nsis --x64
$nsisResult = $LASTEXITCODE

Write-Host ""
Write-Host "[2/2] Creando versión portable..." -ForegroundColor Cyan
& $builderPath --win portable --x64
$portableResult = $LASTEXITCODE

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Resultado" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

if ($nsisResult -eq 0 -or $portableResult -eq 0) {
    Write-Host "✅ Al menos un instalador se creó exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "📂 Archivos en: dist-electron" -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path "dist-electron") {
        Get-ChildItem -Path "dist-electron" -Filter "*.exe" -ErrorAction SilentlyContinue | ForEach-Object {
            $size = [math]::Round($_.Length / 1MB, 2)
            Write-Host "  📦 $($_.Name) - $size MB" -ForegroundColor White
        }
    }
    
    Write-Host ""
    Write-Host "🎉 ¡Listo para distribuir!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Hubo problemas al crear los instaladores" -ForegroundColor Yellow
    Write-Host "Revisa los errores anteriores" -ForegroundColor Yellow
}

Write-Host ""
