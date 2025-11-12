# 📖 Ejemplo de Integración - Mejoras de Colaboración V2

Esta guía muestra cómo integrar las nuevas funcionalidades de colaboración en tu `App.jsx`.

---

## 🎯 Paso 1: Importar Componentes

```javascript
// Componentes nuevos
import NotificationToast from './components/NotificationToast';
import ActivityFeed from './components/ActivityFeed';
import PresencePanel from './components/PresencePanel';
import ChatPanel from './components/ChatPanel';

// Servicio de colaboración V2
import collaborationService from './services/collaborationServiceV2';
```

---

## 🎯 Paso 2: Agregar Estados

```javascript
function App() {
  // Estados existentes...
  const [files, setFiles] = useState(initialFiles);
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // 🆕 Estados para las nuevas funcionalidades
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  
  // Estados de UI
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isActivityMinimized, setIsActivityMinimized] = useState(false);
  
  // ...resto de estados
}
```

---

## 🎯 Paso 3: Setup de Callbacks

```javascript
useEffect(() => {
  if (!isCollaborating) return;

  // 💬 Chat
  collaborationService.on('chatMessage', (message) => {
    console.log('💬 Mensaje recibido:', message);
    setChatMessages(prev => [...prev, message]);
    
    // Mostrar notificación si el chat está cerrado
    if (!isChatOpen && message.userId !== currentUser?.id) {
      addNotification({
        type: 'chat-message',
        userName: message.userName,
        userColor: message.userColor,
        message: message.message.substring(0, 50),
      });
    }
  });

  // 🔔 Notificaciones
  collaborationService.on('notification', (notification) => {
    console.log('🔔 Notificación:', notification);
    addNotification(notification);
  });

  // 📊 Actividad
  collaborationService.on('activity', (activity) => {
    console.log('📊 Actividad:', activity);
    setActivities(prev => [...prev, activity]);
  });

  // ✍️ Indicador de escritura
  collaborationService.on('typingIndicator', (users) => {
    setTypingUsers(users);
  });

  // Cleanup
  return () => {
    collaborationService.callbacks.onChatMessage = null;
    collaborationService.callbacks.onNotification = null;
    collaborationService.callbacks.onActivity = null;
    collaborationService.callbacks.onTypingIndicator = null;
  };
}, [isCollaborating, isChatOpen, currentUser]);
```

---

## 🎯 Paso 4: Funciones de Ayuda

```javascript
// Agregar notificación
const addNotification = useCallback((notification) => {
  const id = Date.now() + Math.random();
  setNotifications(prev => [...prev, { ...notification, id }]);
}, []);

// Remover notificación
const removeNotification = useCallback((id) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
}, []);

// Enviar mensaje de chat
const handleSendMessage = useCallback(async (messageData) => {
  try {
    await collaborationService.sendChatMessage(
      messageData.message,
      messageData.messageType || 'text'
    );
    
    // Registrar actividad
    collaborationService.logActivity(
      'chat_message',
      'envió un mensaje'
    );
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    addNotification({
      type: 'error',
      message: 'No se pudo enviar el mensaje',
    });
  }
}, [addNotification]);

// Cambiar permisos de usuario
const handleChangePermissions = useCallback(async (userId, newRole) => {
  try {
    await collaborationService.changeUserPermissions(userId, newRole);
    
    addNotification({
      type: 'success',
      message: `Permisos actualizados a ${newRole}`,
    });
    
    collaborationService.logActivity(
      'permission_change',
      `cambió permisos de un usuario a ${newRole}`,
      { userId, newRole }
    );
  } catch (error) {
    console.error('Error al cambiar permisos:', error);
    addNotification({
      type: 'error',
      message: 'No se pudieron cambiar los permisos',
    });
  }
}, [addNotification]);

// Toggle chat
const toggleChat = useCallback(() => {
  setIsChatOpen(prev => !prev);
  if (!isChatOpen) {
    setIsChatMinimized(false);
  }
}, [isChatOpen]);

// Toggle actividad
const toggleActivity = useCallback(() => {
  setIsActivityOpen(prev => !prev);
  if (!isActivityOpen) {
    setIsActivityMinimized(false);
  }
}, [isActivityOpen]);
```

---

## 🎯 Paso 5: Agregar a la UI (TopBar)

```javascript
// En TopBar.jsx o donde tengas los botones de colaboración

<div className="flex items-center gap-2">
  {/* Botón de Chat */}
  <button
    onClick={toggleChat}
    className={`relative p-2 rounded hover:bg-gray-700 transition-colors ${
      isChatOpen ? 'bg-gray-700' : ''
    }`}
    title="Chat del equipo"
  >
    <MessageCircle className="w-5 h-5" />
    {chatMessages.length > 0 && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
        {chatMessages.length}
      </span>
    )}
  </button>

  {/* Botón de Actividad */}
  <button
    onClick={toggleActivity}
    className={`relative p-2 rounded hover:bg-gray-700 transition-colors ${
      isActivityOpen ? 'bg-gray-700' : ''
    }`}
    title="Actividad del equipo"
  >
    <Activity className="w-5 h-5" />
    {activities.length > 0 && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center">
        {activities.length}
      </span>
    )}
  </button>
</div>
```

