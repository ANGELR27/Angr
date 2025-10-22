// ═══════════════════════════════════════════════════════════
// 🔄 DIFF SERVICE - Manejo de diferencias de contenido
// ═══════════════════════════════════════════════════════════
// Envía solo los cambios en lugar del contenido completo

/**
 * Algoritmo Myers Diff simplificado
 * Calcula las diferencias entre dos strings de forma eficiente
 */
class DiffService {
  constructor() {
    this.maxDiffSize = 10000; // Máximo tamaño para diff, si es mayor enviar contenido completo
  }

  /**
   * Calcular diferencias entre dos contenidos
   * @param {string} oldContent - Contenido anterior
   * @param {string} newContent - Contenido nuevo
   * @returns {Object} - Objeto con tipo de cambio y datos
   */
  calculateDiff(oldContent, newContent) {
    // Si alguno es null/undefined, return full content
    if (!oldContent || !newContent) {
      return {
        type: 'full',
        content: newContent || '',
        size: (newContent || '').length,
      };
    }

    // Si los contenidos son idénticos, no hay cambios
    if (oldContent === newContent) {
      return {
        type: 'none',
        size: 0,
      };
    }

    // Si el contenido nuevo es muy pequeño, enviar completo
    if (newContent.length < 500) {
      return {
        type: 'full',
        content: newContent,
        size: newContent.length,
      };
    }

    try {
      // Calcular diff por líneas
      const diff = this.diffLines(oldContent, newContent);
      
      // Calcular tamaño del diff
      const diffSize = JSON.stringify(diff).length;
      
      // Si el diff es más grande que el contenido, enviar contenido completo
      if (diffSize > newContent.length || diffSize > this.maxDiffSize) {
        return {
          type: 'full',
          content: newContent,
          size: newContent.length,
        };
      }

      return {
        type: 'diff',
        changes: diff,
        size: diffSize,
      };
    } catch (error) {
      console.error('Error calculando diff:', error);
      // En caso de error, enviar contenido completo
      return {
        type: 'full',
        content: newContent,
        size: newContent.length,
      };
    }
  }

  /**
   * Aplicar cambios diff a un contenido
   * @param {string} oldContent - Contenido base
   * @param {Object} diffData - Datos del diff
   * @returns {string} - Contenido resultante
   */
  applyDiff(oldContent, diffData) {
    if (diffData.type === 'full') {
      return diffData.content;
    }

    if (diffData.type === 'none') {
      return oldContent;
    }

    if (diffData.type === 'diff') {
      try {
        return this.applyLineDiff(oldContent, diffData.changes);
      } catch (error) {
        console.error('Error aplicando diff:', error);
        return oldContent; // Fallback al contenido anterior
      }
    }

    return oldContent;
  }

  /**
   * Calcular diff por líneas (más eficiente para código)
   * @param {string} oldContent
   * @param {string} newContent
   * @returns {Array} - Array de operaciones
   */
  diffLines(oldContent, newContent) {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    const changes = [];
    let oldIndex = 0;
    let newIndex = 0;

    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      // Líneas idénticas
      if (oldIndex < oldLines.length && 
          newIndex < newLines.length && 
          oldLines[oldIndex] === newLines[newIndex]) {
        oldIndex++;
        newIndex++;
        continue;
      }

      // Buscar coincidencias hacia adelante
      const matchOld = this.findMatch(oldLines, oldIndex, newLines[newIndex]);
      const matchNew = this.findMatch(newLines, newIndex, oldLines[oldIndex]);

      if (matchOld !== -1 && (matchNew === -1 || matchOld < matchNew)) {
        // Líneas eliminadas
        const deletedLines = [];
        while (oldIndex < matchOld) {
          deletedLines.push(oldLines[oldIndex]);
          oldIndex++;
        }
        changes.push({
          type: 'delete',
          position: oldIndex - deletedLines.length,
          count: deletedLines.length,
        });
      } else if (matchNew !== -1) {
        // Líneas agregadas
        const addedLines = [];
        while (newIndex < matchNew) {
          addedLines.push(newLines[newIndex]);
          newIndex++;
        }
        changes.push({
          type: 'insert',
          position: oldIndex,
          lines: addedLines,
        });
      } else {
        // Cambio en línea
        if (oldIndex < oldLines.length && newIndex < newLines.length) {
          changes.push({
            type: 'replace',
            position: oldIndex,
            oldLine: oldLines[oldIndex],
            newLine: newLines[newIndex],
          });
          oldIndex++;
          newIndex++;
        } else if (oldIndex < oldLines.length) {
          // Eliminar líneas restantes
          changes.push({
            type: 'delete',
            position: oldIndex,
            count: oldLines.length - oldIndex,
          });
          oldIndex = oldLines.length;
        } else {
          // Agregar líneas restantes
          const remaining = newLines.slice(newIndex);
          changes.push({
            type: 'insert',
            position: oldIndex,
            lines: remaining,
          });
          newIndex = newLines.length;
        }
      }
    }

