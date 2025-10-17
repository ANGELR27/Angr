/**
 * Servicio de Historial de Versiones
 * Guarda snapshots automáticos del proyecto con información de autor y timestamp
 */
class VersionHistoryService {
  constructor() {
    this.snapshots = [];
    this.maxSnapshots = 50; // Límite de snapshots en memoria
    this.autoSaveInterval = null;
    this.autoSaveDelay = 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Crear un snapshot del estado actual
   */
  createSnapshot(files, user, sessionId, description = 'Auto-guardado') {
    const snapshot = {
      id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      sessionId,
      user: {
        id: user.id,
        name: user.name,
        color: user.color,
      },
      description,
      files: JSON.parse(JSON.stringify(files)), // Deep clone
      fileCount: this.countFiles(files),
      size: new Blob([JSON.stringify(files)]).size,
    };

    console.log('📸 Snapshot creado:', {
      id: snapshot.id,
      user: snapshot.user.name,
      files: snapshot.fileCount,
      size: `${(snapshot.size / 1024).toFixed(2)} KB`
    });

    // Agregar al inicio del array
    this.snapshots.unshift(snapshot);

    // Limitar cantidad de snapshots en memoria
    if (this.snapshots.length > this.maxSnapshots) {
      const removed = this.snapshots.splice(this.maxSnapshots);
      console.log(`🧹 ${removed.length} snapshots antiguos removidos`);
    }

    // Guardar en localStorage para persistencia
    this.saveToStorage();

    return snapshot;
  }

  /**
   * Guardar snapshot en Supabase (opcional)
   */
  async saveSnapshotToSupabase(snapshot, supabase) {
    if (!supabase) {
      console.warn('⚠️ Supabase no disponible, solo guardando localmente');
      return;
    }

    try {
      const { error } = await supabase
        .from('version_history')
        .insert({
          snapshot_id: snapshot.id,
          session_id: snapshot.sessionId,
          user_id: snapshot.user.id,
          user_name: snapshot.user.name,
          description: snapshot.description,
          files: snapshot.files,
          file_count: snapshot.fileCount,
          size: snapshot.size,
          created_at: snapshot.date,
        });

      if (error) {
        console.error('❌ Error guardando snapshot en Supabase:', error);
      } else {
        console.log('☁️ Snapshot guardado en Supabase:', snapshot.id);
      }
    } catch (e) {
      console.error('❌ Excepción guardando snapshot:', e);
    }
  }

  /**
   * Cargar snapshots desde Supabase
   */
  async loadSnapshotsFromSupabase(sessionId, supabase) {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('version_history')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(this.maxSnapshots);

      if (error) {
        console.error('❌ Error cargando snapshots:', error);
        return [];
      }

      console.log(`☁️ ${data.length} snapshots cargados desde Supabase`);
      return data.map(row => ({
        id: row.snapshot_id,
        timestamp: new Date(row.created_at).getTime(),
        date: row.created_at,
        sessionId: row.session_id,
        user: {
          id: row.user_id,
          name: row.user_name,
        },
        description: row.description,
        files: row.files,
        fileCount: row.file_count,
        size: row.size,
      }));
    } catch (e) {
      console.error('❌ Excepción cargando snapshots:', e);
      return [];
    }
  }

  /**
   * Obtener todos los snapshots
   */
  getSnapshots() {
    return this.snapshots;
  }

  /**
   * Obtener snapshot específico por ID
   */
  getSnapshotById(snapshotId) {
    return this.snapshots.find(s => s.id === snapshotId);
  }

  /**
   * Restaurar archivos desde un snapshot
   */
  restoreSnapshot(snapshotId) {
    const snapshot = this.getSnapshotById(snapshotId);
    
    if (!snapshot) {
      console.error('❌ Snapshot no encontrado:', snapshotId);
      return null;
    }

    console.log('⏮️ Restaurando snapshot:', {
      id: snapshot.id,
      date: new Date(snapshot.timestamp).toLocaleString(),
      user: snapshot.user.name,
    });

    // Retornar copia profunda de los archivos
    return JSON.parse(JSON.stringify(snapshot.files));
  }

