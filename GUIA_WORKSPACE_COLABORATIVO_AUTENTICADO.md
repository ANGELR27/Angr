# 🚀 Guía: Workspace Colaborativo con Autenticación

## 🎯 Arquitectura Correcta

### ❌ Problema Anterior
```
Usuario A → files_LOCAL_A (localStorage)
Usuario B → files_LOCAL_B (localStorage)
    ↓ Solo broadcasting ❌
Sin fuente única de verdad
```

### ✅ Solución Nueva
```
Usuario A (autenticado)  ┐
Usuario B (autenticado)  ├─→  SUPABASE DATABASE
Usuario C (autenticado)  ┘     (Single Source of Truth)
                              ✅ Todos editan lo mismo
```

---

## 📋 Paso 1: Configurar Supabase Auth

### 1.1 Habilitar Autenticación

1. Ve a tu proyecto de Supabase
2. Menú lateral → **Authentication** → **Providers**
3. Habilita:
   - ✅ **Email** (activado por defecto)
   - ✅ **Google** (opcional, recomendado)
   - ✅ **GitHub** (opcional, recomendado)

### 1.2 Configurar Google OAuth (Opcional)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita "Google+ API"
4. Credenciales → Crear credenciales → ID de cliente OAuth 2.0
5. **Orígenes autorizados**:
   ```
   http://localhost:3001
   https://tu-dominio.com
   ```
6. **URIs de redirección autorizadas**:
   ```
   https://tu-proyecto.supabase.co/auth/v1/callback
   ```
7. Copia **Client ID** y **Client Secret**
8. Pégalos en Supabase → Authentication → Providers → Google

### 1.3 Configurar GitHub OAuth (Opcional)

1. Ve a GitHub → Settings → Developer settings → OAuth Apps
2. New OAuth App
3. **Homepage URL**: `http://localhost:3001`
4. **Authorization callback URL**: 
   ```
   https://tu-proyecto.supabase.co/auth/v1/callback
   ```
5. Copia **Client ID** y **Client Secret**
6. Pégalos en Supabase → Authentication → Providers → GitHub

---

## 📋 Paso 2: Crear Esquema de Base de Datos

### 2.1 Ejecutar SQL

1. Abre Supabase → **SQL Editor**
2. Copia el contenido de `supabase-workspace-schema.sql`
3. Clic en **Run** o `Ctrl + Enter`

Esto creará:
- ✅ `collaborative_sessions` - Sesiones compartidas
- ✅ `session_participants` - Usuarios conectados
- ✅ `workspace_files` - Archivos remotos (SINGLE SOURCE OF TRUTH)
- ✅ `file_changes_log` - Historial de cambios
- ✅ `cursor_positions` - Posiciones de cursores
- ✅ Row Level Security (RLS) - Seguridad
- ✅ Triggers automáticos

### 2.2 Verificar Tablas Creadas

```sql
-- En SQL Editor de Supabase
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver las 5 tablas creadas.

---

## 📋 Paso 3: Actualizar Variables de Entorno

### 3.1 Archivo `.env`

```env
# Supabase (existente)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Nuevas variables para Auth (opcional)
VITE_GOOGLE_CLIENT_ID=tu-google-client-id
VITE_GITHUB_CLIENT_ID=tu-github-client-id
```

---

## 📋 Paso 4: Implementar Autenticación en el Código

### 4.1 Crear Servicio de Autenticación

Crea `src/services/authService.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class AuthService {
  // Login con email/password
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }

  // Signup con email/password
  async signup(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    });
    
    if (error) throw error;
    return data;
  }

  // Login con proveedor social (Google, GitHub)
  async loginWithProvider(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) throw error;
    return data;
  }

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Escuchar cambios de autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChanged(callback);
  }
}

export const authService = new AuthService();
export default authService;
```

### 4.2 Hook de Autenticación

Crea `src/hooks/useAuth.js`:

```javascript
import { useState, useEffect } from 'react';
import authService from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario inicial
    authService.getCurrentUser().then(user => {
      setUser(user);
      setLoading(false);
    });

    // Escuchar cambios
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { user } = await authService.login(email, password);
    setUser(user);
  };

  const signup = async (email, password, displayName) => {
    const { user } = await authService.signup(email, password, displayName);
    setUser(user);
  };

  const loginWithProvider = async (provider) => {
    await authService.loginWithProvider(provider);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    loginWithProvider,
    logout
  };
}
```

### 4.3 Integrar en App.jsx

```javascript
import { useAuth } from './hooks/useAuth';
import AuthModal from './components/AuthModal';

