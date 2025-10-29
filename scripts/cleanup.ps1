# 🧹 Script de Limpieza Automática para Windows
# Elimina archivos duplicados y genera reportes

Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🧹 LIMPIEZA AUTOMÁTICA DEL EDITOR                   ║" -ForegroundColor Cyan
Write-Host "║  Script de optimización v1.0                         ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Función para confirmar acción
function Confirm-Action {
    param([string]$Message)
    $response = Read-Host "$Message (S/N)"
    return $response -match '^[Ss]$'
}

# Función para crear backup
function Create-Backup {
    Write-Host "📦 Creando backup..." -ForegroundColor Blue
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = "backups\backup_$timestamp"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Copy-Item -Path "src" -Destination $backupDir -Recurse
    Write-Host "✅ Backup creado en: $backupDir" -ForegroundColor Green
    return $backupDir
}

# Cambiar al directorio del proyecto (ir al padre de scripts/)
Set-Location -Path (Split-Path -Parent $PSScriptRoot)

# ============================================
# PASO 1: ANÁLISIS INICIAL
# ============================================
Write-Host "📊 PASO 1: Análisis del código actual" -ForegroundColor Blue
Write-Host ""

# Contar estados en App.jsx
Write-Host "🔍 Analizando App.jsx..."
try {
    $statesCount = (Select-String -Path "src\App.jsx" -Pattern "useState" -AllMatches).Matches.Count
    Write-Host "   Estados (useState): $statesCount" -ForegroundColor Yellow
} catch {
    Write-Host "   Estados (useState): 0" -ForegroundColor Yellow
}

# Contar componentes
$componentsCount = (Get-ChildItem -Path "src\components" -Filter "*.jsx" -File).Count
Write-Host "   Componentes totales: $componentsCount" -ForegroundColor Yellow

# Buscar archivos duplicados de notificaciones
Write-Host ""
Write-Host "🔍 Buscando componentes duplicados..."

$duplicates = @(
    "src\components\CollaborationNotification.jsx",
    "src\components\CollaborationNotifications.jsx",
    "src\components\NotificationCenter.jsx"
)

$foundDuplicates = 0
$duplicatesToDelete = @()

foreach ($file in $duplicates) {
    if (Test-Path $file) {
        Write-Host "   ❌ Encontrado: $file" -ForegroundColor Red
        $foundDuplicates++
        $duplicatesToDelete += $file
    }
}

