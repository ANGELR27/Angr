# 🧪 Guía de Prueba: Cursores Remotos y Edición Colaborativa

## ⚡ Prueba Rápida (5 minutos)

### Paso 1: Iniciar el servidor
```bash
npm run dev
```

### Paso 2: Abrir dos ventanas del navegador

**Ventana 1** (Usuario Creador):
1. Abre `http://localhost:3001` (o tu puerto)
2. Haz clic en el botón **"Colaborar"** en la barra superior
3. Selecciona **"Crear Sesión"**
4. Ingresa tu nombre (ej: "Juan")
5. Dale nombre a la sesión (ej: "Mi Proyecto")
6. Clic en **"Crear Sesión"**
7. **Copia el enlace** que aparece

**Ventana 2** (Usuario que se une):
1. **Pega el enlace copiado** en la barra de direcciones
2. Ingresa tu nombre (ej: "María")
3. Clic en **"Unirse"**

---

## 👀 Qué Deberías Ver

### En Ambas Ventanas:

✅ **Banner de colaboración** en la parte superior mostrando:
   - Nombre de la sesión
   - Número de usuarios conectados

✅ **Panel lateral derecho** con:
   - Lista de usuarios activos
   - Colores asignados a cada uno
   - Roles (Owner, Editor, Viewer)

---

## ✍️ Prueba de Escritura

### En la Ventana 1 (Juan):
1. Abre el archivo `index.html`
2. **Escribe algo**, por ejemplo: `<!-- Hola desde Juan -->`
3. Espera 150ms

### En la Ventana 2 (María):
**Observa que:**
- ✅ El texto aparece **instantáneamente**
- ✅ Ves un **cursor con el nombre "Juan"** en la posición donde escribió
- ✅ Aparece un indicador **"Juan está escribiendo..."** en la esquina inferior izquierda

### En la Ventana 2 (María):
1. Ahora **tú escribe algo**: `<!-- Hola desde María -->`

### En la Ventana 1 (Juan):
**Observa que:**
- ✅ El texto aparece **automáticamente**
- ✅ Ves un **cursor con el nombre "María"** con un color diferente
- ✅ Aparece **"María está escribiendo..."** mientras tecleas

---

## 🎯 Prueba de Cursores

### Movimiento del Cursor:

1. En **Ventana 1**: Mueve el cursor con las flechas del teclado
2. En **Ventana 2**: Deberías ver el cursor de Juan moverse en tiempo real

### Múltiples Cursores:
- Ambos usuarios pueden **mover sus cursores** al mismo tiempo
- Cada cursor tiene su **propio color**
- Las **etiquetas flotantes** muestran el nombre

---

## 📝 Prueba de Selección

### Seleccionar Texto:

1. En **Ventana 1**: Selecciona un bloque de texto (arrastra con el mouse)
2. En **Ventana 2**: Deberías ver:
   - ✅ El texto seleccionado **resaltado** con el color de Juan
   - ✅ Un **borde sutil** alrededor de la selección

### Selecciones Múltiples:
- Ambos usuarios pueden **seleccionar texto** simultáneamente
- Cada selección tiene su **propio color**
- Las selecciones **no interfieren** entre sí

---

## 🎨 Verificación Visual