function App() {
  const { user, loading, isAuthenticated, login, signup, loginWithProvider, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // ... resto del código

  // Modificar handleCreateSession
  const handleCreateSession = async () => {
    // ✅ VERIFICAR AUTENTICACIÓN PRIMERO
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Continuar con creación de sesión...
    setShowSessionManager(true);
  };

  return (
    <>
      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={async (authData) => {
          if (authData.mode === 'login') {
            await login(authData.email, authData.password);
          } else if (authData.mode === 'signup') {
            await signup(authData.email, authData.password, authData.displayName);
          } else if (authData.mode === 'social') {
            await loginWithProvider(authData.provider);
          }
        }}
      />

      {/* Resto de la app... */}
    </>
  );
}
```

---

## 📋 Paso 5: Modificar CollaborationService

### 5.1 Actualizar Métodos

```javascript
// En src/services/collaborationService.js

class CollaborationService {
  // ... código existente

  // 🔥 NUEVO: Crear sesión con archivos en DATABASE
  async createSession(sessionData) {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('Debes iniciar sesión primero');

    const sessionCode = this.generateSessionCode();

    // 1. Crear sesión en database
    const { data: session, error: sessionError } = await this.supabase
      .from('collaborative_sessions')
      .insert({
        session_code: sessionCode,
        session_name: sessionData.sessionName,
        owner_user_id: user.id,
        owner_name: user.user_metadata?.display_name || user.email,
        access_control: sessionData.accessControl,
        password_hash: sessionData.password ? await this.hashPassword(sessionData.password) : null
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // 2. Agregar owner como participante
    await this.supabase
      .from('session_participants')
      .insert({
        session_id: session.id,
        user_id: user.id,
        user_name: user.user_metadata?.display_name || user.email,
        user_email: user.email,
        user_color: this.getRandomColor(),
        role: 'owner'
      });

    // 3. 🔥 Guardar archivos en DATABASE (no localStorage)
    if (sessionData.files) {
      const filesArray = Object.entries(sessionData.files).map(([path, file]) => ({
        session_id: session.id,
        file_path: path,
        content: file.content,
        language: file.language,
        file_type: file.type,
        last_modified_by: user.id,
        last_modified_by_name: user.user_metadata?.display_name || user.email
      }));

      await this.supabase
        .from('workspace_files')
        .insert(filesArray);
    }

    // 4. Conectar al canal Realtime
    await this.connectToChannel(session.id);

    return {
      sessionId: sessionCode,
      shareLink: `${window.location.origin}?session=${sessionCode}`
    };
  }

  // 🔥 NUEVO: Unirse a sesión con auth
  async joinSession(sessionCode, userData) {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('Debes iniciar sesión primero');

    // 1. Buscar sesión
    const { data: session, error } = await this.supabase
      .from('collaborative_sessions')
      .select('*')
      .eq('session_code', sessionCode)
      .eq('is_active', true)
      .single();

    if (error || !session) throw new Error('Sesión no encontrada');

    // 2. Verificar contraseña si es privada
    if (session.access_control === 'private' && userData.password) {
      const isValid = await this.verifyPassword(userData.password, session.password_hash);
      if (!isValid) throw new Error('Contraseña incorrecta');
    }

    // 3. Agregar como participante
    await this.supabase
      .from('session_participants')
      .insert({
        session_id: session.id,
        user_id: user.id,
        user_name: user.user_metadata?.display_name || user.email,
        user_email: user.email,
        user_color: this.getRandomColor(),
        role: 'editor'
      });

    // 4. Cargar archivos desde DATABASE
    const { data: files } = await this.supabase
      .from('workspace_files')
      .select('*')
      .eq('session_id', session.id);

    // 5. Convertir a formato local
    const filesObject = {};
    files.forEach(file => {
      filesObject[file.file_path] = {
        name: file.file_path.split('/').pop(),
        type: file.file_type,
        language: file.language,
        content: file.content
      };
    });

    // 6. Conectar al canal
    await this.connectToChannel(session.id);

    return { files: filesObject };
  }

  // 🔥 NUEVO: Guardar cambio en DATABASE
  async broadcastFileChange(filePath, content, cursorPosition, version) {
    const user = await authService.getCurrentUser();
    if (!user) return;

    // 1. Actualizar en DATABASE
    const { error } = await this.supabase
      .from('workspace_files')
      .upsert({
        session_id: this.currentSession.id,
        file_path: filePath,
        content: content,
        version: version,
        last_modified_by: user.id,
        last_modified_by_name: user.user_metadata?.display_name || user.email,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'session_id,file_path'
      });

    if (error) console.error('Error al guardar en DB:', error);

    // 2. Broadcast a otros usuarios
    await this.channel.send({
      type: 'broadcast',
      event: 'file-change',
      payload: {
        userId: user.id,
        userName: user.user_metadata?.display_name || user.email,
        filePath,
        content,
        version,
        timestamp: Date.now()
      }
    });
  }
}
```

---

## 🎯 Flujo Completo

### Usuario A (Owner) Crea Sesión

```
1. Clic en "Colaborar"
   ↓
2. ¿Autenticado?
   ❌ → Mostrar AuthModal → Login/Signup
   ✅ → Continuar
   ↓
3. Modal "Crear Sesión"
   ↓
4. createSession()
   ├─ INSERT en collaborative_sessions
   ├─ INSERT en session_participants (owner)
   ├─ INSERT en workspace_files (todos los archivos)
   └─ Conectar a canal Realtime
   ↓
5. ✅ Sesión creada - Compartir link
```

### Usuario B Se Une

```
1. Abre link: ?session=76ec5
   ↓
2. ¿Autenticado?
   ❌ → Mostrar AuthModal → Login/Signup
   ✅ → Continuar
   ↓
3. joinSession('76ec5')
   ├─ SELECT collaborative_sessions
   ├─ Verificar contraseña (si privada)
   ├─ INSERT en session_participants
   ├─ SELECT workspace_files (cargar desde DB)
   └─ Conectar a canal Realtime
   ↓
4. ✅ Archivos cargados desde DATABASE
5. ✅ Editor sincronizado con Usuario A
```

### Edición en Tiempo Real

```
Usuario A escribe "H"
   ↓
broadcastFileChange()
   ├─ UPDATE workspace_files (DATABASE) ✅
   └─ Broadcast event a Supabase Realtime
       ↓
Usuario B recibe broadcast
   ↓
SELECT workspace_files (DATABASE) ✅
   ↓
Aplicar contenido al editor
   ↓
✅ Usuario B ve "H" inmediatamente
```

---

## ✅ Beneficios del Nuevo Sistema

| Característica | Antes (Broadcasting) | Ahora (Database) |
|----------------|---------------------|------------------|
| Fuente de verdad | ❌ Múltiples (localStorage) | ✅ Una (Supabase DB) |
| Persistencia | ❌ Solo local | ✅ Servidor |
| Autenticación | ❌ No | ✅ Obligatoria |
| Seguridad | ❌ Básica | ✅ RLS + Auth |
| Sincronización | ❌ Broadcast | ✅ DB + Realtime |
| Historial | ❌ No | ✅ Sí (file_changes_log) |
| Offline | ❌ Desincronizado | ✅ Se sincroniza al reconectar |
| Conflictos | ❌ Posibles | ✅ Versionado optimista |

---

## 🧪 Pruebas

### Prueba 1: Autenticación

1. Usuario A: Clic en "Colaborar"
2. Modal de login aparece
3. Signup con email/password
4. ✅ Redirige a crear sesión

### Prueba 2: Crear Sesión

1. Crear sesión "Proyecto X"
2. Verificar en Supabase → Table Editor → collaborative_sessions
3. ✅ Sesión creada con archivos en workspace_files

### Prueba 3: Unirse

1. Usuario B: Pegar link
2. Login (o signup)
3. ✅ Archivos cargados desde DATABASE
4. ✅ Mismo contenido que Usuario A

### Prueba 4: Edición Simultánea

1. Usuario A escribe "Hola"
2. ✅ Se guarda en workspace_files
3. ✅ Usuario B lo ve inmediatamente
4. Usuario B escribe "Mundo"
5. ✅ Usuario A lo ve
6. ✅ Ambos ven "Hola Mundo"

---

## 🎉 Resumen

**Arquitectura Anterior**:
- ❌ localStorage individual
- ❌ Solo broadcasting
- ❌ Sin autenticación
- ❌ Sin persistencia

**Arquitectura Nueva**:
- ✅ Single Source of Truth (Supabase DB)
- ✅ Autenticación obligatoria
- ✅ Persistencia en servidor
- ✅ Historial de cambios
- ✅ Seguridad con RLS
- ✅ Versionado optimista

**Tu hipótesis era 100% correcta** 🎯

Con este sistema, todos los usuarios editan **exactamente los mismos archivos** almacenados en la base de datos, como Google Docs.
