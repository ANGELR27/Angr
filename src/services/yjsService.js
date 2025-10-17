import * as Y from 'yjs';
// Nota: y-websocket está instalado, pero para P2P directo usaremos BroadcastChannel
// que funciona sin servidor adicional en la misma máquina/red local

/**
 * Servicio Yjs para resolución de conflictos CRDT (Conflict-free Replicated Data Types)
 * Esto asegura que múltiples usuarios puedan editar simultáneamente sin perder cambios
 */
class YjsService {
  constructor() {
    this.ydoc = null;
    this.provider = null;
    this.yTexts = new Map(); // Un YText por cada archivo
    this.callbacks = {
      onRemoteChange: null,
      onSynced: null,
      onPeersChanged: null,
    };
    this.isInitialized = false;
    this.currentSessionId = null;
  }

  /**
   * Inicializar Yjs para resolución de conflictos CRDT
   * Usa Supabase como canal de sincronización en lugar de WebRTC/WebSocket separado
   * Esto evita necesidad de servidor Yjs adicional
   */
  async initialize(sessionId, userName = 'Anonymous', supabaseChannel = null) {
    if (this.isInitialized && this.currentSessionId === sessionId) {
      console.log('🔄 Yjs ya inicializado para esta sesión');
      return;
    }

    console.log('🚀 Inicializando Yjs CRDT para sesión:', sessionId);

    try {
      // Crear nuevo documento Yjs
      this.ydoc = new Y.Doc();
      this.currentSessionId = sessionId;

      // Si se proporciona un canal de Supabase, usarlo para sincronización
      if (supabaseChannel) {
        this.setupSupabaseSync(supabaseChannel);
      }

      // Awareness local (sin provider externo)
      this.awareness = {
        clientID: this.ydoc.clientID,
        states: new Map(),
        localState: {
          name: userName,
          color: this.generateColor(),
        }
      };

      this.isInitialized = true;
      console.log('✅ Yjs inicializado correctamente (modo Supabase)');

    } catch (error) {
      console.error('❌ Error al inicializar Yjs:', error);
      // No lanzar error, el sistema puede funcionar sin Yjs
      this.isInitialized = false;
    }
  }

  /**
   * Configurar sincronización via canal de Supabase
   * Esto permite usar Yjs para conflictos sin servidor adicional
   */
  setupSupabaseSync(channel) {
    if (!channel || !this.ydoc) return;

    console.log('🔗 Configurando sincronización Yjs via Supabase');

    // Escuchar updates de Yjs desde otros clientes
    channel.on('broadcast', { event: 'yjs-update' }, (payload) => {
      if (payload.payload.clientID !== this.ydoc.clientID) {
        try {
          const update = new Uint8Array(payload.payload.update);
          Y.applyUpdate(this.ydoc, update);
          console.log('📥 Update Yjs aplicado desde otro cliente');
        } catch (e) {
          console.error('❌ Error aplicando update Yjs:', e);
        }
      }
    });

    // Enviar updates locales via Supabase
    this.ydoc.on('update', async (update, origin) => {
      // Solo enviar si no es un update remoto
      if (origin !== 'remote') {
        try {
          await channel.send({
            type: 'broadcast',
            event: 'yjs-update',
            payload: {
              clientID: this.ydoc.clientID,
              update: Array.from(update), // Convertir Uint8Array a array normal
            }
          });
          console.log('📤 Update Yjs enviado via Supabase');
        } catch (e) {
          console.error('❌ Error enviando update Yjs:', e);
        }
      }
    });

    this.supabaseChannel = channel;
  }

