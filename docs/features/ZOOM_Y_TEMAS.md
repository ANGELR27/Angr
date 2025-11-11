# 🎨 Zoom y Temas - Guía Completa

## ⚡ Nuevas Características

### **1. 🔍 Zoom en el Editor**
Control total del tamaño del texto sin botones, solo con atajos de teclado.

### **2. 🎨 Selector de Temas**
Menú oculto con 10 temas profesionales que se activa con Windows + T.

---

## 🔍 Zoom en el Editor

### **Atajos de Teclado:**

| Atajo | Acción | Rango |
|-------|--------|-------|
| `Ctrl` + `+` (más) | Aumentar tamaño | 10px - 32px |
| `Ctrl` + `-` (menos) | Disminuir tamaño | 10px - 32px |
| `Ctrl` + `0` (cero) | Resetear a 14px | Tamaño por defecto |

### **Cómo usar:**
1. **Aumentar zoom**: Mantén `Ctrl` y presiona `+`
2. **Disminuir zoom**: Mantén `Ctrl` y presiona `-`
3. **Resetear**: Mantén `Ctrl` y presiona `0`

### **Características:**
✅ Zoom incremental de 2px por paso
✅ Límite mínimo: 10px
✅ Límite máximo: 32px
✅ Tamaño por defecto: 14px
✅ Sin interferir con zoom del navegador
✅ Funciona en todos los archivos

### **Ejemplos:**
```
Tamaño inicial: 14px
Ctrl + + → 16px
Ctrl + + → 18px
Ctrl + + → 20px
...
Ctrl + 0 → 14px (reset)
```

---

## 🎨 Selector de Temas

### **Activación:**
```
Windows + T  (o Meta + T en Mac)
```

**Características del menú:**
✅ Se activa con atajo de teclado
✅ Sin botones visuales permanentes
✅ Menú modal elegante
✅ 10 temas profesionales
✅ Preview de colores
✅ Indicador de tema activo
✅ Cerrar con ESC

### **Cómo usar:**
1. Presiona `Windows` + `T`
2. Ve el menú de temas
3. Click en un tema para aplicarlo
4. El menú se cierra automáticamente
5. O presiona `ESC` para cancelar

---

## 🎨 Temas Disponibles

### **1. VS Dark (Por defecto)**
- 🎨 **Colores**: Azul oscuro
- 📝 **Descripción**: Tema oscuro por defecto
- ⚡ **Ideal para**: Uso general

### **2. VS Light**
- 🎨 **Colores**: Claro y limpio
- 📝 **Descripción**: Tema claro
- ⚡ **Ideal para**: Ambientes luminosos

### **3. High Contrast**
- 🎨 **Colores**: Negro con alto contraste
- 📝 **Descripción**: Alto contraste
- ⚡ **Ideal para**: Accesibilidad

### **4. Matrix** 🟢
- 🎨 **Colores**: Verde neón sobre negro
- 📝 **Descripción**: Estilo Matrix verde
- ⚡ **Ideal para**: Fans de Matrix

**Preview:**
```javascript
// Colores verdes brillantes
const matrix = 'green'; // Verde neón
console.log('Wake up, Neo...'); // Verde brillante
```

### **5. Tokyo Night** 🌃
- 🎨 **Colores**: Púrpura, azul, cyan
- 📝 **Descripción**: Tokyo Night oscuro
- ⚡ **Ideal para**: Trabajo nocturno

**Preview:**
```javascript
// Tonos tokyo night
const night = 'purple'; // Púrpura
console.log('Tokyo vibes'); // Cyan
```

### **6. Dracula** 🧛
- 🎨 **Colores**: Púrpura, rosa, cyan, amarillo
- 📝 **Descripción**: Tema Dracula
- ⚡ **Ideal para**: Contraste vibrante

**Preview:**
```javascript
// Dracula colors
const dracula = 'purple'; // Púrpura
console.log('Count Dracula'); // Amarillo
```

### **7. Monokai** 🎭
- 🎨 **Colores**: Amarillo, rosa, verde, cyan
- 📝 **Descripción**: Tema Monokai
- ⚡ **Ideal para**: Desarrolladores clásicos

