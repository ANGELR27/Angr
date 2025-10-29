#!/bin/bash

# 🧹 Script de Limpieza Automática
# Elimina archivos duplicados y genera reportes

echo "╔═══════════════════════════════════════════════════════╗"
echo "║  🧹 LIMPIEZA AUTOMÁTICA DEL EDITOR                   ║"
echo "║  Script de optimización v1.0                         ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para confirmar acción
confirm() {
    read -p "$(echo -e ${YELLOW}"$1 (s/n): "${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Función para backup
create_backup() {
    echo -e "${BLUE}📦 Creando backup...${NC}"
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_dir="backups/backup_$timestamp"
    mkdir -p "$backup_dir"
    cp -r src "$backup_dir/"
    echo -e "${GREEN}✅ Backup creado en: $backup_dir${NC}"
}

# ============================================
# PASO 1: ANÁLISIS INICIAL
# ============================================
echo -e "${BLUE}📊 PASO 1: Análisis del código actual${NC}"
echo ""

# Contar estados en App.jsx
echo "🔍 Analizando App.jsx..."
states_count=$(grep -c "useState" src/App.jsx 2>/dev/null || echo "0")
echo -e "   Estados (useState): ${YELLOW}$states_count${NC}"

# Contar componentes
components_count=$(find src/components -name "*.jsx" 2>/dev/null | wc -l)
echo -e "   Componentes totales: ${YELLOW}$components_count${NC}"

# Buscar archivos duplicados de notificaciones
echo ""
echo "🔍 Buscando componentes duplicados..."
duplicates=(
    "src/components/CollaborationNotification.jsx"
    "src/components/CollaborationNotifications.jsx"
    "src/components/NotificationCenter.jsx"
)

found_duplicates=0
for file in "${duplicates[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${RED}❌ Encontrado: $file${NC}"
        ((found_duplicates++))
    fi
done

if [ $found_duplicates -eq 0 ]; then
    echo -e "   ${GREEN}✅ No se encontraron duplicados${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================
# PASO 2: ELIMINACIÓN DE DUPLICADOS
# ============================================
if [ $found_duplicates -gt 0 ]; then
    echo -e "${BLUE}🗑️  PASO 2: Eliminar componentes duplicados${NC}"
    echo ""
    echo "Se eliminarán los siguientes archivos:"
    for file in "${duplicates[@]}"; do
        if [ -f "$file" ]; then
            echo "   - $file"
        fi
    done
    echo ""
    
    if confirm "¿Deseas eliminar estos archivos?"; then
        create_backup
        
        for file in "${duplicates[@]}"; do
            if [ -f "$file" ]; then
                rm "$file"
                echo -e "${GREEN}✅ Eliminado: $file${NC}"
            fi
        done
        
        echo ""
        echo -e "${GREEN}✅ Archivos eliminados correctamente${NC}"
    else
        echo -e "${YELLOW}⏭️  Paso omitido${NC}"
    fi
else
    echo -e "${GREEN}✅ PASO 2: No hay duplicados que eliminar${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================
# PASO 3: BUSCAR IMPORTS ROTOS
# ============================================
echo -e "${BLUE}🔍 PASO 3: Buscar imports que necesitan actualización${NC}"
echo ""

broken_imports=()

# Buscar imports de componentes eliminados
for duplicate in "CollaborationNotification" "CollaborationNotifications" "NotificationCenter"; do
    matches=$(grep -r "from.*$duplicate" src/ 2>/dev/null | grep -v node_modules | wc -l)
    if [ "$matches" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Encontrados $matches imports de $duplicate${NC}"
        grep -rn "from.*$duplicate" src/ 2>/dev/null | grep -v node_modules
        broken_imports+=("$duplicate")
    fi
done

if [ ${#broken_imports[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ No se encontraron imports rotos${NC}"
else
    echo ""
    echo -e "${YELLOW}📝 ACCIÓN REQUERIDA:${NC}"
    echo "   Reemplaza estos imports por:"
    echo -e "   ${GREEN}import NotificationSystem from './NotificationSystem'${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================
# PASO 4: REPORTES
# ============================================
echo -e "${BLUE}📊 PASO 4: Generando reportes${NC}"
echo ""

# Crear directorio de reportes
mkdir -p reports
timestamp=$(date +%Y%m%d_%H%M%S)
report_file="reports/report_$timestamp.txt"

{
    echo "=========================================="
    echo "  REPORTE DE LIMPIEZA"
    echo "  Fecha: $(date)"
    echo "=========================================="
    echo ""
    echo "MÉTRICAS ACTUALES:"
    echo "  - Estados en App.jsx: $states_count"
    echo "  - Componentes totales: $components_count"
    echo "  - Duplicados encontrados: $found_duplicates"
    echo ""
    echo "ARCHIVOS ELIMINADOS:"
    for file in "${duplicates[@]}"; do
        if [ ! -f "$file" ]; then
            echo "  ✅ $file"
        fi
    done
    echo ""
    echo "IMPORTS QUE NECESITAN ACTUALIZACIÓN:"
    for import in "${broken_imports[@]}"; do
        echo "  ⚠️  $import"
    done
    echo ""
    echo "=========================================="
} > "$report_file"

echo -e "${GREEN}✅ Reporte generado: $report_file${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================
# PASO 5: VERIFICACIÓN
# ============================================
echo -e "${BLUE}🔎 PASO 5: Verificación final${NC}"
echo ""

# Verificar que NotificationSystem existe
if [ -f "src/components/NotificationSystem.jsx" ]; then
    echo -e "${GREEN}✅ NotificationSystem.jsx existe${NC}"
else
    echo -e "${RED}❌ ADVERTENCIA: NotificationSystem.jsx no encontrado${NC}"
fi

# Verificar que App.jsx existe y es válido
if [ -f "src/App.jsx" ]; then
    echo -e "${GREEN}✅ App.jsx existe${NC}"
    
    # Verificar sintaxis básica
    if node -c src/App.jsx 2>/dev/null; then
        echo -e "${GREEN}✅ App.jsx tiene sintaxis válida${NC}"
    else
        echo -e "${YELLOW}⚠️  No se pudo verificar sintaxis de App.jsx${NC}"
    fi
else
    echo -e "${RED}❌ ERROR: App.jsx no encontrado${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================
# RESUMEN FINAL
# ============================================
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  ✅ LIMPIEZA COMPLETADA               ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. Revisar el reporte generado:"
echo -e "   ${BLUE}cat $report_file${NC}"
echo ""
echo "2. Corregir imports rotos (si los hay):"
echo -e "   ${BLUE}Buscar y reemplazar manualmente en tu editor${NC}"
echo ""
echo "3. Probar que todo funciona:"
echo -e "   ${BLUE}npm run dev${NC}"
echo ""
echo "4. Si todo funciona, hacer commit:"
echo -e "   ${BLUE}git add .${NC}"
echo -e "   ${BLUE}git commit -m 'refactor: eliminar componentes duplicados'${NC}"
echo ""
echo "5. Si algo salió mal, restaurar backup:"
echo -e "   ${BLUE}cp -r backups/backup_[timestamp]/src .${NC}"
echo ""
echo "📚 Lee los documentos de análisis para más mejoras:"
echo "   - ACCIONES_INMEDIATAS.md"
echo "   - ANALISIS_MEJORAS_OPTIMIZACION.md"
echo "   - PROPUESTA_REFACTORIZACION.md"
echo ""
echo -e "${GREEN}¡Éxito! 🚀${NC}"
echo ""
