# 🚀 Inicio Rápido - Colaboración

## ⚡ Configuración en 5 Minutos

### Paso 1: Crear Cuenta en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Click en **"Start your project"**
3. Regístrate con GitHub, Google o email
4. ✅ **Gratis, sin tarjeta de crédito**

### Paso 2: Crear Proyecto
1. Click en **"New Project"**
2. Completa:
   - **Name:** `mi-editor-codigo` (o el que quieras)
   - **Database Password:** Crea una contraseña fuerte
   - **Region:** Elige la más cercana a ti
3. Click en **"Create new project"**
4. ⏳ Espera 2-3 minutos mientras se crea

### Paso 3: Obtener Credenciales
1. En el dashboard de tu proyecto, ve a **Settings** (⚙️ en la barra lateral)
2. Click en **API**
3. Copia estos dos valores:
   - 📋 **Project URL** (ej: `https://abc123.supabase.co`)
   - 📋 **anon/public key** (string largo que empieza con `eyJ...`)

### Paso 4: Configurar el Editor
1. En la carpeta raíz del proyecto, crea un archivo llamado `.env`
2. Pega este contenido (reemplaza con tus valores reales):

```env
VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Guarda el archivo

### Paso 5: Reiniciar Servidor
```bash
# Detén el servidor (Ctrl+C)
# Reinicia
npm run dev
```

## ✅ ¡Listo!

El botón de colaboración (👥) ahora estará activo en la barra superior.

## 🎯 Probar la Colaboración

### Crear una Sesión:
1. Click en el botón **👥** en la barra superior
2. Click en **"Crear Nueva Sesión"**
3. Ingresa tu nombre
4. Elige tipo de acceso (Público/Privado)
5. Click en **"Crear Sesión"**
6. 📋 Copia el enlace y compártelo

### Unirse a una Sesión:
1. Abre el enlace compartido en otra pestaña/navegador
2. Ingresa tu nombre
3. Click en **"Unirse"**
4. ¡Ahora pueden editar juntos en tiempo real! ✨

## 🎨 Probar en Modo Local (Sin Segundo Usuario)

1. Abre el editor en `http://localhost:3001`
2. Crea una sesión
3. Copia el enlace de sesión
4. Abre una ventana de incógnito en el navegador
5. Pega el enlace
6. Únete con otro nombre
7. Edita en una ventana y verás los cambios en la otra ⚡

## 📱 Probar con Otro Dispositivo

1. Encuentra tu IP local:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. En tu celular/tablet, ve a:
   ```
   http://TU_IP:3001?session=ID_DE_SESION
   ```

3. ¡Edita desde tu celular y verás los cambios en tu PC!

## ❓ ¿Problemas?

### "Supabase no está configurado"
- ✅ Verifica que el archivo `.env` esté en la raíz del proyecto
- ✅ Asegúrate de que las variables empiecen con `VITE_`
- ✅ Reinicia el servidor con `npm run dev`

### No veo el botón de colaboración
- ✅ Verifica que estés en modo normal (no "Lite")
- ✅ Revisa la consola del navegador por errores
- ✅ Confirma que las credenciales sean correctas

### Los cambios no se sincronizan
- ✅ Ambos usuarios deben estar en la misma sesión
- ✅ Verifica tu conexión a internet
- ✅ Asegúrate de que el otro usuario sea "Editor" (no solo observador)

## 📚 Documentación Completa

- 📖 [COLABORACION.md](./COLABORACION.md) - Guía completa con todas las funcionalidades
- 📋 [FUNCIONALIDADES_COLABORATIVAS.md](./FUNCIONALIDADES_COLABORATIVAS.md) - Resumen técnico

## 🎉 ¡Disfruta Colaborando!

Ahora puedes:
- 👥 Pair programming en tiempo real
- 📚 Enseñar/aprender código en vivo
- 🔍 Revisar código colaborativamente
- 🚀 Trabajar en equipo desde cualquier lugar

---

**Tiempo estimado de configuración:** 5-10 minutos
**Costo:** Gratis 💰
**Dificultad:** Fácil ⭐
