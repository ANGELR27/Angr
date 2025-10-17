/**
 * Servicio para gestionar comentarios en líneas de código
 * Soporta hilos de conversación, resolución y sincronización en tiempo real
 */
class CommentService {
  constructor() {
    this.threads = new Map(); // threadId -> Thread
    this.fileThreads = new Map(); // filePath -> Set of threadIds
    this.callbacks = {
      onThreadAdded: null,
      onThreadUpdated: null,
      onThreadResolved: null,
      onCommentAdded: null,
      onCommentEdited: null,
      onCommentDeleted: null,
    };
  }

  /**
   * Crear nuevo hilo de comentarios en una línea
   */
  createThread(filePath, lineNumber, firstComment, user) {
    const threadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: firstComment,
      user: {
        id: user.id,
        name: user.name,
        color: user.color,
      },
      timestamp: Date.now(),
      edited: false,
    };

    const thread = {
      id: threadId,
      filePath,
      lineNumber,
      comments: [comment],
      isResolved: false,
      createdAt: Date.now(),
      createdBy: user.id,
      updatedAt: Date.now(),
    };

    this.threads.set(threadId, thread);

    // Mantener índice por archivo
    if (!this.fileThreads.has(filePath)) {
      this.fileThreads.set(filePath, new Set());
    }
    this.fileThreads.get(filePath).add(threadId);

    console.log('💬 Nuevo hilo creado:', {
      threadId,
      filePath,
      lineNumber,
      user: user.name,
    });

    this.callbacks.onThreadAdded?.(thread);
    this.saveToStorage();

