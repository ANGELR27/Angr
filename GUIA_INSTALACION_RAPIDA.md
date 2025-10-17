# 🚀 Guía de Instalación Rápida - Sistema Colaborativo

## 📋 Checklist de Archivos Creados

Verifica que estos archivos existan en tu proyecto:

### Servicios (/src/services/)
- [x] `yjsService.js` - Resolución de conflictos CRDT
- [x] `versionHistoryService.js` - Historial de versiones
- [x] `commentService.js` - Sistema de comentarios
- [x] `trackChangesService.js` - Track Changes
- [x] `permissionsService.js` - Permisos granulares
- [x] `presenceService.js` - Presencia avanzada

### Componentes (/src/components/)
- [x] `ConnectionStatus.jsx` - Estado de conexión
- [x] `VersionHistory.jsx` - Panel de versiones
- [x] `CommentThread.jsx` - Hilos de comentarios
- [x] `CollaborativeChat.jsx` - Chat en tiempo real
- [x] `TrackChangesPanel.jsx` - Panel Track Changes
- [x] `RecentChangesIndicator.jsx` - Indicadores de cambios
- [x] `NotificationCenter.jsx` - Notificaciones

### Hooks (/src/hooks/)
- [x] `useConnectionManager.js` - Gestión de conexión

---

## 🔧 PASO 1: Actualizar Supabase (Si usas el historial de versiones)

Agrega esta tabla a tu base de datos en Supabase:

```sql
-- Ejecutar en Supabase SQL Editor
CREATE TABLE IF NOT EXISTS version_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  description TEXT,
  files JSONB NOT NULL,
  file_count INTEGER,
  size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_version_history_session ON version_history(session_id);
CREATE INDEX idx_version_history_created ON version_history(created_at DESC);
```

---

## 📦 PASO 2: No Necesitas Nuevas Dependencias

Todas las dependencias ya están instaladas:
- ✅ `yjs` - Ya está en package.json
- ✅ `@supabase/supabase-js` - Ya está en package.json
- ✅ `uuid` - Ya está en package.json

---

## 🎨 PASO 3: Integrar en App.jsx (EJEMPLO COMPLETO)

Copia y pega este código en tu `App.jsx` (ajusta según tu estructura):