---

## 🎯 Paso 6: Renderizar Componentes

```javascript
return (
  <div className="app-container">
    {/* Tu UI existente */}
    <TopBar />
    <FileTree />
    <CodeEditor />
    
    {/* 🆕 Componentes nuevos */}
    
    {/* Sistema de notificaciones (siempre visible) */}
    <NotificationToast
      notifications={notifications}
      onRemove={removeNotification}
    />
    
    {/* Panel de presencia (solo si hay colaboración activa) */}
    {isCollaborating && (
      <PresencePanel
        activeUsers={activeUsers}
        currentUser={currentUser}
        onChangePermissions={handleChangePermissions}
      />
    )}
    
    {/* Chat (se muestra al hacer clic en el botón) */}
    {isCollaborating && (
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        isMinimized={isChatMinimized}
        onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
      />
    )}
    
    {/* Feed de actividad */}
    {isCollaborating && (
      <ActivityFeed
        activities={activities}
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        isMinimized={isActivityMinimized}
        onToggleMinimize={() => setIsActivityMinimized(!isActivityMinimized)}
      />
    )}
  </div>
);
```

---

## 🎯 Paso 7: Registrar Actividades

Registra actividades en momentos clave:

```javascript
// Al guardar un archivo
const handleSaveFile = async () => {
  // ...guardar archivo
  collaborationService.logActivity(
    'file_saved',
    `guardó ${activePath}`,
    { fileName: activePath }
  );
};

// Al ejecutar código
const handleExecuteCode = async () => {
  // ...ejecutar código
  collaborationService.logActivity(
    'code_execution',
    `ejecutó ${activePath}`,
    { fileName: activePath }
  );
};

// Al crear un archivo
const handleNewFile = async (name) => {
  // ...crear archivo
  collaborationService.logActivity(
    'file_change',
    `creó ${name}`,
    { fileName: name }
  );
};
```

---

## 🎯 Paso 8: Notificaciones Automáticas

```javascript
// En useCollaboration.js o donde manejes eventos de colaboración

// Usuario se unió
const handleUserJoined = useCallback((user) => {
  addNotification({
    type: 'user-joined',
    userName: user.name,
    userColor: user.color,
    message: 'se unió a la sesión',
  });
  
  collaborationService.logActivity(
    'user_joined',
    `se unió a la sesión`,
    { userId: user.id }
  );
}, [addNotification]);

// Usuario salió
const handleUserLeft = useCallback((user) => {
  addNotification({
    type: 'user-left',
    userName: user.name,
    userColor: user.color,
    message: 'salió de la sesión',
  });
  
  collaborationService.logActivity(
    'user_left',
    `salió de la sesión`,
    { userId: user.id }
  );
}, [addNotification]);

// Conexión restaurada
const handleConnectionRestored = useCallback(() => {
  addNotification({
    type: 'connection-restored',
    message: 'Conexión restaurada correctamente',
  });
}, [addNotification]);
```

---

## 🎨 Estilado Personalizado

Puedes personalizar los colores en los componentes:

```javascript
// NotificationToast.jsx
const configs = {
  success: {
    bgColor: 'bg-green-500/90',  // Cambia aquí
    borderColor: 'border-green-400',
  },
  // ...
};

// ActivityFeed.jsx
const colors = {
  file_change: 'text-blue-400',  // Cambia aquí
  // ...
};
```

---

## ⚡ Performance Tips

1. **Memoizar callbacks** para evitar re-renders innecesarios
2. **Limitar tamaño de arrays** (últimos 100 mensajes/actividades)
3. **Debounce** para indicadores de escritura
4. **Lazy loading** de componentes pesados

```javascript
// Ejemplo de lazy loading
const ChatPanel = lazy(() => import('./components/ChatPanel'));
const ActivityFeed = lazy(() => import('./components/ActivityFeed'));

// Uso con Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ChatPanel {...props} />
</Suspense>
```

---

## 🐛 Debugging

```javascript
// Activar logs en el servicio
collaborationService.debug = true;

// Ver estado actual
console.log('Chat messages:', collaborationService.getChatMessages());
console.log('Activities:', collaborationService.getActivityLog());
console.log('Active users:', activeUsers);
```

---

## ✅ Checklist de Integración

- [ ] Importar componentes
- [ ] Agregar estados
- [ ] Setup de callbacks
- [ ] Crear funciones de ayuda
- [ ] Agregar botones a la UI
- [ ] Renderizar componentes
- [ ] Registrar actividades clave
- [ ] Configurar notificaciones automáticas
- [ ] Probar en modo colaborativo
- [ ] Verificar performance

---

## 🎉 ¡Listo!

Con estos pasos tendrás las nuevas funcionalidades de colaboración completamente integradas y funcionando.

**¿Preguntas?** Revisa `MEJORAS_COLABORACION_V2.md` para más detalles técnicos.
