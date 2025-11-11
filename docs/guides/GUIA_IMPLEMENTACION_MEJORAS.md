# 🚀 GUÍA DE IMPLEMENTACIÓN - MEJORAS COMPLETAS DE COLABORACIÓN

Esta guía te llevará paso a paso para implementar TODAS las mejoras en tu sistema de colaboración.

## 📋 ÍNDICE

1. [Configuración Inicial](#1-configuración-inicial)
2. [Implementar Persistencia en Base de Datos](#2-implementar-persistencia-en-base-de-datos)
3. [Integrar Sistema de Diffs](#3-integrar-sistema-de-diffs)
4. [Agregar Chat en Tiempo Real](#4-agregar-chat-en-tiempo-real)
5. [Implementar Comentarios en Código](#5-implementar-comentarios-en-código)
6. [Configurar Notificaciones](#6-configurar-notificaciones)
7. [Actualizar CollaborationService](#7-actualizar-collaborationservice)
8. [Pruebas y Validación](#8-pruebas-y-validación)

---

## 1. CONFIGURACIÓN INICIAL

### Paso 1.1: Ejecutar el Schema SQL en Supabase

1. Ve a tu proyecto de Supabase
2. Abre el **SQL Editor**
3. Ejecuta el archivo `supabase-schema-MEJORADO-COMPLETO.sql`
4. Verifica que todas las tablas se crearon correctamente:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Deberías ver estas tablas:
- ✅ `collaborative_sessions`
- ✅ `session_participants`
- ✅ `workspace_files`
- ✅ `file_changes_log`
- ✅ `cursor_positions`
- ✅ `chat_messages` ← NUEVA
- ✅ `code_comments` ← NUEVA
- ✅ `comment_replies` ← NUEVA
- ✅ `file_operations_queue` ← NUEVA
- ✅ `notifications` ← NUEVA
- ✅ `file_locks` ← NUEVA

### Paso 1.2: Verificar Variables de Entorno

Asegúrate de tener en tu archivo `.env`:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

---

## 2. IMPLEMENTAR PERSISTENCIA EN BASE DE DATOS

### Paso 2.1: Integrar DatabaseService en CollaborationService

Abre `src/services/collaborationService.js` y agrega al inicio:

```javascript
import databaseService from './databaseService';
```

### Paso 2.2: Modificar createSession para usar BD

Reemplaza la función `createSession` actual:

```javascript
async createSession(sessionData) {
  if (!this.supabase) {
    throw new Error('Supabase no configurado');
  }

  // Generar ID corto
  const sessionCode = uuidv4().substring(0, 5);
  const userId = uuidv4();
  
  this.currentUser = {
    id: userId,
    name: sessionData.userName || 'Usuario Anónimo',
    color: this.generateUserColor(),
    role: 'owner',
  };

  // 🔥 NUEVO: Guardar en base de datos
  try {
    const session = await databaseService.createSession({
      sessionCode: sessionCode,
      sessionName: sessionData.sessionName || 'Sesión de Código',
      ownerUserId: userId,
      ownerName: this.currentUser.name,
      accessControl: sessionData.accessControl || 'public',
      passwordHash: sessionData.password || null,
    });

    this.currentSession = {
      id: sessionCode,
      dbId: session.id, // ID de la BD
      name: session.session_name,
      owner: userId,
      users: [this.currentUser],
      accessControl: session.access_control,
      createdAt: session.created_at,
      files: sessionData.files || {},
      images: sessionData.images || [],
    };

    // Agregar participante a la BD
    await databaseService.addParticipant({
      sessionId: session.id,
      userId: userId,
      userName: this.currentUser.name,
      userEmail: null,
      userColor: this.currentUser.color,
      role: 'owner',
    });

    // Guardar archivos iniciales en BD
    if (sessionData.files) {
      await this.syncFilesToDatabase(session.id, sessionData.files);
    }

  } catch (error) {
    console.error('❌ Error al crear sesión en BD:', error);
    // Fallback a modo local
  }

  // Conectar al canal de Realtime
  await this.connectToChannel(sessionCode);
  await this.broadcastUserJoined();
  this.saveSessionToStorage();

  // Obtener URL pública
  let publicUrl = window.location.origin;
  
  return {
    sessionId: sessionCode,
    userId,
    shareLink: `${publicUrl}?session=${sessionCode}`,
  };
}
```

### Paso 2.3: Crear función para sincronizar archivos

Agrega esta nueva función en `collaborationService.js`:

```javascript
/**
 * Sincronizar archivos al iniciar sesión
 */
async syncFilesToDatabase(sessionDbId, files) {
  if (!databaseService.isConfigured) return;

  const flatFiles = this.flattenFileStructure(files);
  
  for (const file of flatFiles) {
    try {
      await databaseService.createFile({
        sessionId: sessionDbId,
        filePath: file.path,
        content: file.content,
        language: file.language,
        fileType: file.type,
        lastModifiedBy: this.currentUser.id,
        lastModifiedByName: this.currentUser.name,
        isImage: file.isImage || false,
      });
    } catch (error) {
      console.error('❌ Error al guardar archivo:', file.path, error);
    }
  }
}

/**
 * Aplanar estructura de archivos
 */
flattenFileStructure(files, basePath = '') {
  let flatFiles = [];
  
  Object.entries(files || {}).forEach(([key, item]) => {
    const currentPath = basePath ? `${basePath}/${key}` : key;
    
    if (item.type === 'file') {
      flatFiles.push({
        path: currentPath,
        name: item.name,
        content: item.content,
        language: item.language,
        type: item.type,
        isImage: item.isImage,
      });
    } else if (item.type === 'folder' && item.children) {
      flatFiles = flatFiles.concat(
        this.flattenFileStructure(item.children, currentPath)
      );
    }
  });
  
  return flatFiles;
}
```

---

## 3. INTEGRAR SISTEMA DE DIFFS

### Paso 3.1: Importar DiffService

En `collaborationService.js`:

```javascript
import diffService from './diffService';
```

### Paso 3.2: Modificar broadcastFileChange

Reemplaza la función actual:

```javascript
async broadcastFileChange(filePath, content, cursorPosition, version) {
  console.log('📡 broadcastFileChange con DIFF');
  
  if (!this.currentUser || !this.channel) {
    console.error('❌ Falta usuario o canal');
    return;
  }

  // Obtener contenido anterior
  const oldContent = this.fileCache[filePath] || '';
  
  // 🔥 CALCULAR DIFF en lugar de enviar todo
  const diffData = diffService.calculateDiff(oldContent, content);
  
  console.log('📊 Diff stats:', {
    type: diffData.type,
    size: diffData.size,
    originalSize: content.length,
    savings: `${Math.round((1 - diffData.size / content.length) * 100)}%`
  });

  // Actualizar cache
  this.fileCache[filePath] = content;

  // Generar hash para verificación
  const contentHash = diffService.generateHash(content);

  const messageId = `${this.currentUser.id}-${filePath}-${Date.now()}`;

  const message = {
    type: 'broadcast',
    event: 'file-change',
    payload: {
      messageId,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userColor: this.currentUser.color,
      filePath,
      diffData, // ← En lugar de content completo
      contentHash, // ← Para verificación
      cursorPosition,
      version: typeof version === 'number' ? version : undefined,
      timestamp: Date.now(),
    }
  };
  
  if (!this.channel || this.connectionStatus !== 'connected') {
    console.warn('⚠️ Sin conexión - agregando al buffer');
    if (this.offlineBuffer.length < this.maxBufferSize) {
      this.offlineBuffer.push(message);
    }
    return;
  }
  
  try {
    await this.channel.send(message);
    console.log('✅ Diff enviado exitosamente');
  } catch (error) {
    console.error('❌ Error al enviar diff:', error);
  }
}
```

### Paso 3.3: Actualizar el Listener de file-change

En la función `connectToChannel`, modifica el listener:

```javascript
this.channel.on('broadcast', { event: 'file-change' }, (payload) => {
  const data = payload.payload;
  
  console.log('🎯 Diff recibido:', {
    filePath: data.filePath,
    diffType: data.diffData?.type,
    diffSize: data.diffData?.size,
  });
  
  if (data.userId === this.currentUser?.id) {
    console.log('⏸️ Es mi propio mensaje - ignorar');
    return;
  }
  
  if (data.messageId && this.isMessageProcessed(data.messageId)) {
    console.log('⏸️ Mensaje duplicado - ignorar');
    return;
  }
  
  if (this.callbacks.onFileChange) {
    // 🔥 APLICAR DIFF
    const oldContent = this.fileCache[data.filePath] || '';
    const newContent = diffService.applyDiff(oldContent, data.diffData);
    
    // Verificar integridad
    const isValid = diffService.verifyIntegrity(
      oldContent, 
      newContent, 
      data.contentHash
    );
    
    if (!isValid) {
      console.error('❌ Error de integridad - solicitando contenido completo');
      // TODO: Implementar solicitud de resincronización
      return;
    }
    
    // Actualizar cache
    this.fileCache[data.filePath] = newContent;
    
    // Llamar callback con contenido aplicado
    this.callbacks.onFileChange({
      ...data,
      content: newContent, // Contenido reconstruido
    });
  }
});
```

### Paso 3.4: Inicializar Cache de Archivos

En el constructor de `CollaborationService`:

```javascript
constructor() {
  // ... código existente ...
  this.fileCache = {}; // ← NUEVO: Cache de contenidos
}
```

---

## 4. AGREGAR CHAT EN TIEMPO REAL

### Paso 4.1: Actualizar App.jsx

Importa el componente:

```javascript
import ChatPanel from './components/ChatPanel';
```

Agrega estados:

```javascript
const [showChat, setShowChat] = useState(false);
const [isChatMinimized, setIsChatMinimized] = useState(false);
const [chatMessages, setChatMessages] = useState([]);
```

### Paso 4.2: Crear Funciones de Chat

```javascript
const handleSendChatMessage = useCallback(async (messageData) => {
  if (!isCollaborating) return;

  // Enviar a Supabase
  try {
    await databaseService.sendChatMessage({
      sessionId: currentSession?.dbId,
      userId: currentUser?.id,
      userName: currentUser?.name,
      userColor: currentUser?.color,
      message: messageData.message,
      messageType: messageData.messageType,
    });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
  }

  // Agregar a estado local
  const newMessage = {
    id: Date.now(),
    userId: currentUser?.id,
    userName: currentUser?.name,
    userColor: currentUser?.color,
    message: messageData.message,
    messageType: messageData.messageType,
    timestamp: Date.now(),
  };

  setChatMessages(prev => [...prev, newMessage]);
}, [isCollaborating, currentSession, currentUser]);
```

### Paso 4.3: Suscribirse a Mensajes

```javascript
useEffect(() => {
  if (!isCollaborating || !currentSession?.dbId) return;

  // Cargar mensajes existentes
  databaseService.getChatMessages(currentSession.dbId, 50)
    .then(messages => {
      setChatMessages(messages);
    });

  // Suscribirse a nuevos mensajes
  const subscription = databaseService.subscribeToChatMessages(
    currentSession.dbId,
    (newMessage) => {
      // Solo agregar si no es propio
      if (newMessage.user_id !== currentUser?.id) {
        setChatMessages(prev => [...prev, newMessage]);
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, [isCollaborating, currentSession, currentUser]);
```

### Paso 4.4: Renderizar ChatPanel

En el JSX de App.jsx:

```jsx
{/* Chat Panel */}
{isCollaborating && (
  <ChatPanel
    isOpen={showChat}
    onClose={() => setShowChat(false)}
    messages={chatMessages}
    currentUser={currentUser}
    onSendMessage={handleSendChatMessage}
    isMinimized={isChatMinimized}
    onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
  />
)}
```

### Paso 4.5: Agregar Botón en TopBar

Modifica `TopBar.jsx` para incluir botón de chat:

```jsx
<button
  onClick={() => setShowChat(!showChat)}
  className="p-2 hover:bg-[#3e3e42] rounded transition-colors"
  title="Chat"
>
  <MessageCircle className="w-5 h-5 text-gray-300" />
</button>
```

---

## 5. IMPLEMENTAR COMENTARIOS EN CÓDIGO

### Paso 5.1: Agregar Estados en App.jsx

```javascript
const [showComments, setShowComments] = useState(false);
const [codeComments, setCodeComments] = useState([]);
```

### Paso 5.2: Crear Funciones de Comentarios

```javascript
const handleAddComment = useCallback(async (lineNumber, commentText) => {
  if (!isCollaborating || !activeTab) return;

  try {
    await databaseService.createComment({
      sessionId: currentSession?.dbId,
      workspaceFileId: activeTab, // Necesitarás el ID de BD del archivo
      userId: currentUser?.id,
      userName: currentUser?.name,
      userColor: currentUser?.color,
      lineNumber,
      commentText,
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
  }
}, [isCollaborating, currentSession, currentUser, activeTab]);

const handleResolveComment = useCallback(async (commentId) => {
  try {
    await databaseService.resolveComment(commentId, currentUser?.id);
    setCodeComments(prev =>
      prev.map(c => c.id === commentId ? { ...c, is_resolved: true } : c)
    );
  } catch (error) {
    console.error('Error al resolver comentario:', error);
  }
}, [currentUser]);

const handleReplyComment = useCallback(async (commentId, replyText) => {
  try {
    await databaseService.addCommentReply({
      commentId,
      userId: currentUser?.id,
      userName: currentUser?.name,
      replyText,
    });
  } catch (error) {
    console.error('Error al responder comentario:', error);
  }
}, [currentUser]);
```

### Paso 5.3: Renderizar CommentsPanel

```jsx
{/* Comments Panel */}
{isCollaborating && (
  <CommentsPanel
    isOpen={showComments}
    onClose={() => setShowComments(false)}
    comments={codeComments}
    currentUser={currentUser}
    currentFile={activeTab}
    onAddComment={handleAddComment}
    onResolveComment={handleResolveComment}
    onReplyComment={handleReplyComment}
  />
)}
```

### Paso 5.4: Agregar Atajo de Teclado

En `CodeEditor.jsx`, agrega comando para comentar:

```javascript
// Crear comentario (Ctrl+Alt+C)
editor.addCommand(
  monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyC,
  () => {
    const selection = editor.getSelection();
    const lineNumber = selection.startLineNumber;
    
    // Abrir modal de comentario
    if (onAddComment) {
      const commentText = prompt('Escribe tu comentario:');
      if (commentText) {
        onAddComment(lineNumber, commentText);
      }
    }
  }
);
```

---

## 6. CONFIGURAR NOTIFICACIONES

### Paso 6.1: Agregar NotificationSystem en App.jsx

```javascript
import NotificationSystem from './components/NotificationSystem';

const [notifications, setNotifications] = useState([]);
```

### Paso 6.2: Crear Funciones de Notificaciones

```javascript
const handleMarkNotificationAsRead = useCallback(async (notificationId) => {
  try {
    await databaseService.markNotificationAsRead(notificationId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
  } catch (error) {
    console.error('Error al marcar notificación:', error);
  }
}, []);

const handleMarkAllNotificationsAsRead = useCallback(async () => {
  try {
    await Promise.all(
      notifications
        .filter(n => !n.is_read)
        .map(n => databaseService.markNotificationAsRead(n.id))
    );
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  } catch (error) {
    console.error('Error al marcar todas:', error);
  }
}, [notifications]);

const handleClearAllNotifications = useCallback(() => {
  setNotifications([]);
}, []);
```

### Paso 6.3: Renderizar en TopBar

```jsx
<NotificationSystem
  notifications={notifications}
  onMarkAsRead={handleMarkNotificationAsRead}
  onMarkAllAsRead={handleMarkAllNotificationsAsRead}
  onClearAll={handleClearAllNotifications}
/>
```

---

## 7. ACTUALIZAR COLLABORATIONSERVICE

### Paso 7.1: Agregar Evento de Operaciones de Archivos

En `connectToChannel`, agrega:

```javascript
// Escuchar operaciones de archivos
this.channel.on('broadcast', { event: 'file-operation' }, (payload) => {
  const data = payload.payload;
  
  console.log('📁 Operación de archivo:', data.operation, data.filePath);
  
  if (data.userId === this.currentUser?.id) return;
  
  if (this.callbacks.onFileOperation) {
    this.callbacks.onFileOperation(data);
  }
});
```

### Paso 7.2: Crear Funciones para Sincronizar Operaciones

```javascript
/**
 * Transmitir creación de archivo
 */
async broadcastFileCreated(filePath, content, language) {
  if (!this.channel || !this.currentUser) return;

  await this.channel.send({
    type: 'broadcast',
    event: 'file-operation',
    payload: {
      operation: 'create',
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      filePath,
      content,
      language,
      timestamp: Date.now(),
    },
  });

  // Guardar en BD
  if (databaseService.isConfigured && this.currentSession?.dbId) {
    await databaseService.createFile({
      sessionId: this.currentSession.dbId,
      filePath,
      content,
      language,
      fileType: 'file',
      lastModifiedBy: this.currentUser.id,
      lastModifiedByName: this.currentUser.name,
    });
  }
}

/**
 * Transmitir eliminación de archivo
 */
async broadcastFileDeleted(filePath) {
  if (!this.channel || !this.currentUser) return;

  await this.channel.send({
    type: 'broadcast',
    event: 'file-operation',
    payload: {
      operation: 'delete',
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      filePath,
      timestamp: Date.now(),
    },
  });
}

/**
 * Transmitir renombrado de archivo
 */
async broadcastFileRenamed(oldPath, newPath) {
  if (!this.channel || !this.currentUser) return;

  await this.channel.send({
    type: 'broadcast',
    event: 'file-operation',
    payload: {
      operation: 'rename',
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      oldPath,
      newPath,
      timestamp: Date.now(),
    },
  });
}
```

---

## 8. PRUEBAS Y VALIDACIÓN

### Paso 8.1: Checklist de Pruebas

- [ ] **Persistencia en BD**
  - [ ] Crear sesión guarda en BD
  - [ ] Unirse a sesión carga desde BD
  - [ ] Archivos se sincronizan correctamente
  - [ ] Historial de cambios se registra

- [ ] **Sistema de Diffs**
  - [ ] Ediciones pequeñas envían diff
  - [ ] Ediciones grandes envían contenido completo
  - [ ] Diff se aplica correctamente
  - [ ] Hash verifica integridad

- [ ] **Chat**
  - [ ] Mensajes se envían y reciben
  - [ ] Historial se carga al unirse
  - [ ] Minimizar/Maximizar funciona
  - [ ] Mensajes de código se formatean

- [ ] **Comentarios**
  - [ ] Crear comentario en línea
  - [ ] Responder a comentarios
  - [ ] Resolver comentarios
  - [ ] Filtrar resueltos/no resueltos

- [ ] **Notificaciones**
  - [ ] Se crean notificaciones automáticamente
  - [ ] Badge muestra cantidad no leídas
  - [ ] Marcar como leídas funciona
  - [ ] Filtros funcionan correctamente

### Paso 8.2: Comandos de Prueba

```bash
# Iniciar servidor de desarrollo
npm run dev

# En otra terminal, abrir con ngrok (opcional)
npm run dev:public
```

### Paso 8.3: Escenarios de Prueba

1. **Prueba de Sesión**
   - Usuario A crea sesión
   - Usuario B se une con el código
   - Ambos ven el mismo proyecto

2. **Prueba de Edición con Diffs**
   - Usuario A escribe código
   - Usuario B ve cambios en tiempo real
   - Verificar consola que muestra "diff" en lugar de "full"

3. **Prueba de Chat**
   - Usuario A envía mensaje
   - Usuario B lo recibe instantáneamente
   - Enviar código con formato

4. **Prueba de Comentarios**
   - Usuario A selecciona línea y comenta (Ctrl+Alt+C)
   - Usuario B ve el comentario
   - Usuario B responde
   - Usuario A resuelve

5. **Prueba de Desconexión**
   - Desconectar internet en Usuario A
   - Usuario A sigue escribiendo (va al buffer)
   - Reconectar internet
   - Cambios se sincronizan automáticamente

---

## 🎉 ¡IMPLEMENTACIÓN COMPLETADA!

Ahora tienes un sistema de colaboración **profesional** con:

✅ **Persistencia real** en base de datos  
✅ **Optimización** con sistema de diffs  
✅ **Chat** en tiempo real  
✅ **Comentarios** estilo Google Docs  
✅ **Notificaciones** inteligentes  
✅ **Sincronización** de operaciones de archivos  
✅ **Historial** completo de cambios  
✅ **Recuperación** ante desconexiones  

---

## 📚 PRÓXIMOS PASOS (Opcionales)

### Funcionalidades Avanzadas

1. **Video/Audio Llamadas** (Integrar WebRTC)
2. **File Locking** (Bloquear archivo mientras se edita)
3. **Branches** (Crear versiones del proyecto)
4. **Presence Awareness** (Ver scroll position de otros)
5. **AI Assistant** (Sugerencias con IA en el chat)

### Mejoras de Performance

1. **Compresión** de diffs con gzip
2. **Batching** de múltiples operaciones
3. **WebWorkers** para diff calculation
4. **IndexedDB** para cache offline más robusto

### Seguridad

1. **Encriptación** end-to-end para mensajes
2. **Rate Limiting** para prevenir spam
3. **2FA** para sesiones privadas
4. **Audit Log** completo de todas las acciones

---

## ❓ SOLUCIÓN DE PROBLEMAS

### Error: "Cannot read property 'send' of undefined"
- **Causa**: Canal de Realtime no conectado
- **Solución**: Verificar que `connectionStatus === 'connected'` antes de enviar

### Error: "RLS policy violation"
- **Causa**: Row Level Security bloqueando acceso
- **Solución**: Verificar que las políticas RLS estén configuradas correctamente

### Los diffs no se aplican correctamente
- **Causa**: Posible corrupción en el diff
- **Solución**: Verificar hash y solicitar contenido completo si falla

### Chat no muestra mensajes
- **Causa**: Suscripción no activa
- **Solución**: Verificar que `subscribeToChatMessages` se llamó correctamente

---

## 📞 SOPORTE

Si encuentras algún problema:

1. Revisa los logs de consola (busca 🔥, ✅, ❌)
2. Verifica que todas las tablas existan en Supabase
3. Comprueba que las variables de entorno estén correctas
4. Consulta la documentación de Supabase Realtime

**¡Buena suerte con tu implementación!** 🚀