    return changes;
  }

  /**
   * Encontrar próxima coincidencia en array
   */
  findMatch(lines, startIndex, searchLine, maxLookAhead = 10) {
    for (let i = startIndex; i < Math.min(lines.length, startIndex + maxLookAhead); i++) {
      if (lines[i] === searchLine) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Aplicar diff de líneas
   */
  applyLineDiff(oldContent, changes) {
    const lines = oldContent.split('\n');
    
    // Aplicar cambios en orden inverso para mantener índices correctos
    const sortedChanges = [...changes].sort((a, b) => b.position - a.position);

    for (const change of sortedChanges) {
      switch (change.type) {
        case 'insert':
          lines.splice(change.position, 0, ...change.lines);
          break;
        
        case 'delete':
          lines.splice(change.position, change.count);
          break;
        
        case 'replace':
          lines[change.position] = change.newLine;
          break;
      }
    }

    return lines.join('\n');
  }

  /**
   * Calcular diff a nivel de caracteres (para cambios pequeños)
   * Usa el algoritmo de distancia de edición (Levenshtein)
   */
  diffCharacters(oldText, newText) {
    const m = oldText.length;
    const n = newText.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    // Inicializar primera fila y columna
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    // Llenar matriz de distancia
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (oldText[i - 1] === newText[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,     // delete
            dp[i][j - 1] + 1,     // insert
            dp[i - 1][j - 1] + 1  // replace
          );
        }
      }
    }

    // Reconstruir cambios
    const changes = [];
    let i = m, j = n;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldText[i - 1] === newText[j - 1]) {
        i--;
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
        changes.unshift({ type: 'delete', position: i - 1 });
        i--;
      } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) {
        changes.unshift({ type: 'insert', position: i, char: newText[j - 1] });
        j--;
      } else {
        changes.unshift({ type: 'replace', position: i - 1, char: newText[j - 1] });
        i--;
        j--;
      }
    }

    return changes;
  }

  /**
   * Optimización: Comprimir diff usando RLE (Run-Length Encoding)
   */
  compressDiff(diff) {
    if (diff.type !== 'diff') return diff;

    // Comprimir cambios consecutivos del mismo tipo
    const compressed = [];
    let current = null;

    for (const change of diff.changes) {
      if (!current) {
        current = { ...change };
      } else if (current.type === change.type && 
                 current.type === 'delete' && 
                 current.position + current.count === change.position) {
        // Combinar deletes consecutivos
        current.count += change.count;
      } else if (current.type === change.type && 
                 current.type === 'insert' && 
                 current.position === change.position) {
        // Combinar inserts consecutivos
        current.lines.push(...change.lines);
      } else {
        compressed.push(current);
        current = { ...change };
      }
    }
    
    if (current) compressed.push(current);

    return {
      ...diff,
      changes: compressed,
      size: JSON.stringify(compressed).length,
    };
  }

  /**
   * Generar un hash rápido del contenido para verificación
   */
  generateHash(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  /**
   * Verificar integridad del contenido después de aplicar diff
   */
  verifyIntegrity(originalContent, appliedContent, expectedHash) {
    const actualHash = this.generateHash(appliedContent);
    const isValid = actualHash === expectedHash;
    
    if (!isValid) {
      console.warn('⚠️ Hash mismatch - posible corrupción de datos');
      console.log('Expected:', expectedHash);
      console.log('Actual:', actualHash);
    }
    
    return isValid;
  }

  /**
   * Estadísticas del diff
   */
  getDiffStats(diff) {
    if (diff.type === 'full') {
      return {
        type: 'full',
        size: diff.size,
        compression: 0,
      };
    }

    if (diff.type === 'none') {
      return {
        type: 'none',
        size: 0,
        compression: 100,
      };
    }

    const stats = {
      type: 'diff',
      size: diff.size,
      insertions: 0,
      deletions: 0,
      replacements: 0,
    };

    for (const change of diff.changes) {
      if (change.type === 'insert') stats.insertions += change.lines.length;
      if (change.type === 'delete') stats.deletions += change.count;
      if (change.type === 'replace') stats.replacements += 1;
    }

    return stats;
  }
}

// Exportar instancia singleton
const diffService = new DiffService();
export default diffService;
