@echo off
echo ================================================
echo   Abriendo Pagina de Presentacion
echo ================================================
echo.
echo Iniciando servidor local en puerto 8080...
echo.
echo La pagina se abrira automaticamente en tu navegador
echo Presiona Ctrl+C para detener el servidor
echo.
cd /d "%~dp0"
start http://localhost:8080
python -m http.server 8080
