# 🎯 Solución Simple - Ngrok en 2 Terminales

## ⚡ Método Más Confiable (2 Comandos)

### Terminal 1: Iniciar el Servidor

```bash
npm run dev
```

Espera a que aparezca el puerto (ej: `http://localhost:3000/`)

### Terminal 2: Iniciar Ngrok

```bash
ngrok http 3000
```

(Reemplaza `3000` por el puerto que te mostró Vite)

### 🎉 ¡Listo!

Ngrok te mostrará algo como:

```
Session Status                online
Account                       tu_cuenta (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**📋 Copia la URL:** `https://abc123.ngrok-free.app`

### 🌐 Usar la URL Pública:

1. **Abre la URL de ngrok en tu navegador** (https://abc123.ngrok-free.app)
2. **Click en el botón 👥 Colaboración**
3. **Crea una sesión**
4. **El enlace generado usará automáticamente la URL de ngrok** ✅
5. **Compártelo con tus compañeros**

## ✨ Por Qué Funciona Así:

El código detecta automáticamente si la URL actual es de ngrok:

```javascript
// En collaborationService.js
if (window.location.hostname.includes('ngrok')) {
  // Usar la URL actual (ngrok)
} else {
  // Usar localhost
}
```

**Por eso es importante abrir la URL de ngrok en el navegador, no localhost.**

## 🎬 Ejemplo Completo:

```bash
# Terminal 1
npm run dev
# Output: http://localhost:3000/

# Terminal 2
ngrok http 3000
# Output: https://abc123.ngrok-free.app -> http://localhost:3000

# Navegador
# Abre: https://abc123.ngrok-free.app (NO localhost)
# Crea sesión
# El enlace será: https://abc123.ngrok-free.app?session=...
```

## 💡 Consejos:

- ✅ **Siempre abre la URL de ngrok** (no localhost)
- ✅ **Deja ambas terminales abiertas** mientras colaboras
- ✅ **Comparte la URL de ngrok** con tus compañeros
- ✅ **Los cambios se sincronizan automáticamente**

## 🔄 Para Detener:

1. En la Terminal 2: `Ctrl + C` (detiene ngrok)
2. En la Terminal 1: `Ctrl + C` (detiene Vite)

## 🎯 Ventajas de Este Método:

- ✅ **Más confiable** - Ves exactamente lo que hace ngrok
- ✅ **Más control** - Puedes ver las conexiones en http://127.0.0.1:4040
- ✅ **Más simple** - Sin scripts complicados
- ✅ **Funciona siempre** - No depende de detección automática

---

**¡Así colaborarás sin problemas con tus compañeros!** 🚀✨