**Preview:**
```javascript
// Monokai style
const monokai = 'yellow'; // Amarillo
console.log('Classic theme'); // Verde
```

### **8. GitHub Dark** 🐙
- 🎨 **Colores**: Azul, naranja, púrpura
- 📝 **Descripción**: GitHub oscuro
- ⚡ **Ideal para**: Fans de GitHub

**Preview:**
```javascript
// GitHub dark colors
const github = 'blue'; // Azul
console.log('Octocat approved'); // Naranja
```

### **9. Cobalt 2** 💎
- 🎨 **Colores**: Azul profundo, naranja, verde
- 📝 **Descripción**: Tema Cobalt azul
- ⚡ **Ideal para**: Alto contraste azul

**Preview:**
```javascript
// Cobalt colors
const cobalt = 'blue'; // Azul profundo
console.log('Deep blue'); // Verde brillante
```

### **10. Nord** ❄️
- 🎨 **Colores**: Azul ártico, teal, cyan
- 📝 **Descripción**: Tema Nord ártico
- ⚡ **Ideal para**: Tonos fríos

**Preview:**
```javascript
// Nord palette
const nord = 'arctic'; // Azul ártico
console.log('Cold vibes'); // Cyan
```

---

## 🎯 Uso del Menú de Temas

### **Interfaz del menú:**
```
┌────────────────────────────────────┐
│ 🎨 Selector de Temas          [✕]  │
├────────────────────────────────────┤
│ Win + T para abrir/cerrar         │
├────────────────────────────────────┤
│                                    │
│  ┌──────────┐  ┌──────────┐      │
│  │ VS Dark  │  │ VS Light │      │
│  │ Activo ✓ │  │          │      │
│  │ ▰▰▰▰▰▰▰ │  │ ▱▱▱▱▱▱▱ │      │
│  └──────────┘  └──────────┘      │
│                                    │
│  ┌──────────┐  ┌──────────┐      │
│  │ Matrix   │  │ Tokyo N. │      │
│  │          │  │          │      │
│  │ ▰▰▰▰▰▰▰ │  │ ▰▰▰▰▰▰▰ │      │
│  └──────────┘  └──────────┘      │
│                                    │
├────────────────────────────────────┤
│ Tema: VS Dark        ESC: cerrar  │
└────────────────────────────────────┘
```

### **Elementos visuales:**
✅ **Tarjetas de tema**: Grid de 2 columnas
✅ **Nombre del tema**: Título destacado
✅ **Descripción**: Breve explicación
✅ **Badge "Activo"**: En tema seleccionado
✅ **Preview bar**: Barra de colores representativa
✅ **Border azul**: En tema activo
✅ **Hover effect**: Al pasar el mouse

---

## 🧪 Pruebas Rápidas

### **Test 1: Zoom**
```
1. En el editor
2. Ctrl + + (3 veces)
3. ¿Texto más grande? ✅
4. Ctrl + 0
5. ¿Vuelve a 14px? ✅
```

### **Test 2: Tema Matrix**
```
1. Windows + T
2. ¿Aparece menú? ✅
3. Click en "Matrix"
4. ¿Colores verdes? ✅
5. ¿Menú se cierra? ✅
```

### **Test 3: Cambio de temas**
```
1. Win + T
2. Selecciona "Dracula"
3. Win + T otra vez
4. Selecciona "Tokyo Night"
5. ¿Cambia inmediatamente? ✅
```

### **Test 4: Cerrar con ESC**
```
1. Win + T
2. ¿Menú abierto? ✅
3. Presiona ESC
4. ¿Menú se cierra? ✅
```

---

## 💡 Tips de Uso

### **Tip 1: Combinar Zoom y Temas**
```
1. Selecciona tu tema favorito (Win + T)
2. Ajusta el zoom (Ctrl + +/-)
3. ¡Personalización completa!
```

### **Tip 2: Temas según momento**
- 🌞 **Día**: VS Light, GitHub Dark
- 🌙 **Noche**: Tokyo Night, Dracula, Matrix
- 💻 **Trabajo**: VS Dark, Monokai, Cobalt 2
- 🎨 **Diversión**: Matrix, Dracula, Tokyo Night