if ($foundDuplicates -eq 0) {
    Write-Host "   ✅ No se encontraron duplicados" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# ============================================
# PASO 2: ELIMINACIÓN DE DUPLICADOS
# ============================================
if ($foundDuplicates -gt 0) {
    Write-Host "🗑️  PASO 2: Eliminar componentes duplicados" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Se eliminarán los siguientes archivos:"
    foreach ($file in $duplicatesToDelete) {
        Write-Host "   - $file"
    }
    Write-Host ""
    
    if (Confirm-Action "¿Deseas eliminar estos archivos?") {
        $backupDir = Create-Backup
        
        foreach ($file in $duplicatesToDelete) {
            Remove-Item -Path $file -Force
            Write-Host "✅ Eliminado: $file" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "✅ Archivos eliminados correctamente" -ForegroundColor Green
    } else {
        Write-Host "⏭️  Paso omitido" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ PASO 2: No hay duplicados que eliminar" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# ============================================
# PASO 3: BUSCAR IMPORTS ROTOS
# ============================================
Write-Host "🔍 PASO 3: Buscar imports que necesitan actualización" -ForegroundColor Blue
Write-Host ""

$brokenImports = @()

# Buscar imports de componentes eliminados
$duplicateNames = @("CollaborationNotification", "CollaborationNotifications", "NotificationCenter")

foreach ($duplicate in $duplicateNames) {
    $matches = Select-String -Path "src\**\*.jsx" -Pattern "from.*$duplicate" -Exclude "node_modules"
    if ($matches.Count -gt 0) {
        Write-Host "⚠️  Encontrados $($matches.Count) imports de $duplicate" -ForegroundColor Yellow
        $matches | ForEach-Object {
            Write-Host "   $($_.Path):$($_.LineNumber) - $($_.Line.Trim())" -ForegroundColor Gray
        }
        $brokenImports += $duplicate
    }
}

if ($brokenImports.Count -eq 0) {
    Write-Host "✅ No se encontraron imports rotos" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "📝 ACCIÓN REQUERIDA:" -ForegroundColor Yellow
    Write-Host "   Reemplaza estos imports por:"
    Write-Host "   import NotificationSystem from './NotificationSystem'" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# ============================================
# PASO 4: REPORTES
# ============================================
Write-Host "📊 PASO 4: Generando reportes" -ForegroundColor Blue
Write-Host ""

# Crear directorio de reportes
New-Item -ItemType Directory -Path "reports" -Force | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportFile = "reports\report_$timestamp.txt"

$reportContent = @"
==========================================
  REPORTE DE LIMPIEZA
  Fecha: $(Get-Date)
==========================================

MÉTRICAS ACTUALES:
  - Estados en App.jsx: $statesCount
  - Componentes totales: $componentsCount
  - Duplicados encontrados: $foundDuplicates

ARCHIVOS ELIMINADOS:
"@

foreach ($file in $duplicates) {
    if (-not (Test-Path $file)) {
        $reportContent += "`n  ✅ $file"
    }
}

$reportContent += "`n`nIMPORTS QUE NECESITAN ACTUALIZACIÓN:"
foreach ($import in $brokenImports) {
    $reportContent += "`n  ⚠️  $import"
}

$reportContent += "`n`n=========================================="

Set-Content -Path $reportFile -Value $reportContent
Write-Host "✅ Reporte generado: $reportFile" -ForegroundColor Green

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# ============================================
# PASO 5: VERIFICACIÓN
# ============================================
Write-Host "🔎 PASO 5: Verificación final" -ForegroundColor Blue
Write-Host ""

# Verificar que NotificationSystem existe
if (Test-Path "src\components\NotificationSystem.jsx") {
    Write-Host "✅ NotificationSystem.jsx existe" -ForegroundColor Green
} else {
    Write-Host "❌ ADVERTENCIA: NotificationSystem.jsx no encontrado" -ForegroundColor Red
}

# Verificar que App.jsx existe
if (Test-Path "src\App.jsx") {
    Write-Host "✅ App.jsx existe" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: App.jsx no encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# ============================================
# RESUMEN FINAL
# ============================================
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                  ✅ LIMPIEZA COMPLETADA               ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Revisar el reporte generado:"
Write-Host "   Get-Content $reportFile" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Corregir imports rotos (si los hay):"
Write-Host "   Buscar y reemplazar manualmente en tu editor" -ForegroundColor Blue
Write-Host ""
Write-Host "3. Probar que todo funciona:"
Write-Host "   npm run dev" -ForegroundColor Blue
Write-Host ""
Write-Host "4. Si todo funciona, hacer commit:"
Write-Host "   git add ." -ForegroundColor Blue
Write-Host "   git commit -m 'refactor: eliminar componentes duplicados'" -ForegroundColor Blue
Write-Host ""
if ($backupDir) {
    Write-Host "5. Si algo salió mal, restaurar backup:"
    Write-Host "   Copy-Item -Path '$backupDir\src' -Destination . -Recurse -Force" -ForegroundColor Blue
    Write-Host ""
}
Write-Host "📚 Lee los documentos de análisis para más mejoras:"
Write-Host "   - ACCIONES_INMEDIATAS.md"
Write-Host "   - ANALISIS_MEJORAS_OPTIMIZACION.md"
Write-Host "   - PROPUESTA_REFACTORIZACION.md"
Write-Host ""
Write-Host "¡Éxito! 🚀" -ForegroundColor Green
Write-Host ""

# Pausar para que el usuario pueda leer
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
