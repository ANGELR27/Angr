# 🚀 Guía Rápida - URL Pública Automática

## 🔧 Primera Vez (Solo una vez)

Si es tu primera vez usando ngrok, necesitas configurarlo (2 minutos):

👉 **[Ver SETUP_NGROK.md](./SETUP_NGROK.md)** - Guía de configuración paso a paso

## ✨ Todo Automatizado en 1 Comando

### Uso Simplificado:

```bash
npm run dev:public
```

**¡ESO ES TODO!** 🎉

El script automáticamente:
1. ✅ Inicia ngrok
2. ✅ Obtiene la URL pública
3. ✅ Inicia el servidor Vite
4. ✅ Configura todo para que funcione

### 📋 Lo que verás:

```
🚀 Iniciando ngrok...

✅ Túnel ngrok creado exitosamente!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 URL Pública: https://abc123.ngrok-free.app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Abre esta URL en tu navegador: https://abc123.ngrok-free.app
🤝 Los enlaces de sesión usarán esta URL automáticamente

🚀 Iniciando servidor Vite...

  VITE v5.4.20  ready in 428 ms

  ➜  Local:   http://localhost:3001/
```

### 🎯 Cómo Funciona:

1. **Abre la URL pública** en tu navegador (la que dice ngrok-free.app)
2. **Crea una sesión** desde el botón 👥
3. **El enlace generado** automáticamente usará la URL pública de ngrok
4. **Comparte el enlace** - ¡funcionará desde cualquier lugar! 🌍

### 📱 Acceso desde Otros Dispositivos:

Ahora cualquiera puede acceder con la URL pública:
- Desde otro PC
- Desde tu celular
- Desde cualquier lugar del mundo
- Sin configuración adicional

### 🛑 Detener el Servidor:

Presiona `Ctrl + C` una sola vez - se cerrarán automáticamente:
- ✅ Servidor Vite
- ✅ Túnel ngrok

### 💡 Comandos Disponibles:

```bash
# Desarrollo local (solo localhost)
npm run dev

# Desarrollo con URL pública (ngrok automático)
npm run dev:public
```

### ⚠️ Nota Importante:

La URL de ngrok cambia cada vez que reinicias el script. Esto es normal en la versión gratuita de ngrok.

Si quieres una URL permanente:
- Desplegar a Vercel/Netlify (gratuito y permanente)
- O usar ngrok Pro (URL fija)

### 🎉 Ventajas:

- ✅ **Cero configuración manual**
- ✅ **Todo automático**
- ✅ **Un solo comando**
- ✅ **Enlaces públicos automáticos**
- ✅ **Perfecto para demos y pruebas**

### 🐛 Solución de Problemas:

**"Error al iniciar ngrok":**
```bash
# Verifica que ngrok esté en PATH
ngrok version

# Si no está instalado:
# Windows: choco install ngrok
# O descarga de: https://ngrok.com/download
```

**"No se pudo obtener la URL de ngrok":**
- Espera 5-10 segundos después de iniciar
- Si persiste, reinicia el comando
- Verifica tu conexión a internet

**El enlace de sesión sigue usando localhost:**
- Asegúrate de abrir la URL pública de ngrok (no localhost)
- Recarga la página después de que aparezca la URL de ngrok
- Crea la sesión desde la URL pública

---

**¡Ahora colaborar es súper simple!** 🚀✨
