// ═══════════════════════════════════════════════════════════
// 🗄️ DATABASE SERVICE - Persistencia en Supabase
// ═══════════════════════════════════════════════════════════
// Maneja todas las operaciones de base de datos para colaboración

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key-aqui';

class DatabaseService {
  constructor() {
    this.supabase = null;
    this.isConfigured = false;
    
    if (SUPABASE_URL !== 'https://tu-proyecto.supabase.co' && SUPABASE_ANON_KEY !== 'tu-anon-key-aqui') {
      this.initialize();
    }
  }

  initialize() {
    try {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      this.isConfigured = true;
      console.log('✅ DatabaseService inicializado');
    } catch (error) {
      console.error('❌ Error al inicializar DatabaseService:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 📋 SESIONES
  // ═══════════════════════════════════════════════════════════

  /**
   * Crear nueva sesión en la base de datos
   */
  async createSession(sessionData) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('collaborative_sessions')
      .insert({
        session_code: sessionData.sessionCode,
        session_name: sessionData.sessionName,
        owner_user_id: sessionData.ownerUserId,
        owner_name: sessionData.ownerName,
        access_control: sessionData.accessControl,
        password_hash: sessionData.passwordHash,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Obtener sesión por código
   */
  async getSessionByCode(sessionCode) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('collaborative_sessions')
      .select('*')
      .eq('session_code', sessionCode)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Obtener sesión completa con participantes y archivos
   */
  async getSessionComplete(sessionCode) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .rpc('get_session_complete', { session_code_param: sessionCode });

    if (error) throw error;
    return data[0];
  }

  /**
   * Actualizar sesión
   */
  async updateSession(sessionId, updates) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('collaborative_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Marcar sesión como inactiva
   */
  async deactivateSession(sessionId) {
    return this.updateSession(sessionId, { is_active: false });
  }

  // ═══════════════════════════════════════════════════════════
  // 👥 PARTICIPANTES
  // ═══════════════════════════════════════════════════════════

  /**
   * Agregar participante a sesión
   */
  async addParticipant(participantData) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('session_participants')
      .insert({
        session_id: participantData.sessionId,
        user_id: participantData.userId,
        user_name: participantData.userName,
        user_email: participantData.userEmail,
        user_color: participantData.userColor,
        role: participantData.role,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Obtener participantes de una sesión
   */
  async getSessionParticipants(sessionId) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('session_participants')
      .select('*')
      .eq('session_id', sessionId)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Actualizar estado online de participante
   */
  async updateParticipantStatus(participantId, isOnline) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('session_participants')
      .update({ 
        is_online: isOnline,
        last_seen_at: new Date().toISOString()
      })
      .eq('id', participantId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Cambiar rol de participante
   */
  async updateParticipantRole(participantId, newRole) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('session_participants')
      .update({ role: newRole })
      .eq('id', participantId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ═══════════════════════════════════════════════════════════
  // 📁 ARCHIVOS
  // ═══════════════════════════════════════════════════════════

  /**
   * Crear archivo en la base de datos
   */
  async createFile(fileData) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('workspace_files')
      .insert({
        session_id: fileData.sessionId,
        file_path: fileData.filePath,
        content: fileData.content,
        language: fileData.language,
        file_type: fileData.fileType,
        last_modified_by: fileData.lastModifiedBy,
        last_modified_by_name: fileData.lastModifiedByName,
        is_image: fileData.isImage || false,
        file_size: fileData.content?.length || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Obtener todos los archivos de una sesión
   */
  async getSessionFiles(sessionId) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('workspace_files')
      .select('*')
      .eq('session_id', sessionId)
      .order('file_path', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Actualizar contenido de archivo
   */
  async updateFile(fileId, updates) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('workspace_files')
      .update({
        ...updates,
        version: this.supabase.raw('version + 1'),
        file_size: updates.content?.length || 0,
      })
      .eq('id', fileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Eliminar archivo
   */
  async deleteFile(fileId) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { error } = await this.supabase
      .from('workspace_files')
      .delete()
      .eq('id', fileId);

    if (error) throw error;
    return true;
  }

  /**
   * Renombrar archivo
   */
  async renameFile(fileId, newPath, userId, userName) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('workspace_files')
      .update({
        file_path: newPath,
        last_modified_by: userId,
        last_modified_by_name: userName,
      })
      .eq('id', fileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ═══════════════════════════════════════════════════════════
  // 📜 HISTORIAL DE CAMBIOS
  // ═══════════════════════════════════════════════════════════

  /**
   * Obtener historial de un archivo
   */
  async getFileHistory(fileId, limit = 50) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .rpc('get_file_history', { 
        file_id_param: fileId,
        limit_param: limit 
      });

    if (error) throw error;
    return data;
  }

  /**
   * Obtener cambios recientes de una sesión
   */
  async getRecentChanges(sessionId, limit = 100) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('file_changes_log')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // ═══════════════════════════════════════════════════════════
  // 💬 CHAT
  // ═══════════════════════════════════════════════════════════

  /**
   * Enviar mensaje al chat
   */
  async sendChatMessage(messageData) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('chat_messages')
      .insert({
        session_id: messageData.sessionId,
        user_id: messageData.userId,
        user_name: messageData.userName,
        user_color: messageData.userColor,
        message: messageData.message,
        message_type: messageData.messageType || 'text',
        metadata: messageData.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Obtener mensajes del chat
   */
  async getChatMessages(sessionId, limit = 100) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Suscribirse a nuevos mensajes del chat
   */
  subscribeToChatMessages(sessionId, callback) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    return this.supabase
      .channel(`chat:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  }

  // ═══════════════════════════════════════════════════════════
  // 💭 COMENTARIOS
  // ═══════════════════════════════════════════════════════════

  /**
   * Crear comentario en código
   */
  async createComment(commentData) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('code_comments')
      .insert({
        session_id: commentData.sessionId,
        workspace_file_id: commentData.workspaceFileId,
        user_id: commentData.userId,
        user_name: commentData.userName,
        user_color: commentData.userColor,
        line_number: commentData.lineNumber,
        comment_text: commentData.commentText,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Obtener comentarios de un archivo
   */
  async getFileComments(workspaceFileId) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('code_comments')
      .select('*, comment_replies(*)')
      .eq('workspace_file_id', workspaceFileId)
      .order('line_number', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Resolver comentario
   */
  async resolveComment(commentId, resolvedBy) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('code_comments')
      .update({
        is_resolved: true,
        resolved_by: resolvedBy,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Agregar respuesta a comentario
   */
  async addCommentReply(replyData) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('comment_replies')
      .insert({
        comment_id: replyData.commentId,
        user_id: replyData.userId,
        user_name: replyData.userName,
        reply_text: replyData.replyText,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ═══════════════════════════════════════════════════════════
  // 🔔 NOTIFICACIONES
  // ═══════════════════════════════════════════════════════════

  /**
   * Crear notificación
   */
  async createNotification(notificationData) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { data, error } = await this.supabase
      .from('notifications')
      .insert({
        session_id: notificationData.sessionId,
        user_id: notificationData.userId,
        notification_type: notificationData.notificationType,
        title: notificationData.title,
        message: notificationData.message,
        metadata: notificationData.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Notificar a todos los participantes
   */
  async notifySessionParticipants(sessionId, notificationType, title, message) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { error } = await this.supabase
      .rpc('notify_session_participants', {
        session_id_param: sessionId,
        notification_type_param: notificationType,
        title_param: title,
        message_param: message,
      });

    if (error) throw error;
    return true;
  }

  /**
   * Marcar notificación como leída
   */
  async markNotificationAsRead(notificationId) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { error } = await this.supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  }

  // ═══════════════════════════════════════════════════════════
  // 🔒 BLOQUEO DE ARCHIVOS
  // ═══════════════════════════════════════════════════════════

  /**
   * Bloquear archivo para edición
   */
  async lockFile(lockData) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Bloqueo por 5 minutos

    const { data, error } = await this.supabase
      .from('file_locks')
      .insert({
        session_id: lockData.sessionId,
        workspace_file_id: lockData.workspaceFileId,
        user_id: lockData.userId,
        user_name: lockData.userName,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Liberar bloqueo de archivo
   */
  async unlockFile(workspaceFileId) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    const { error } = await this.supabase
      .from('file_locks')
      .delete()
      .eq('workspace_file_id', workspaceFileId);

    if (error) throw error;
    return true;
  }

  /**
   * Verificar si archivo está bloqueado
   */
  async isFileLocked(workspaceFileId) {
    if (!this.supabase) throw new Error('Supabase no configurado');

    // Primero limpiar bloqueos expirados
    await this.supabase.rpc('clean_expired_locks');

    const { data, error } = await this.supabase
      .from('file_locks')
      .select('*')
      .eq('workspace_file_id', workspaceFileId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }
}

// Exportar instancia singleton
const databaseService = new DatabaseService();
export default databaseService;
