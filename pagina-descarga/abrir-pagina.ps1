# Script para abrir la página con servidor local
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Servidor Local - Pagina de Presentacion" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$port = 8080

Write-Host "Iniciando servidor en puerto $port..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Abre tu navegador en: http://localhost:$port" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
Write-Host ""

# Abrir navegador automáticamente
Start-Process "http://localhost:$port"

# Iniciar servidor
if (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server $port
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    npx serve -l $port
} else {
    Write-Host "ERROR: Python o Node.js requerido" -ForegroundColor Red
    Write-Host "Instala Python desde: https://python.org" -ForegroundColor Yellow
    pause
}
