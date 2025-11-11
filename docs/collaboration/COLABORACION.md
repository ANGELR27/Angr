# 🤝 Colaboración en Tiempo Real

El editor ahora incluye funcionalidades de **edición colaborativa en tiempo real** estilo Google Docs, permitiendo que múltiples usuarios trabajen juntos en el mismo proyecto.

## ✨ Características

### 🔄 Edición Colaborativa
- **Sincronización en tiempo real** de cambios en archivos
- Los cambios de otros usuarios se reflejan instantáneamente
- Sin conflictos - el último cambio siempre gana
- Historial de ediciones preservado

### 👥 Sesiones Compartidas
- **Crear sesiones públicas o privadas**
- Control de acceso con contraseña opcional
- Compartir mediante enlace directo
- Visualización de usuarios activos en tiempo real

### 🛡️ Control de Acceso
Tres niveles de permisos:

1. **👑 Propietario (Owner)**
   - Control total de la sesión
   - Puede cambiar permisos de otros usuarios
   - Puede cerrar la sesión

2. **✏️ Editor**
   - Puede editar todos los archivos
   - Puede ver cambios de otros usuarios
   - No puede cambiar permisos

3. **👁️ Observador (Viewer)**
   - Solo lectura
   - Ve cambios en tiempo real
   - No puede editar archivos

### 📊 Indicadores Visuales
- **Badge en el botón de colaboración** mostrando usuarios activos
- **Banner flotante** con avatares de usuarios conectados
- **Panel lateral** con lista completa de usuarios y permisos
- **Indicador visual** cuando usuarios están en el mismo archivo

## 🚀 Configuración

### Requisitos Previos

Para usar la colaboración en tiempo real, necesitas configurar **Supabase** (plataforma gratuita):

1. **Crear cuenta en Supabase**
   - Ve a [https://supabase.com](https://supabase.com)
   - Regístrate gratis (no requiere tarjeta de crédito)

2. **Crear un nuevo proyecto**
   - Click en "New Project"
   - Elige un nombre y región
   - Espera 2-3 minutos mientras se crea

3. **Obtener credenciales**
   - Ve a `Settings` → `API`
   - Copia la **Project URL**
   - Copia la **anon/public key**

4. **Configurar el proyecto**
   - Crea un archivo `.env` en la raíz del proyecto
   - Copia el contenido de `.env.example`
   - Reemplaza con tus credenciales reales:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

5. **Reiniciar el servidor**
   ```bash
   npm run dev
   ```

## 📖 Cómo Usar

### Crear una Nueva Sesión

1. Click en el botón **👥 Colaboración** en la barra superior
2. Selecciona **"Crear Nueva Sesión"**
3. Completa el formulario:
   - Tu nombre (requerido)
   - Nombre de la sesión (opcional)
   - Tipo de acceso (público/privado)
   - Contraseña (si es privada)
4. Click en **"Crear Sesión"**
5. ¡Comparte el enlace generado con otros usuarios!

### Unirse a una Sesión Existente

**Opción 1: Con enlace directo**
- Click en el enlace compartido
- Ingresa tu nombre
- Click en "Unirse"

**Opción 2: Con ID de sesión**
1. Click en el botón **👥 Colaboración**
2. Selecciona **"Unirse a Sesión"**
3. Ingresa:
   - Tu nombre
   - ID de la sesión
   - Contraseña (si es requerida)
4. Click en **"Unirse"**

### Gestionar Permisos (Solo Propietarios)

1. Click en el **banner de colaboración** o el **botón 👥**
2. En el panel lateral, verás la lista de usuarios
3. Para cada usuario (excepto tú):
   - Usa el selector para cambiar entre "Editor" y "Observador"
   - Los cambios se aplican instantáneamente

### Salir de una Sesión

1. Abre el **panel de colaboración**
2. Click en **"Salir de la Sesión"** (botón rojo)
3. Confirma la acción

## 🎯 Casos de Uso

### Pair Programming
- Dos desarrolladores trabajando juntos
- Uno edita mientras el otro observa
- Comunicación en tiempo real (vía chat externo)

### Enseñanza/Tutorías
- Profesor con múltiples estudiantes
- Estudiantes en modo "Observador"
- El profesor demuestra en vivo

### Revisión de Código
- Sesión temporal para revisar código
- Varios revisores pueden ver y comentar
- Cambios en vivo durante la revisión

### Trabajo en Equipo
- Múltiples editores trabajando en paralelo
- Cada uno en archivos diferentes
- Sincronización automática

## 🔒 Seguridad y Privacidad

- ✅ **Las credenciales de Supabase son solo tuyas** - no se comparten
- ✅ **Los archivos NO se guardan en Supabase** - solo se transmiten en tiempo real
- ✅ **Sesiones privadas protegidas con contraseña**
- ✅ **Control total sobre permisos de usuarios**
- ⚠️ **No compartas sesiones públicas con código sensible**

## 🛠️ Tecnologías Utilizadas

- **Supabase Realtime** - Sincronización en tiempo real
- **WebSockets** - Comunicación bidireccional
- **React Hooks** - Gestión de estado colaborativo
- **UUID** - Identificadores únicos para sesiones y usuarios

## ⚠️ Limitaciones

- **Máximo de usuarios**: Depende del plan de Supabase (gratis: ~200 conexiones simultáneas)
- **Sin historial persistente**: Los cambios no se guardan en la nube automáticamente
- **Conexión requerida**: Necesitas internet para colaborar
- **Sin chat integrado**: Usa Discord/Slack para comunicación por voz/texto

## 🐛 Solución de Problemas

### "Supabase no está configurado"
- Verifica que el archivo `.env` exista
- Asegúrate de que las variables empiecen con `VITE_`
- Reinicia el servidor de desarrollo

### "Error al conectar"
- Verifica tu conexión a internet
- Confirma que las credenciales de Supabase sean correctas
- Revisa la consola del navegador para más detalles

### "No veo los cambios de otros usuarios"
- Verifica que ambos estén en la misma sesión
- Refresca la página
- Verifica que el otro usuario sea "Editor" (no solo observador)

## 🎨 Personalización

El sistema de colaboración es modular y puede extenderse:

- `src/services/collaborationService.js` - Lógica de sincronización
- `src/hooks/useCollaboration.js` - Hook de React para colaboración
- `src/components/SessionManager.jsx` - UI para gestión de sesiones
- `src/components/CollaborationPanel.jsx` - Panel de usuarios activos
- `src/components/CollaborationBanner.jsx` - Banner de estado

## 📝 Notas Adicionales

- Las sesiones **no expiran automáticamente** - permanecen activas mientras haya usuarios
- El **último usuario en salir** automáticamente cierra la sesión
- Los cambios se **sincronizan instantáneamente** (latencia < 100ms en buena conexión)
- Puedes estar en **solo una sesión a la vez** por pestaña del navegador

## 🚀 Próximas Mejoras

Posibles funcionalidades futuras:
- [ ] Indicadores de cursor en tiempo real
- [ ] Chat integrado
- [ ] Historial de cambios persistente
- [ ] Versionado de archivos
- [ ] Merge de conflictos más inteligente
- [ ] Notificaciones de eventos importantes

---

**¡Disfruta colaborando en tiempo real!** 🎉