  /**
   * Comparar dos snapshots y obtener diferencias
   */
  compareSnapshots(snapshotId1, snapshotId2) {
    const snap1 = this.getSnapshotById(snapshotId1);
    const snap2 = this.getSnapshotById(snapshotId2);

    if (!snap1 || !snap2) {
      console.error('❌ Uno o ambos snapshots no encontrados');
      return null;
    }

    const changes = {
      filesAdded: [],
      filesRemoved: [],
      filesModified: [],
    };

    // Archivos en snap1
    const files1 = this.getAllFilePaths(snap1.files);
    const files2 = this.getAllFilePaths(snap2.files);

    // Encontrar archivos agregados
    files2.forEach(path => {
      if (!files1.includes(path)) {
        changes.filesAdded.push(path);
      }
    });

    // Encontrar archivos removidos y modificados
    files1.forEach(path => {
      if (!files2.includes(path)) {
        changes.filesRemoved.push(path);
      } else {
        const content1 = this.getFileContent(snap1.files, path);
        const content2 = this.getFileContent(snap2.files, path);
        if (content1 !== content2) {
          changes.filesModified.push({
            path,
            oldLength: content1?.length || 0,
            newLength: content2?.length || 0,
          });
        }
      }
    });

    return changes;
  }

  /**
   * Iniciar auto-guardado automático
   */
  startAutoSave(getFilesCallback, getUserCallback, getSessionIdCallback, intervalMinutes = 5) {
    this.stopAutoSave(); // Limpiar anterior si existe

    const interval = intervalMinutes * 60 * 1000;
    console.log(`⏰ Auto-guardado iniciado (cada ${intervalMinutes} minutos)`);

    this.autoSaveInterval = setInterval(() => {
      const files = getFilesCallback();
      const user = getUserCallback();
      const sessionId = getSessionIdCallback();

      if (files && user && sessionId) {
        this.createSnapshot(files, user, sessionId, 'Auto-guardado automático');
      }
    }, interval);
  }

  /**
   * Detener auto-guardado
   */
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
      console.log('⏹️ Auto-guardado detenido');
    }
  }

  /**
   * Guardar snapshots en localStorage
   */
  saveToStorage() {
    try {
      // Guardar solo los últimos 10 snapshots en localStorage (límite de espacio)
      const toSave = this.snapshots.slice(0, 10);
      localStorage.setItem('version_history', JSON.stringify(toSave));
      console.log('💾 Snapshots guardados en localStorage');
    } catch (e) {
      console.error('❌ Error guardando en localStorage:', e);
    }
  }

  /**
   * Cargar snapshots desde localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('version_history');
      if (stored) {
        this.snapshots = JSON.parse(stored);
        console.log(`📁 ${this.snapshots.length} snapshots cargados desde localStorage`);
      }
    } catch (e) {
      console.error('❌ Error cargando desde localStorage:', e);
    }
  }

  /**
   * Limpiar historial
   */
  clearHistory() {
    this.snapshots = [];
    localStorage.removeItem('version_history');
    console.log('🧹 Historial de versiones limpiado');
  }

  /**
   * Obtener estadísticas del historial
   */
  getStats() {
    const totalSize = this.snapshots.reduce((sum, s) => sum + s.size, 0);
    const uniqueUsers = [...new Set(this.snapshots.map(s => s.user.id))];

    return {
      totalSnapshots: this.snapshots.length,
      totalSize: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      uniqueUsers: uniqueUsers.length,
      oldestSnapshot: this.snapshots[this.snapshots.length - 1],
      newestSnapshot: this.snapshots[0],
    };
  }

  // Utilidades privadas
  countFiles(obj, count = 0) {
    Object.values(obj || {}).forEach(item => {
      if (item.type === 'file') {
        count++;
      } else if (item.type === 'folder' && item.children) {
        count = this.countFiles(item.children, count);
      }
    });
    return count;
  }

  getAllFilePaths(files, basePath = '') {
    let paths = [];
    Object.entries(files || {}).forEach(([key, item]) => {
      const currentPath = basePath ? `${basePath}/${key}` : key;
      if (item.type === 'file') {
        paths.push(currentPath);
      } else if (item.type === 'folder' && item.children) {
        paths = paths.concat(this.getAllFilePaths(item.children, currentPath));
      }
    });
    return paths;
  }

  getFileContent(files, path) {
    const parts = path.split('/');
    let current = files;

    for (const part of parts) {
      if (!current || !current[part]) return null;
      current = current[part];
      if (current.type === 'folder') {
        current = current.children;
      }
    }

    return current.type === 'file' ? current.content : null;
  }
}

// Exportar instancia singleton
export const versionHistoryService = new VersionHistoryService();
export default versionHistoryService;