### **Tip 3: Zoom por archivo**
El zoom es global, se mantiene entre archivos.

### **Tip 4: Resetear todo**
```
Tema: Win + T → VS Dark
Zoom: Ctrl + 0
```

---

## 🎨 Paletas de Colores

### **Matrix:**
```
Fondo: #0d0208 (Negro profundo)
Texto: #00ff41 (Verde neón)
Keywords: #00ff41 (Verde brillante)
Strings: #39ff14 (Verde lima)
```

### **Tokyo Night:**
```
Fondo: #1a1b26 (Azul oscuro)
Texto: #c0caf5 (Blanco azulado)
Keywords: #bb9af7 (Púrpura)
Strings: #9ece6a (Verde)
```

### **Dracula:**
```
Fondo: #282a36 (Gris oscuro)
Texto: #f8f8f2 (Blanco)
Keywords: #ff79c6 (Rosa)
Strings: #f1fa8c (Amarillo)
```

### **Monokai:**
```
Fondo: #272822 (Verde oscuro)
Texto: #f8f8f2 (Blanco)
Keywords: #f92672 (Rosa)
Strings: #e6db74 (Amarillo)
```

---

## 🔧 Características Técnicas

### **Zoom:**
- ✅ State local en React
- ✅ Actualización inmediata
- ✅ Persistente durante sesión
- ✅ Límites de seguridad

### **Temas:**
- ✅ Definidos en Monaco Editor
- ✅ 10 temas personalizados
- ✅ Activación con atajo global
- ✅ Cambio instantáneo
- ✅ Sin recarga necesaria

### **Menú:**
- ✅ Modal overlay
- ✅ Click fuera para cerrar
- ✅ ESC para cerrar
- ✅ Win + T para toggle
- ✅ Animaciones suaves

---

## 📊 Resumen de Atajos

| Atajo | Función |
|-------|---------|
| `Ctrl` + `+` | Zoom in (+2px) |
| `Ctrl` + `-` | Zoom out (-2px) |
| `Ctrl` + `0` | Reset zoom (14px) |
| `Win` + `T` | Abrir/cerrar temas |
| `ESC` | Cerrar menú temas |

---

## 🎯 Casos de Uso

### **Presentaciones:**
```
1. Win + T → Tema vibrante (Dracula/Matrix)
2. Ctrl + + (varias veces) → Texto grande
3. ¡Perfecto para audiencia!
```

### **Trabajo Nocturno:**
```
1. Win + T → Tokyo Night o Matrix
2. Zoom según preferencia
3. Menos fatiga visual
```

### **Accesibilidad:**
```
1. Win + T → High Contrast
2. Ctrl + + → Aumentar tamaño
3. Mejor legibilidad
```

---

## 📁 Archivos Modificados

```
✅ src/components/CodeEditor.jsx
   - Zoom con atajos
   - Soporte de temas
   - fontSize dinámico

✅ src/components/ThemeSelector.jsx (nuevo)
   - Menú de temas
   - 10 temas incluidos
   - Win + T activación

✅ src/utils/themes.js (nuevo)
   - Definiciones de temas
   - Colores personalizados
   - 7 temas custom

✅ src/App.jsx
   - Estado de tema
   - Listener Win + T
   - Integración
```

---

## 🎉 Beneficios

### **Zoom:**
✅ Mayor legibilidad
✅ Presentaciones fáciles
✅ Personalización rápida
✅ Sin usar zoom del navegador

### **Temas:**
✅ Personalización visual
✅ Reducir fatiga visual
✅ Ambiente de trabajo agradable
✅ Variedad profesional
✅ Activación rápida sin menús

---

**¡Zoom y temas completamente funcionales!** 🎨⚡

**Pruébalos ahora:**
1. `Ctrl` + `+` → Aumenta el texto
2. `Win` + `T` → Abre temas
3. Click en "Matrix" → ¡Verde neón!
4. `Ctrl` + `0` → Reset zoom
