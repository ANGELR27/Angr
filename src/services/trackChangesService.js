/**
 * Servicio de Track Changes (Seguimiento de Cambios)
 * Similar a "Suggesting Mode" de Google Docs o "Track Changes" de Word
 * Permite proponer cambios sin aplicarlos directamente
 */
class TrackChangesService {
  constructor() {
    this.suggestions = new Map(); // suggestionId -> Suggestion
    this.fileSuggestions = new Map(); // filePath -> Set of suggestionIds
    this.mode = 'editing'; // 'editing' | 'suggesting' | 'viewing'
    this.callbacks = {
      onSuggestionCreated: null,
      onSuggestionAccepted: null,
      onSuggestionRejected: null,
      onModeChanged: null,
    };
  }

  /**
   * Cambiar modo de edición
   */
  setMode(mode) {
    if (!['editing', 'suggesting', 'viewing'].includes(mode)) {
      console.error('❌ Modo inválido:', mode);
      return;
    }

    this.mode = mode;
    console.log('📝 Modo cambiado a:', mode);
    this.callbacks.onModeChanged?.(mode);
    this.saveToStorage();
  }

  /**
   * Obtener modo actual
   */
  getMode() {
    return this.mode;
  }

  /**
   * Crear nueva sugerencia
   */
  createSuggestion(filePath, change, user) {
    const suggestionId = `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const suggestion = {
      id: suggestionId,
      filePath,
      type: change.type, // 'insert', 'delete', 'replace'
      range: {
        startLine: change.startLine,
        startColumn: change.startColumn,
        endLine: change.endLine,
        endColumn: change.endColumn,
      },
      originalText: change.originalText || '',
      suggestedText: change.suggestedText || '',
      user: {
        id: user.id,
        name: user.name,
        color: user.color,
      },
      status: 'pending', // 'pending', 'accepted', 'rejected'
      timestamp: Date.now(),
      comment: change.comment || '',
    };

    this.suggestions.set(suggestionId, suggestion);

    // Mantener índice por archivo
    if (!this.fileSuggestions.has(filePath)) {
      this.fileSuggestions.set(filePath, new Set());
    }
    this.fileSuggestions.get(filePath).add(suggestionId);

    console.log('💡 Nueva sugerencia creada:', {
      id: suggestionId,
      type: change.type,
      file: filePath,
      user: user.name,
    });

    this.callbacks.onSuggestionCreated?.(suggestion);
    this.saveToStorage();

    return suggestion;
  }

  /**
   * Aceptar sugerencia
   */
  acceptSuggestion(suggestionId, acceptedBy) {
    const suggestion = this.suggestions.get(suggestionId);
    if (!suggestion) {
      console.error('❌ Sugerencia no encontrada:', suggestionId);
      return null;
    }

    suggestion.status = 'accepted';
    suggestion.acceptedBy = acceptedBy;
    suggestion.acceptedAt = Date.now();

    console.log('✅ Sugerencia aceptada:', suggestionId);

    this.callbacks.onSuggestionAccepted?.(suggestion);
    this.saveToStorage();

    return {
      filePath: suggestion.filePath,
      range: suggestion.range,
      text: suggestion.suggestedText,
    };
  }

  /**
   * Rechazar sugerencia
   */
  rejectSuggestion(suggestionId, rejectedBy, reason = '') {
    const suggestion = this.suggestions.get(suggestionId);
    if (!suggestion) {
      console.error('❌ Sugerencia no encontrada:', suggestionId);
      return false;
    }

    suggestion.status = 'rejected';
    suggestion.rejectedBy = rejectedBy;
    suggestion.rejectedAt = Date.now();
    suggestion.rejectionReason = reason;

    console.log('❌ Sugerencia rechazada:', suggestionId);

    this.callbacks.onSuggestionRejected?.(suggestion);
    this.saveToStorage();

    return true;
  }

  /**
   * Eliminar sugerencia
   */
  deleteSuggestion(suggestionId) {
    const suggestion = this.suggestions.get(suggestionId);
    if (!suggestion) return false;

    // Remover de índice de archivos
    const fileSet = this.fileSuggestions.get(suggestion.filePath);
    if (fileSet) {
      fileSet.delete(suggestionId);
      if (fileSet.size === 0) {
        this.fileSuggestions.delete(suggestion.filePath);
      }
    }

    this.suggestions.delete(suggestionId);
    this.saveToStorage();

    console.log('🗑️ Sugerencia eliminada:', suggestionId);
    return true;
  }

  /**
   * Obtener sugerencias de un archivo
   */
  getSuggestionsByFile(filePath, status = null) {
    const suggestionIds = this.fileSuggestions.get(filePath);
    if (!suggestionIds) return [];

    let suggestions = Array.from(suggestionIds)
      .map(id => this.suggestions.get(id))
      .filter(s => s);

    if (status) {
      suggestions = suggestions.filter(s => s.status === status);
    }

    // Ordenar por posición en el archivo
    suggestions.sort((a, b) => {
      if (a.range.startLine !== b.range.startLine) {
        return a.range.startLine - b.range.startLine;
      }
      return a.range.startColumn - b.range.startColumn;
    });

    return suggestions;
  }

  /**
   * Obtener todas las sugerencias pendientes
   */
  getPendingSuggestions() {
    return Array.from(this.suggestions.values())
      .filter(s => s.status === 'pending');
  }

  /**
   * Obtener sugerencia específica
   */
  getSuggestion(suggestionId) {
    return this.suggestions.get(suggestionId);
  }

  /**
   * Aceptar todas las sugerencias de un archivo
   */
  acceptAllSuggestionsInFile(filePath, acceptedBy) {
    const suggestions = this.getSuggestionsByFile(filePath, 'pending');
    const changes = [];

    suggestions.forEach(suggestion => {
      const change = this.acceptSuggestion(suggestion.id, acceptedBy);
      if (change) {
        changes.push(change);
      }
    });

    console.log(`✅ ${changes.length} sugerencias aceptadas en ${filePath}`);
    return changes;
  }

  /**
   * Rechazar todas las sugerencias de un archivo
   */
  rejectAllSuggestionsInFile(filePath, rejectedBy) {
    const suggestions = this.getSuggestionsByFile(filePath, 'pending');
    let count = 0;

    suggestions.forEach(suggestion => {
      if (this.rejectSuggestion(suggestion.id, rejectedBy)) {
        count++;
      }
    });

    console.log(`❌ ${count} sugerencias rechazadas en ${filePath}`);
    return count;
  }

  /**
   * Obtener estadísticas
   */
  getStats() {
    const all = Array.from(this.suggestions.values());
    const pending = all.filter(s => s.status === 'pending').length;
    const accepted = all.filter(s => s.status === 'accepted').length;
    const rejected = all.filter(s => s.status === 'rejected').length;

    return {
      total: all.length,
      pending,
      accepted,
      rejected,
      filesWithSuggestions: this.fileSuggestions.size,
      mode: this.mode,
    };
  }

  /**
   * Sincronizar sugerencia desde otro usuario
   */
  syncSuggestion(payload) {
    const { action, suggestionId, suggestion, userId, reason } = payload;

    switch (action) {
      case 'create':
        if (!this.suggestions.has(suggestionId)) {
          this.suggestions.set(suggestionId, suggestion);
          if (!this.fileSuggestions.has(suggestion.filePath)) {
            this.fileSuggestions.set(suggestion.filePath, new Set());
          }
          this.fileSuggestions.get(suggestion.filePath).add(suggestionId);
          this.callbacks.onSuggestionCreated?.(suggestion);
        }
        break;

      case 'accept':
        const acceptSug = this.suggestions.get(suggestionId);
        if (acceptSug && acceptSug.status === 'pending') {
          acceptSug.status = 'accepted';
          acceptSug.acceptedBy = userId;
          acceptSug.acceptedAt = Date.now();
          this.callbacks.onSuggestionAccepted?.(acceptSug);
        }
        break;

      case 'reject':
        const rejectSug = this.suggestions.get(suggestionId);
        if (rejectSug && rejectSug.status === 'pending') {
          rejectSug.status = 'rejected';
          rejectSug.rejectedBy = userId;
          rejectSug.rejectedAt = Date.now();
          rejectSug.rejectionReason = reason || '';
          this.callbacks.onSuggestionRejected?.(rejectSug);
        }
        break;

      case 'delete':
        this.deleteSuggestion(suggestionId);
        break;
    }

    this.saveToStorage();
  }

  /**
   * Registrar callbacks
   */
  on(event, callback) {
    const eventMap = {
      'suggestionCreated': 'onSuggestionCreated',
      'suggestionAccepted': 'onSuggestionAccepted',
      'suggestionRejected': 'onSuggestionRejected',
      'modeChanged': 'onModeChanged',
    };

    const callbackKey = eventMap[event];
    if (callbackKey) {
      this.callbacks[callbackKey] = callback;
    }
  }

  /**
   * Guardar en localStorage
   */
  saveToStorage() {
    try {
      const data = {
        mode: this.mode,
        suggestions: Array.from(this.suggestions.entries()),
        fileSuggestions: Array.from(this.fileSuggestions.entries()).map(([file, set]) => [file, Array.from(set)]),
      };
      localStorage.setItem('track_changes', JSON.stringify(data));
    } catch (e) {
      console.error('❌ Error guardando sugerencias:', e);
    }
  }

  /**
   * Cargar desde localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('track_changes');
      if (stored) {
        const data = JSON.parse(stored);
        this.mode = data.mode || 'editing';
        this.suggestions = new Map(data.suggestions);
        this.fileSuggestions = new Map(data.fileSuggestions.map(([file, arr]) => [file, new Set(arr)]));
        console.log(`💡 ${this.suggestions.size} sugerencias cargadas (modo: ${this.mode})`);
      }
    } catch (e) {
      console.error('❌ Error cargando sugerencias:', e);
    }
  }

  /**
   * Limpiar todas las sugerencias
   */
  clearAll() {
    this.suggestions.clear();
    this.fileSuggestions.clear();
    this.mode = 'editing';
    localStorage.removeItem('track_changes');
    console.log('🧹 Todas las sugerencias eliminadas');
  }
}

// Exportar instancia singleton
export const trackChangesService = new TrackChangesService();
export default trackChangesService;
