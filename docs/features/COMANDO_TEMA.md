# 🎨 Comando Terminal: tema

## ✨ Nueva Característica

Ahora puedes abrir el selector de temas directamente desde la terminal con un comando simple.

---

## 💻 Comando

### **Opción 1: `tema`**
```bash
$ tema
```

### **Opción 2: `theme`**
```bash
$ theme
```

Ambos comandos hacen exactamente lo mismo: **abren el selector de temas**.

---

## 🎯 Cómo Usar

### **Paso a Paso:**

1. **Abre la terminal**
   - Click en botón "Terminal" (verde) en la barra superior
   - O si ya está abierta, haz click en ella

2. **Escribe el comando**
   ```bash
   $ tema
   ```
   O también:
   ```bash
   $ theme
   ```

3. **Presiona Enter**

4. **¡El menú de temas se abre automáticamente!** 🎨

---

## 🧪 Prueba Rápida

```
1. Click en "Terminal" (botón verde)
2. Escribe: tema
3. Enter
4. ¿Se abre el selector de temas? ✅
5. Selecciona un tema
6. ¡Funciona!
```

---

## 📊 Respuesta del Comando

Cuando ejecutas el comando, la terminal responde:

```bash
$ tema
🎨 Abriendo selector de temas...
```

Y el menú de temas se abre inmediatamente.

---

## 🎨 Formas de Abrir el Selector de Temas

Ahora tienes **3 formas** de abrir el selector:

### **1. Atajo de Teclado**
```
Ctrl + Shift + T
```

### **2. Comando en Terminal (NUEVO)**
```bash
$ tema
```
o
```bash
$ theme
```

### **3. Desde App (si se agrega botón)**
_(Actualmente solo con atajo y comando)_

---

## 💡 Ventajas del Comando

✅ **Rápido** - Solo 4 letras + Enter
✅ **Fácil de recordar** - `tema` es intuitivo
✅ **Bilingüe** - `tema` (español) o `theme` (inglés)
✅ **Sin teclado especial** - No necesitas teclas especiales como Meta
✅ **Confirmación visual** - La terminal te confirma la acción

---

## 📝 Comandos de Terminal Actualizados

### **Lista Completa:**

| Comando | Descripción |
|---------|-------------|
| `help` | Muestra todos los comandos |
| `clear` | Limpia la terminal |
| `date` | Muestra la fecha |
| `time` | Muestra la hora |
| `version` | Versión del editor |
| `echo <mensaje>` | Imprime un mensaje |
| **`tema`** | **Abre selector de temas** ⭐ |
| **`theme`** | **Abre selector de temas** ⭐ |

---

## 🎮 Ejemplos de Uso

### **Ejemplo 1: Cambiar Tema Rápido**
```bash
$ tema
# Selecciona "Matrix"
# ¡Tema cambiado! Verde neón
```

### **Ejemplo 2: Explorar Temas**
```bash
$ theme
# Ve todos los temas disponibles
# Prueba Tokyo Night
# Prueba Dracula
# Elige tu favorito
```

### **Ejemplo 3: Workflow Completo**
```bash
$ clear           # Limpiar terminal
$ version         # Ver versión
$ tema            # Abrir temas
# Selecciona tema
$ date            # Ver fecha
$ echo Listo!     # Mensaje
```

---

## 🔧 Características Técnicas

### **Implementación:**
```javascript
case 'tema':
case 'theme':
  setHistory(prev => [...prev, 
    { type: 'success', text: '🎨 Abriendo selector de temas...' }
  ]);
  if (onOpenThemes) {
    onOpenThemes();  // Abre el modal
  }
  break;
```

### **Flujo:**
```
1. Usuario escribe "tema"
2. Terminal detecta comando
3. Muestra mensaje de confirmación
4. Llama a onOpenThemes()
5. App.jsx recibe señal
6. setShowThemeSelector(true)
7. Modal de temas se abre
```

---

## 📁 Archivos Modificados

```
✅ src/components/Terminal.jsx
   - Nuevo case 'tema' y 'theme'
   - Prop onOpenThemes agregada
   - Actualizado help

✅ src/App.jsx
   - onOpenThemes={() => setShowThemeSelector(true)}
   - Pasado al componente Terminal

✅ src/components/ThemeSelector.jsx
   - Instrucciones actualizadas
   - Menciona comando "tema"
```

---

## 🎨 Interfaz Actualizada

### **Menú de Temas:**
```
┌────────────────────────────────────────┐
│ 🎨 Selector de Temas             [✕]  │
├────────────────────────────────────────┤
│ Ctrl + Shift + T para abrir/cerrar    │
│ O escribe "tema" en la terminal        │ ← NUEVO
├────────────────────────────────────────┤
│  [Grid de temas...]                    │
└────────────────────────────────────────┘
```

### **Terminal con help:**
```
$ help
Comandos disponibles:
  help    - Muestra esta ayuda
  clear   - Limpia la terminal
  date    - Muestra la fecha y hora
  echo    - Imprime un mensaje
  version - Muestra la versión del editor
  tema    - Abre el selector de temas        ← NUEVO
  theme   - Abre el selector de temas        ← NUEVO
```

---

## 💡 Tips de Uso

### **Tip 1: Alias Mental**
Piensa en `tema` como "abrir temas" - Es fácil de recordar.

### **Tip 2: En Inglés**
Si prefieres inglés, usa `theme` en lugar de `tema`.

### **Tip 3: Workflow Rápido**
```bash
$ tema    # Cambiar tema
$ clear   # Limpiar terminal
# ¡Listo para trabajar!
```

### **Tip 4: Sin Salir de Terminal**
No necesitas usar el mouse o teclado especial. Todo desde la terminal.

---

## 🆚 Comparación de Métodos

| Método | Teclas/Comandos | Requiere Mouse | Requiere Teclado Especial |
|--------|----------------|----------------|---------------------------|
| Atajo | Ctrl+Shift+T | ❌ No | ✅ Sí (Ctrl/Shift) |
| **Comando** | **tema + Enter** | **❌ No** | **❌ No** |

**El comando es más universal** - Funciona con cualquier teclado.

---

## 🎉 Resumen

### **Comando Nuevo:**
```bash
$ tema
```
o
```bash
$ theme
```

### **Qué Hace:**
✅ Abre el selector de temas
✅ Muestra mensaje de confirmación
✅ 10 temas disponibles
✅ Funciona instantáneamente

### **Ventajas:**
✅ Rápido de escribir
✅ Fácil de recordar
✅ Sin teclas especiales
✅ Bilingüe (tema/theme)
✅ Confirmación visual

---

**¡Ahora puedes cambiar temas desde la terminal!** 🎨💻

**Pruébalo ahora:**
1. Abre Terminal
2. Escribe: `tema`
3. Enter
4. ¡Selector de temas se abre! ✨

**Comandos útiles:**
```bash
$ help    # Ver todos los comandos
$ tema    # Abrir temas
$ clear   # Limpiar terminal
```