### Colores de Usuario:
Deberías ver **colores diferentes** para cada usuario, como:
- 🔴 Rojo (#FF6B6B)
- 🔵 Azul (#45B7D1)
- 🟢 Turquesa (#4ECDC4)
- 🟡 Amarillo (#F7DC6F)
- 🟣 Morado (#BB8FCE)

### Etiquetas de Cursor:
```
┌─────────┐
│  Juan   │ ← Etiqueta flotante
└────┬────┘
     │      ← Línea del cursor (parpadeante)
```

### Indicador de Escritura:
```
┌────────────────────────────────┐
│ Juan está escribiendo... ● ● ● │ ← Esquina inferior izquierda
└────────────────────────────────┘
```

---

## 🔥 Pruebas Avanzadas

### Prueba 1: Edición Simultánea
1. Ambos usuarios escriben **al mismo tiempo**
2. Los cambios deberían **mezclarse correctamente**
3. No debería haber **conflictos ni pérdida de datos**

### Prueba 2: Múltiples Archivos
1. Usuario 1 edita `index.html`
2. Usuario 2 edita `styles.css`
3. Ambos deberían ver **solo el cursor en su archivo activo**
4. Los cursores **no aparecen** en archivos diferentes

### Prueba 3: Cambio de Archivo
1. Usuario 1 está en `index.html`
2. Usuario 2 también abre `index.html`
3. Deberían verse los **cursores mutuamente**
4. Usuario 2 cambia a `script.js`
5. El cursor de Usuario 2 **desaparece** para Usuario 1

### Prueba 4: Reconexión
1. Usuario 2 **cierra y reabre** el navegador
2. Ingresa **el mismo enlace**
3. La sesión debería **restaurarse automáticamente**
4. Los cursores deberían **reaparecer**

---

## 🐛 Troubleshooting

### "No veo el cursor del otro usuario"
**Soluciones:**
1. Asegúrate de que ambos están en el **mismo archivo**
2. Verifica que el otro usuario esté **escribiendo o moviendo el cursor**
3. Abre DevTools (F12) y busca errores en la consola
4. Verifica que Supabase esté configurado (archivo `.env`)

### "El indicador de escritura no aparece"
**Soluciones:**
1. Espera **150ms** después de escribir
2. Verifica que el otro usuario esté en el **mismo archivo**
3. Refresca la página (F5)

### "Los cambios no se sincronizan"
**Soluciones:**
1. Verifica tu archivo `.env`:
   ```
   VITE_SUPABASE_URL=tu-url-aqui
   VITE_SUPABASE_ANON_KEY=tu-key-aqui
   ```
2. Reinicia el servidor: `Ctrl+C` luego `npm run dev`
3. Verifica conexión a Internet

### "Los colores son todos iguales"
**No es un error:** Los colores se asignan aleatoriamente. Si hay pocos usuarios, pueden coincidir. Recarga la página para obtener colores diferentes.

---

## 📊 Checklist de Funcionalidades

Marca lo que funciona correctamente:

**Cursores:**
- [ ] Veo el cursor del otro usuario
- [ ] El cursor se mueve en tiempo real
- [ ] La etiqueta muestra el nombre correcto
- [ ] El cursor parpadea sutilmente
- [ ] Desaparece cuando el usuario cambia de archivo

**Selecciones:**
- [ ] Veo la selección del otro usuario resaltada
- [ ] El color de la selección es correcto
- [ ] Múltiples selecciones no interfieren

**Escritura:**
- [ ] Los cambios aparecen instantáneamente
- [ ] El indicador "escribiendo" funciona
- [ ] Los puntos animados se ven bien
- [ ] Desaparece después de 2 segundos sin actividad

**Sincronización:**
- [ ] Múltiples usuarios pueden escribir simultáneamente
- [ ] No hay pérdida de datos
- [ ] No hay bucles infinitos de actualización
- [ ] La posición del cursor se preserva

**UI/UX:**
- [ ] Los colores son distinguibles
- [ ] Las etiquetas son legibles
- [ ] Los indicadores no obstruyen el código
- [ ] La experiencia es fluida (sin lag)

---

## 🎯 Objetivo Final

Cuando todo funcione correctamente, deberías poder:

✅ **Ver cursores** de todos los usuarios en tiempo real
✅ **Ver selecciones** de texto con colores únicos
✅ **Ver quién está escribiendo** con el indicador flotante
✅ **Editar simultáneamente** sin conflictos
✅ **Cambiar entre archivos** y ver cursores solo en el archivo activo

---

## 📸 Captura de Pantalla Esperada

```
┌─────────────────────────────────────────────────────────┐
│ [≡] Mi Editor - Sesión: Mi Proyecto    👥 2 usuarios   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1  <!DOCTYPE html>                                     │
│  2  <html>              ┌──────┐                       │
│  3    <head>            │ María│ ← Cursor de María     │
│  4      <title>...</    └──┬───┘                       │
│  5    </head>              │                           │
│  6    <body>              │                            │
│  7      <!-- Juan está aquí -->                        │
│  8                    ┌─────┐                          │
│  9      <div>         │ Juan│ ← Cursor de Juan        │
│ 10                    └──┬──┘                          │
│                                                         │
│  [María está escribiendo... ● ● ●]  ← Indicador       │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Tips

- **Usa dos navegadores diferentes** (Chrome y Edge) para evitar compartir sesiones
- **Abre DevTools** para ver logs de sincronización en tiempo real
- **Prueba con 3+ usuarios** para ver todos los colores y cursores
- **Usa ngrok** para probar con amigos remotamente

---

¡Disfruta tu editor colaborativo! 🎉