    return thread;
  }

  /**
   * Agregar comentario a un hilo existente
   */
  addComment(threadId, text, user) {
    const thread = this.threads.get(threadId);
    if (!thread) {
      console.error('❌ Hilo no encontrado:', threadId);
      return null;
    }

    const comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      user: {
        id: user.id,
        name: user.name,
        color: user.color,
      },
      timestamp: Date.now(),
      edited: false,
    };

    thread.comments.push(comment);
    thread.updatedAt = Date.now();

    console.log('💬 Comentario agregado al hilo:', threadId);

    this.callbacks.onCommentAdded?.(threadId, comment);
    this.callbacks.onThreadUpdated?.(thread);
    this.saveToStorage();

    return comment;
  }

  /**
   * Editar comentario existente
   */
  editComment(threadId, commentId, newText) {
    const thread = this.threads.get(threadId);
    if (!thread) {
      console.error('❌ Hilo no encontrado:', threadId);
      return false;
    }

    const comment = thread.comments.find(c => c.id === commentId);
    if (!comment) {
      console.error('❌ Comentario no encontrado:', commentId);
      return false;
    }

    comment.text = newText;
    comment.edited = true;
    comment.editedAt = Date.now();
    thread.updatedAt = Date.now();

    console.log('✏️ Comentario editado:', commentId);

    this.callbacks.onCommentEdited?.(threadId, comment);
    this.callbacks.onThreadUpdated?.(thread);
    this.saveToStorage();

    return true;
  }

  /**
   * Eliminar comentario
   */
  deleteComment(threadId, commentId) {
    const thread = this.threads.get(threadId);
    if (!thread) {
      console.error('❌ Hilo no encontrado:', threadId);
      return false;
    }

    const index = thread.comments.findIndex(c => c.id === commentId);
    if (index === -1) {
      console.error('❌ Comentario no encontrado:', commentId);
      return false;
    }

    thread.comments.splice(index, 1);
    thread.updatedAt = Date.now();

    // Si no quedan comentarios, eliminar el hilo
    if (thread.comments.length === 0) {
      this.deleteThread(threadId);
      return true;
    }

    console.log('🗑️ Comentario eliminado:', commentId);

    this.callbacks.onCommentDeleted?.(threadId, commentId);
    this.callbacks.onThreadUpdated?.(thread);
    this.saveToStorage();

    return true;
  }

  /**
   * Marcar hilo como resuelto
   */
  resolveThread(threadId, userId) {
    const thread = this.threads.get(threadId);
    if (!thread) {
      console.error('❌ Hilo no encontrado:', threadId);
      return false;
    }

    thread.isResolved = true;
    thread.resolvedAt = Date.now();
    thread.resolvedBy = userId;
    thread.updatedAt = Date.now();

    console.log('✅ Hilo marcado como resuelto:', threadId);

    this.callbacks.onThreadResolved?.(thread);
    this.callbacks.onThreadUpdated?.(thread);
    this.saveToStorage();

    return true;
  }

  /**
   * Reabrir hilo resuelto
   */
  reopenThread(threadId) {
    const thread = this.threads.get(threadId);
    if (!thread) {
      console.error('❌ Hilo no encontrado:', threadId);
      return false;
    }

    thread.isResolved = false;
    delete thread.resolvedAt;
    delete thread.resolvedBy;
    thread.updatedAt = Date.now();

    console.log('🔓 Hilo reabierto:', threadId);

    this.callbacks.onThreadUpdated?.(thread);
    this.saveToStorage();

    return true;
  }

  /**
   * Eliminar hilo completo
   */
  deleteThread(threadId) {
    const thread = this.threads.get(threadId);
    if (!thread) return false;

    // Remover de índice de archivos
    const fileSet = this.fileThreads.get(thread.filePath);
    if (fileSet) {
      fileSet.delete(threadId);
      if (fileSet.size === 0) {
        this.fileThreads.delete(thread.filePath);
      }
    }

    this.threads.delete(threadId);
    this.saveToStorage();

    console.log('🗑️ Hilo eliminado:', threadId);
    return true;
  }

  /**
   * Obtener todos los hilos de un archivo
   */
  getThreadsByFile(filePath, includeResolved = true) {
    const threadIds = this.fileThreads.get(filePath);
    if (!threadIds) return [];

    const threads = Array.from(threadIds)
      .map(id => this.threads.get(id))
      .filter(thread => thread && (includeResolved || !thread.isResolved))
      .sort((a, b) => a.lineNumber - b.lineNumber);

    return threads;
  }

  /**
   * Obtener hilo específico
   */
  getThread(threadId) {
    return this.threads.get(threadId);
  }

  /**
   * Obtener todos los hilos
   */
  getAllThreads(includeResolved = true) {
    const allThreads = Array.from(this.threads.values());
    
    if (!includeResolved) {
      return allThreads.filter(t => !t.isResolved);
    }

    return allThreads;
  }

  /**
   * Obtener estadísticas
   */
  getStats() {
    const allThreads = Array.from(this.threads.values());
    const resolved = allThreads.filter(t => t.isResolved).length;
    const unresolved = allThreads.length - resolved;
    const totalComments = allThreads.reduce((sum, t) => sum + t.comments.length, 0);

    return {
      totalThreads: allThreads.length,
      resolved,
      unresolved,
      totalComments,
      filesWithComments: this.fileThreads.size,
    };
  }

  /**
   * Sincronizar comentario desde otro usuario (vía Supabase)
   */
  syncComment(payload) {
    const { action, threadId, commentId, thread, comment, userId } = payload;

    switch (action) {
      case 'create-thread':
        if (!this.threads.has(threadId)) {
          this.threads.set(threadId, thread);
          if (!this.fileThreads.has(thread.filePath)) {
            this.fileThreads.set(thread.filePath, new Set());
          }
          this.fileThreads.get(thread.filePath).add(threadId);
          this.callbacks.onThreadAdded?.(thread);
        }
        break;

      case 'add-comment':
        const targetThread = this.threads.get(threadId);
        if (targetThread && !targetThread.comments.find(c => c.id === comment.id)) {
          targetThread.comments.push(comment);
          targetThread.updatedAt = Date.now();
          this.callbacks.onCommentAdded?.(threadId, comment);
          this.callbacks.onThreadUpdated?.(targetThread);
        }
        break;

      case 'edit-comment':
        const editThread = this.threads.get(threadId);
        if (editThread) {
          const editComment = editThread.comments.find(c => c.id === commentId);
          if (editComment) {
            editComment.text = comment.text;
            editComment.edited = true;
            editComment.editedAt = Date.now();
            this.callbacks.onCommentEdited?.(threadId, editComment);
          }
        }
        break;

      case 'delete-comment':
        const delThread = this.threads.get(threadId);
        if (delThread) {
          const index = delThread.comments.findIndex(c => c.id === commentId);
          if (index !== -1) {
            delThread.comments.splice(index, 1);
            if (delThread.comments.length === 0) {
              this.deleteThread(threadId);
            } else {
              this.callbacks.onCommentDeleted?.(threadId, commentId);
            }
          }
        }
        break;

      case 'resolve-thread':
        const resolveThread = this.threads.get(threadId);
        if (resolveThread && !resolveThread.isResolved) {
          resolveThread.isResolved = true;
          resolveThread.resolvedAt = Date.now();
          resolveThread.resolvedBy = userId;
          this.callbacks.onThreadResolved?.(resolveThread);
        }
        break;
    }

    this.saveToStorage();
  }

  /**
   * Registrar callbacks
   */
  on(event, callback) {
    const eventMap = {
      'threadAdded': 'onThreadAdded',
      'threadUpdated': 'onThreadUpdated',
      'threadResolved': 'onThreadResolved',
      'commentAdded': 'onCommentAdded',
      'commentEdited': 'onCommentEdited',
      'commentDeleted': 'onCommentDeleted',
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
        threads: Array.from(this.threads.entries()),
        fileThreads: Array.from(this.fileThreads.entries()).map(([file, set]) => [file, Array.from(set)]),
      };
      localStorage.setItem('comment_threads', JSON.stringify(data));
    } catch (e) {
      console.error('❌ Error guardando comentarios:', e);
    }
  }

  /**
   * Cargar desde localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('comment_threads');
      if (stored) {
        const data = JSON.parse(stored);
        this.threads = new Map(data.threads);
        this.fileThreads = new Map(data.fileThreads.map(([file, arr]) => [file, new Set(arr)]));
        console.log(`💬 ${this.threads.size} hilos de comentarios cargados`);
      }
    } catch (e) {
      console.error('❌ Error cargando comentarios:', e);
    }
  }

  /**
   * Limpiar todos los comentarios
   */
  clearAll() {
    this.threads.clear();
    this.fileThreads.clear();
    localStorage.removeItem('comment_threads');
    console.log('🧹 Todos los comentarios eliminados');
  }
}

// Exportar instancia singleton
export const commentService = new CommentService();
export default commentService;
