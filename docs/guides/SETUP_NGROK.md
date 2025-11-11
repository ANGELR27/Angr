# 🔧 Configuración de ngrok (Una Sola Vez)

## 📋 Pasos Rápidos

### 1. Crear Cuenta en ngrok (Gratis)

Ve a: **https://dashboard.ngrok.com/signup**

- Regístrate con Google/GitHub (más rápido)
- O con email
- **100% gratis, sin tarjeta de crédito**

### 2. Obtener tu Authtoken

Después de registrarte:

1. Ve a: **https://dashboard.ngrok.com/get-started/your-authtoken**
2. Verás un token como: `2abc123def456ghi789jkl0`
3. Click en **"Copy"** para copiarlo

### 3. Configurar ngrok (En tu terminal)

```bash
ngrok config add-authtoken TU_TOKEN_AQUI
```

**Ejemplo:**
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl0
```

✅ Verás: `Authtoken saved to configuration file`

### 4. ¡Listo! Ahora ejecuta:

```bash
npm run dev:public
```

## 🎉 ¡Todo Automático!

Ahora cada vez que ejecutes `npm run dev:public`:
- ✅ ngrok se iniciará automáticamente
- ✅ Obtendrás una URL pública
- ✅ Los enlaces de sesión usarán esa URL
- ✅ Cero configuración adicional

## 📱 Cómo Usar:

1. Ejecuta: `npm run dev:public`
2. Espera a ver la URL pública (ej: `https://abc123.ngrok-free.app`)
3. **Abre esa URL en tu navegador** (no localhost)
4. Crea una sesión desde el botón 👥
5. El enlace generado será público automáticamente
6. ¡Compártelo con quien quieras!

## 🌍 Beneficios:

- ✅ **Acceso desde cualquier dispositivo**
- ✅ **Compartir con colaboradores**
- ✅ **Demos en vivo**
- ✅ **Pruebas en móviles**
- ✅ **Pair programming remoto**

## ⚠️ Notas:

### URL Temporal:
La URL de ngrok cambia cada vez que reinicias. Esto es normal en la versión gratuita.

**Si quieres URL permanente:**
- Opción 1: Desplegar a Vercel/Netlify (gratis y permanente)
- Opción 2: ngrok Pro ($8/mes) - URL fija

### Límites Gratis de ngrok:
- ✅ 1 proceso simultáneo
- ✅ 40 conexiones/minuto
- ✅ Sin límite de tiempo
- ✅ Perfecto para desarrollo y demos

## 🆚 Comparación de Opciones:

| Opción | Pros | Contras | Costo |
|--------|------|---------|-------|
| **npm run dev** | Simple, rápido | Solo localhost | Gratis |
| **npm run dev:public** | URL pública, fácil | URL cambia al reiniciar | Gratis |
| **Desplegar (Vercel)** | URL permanente | Requiere despliegue | Gratis |
| **ngrok Pro** | URL fija, sin límites | - | $8/mes |

## 💡 Recomendación:

- **Desarrollo solo:** `npm run dev`
- **Colaboración/Demos:** `npm run dev:public`
- **Producción:** Desplegar a Vercel/Netlify

## 🐛 Problemas Comunes:

### "command not found: ngrok"
```bash
# Verifica instalación:
ngrok version

# Si no está instalado, descarga de:
# https://ngrok.com/download
```

### "authtoken not found"
```bash
# Configura el token:
ngrok config add-authtoken TU_TOKEN
```

### "address already in use"
```bash
# Detén el servidor anterior (Ctrl+C)
# O usa otro puerto
```

---

**¡Configuración de 2 minutos para colaboración ilimitada!** 🚀✨