  /**
   * Obtener o crear un YText para un archivo específico
   * YText es un tipo de dato CRDT optimizado para texto
   */
  getYText(filePath) {
    if (!this.ydoc) {
      console.warn('⚠️ Yjs no inicializado, retornando null');
      return null;
    }

    if (!this.yTexts.has(filePath)) {
      // Crear nuevo YText para este archivo
      const ytext = this.ydoc.getText(filePath);
      
      // Observar cambios remotos en este texto
      ytext.observe((event, transaction) => {
        // Solo procesar cambios remotos (no locales)
        if (!transaction.local) {
          console.log('📥 Cambio remoto Yjs en archivo:', filePath);
          const newContent = ytext.toString();
          
          if (this.callbacks.onRemoteChange) {
            this.callbacks.onRemoteChange(filePath, newContent, event);
          }
        }
      });

      this.yTexts.set(filePath, ytext);
      console.log('✅ YText creado para:', filePath);
    }

    return this.yTexts.get(filePath);
  }

  /**
   * Actualizar contenido de un archivo (cambio local)
   * Yjs automáticamente propagará el cambio a otros peers
   */
  updateText(filePath, newContent, cursorPosition = null) {
    const ytext = this.getYText(filePath);
    if (!ytext) return;

    // Usar transacción para agrupar cambios
    this.ydoc.transact(() => {
      const currentContent = ytext.toString();
      
      // Calcular diferencia eficientemente
      if (currentContent !== newContent) {
        // Borrar todo el contenido actual
        ytext.delete(0, currentContent.length);
        // Insertar nuevo contenido
        ytext.insert(0, newContent);
        
        console.log('📤 Texto actualizado en Yjs:', {
          filePath,
          length: newContent.length
        });
      }
    }, 'local-update');
  }

  /**
   * Aplicar cambio incremental (más eficiente que reemplazar todo)
   * Útil cuando se conoce la posición exacta del cambio
   */
  applyDelta(filePath, position, deletedLength, insertedText) {
    const ytext = this.getYText(filePath);
    if (!ytext) return;

    this.ydoc.transact(() => {
      if (deletedLength > 0) {
        ytext.delete(position, deletedLength);
      }
      if (insertedText && insertedText.length > 0) {
        ytext.insert(position, insertedText);
      }
    }, 'delta-update');
  }

  /**
   * Obtener contenido actual de un archivo
   */
  getText(filePath) {
    const ytext = this.getYText(filePath);
    return ytext ? ytext.toString() : null;
  }

  /**
   * Registrar callbacks para eventos
   */
  on(event, callback) {
    const eventMap = {
      'remoteChange': 'onRemoteChange',
      'synced': 'onSynced',
      'peersChanged': 'onPeersChanged',
    };

    const callbackKey = eventMap[event];
    if (callbackKey) {
      this.callbacks[callbackKey] = callback;
    }
  }

  /**
   * Obtener información de awareness (presencia de usuarios)
   */
  getAwareness() {
    return this.awareness || null;
  }

  /**
   * Actualizar estado de awareness del usuario actual
   */
  setAwarenessState(state) {
    if (this.awareness) {
      this.awareness.localState = { ...this.awareness.localState, ...state };
    }
  }

  /**
   * Generar color único para el usuario
   */
  generateColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Obtener estadísticas de sincronización
   */
  getStats() {
    return {
      initialized: this.isInitialized,
      sessionId: this.currentSessionId,
      activeFiles: this.yTexts.size,
      clientID: this.ydoc?.clientID || null,
    };
  }

  /**
   * Limpiar y desconectar
   */
  destroy() {
    console.log('🧹 Limpiando Yjs...');

    // Limpiar observers
    this.yTexts.forEach((ytext, path) => {
      ytext.unobserve();
    });
    this.yTexts.clear();

    // Limpiar canal de Supabase
    this.supabaseChannel = null;

    // Limpiar documento
    if (this.ydoc) {
      this.ydoc.destroy();
      this.ydoc = null;
    }

    this.awareness = null;
    this.isInitialized = false;
    this.currentSessionId = null;
    console.log('✅ Yjs limpiado');
  }
}

// Exportar instancia singleton
export const yjsService = new YjsService();
export default yjsService;