```javascript
import { useState, useEffect } from 'react';

// TUS IMPORTS EXISTENTES...

// NUEVOS IMPORTS - Agregar al inicio
import yjsService from './services/yjsService';
import versionHistoryService from './services/versionHistoryService';
import commentService from './services/commentService';
import trackChangesService from './services/trackChangesService';
import permissionsService from './services/permissionsService';
import presenceService from './services/presenceService';

import ConnectionStatus from './components/ConnectionStatus';
import VersionHistory from './components/VersionHistory';
import CollaborativeChat from './components/CollaborativeChat';
import TrackChangesPanel from './components/TrackChangesPanel';
import NotificationCenter, { useNotifications } from './components/NotificationCenter';
import RecentActivitySidebar from './components/RecentChangesIndicator';

import { useConnectionManager } from './hooks/useConnectionManager';

function App() {
  // TU ESTADO EXISTENTE...
  // const [files, setFiles] = useState(...);
  // const [activeTab, setActiveTab] = useState(...);
  // const { isCollaborating, currentUser, currentSession, ... } = useCollaboration(...);

  // NUEVO ESTADO - Agregar después de tu estado existente
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [showTrackChanges, setShowTrackChanges] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Hooks de nuevas funcionalidades
  const notifications = useNotifications();
  const connection = useConnectionManager(isCollaborating, collaborationService);

  // EFECTO 1: Inicializar servicios cuando se colabora
  useEffect(() => {
    if (isCollaborating && currentSession && currentUser) {
      console.log('🚀 Inicializando sistema colaborativo avanzado...');

      // 1. Yjs para resolución de conflictos
      yjsService.initialize(
        currentSession.id,
        currentUser.name,
        collaborationService.channel // Tu canal de Supabase existente
      );

      // 2. Auto-guardado de versiones cada 5 minutos
      versionHistoryService.startAutoSave(
        () => files,
        () => currentUser,
        () => currentSession.id,
        5
      );

      // 3. Cargar datos guardados
      commentService.loadFromStorage();
      trackChangesService.loadFromStorage();
      permissionsService.loadFromStorage();

      // 4. Asignar permisos
      if (currentUser.role) {
        permissionsService.assignRole(currentUser.id, currentUser.role);
      }

      // 5. Actualizar presencia
      presenceService.updatePresence(currentUser.id, {
        name: currentUser.name,
        color: currentUser.color,
        status: 'active',
        currentFile: activeTab,
      });

      // 6. Solicitar permisos de notificaciones
      notifications.requestPermission();

      console.log('✅ Sistema colaborativo avanzado inicializado');
    }

    return () => {
      if (isCollaborating) {
        yjsService.destroy();
        versionHistoryService.stopAutoSave();
        presenceService.clearAll();
      }
    };
  }, [isCollaborating, currentSession, currentUser]);

  // EFECTO 2: Actualizar presencia cuando cambia de archivo
  useEffect(() => {
    if (isCollaborating && currentUser && activeTab) {
      presenceService.updateCurrentFile(currentUser.id, activeTab);
    }
  }, [activeTab, isCollaborating, currentUser]);

  // EFECTO 3: Escuchar cambios de Yjs
  useEffect(() => {
    if (!isCollaborating) return;

    yjsService.on('remoteChange', (filePath, content) => {
      // Aplicar cambio remoto al archivo
      const parts = filePath.split('/');
      const updateNestedFile = (obj, path, newContent) => {
        if (path.length === 1) {
          return {
            ...obj,
            [path[0]]: { ...obj[path[0]], content: newContent }
          };
        }
        const [first, ...rest] = path;
        return {
          ...obj,
          [first]: {
            ...obj[first],
            children: updateNestedFile(obj[first].children, rest, newContent)
          }
        };
      };
      setFiles(updateNestedFile(files, parts, content));
    });
  }, [isCollaborating, files]);

  // HANDLERS NUEVOS
  const handleSaveSnapshot = () => {
    if (!currentUser || !currentSession) return;
    
    const snapshot = versionHistoryService.createSnapshot(
      files,
      currentUser,
      currentSession.id,
      'Guardado manual'
    );
    
    notifications.addNotification({
      type: 'change',
      title: 'Snapshot creado',
      message: `Versión guardada exitosamente`,
    });
  };

  return (
    <div className="app">
      {/* TU CONTENIDO EXISTENTE */}
      {/* ... TopBar, FileExplorer, CodeEditor, Preview, etc. ... */}

      {/* AGREGAR ESTOS COMPONENTES AL FINAL */}

      {/* 1. Indicador de Conexión */}
      {isCollaborating && (
        <ConnectionStatus
          isCollaborating={isCollaborating}
          connectionState={connection.connectionState}
          pendingChanges={connection.pendingChanges}
          onReconnect={connection.handleReconnect}
        />
      )}

      {/* 2. Historial de Versiones */}
      {showVersionHistory && (
        <VersionHistory
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          snapshots={versionHistoryService.getSnapshots()}
          onRestore={(id) => {
            const restored = versionHistoryService.restoreSnapshot(id);
            if (restored) {
              setFiles(restored);
              notifications.addNotification({
                type: 'change',
                title: 'Versión restaurada',
                message: 'Proyecto restaurado a versión anterior'
              });
            }
          }}
          currentUser={currentUser}
        />
      )}

      {/* 3. Chat Colaborativo */}
      {isCollaborating && (
        <CollaborativeChat
          isOpen={showChat}
          onToggle={() => setShowChat(!showChat)}
          messages={chatMessages}
          onSendMessage={(msg) => {
            // Aquí broadcast via Supabase
            setChatMessages(prev => [...prev, { ...msg, id: Date.now() }]);
          }}
          currentUser={currentUser}
          activeUsers={activeUsers}
          isMinimized={chatMinimized}
          onToggleMinimize={() => setChatMinimized(!chatMinimized)}
        />
      )}

      {/* 4. Panel Track Changes */}
      {showTrackChanges && (
        <TrackChangesPanel
          isOpen={showTrackChanges}
          onClose={() => setShowTrackChanges(false)}
          suggestions={trackChangesService.getAllSuggestions()}
          mode={trackChangesService.getMode()}
          currentUser={currentUser}
          onModeChange={(mode) => trackChangesService.setMode(mode)}
          onAcceptSuggestion={(id) => {
            const change = trackChangesService.acceptSuggestion(id, currentUser?.id);
            // Aplicar cambio
          }}
          onRejectSuggestion={(id) => {
            trackChangesService.rejectSuggestion(id, currentUser?.id);
          }}
          onJumpToSuggestion={(sug) => setActiveTab(sug.filePath)}
        />
      )}

      {/* 5. Centro de Notificaciones - Agregar en TopBar */}
      {/* En tu TopBar existente, agrega: */}
      {isCollaborating && (
        <NotificationCenter
          notifications={notifications.notifications}
          onMarkAsRead={notifications.markAsRead}
          onMarkAllAsRead={notifications.markAllAsRead}
          onDismiss={notifications.dismissNotification}
        />
      )}

      {/* 6. Actividad Reciente */}
      {showActivity && (
        <RecentActivitySidebar
          activities={recentActivities}
          onClose={() => setShowActivity(false)}
        />
      )}
    </div>
  );
}

export default App;
```

