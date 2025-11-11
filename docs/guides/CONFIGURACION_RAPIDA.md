# ⚡ Configuración Rápida del Editor

## 🚀 Inicio Rápido (5 minutos)

### 1. Instalación Básica
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El editor abrirá en `http://localhost:3000` 🎉

---

## 🤝 Configurar Colaboración (Opcional)

Si deseas habilitar la **colaboración en tiempo real**, sigue estos pasos:

### Paso 1: Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto (toma ~2 minutos)
3. Ve a **Project Settings** → **API**
4. Copia tu **Project URL** y **anon/public key**

### Paso 2: Configurar Variables de Entorno
```bash
# Copiar template
cp .env.example .env

# Editar .env con tus credenciales
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Paso 3: Crear Tabla en Supabase (opcional)
Si quieres persistencia en la nube, ejecuta este SQL en Supabase:

```sql
-- Crear tabla para sesiones colaborativas
CREATE TABLE collaboration_sessions (
  session_id TEXT PRIMARY KEY,
  project_state JSONB,
  owner_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer y escribir (ajusta según necesites)
CREATE POLICY "Enable all access for all users" ON collaboration_sessions
  FOR ALL USING (true) WITH CHECK (true);
```

### Paso 4: Reiniciar Servidor
```bash
# Ctrl+C para detener
# Luego reiniciar
npm run dev
```

**¡Listo!** Ahora puedes crear sesiones colaborativas 🎊

---

## 🌐 Compartir Sesión Públicamente

Si quieres que otros accedan desde internet:

### Opción A: Ngrok (Rápido)
```bash
# Instalar ngrok: https://ngrok.com/download
# Luego ejecutar:
npm run dev:public
```

Recibirás una URL pública tipo: `https://abc123.ngrok.io`

### Opción B: Desplegar a Vercel/Netlify
```bash
# Vercel
npm run build
npx vercel --prod

# Netlify
npm run build
npx netlify deploy --prod --dir=dist
```

---

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo local (puerto 3000) |
| `npm run dev:public` | Desarrollo con ngrok (URL pública) |
| `npm run build` | Compilar para producción |
| `npm run preview` | Previsualizar build de producción |

---

## ✅ Verificar que Todo Funciona

1. **Editor básico:** Deberías ver archivos HTML/CSS/JS de ejemplo
2. **Preview:** El panel derecho muestra el resultado en vivo
3. **Terminal:** Ejecuta código JavaScript con el botón "▶️"
4. **Colaboración:** Botón arriba a la derecha (🤝)

---

## 🐛 Solución de Problemas

### El editor no carga
- Verifica que Node.js esté instalado: `node -v`
- Limpia cache: `rm -rf node_modules && npm install`

### La colaboración no funciona
- Verifica que `.env` tenga las credenciales correctas
- Revisa la consola del navegador (F12) para errores
- Asegúrate que Supabase esté configurado correctamente

### Monaco Editor en blanco
- Recarga la página (Ctrl+R)
- Limpia cache del navegador (Ctrl+Shift+Delete)

---

## 📚 Documentación Adicional

- `DIAGNOSTICO_PROBLEMAS_RESUELTOS.md` - Problemas corregidos
- `README.md` - Documentación completa
- Archivos `*.md` en raíz - Guías específicas

---

## 💡 Tips Útiles

### Atajos de Teclado
- `Ctrl+B` - Toggle sidebar
- `Ctrl+Shift+T` - Selector de temas
- `Ctrl+S` - Guardado automático (siempre activo)
- `F1` o `?` - Ver todos los atajos

### Características Cool
- 🎨 **20+ temas** de colores (incluidos VSCode, Monokai, Dracula)
- 🖼️ **Drag & drop** de imágenes al editor
- 📁 **Estructura de carpetas** con arrastrar y soltar
- 🚀 **Autocompletado inteligente** para HTML/CSS/JS
- 👥 **Cursores remotos** en colaboración en vivo

---

## 🎯 Próximos Pasos

Una vez que tengas todo funcionando:
1. ✅ Explora los archivos de ejemplo
2. ✅ Prueba el sistema de colaboración
3. ✅ Personaliza los temas a tu gusto
4. ✅ Comparte tu enlace de sesión con amigos

**¡Disfruta programando!** 🎉
