@echo off
echo ================================================
echo   Creando Instaladores de Code Editor Pro
echo ================================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no esta instalado
    echo Descarga desde: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Compilando aplicacion web con Vite...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la compilacion web
    pause
    exit /b 1
)

echo.
echo [2/3] Creando instalador NSIS...
call npx electron-builder --win --config.win.target=nsis
if %ERRORLEVEL% NEQ 0 (
    echo ADVERTENCIA: Fallo crear instalador NSIS
)

echo.
echo [3/3] Creando version portable...
call npx electron-builder --win --config.win.target=portable
if %ERRORLEVEL% NEQ 0 (
    echo ADVERTENCIA: Fallo crear version portable
)

echo.
echo ================================================
echo   Compilacion Completada
echo ================================================
echo.
echo Archivos en: dist-electron\
echo.
dir /B dist-electron\*.exe 2>nul
echo.
pause