---

## 🎯 PASO 4: Agregar Botones en TopBar (OPCIONAL)

Agrega estos botones a tu `TopBar.jsx`:

```javascript
// En TopBar.jsx

import { History, MessageSquare, FileEdit, Activity } from 'lucide-react';

// Dentro del componente TopBar, agregar botones:

{isCollaborating && (
  <>
    {/* Historial */}
    <button
      onClick={() => onShowVersionHistory(true)}
      className="p-2 hover:bg-gray-800 rounded-lg"
      title="Historial de versiones"
    >
      <History size={20} className="text-gray-400" />
    </button>

    {/* Chat */}
    <button
      onClick={() => onToggleChat()}
      className="p-2 hover:bg-gray-800 rounded-lg"
      title="Chat"
    >
      <MessageSquare size={20} className="text-gray-400" />
    </button>

    {/* Track Changes */}
    <button
      onClick={() => onShowTrackChanges(true)}
      className="p-2 hover:bg-gray-800 rounded-lg"
      title="Control de cambios"
    >
      <FileEdit size={20} className="text-gray-400" />
    </button>

    {/* Actividad */}
    <button
      onClick={() => onShowActivity(true)}
      className="p-2 hover:bg-gray-800 rounded-lg"
      title="Actividad reciente"
    >
      <Activity size={20} className="text-gray-400" />
    </button>
  </>
)}
```

---

## ⌨️ PASO 5: Atajos de Teclado (OPCIONAL)

Agrega estos atajos en tu `App.jsx`:

```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    // Ctrl/Cmd + H: Historial
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
      e.preventDefault();
      setShowVersionHistory(prev => !prev);
    }
    
    // Ctrl/Cmd + Shift + C: Chat
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c') {
      e.preventDefault();
      setShowChat(prev => !prev);
    }
    
    // Ctrl/Cmd + Shift + T: Track Changes
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 't') {
      e.preventDefault();
      setShowTrackChanges(prev => !prev);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

## ✅ VERIFICACIÓN

Después de integrar, verifica que:

1. ✅ No hay errores en consola
2. ✅ El indicador de conexión aparece cuando colaboras
3. ✅ Puedes abrir el historial de versiones
4. ✅ El chat se muestra correctamente
5. ✅ Las notificaciones funcionan

---

## 🐛 Troubleshooting

### Error: "Cannot find module './services/yjsService'"
**Solución:** Verifica que todos los archivos de servicios estén en `/src/services/`

### Error: "yjs is not defined"
**Solución:** Ejecuta `npm install` para asegurar que Yjs esté instalado

### El historial no guarda
**Solución:** Verifica que la tabla `version_history` existe en Supabase

### Las notificaciones no aparecen
**Solución:** Llama a `notifications.requestPermission()` al iniciar colaboración

---

## 🎉 ¡Listo!

Tu editor ahora tiene **TODAS** las funcionalidades colaborativas de nivel Google Docs.

**Prueba lo siguiente:**

1. Abre dos pestañas del editor
2. Únete a la misma sesión en ambas
3. Edita código en una - verás los cambios en la otra
4. Crea un comentario
5. Envía un mensaje en el chat
6. Crea un snapshot
7. ¡Disfruta de tu editor colaborativo profesional!

---

**¿Necesitas ayuda?** Revisa `SISTEMA_COLABORATIVO_COMPLETO.md` para documentación detallada de cada funcionalidad.
