import * as Y from 'yjs';

/**
 * 🔗 YJS SUPABASE PROVIDER
 * Conecta Yjs CRDT con Supabase Realtime
 * Esto elimina conflictos al 100% en edición colaborativa
 */
export class YjsSupabaseProvider {
  constructor(doc, channel, awareness) {
    this.doc = doc;
    this.channel = channel;
    this.awareness = awareness;
    this.synced = false;
    
    // Listeners
    this._docUpdateHandler = this._handleDocUpdate.bind(this);
    this._awarenessUpdateHandler = this._handleAwarenessUpdate.bind(this);
    
    // Conectar listeners
    this.connect();
  }

  connect() {
    if (!this.channel) {
      console.warn('⚠️ No hay canal de Supabase');
      return;
    }

    console.log('🔗 Conectando Yjs con Supabase...');

    // Escuchar actualizaciones del documento local
    this.doc.on('update', this._docUpdateHandler);
    
    // Escuchar actualizaciones de awareness local
    if (this.awareness) {
      this.awareness.on('update', this._awarenessUpdateHandler);
    }

    // Escuchar mensajes de Supabase
    this.channel.on('broadcast', { event: 'yjs-update' }, ({ payload }) => {
      this._applyRemoteUpdate(payload);
    });

    this.channel.on('broadcast', { event: 'yjs-awareness' }, ({ payload }) => {
      this._applyRemoteAwareness(payload);
    });

    // 🔥 Escuchar solicitudes de sincronización
    this.channel.on('broadcast', { event: 'yjs-sync-request' }, () => {
      this._respondToSyncRequest();
    });

    // 🔥 Escuchar respuestas de sincronización
    this.channel.on('broadcast', { event: 'yjs-sync-response' }, ({ payload }) => {
      this._applyFullState(payload);
    });

    // Sincronización inicial
    this._requestSync();
  }

  /**
   * Cuando el documento local cambia → enviar a Supabase
   */
  _handleDocUpdate(update, origin) {
    // No reenviar actualizaciones que vengan de Supabase
    if (origin === 'supabase') {
      return;
    }

    // Convertir update a array para enviar
    const updateArray = Array.from(update);

    this.channel.send({
      type: 'broadcast',
      event: 'yjs-update',
      payload: {
        update: updateArray,
        timestamp: Date.now(),
      },
    });

    console.log('📤 Yjs update enviado:', updateArray.length, 'bytes');
  }

  /**
   * Cuando awareness local cambia → enviar a Supabase
   */
  _handleAwarenessUpdate({ added, updated, removed }) {
    if (!this.awareness) return;

    const changedClients = [...added, ...updated, ...removed];
    const awarenessUpdate = this.awareness.getStates();
    
    // Solo enviar los clientes que cambiaron
    const update = {};
    changedClients.forEach(clientId => {
      update[clientId] = awarenessUpdate.get(clientId) || null;
    });

    this.channel.send({
      type: 'broadcast',
      event: 'yjs-awareness',
      payload: {
        update,
        timestamp: Date.now(),
      },
    });

    console.log('📤 Awareness enviado:', changedClients.length, 'clientes');
  }

  /**
   * Aplicar update remoto recibido de Supabase
   */
  _applyRemoteUpdate(payload) {
    if (!payload.update) return;

    try {
      // Convertir array a Uint8Array
      const update = new Uint8Array(payload.update);
      
      // Aplicar update con origin 'supabase' para no reenviarlo
      Y.applyUpdate(this.doc, update, 'supabase');
      
      console.log('📥 Yjs update aplicado:', update.length, 'bytes');
      
      if (!this.synced) {
        this.synced = true;
        console.log('✅ Yjs sincronizado');
      }
    } catch (error) {
      console.error('❌ Error aplicando update:', error);
    }
  }

  /**
   * Aplicar awareness remoto recibido de Supabase
   */
  _applyRemoteAwareness(payload) {
    if (!this.awareness || !payload.update) return;

    try {
      Object.entries(payload.update).forEach(([clientId, state]) => {
        if (state === null) {
          this.awareness.states.delete(Number(clientId));
        } else {
          this.awareness.states.set(Number(clientId), state);
        }
      });

      console.log('📥 Awareness aplicado');
    } catch (error) {
      console.error('❌ Error aplicando awareness:', error);
    }
  }

  /**
   * Solicitar sincronización inicial
   */
  _requestSync() {
    this.channel.send({
      type: 'broadcast',
      event: 'yjs-sync-request',
      payload: {
        timestamp: Date.now(),
      },
    });

    console.log('🔄 Solicitando sincronización inicial...');
  }

  /**
   * Responder a solicitud de sync con estado completo
   */
  _respondToSyncRequest() {
    // Enviar estado completo del documento
    const state = Y.encodeStateAsUpdate(this.doc);
    const stateArray = Array.from(state);

    this.channel.send({
      type: 'broadcast',
      event: 'yjs-sync-response',
      payload: {
        state: stateArray,
        timestamp: Date.now(),
      },
    });

    console.log('📤 Enviando estado completo:', stateArray.length, 'bytes');
  }

  /**
   * Aplicar estado completo recibido
   */
  _applyFullState(payload) {
    if (!payload.state || this.synced) return;

    try {
      const state = new Uint8Array(payload.state);
      Y.applyUpdate(this.doc, state, 'supabase');
      
      this.synced = true;
      console.log('✅ Estado completo aplicado:', state.length, 'bytes');
    } catch (error) {
      console.error('❌ Error aplicando estado completo:', error);
    }
  }

  /**
   * Desconectar
   */
  disconnect() {
    console.log('🔌 Desconectando Yjs...');
    
    this.doc.off('update', this._docUpdateHandler);
    
    if (this.awareness) {
      this.awareness.off('update', this._awarenessUpdateHandler);
    }
    
    this.synced = false;
  }

  /**
   * Destruir provider
   */
  destroy() {
    this.disconnect();
    this.doc = null;
    this.channel = null;
    this.awareness = null;
  }
}
