# SOLUCION DEFINITIVA - Desbloquear archivo y crear instaladores
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  SOLUCION DEFINITIVA" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Reiniciar completamente
Write-Host "[1/5] Cerrando TODOS los procesos..." -ForegroundColor Yellow
taskkill /F /IM electron.exe 2>$null
taskkill /F /IM node.exe 2>$null
taskkill /F /IM Code.exe 2>$null
Start-Sleep -Seconds 3

# Paso 2: Eliminar carpeta con fuerza bruta
Write-Host "[2/5] Eliminando carpeta dist-electron..." -ForegroundColor Yellow
if (Test-Path "dist-electron") {
    Remove-Item -Path "dist-electron" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    # Si aún existe, usar cmd para forzar
    if (Test-Path "dist-electron") {
        cmd /c "rd /s /q dist-electron" 2>$null
        Start-Sleep -Seconds 2
    }
}

# Paso 3: Limpiar caché de electron-builder
Write-Host "[3/5] Limpiando cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:LOCALAPPDATA\electron-builder\Cache" -Recurse -Force -ErrorAction SilentlyContinue

# Paso 4: Configurar para evitar problemas
Write-Host "[4/5] Configurando build sin firma..." -ForegroundColor Yellow
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
$env:DEBUG = ""

Write-Host "[5/5] Creando instaladores (ULTIMO INTENTO)..." -ForegroundColor Green
Write-Host ""

# Ejecutar con configuración especial que NO use ASAR temporalmente
npm exec -- electron-builder --win --x64 --config.asar=false

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  VERIFICANDO RESULTADO" -ForegroundColor Cyan  
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar qué se creó
if (Test-Path "dist-electron\win-unpacked\Code Editor Pro.exe") {
    Write-Host "EXITO: Aplicacion desempaquetada creada" -ForegroundColor Green
    Write-Host "Ubicacion: dist-electron\win-unpacked\Code Editor Pro.exe" -ForegroundColor White
    Write-Host ""
    Write-Host "Puedes ejecutarla directamente desde ahi" -ForegroundColor Yellow
    Write-Host ""
}

$instaladores = Get-ChildItem -Path "dist-electron" -Filter "*.exe" -ErrorAction SilentlyContinue

if ($instaladores) {
    Write-Host "INSTALADORES CREADOS:" -ForegroundColor Green
    Write-Host ""
    foreach ($file in $instaladores) {
        $sizeMB = [math]::Round($file.Length / 1MB, 2)
        Write-Host "  $($file.Name) - $sizeMB MB" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "Abriendo carpeta..." -ForegroundColor Green
    explorer "dist-electron"
} else {
    Write-Host "No se crearon instaladores .exe" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "PERO puedes usar la version desempaquetada en:" -ForegroundColor Cyan
    Write-Host "dist-electron\win-unpacked\Code Editor Pro.exe" -ForegroundColor White
    Write-Host ""
    
    if (Test-Path "dist-electron\win-unpacked") {
        $respuesta = Read-Host "Quieres abrir esa carpeta? (S/N)"
        if ($respuesta -eq "S" -or $respuesta -eq "s") {
            explorer "dist-electron\win-unpacked"
        }
    }
}

Write-Host ""
Write-Host "Proceso completado" -ForegroundColor Cyan
