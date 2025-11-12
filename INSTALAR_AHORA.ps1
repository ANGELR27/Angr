# Script final: Cerrar procesos y crear instaladores
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  CREAR INSTALADORES - METODO DEFINITIVO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Cerrar procesos que bloquean
Write-Host "Cerrando procesos de Electron y Node..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*electron*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Paso 2: Limpiar build anterior
Write-Host "Limpiando carpeta dist-electron..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "dist-electron" -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Paso 3: Crear instaladores
Write-Host ""
Write-Host "Creando instaladores (5-10 minutos)..." -ForegroundColor Green
Write-Host ""

# Usar npm run que ya está configurado
npm run electron:build:win

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  RESULTADO" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Mostrar archivos creados
if (Test-Path "dist-electron") {
    $instaladores = Get-ChildItem -Path "dist-electron" -Filter "*.exe" -ErrorAction SilentlyContinue
    
    if ($instaladores) {
        Write-Host "INSTALADORES CREADOS EXITOSAMENTE:" -ForegroundColor Green
        Write-Host ""
        
        foreach ($file in $instaladores) {
            $sizeMB = [math]::Round($file.Length / 1MB, 2)
            Write-Host "  $($file.Name)" -ForegroundColor White
            Write-Host "  Tamaño: $sizeMB MB" -ForegroundColor Gray
            Write-Host "  Ruta: $($file.FullName)" -ForegroundColor Gray
            Write-Host ""
        }
        
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host "  QUE HACER AHORA:" -ForegroundColor Cyan
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. Abre la carpeta: dist-electron" -ForegroundColor Yellow
        Write-Host "2. Busca: Code Editor Pro Setup 1.0.0.exe" -ForegroundColor Yellow
        Write-Host "3. Doble clic para instalar" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Abriendo carpeta dist-electron..." -ForegroundColor Green
        Start-Sleep -Seconds 2
        explorer "dist-electron"
        
    } else {
        Write-Host "NO se crearon archivos .exe" -ForegroundColor Red
        Write-Host "Revisa los errores anteriores" -ForegroundColor Yellow
    }
} else {
    Write-Host "La carpeta dist-electron no existe" -ForegroundColor Red
}

Write-Host ""
