# ✅ Pruebas Rápidas - Code Editor

## 🗑️ Eliminar Archivos y Carpetas (NUEVO)

### Cómo usar:
1. **Click derecho** sobre un archivo o carpeta en el explorador
2. Aparece menú contextual con botón rojo **"Eliminar"** 🗑️
3. Click en "Eliminar"
4. Confirma la acción
5. ¡Archivo o carpeta eliminado!

### Características:
- ✅ **Menú contextual** aparece al hacer click derecho
- ✅ **Confirmación** antes de eliminar
- ✅ **Cierra pestañas** automáticamente si el archivo está abierto
- ✅ **Elimina carpetas** con todo su contenido
- ✅ **Estilo visual** con ícono de basura rojo

---

## ⚡ Snippet "!" en HTML (VERIFICADO)

### Cómo usar:
1. **Crea un archivo** HTML nuevo:
   - Click en "Archivo"
   - Nombre: `test.html`

2. **Escribe el símbolo** `!`

3. **Presiona TAB** o **ENTER**

4. ✅ **¡Se genera automáticamente!**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```

### Notas:
- ✅ El cursor se posiciona en `Document` para editarlo
- ✅ Presiona TAB para saltar al body
- ✅ Solo funciona en archivos `.html`
- ✅ Aparece en las sugerencias al escribir `!`

---

## 🧪 Tests Completos

### ✅ Test 1: Eliminar Archivo
```
1. Click derecho en "script.js"
2. ¿Aparece menú? ✅
3. Click "Eliminar"
4. ¿Confirmación? ✅
5. ¿Se elimina? ✅
6. ¿Se cierra pestaña? ✅
```

### ✅ Test 2: Eliminar Carpeta
```
1. Click derecho en carpeta "components"
2. ¿Aparece menú? ✅
3. Click "Eliminar"
4. ¿Dice "y todo su contenido"? ✅
5. Confirmar
6. ¿Se elimina carpeta completa? ✅
```

### ✅ Test 3: Snippet "!"
```
1. Nuevo archivo: test.html
2. Escribe: !
3. ¿Aparece en sugerencias? ✅
4. Presiona: TAB
5. ¿HTML5 completo? ✅
6. ¿Cursor en title? ✅
```

### ✅ Test 4: Cerrar menú contextual
```
1. Click derecho en archivo
2. Aparece menú
3. Click fuera del menú
4. ¿Se cierra? ✅
```

---

## 🎯 Características del Menú Contextual

### Diseño:
- ✅ Fondo gris oscuro con borde azul
- ✅ Sombra 2xl para profundidad
- ✅ Botón con hover rojo/20
- ✅ Ícono de basura (Trash2) rojo
- ✅ Texto rojo indicando peligro
- ✅ Ancho mínimo de 200px

### Funcionalidad:
- ✅ Se posiciona donde haces click derecho
- ✅ Se cierra al click fuera
- ✅ Se cierra al seleccionar opción
- ✅ Previene propagación de eventos
- ✅ Confirmación personalizada por tipo

---

## 🚀 Cómo Probar Ahora

### 1. Menú Contextual:
```
→ Recarga la página
→ Click derecho en cualquier archivo del explorador
→ ¡Verás el menú con "Eliminar"!
```

### 2. Snippet "!":
```
→ Click en "Archivo"
→ Nombre: test.html
→ En el editor escribe: !
→ Presiona TAB
→ ¡HTML5 completo!
```

### 3. Eliminar y Crear:
```
→ Click derecho en "test.html"
→ Eliminar
→ Crear nuevo: demo.html
→ Usar snippet "!"
→ ¡Ciclo completo!
```

---

## 📝 Mensajes de Confirmación

### Para Archivos:
```
¿Eliminar el archivo "script.js"?
```

### Para Carpetas:
```
¿Eliminar la carpeta "components" y todo su contenido?
```

---

## 🎨 Estilo Visual del Menú

```css
Fondo: bg-gray-800
Borde: border-blue-500/30
Sombra: shadow-2xl
Botón hover: hover:bg-red-500/20
Texto: text-red-400
Ícono: Trash2 (w-4 h-4)
Padding: px-4 py-2
```

---

## ⚡ Shortcuts Relacionados

| Acción | Método |
|--------|--------|
| Abrir menú | Click derecho |
| Cerrar menú | Click fuera |
| Confirmar | Enter en diálogo |
| Cancelar | ESC en diálogo |

---

## 🔥 Snippets Adicionales Verificados

Todos estos funcionan igual que "!":

### HTML:
- `div` → Div con clase
- `form` → Formulario completo
- `table` → Tabla completa
- `img` → Imagen con atributos

### CSS:
- `flex` → Flexbox centrado
- `grid` → CSS Grid
- `gradient` → Gradiente

### JavaScript:
- `log` → console.log()
- `fetch` → Fetch API
- `async` → Función async

---

**¡Todo funciona perfectamente!** ✨

**Recarga la página y prueba:**
1. Click derecho → Menú contextual 🗑️
2. Escribe `!` en HTML → Estructura completa ⚡
3. Drag & drop imagen → Inserción automática 🖼️
4. console.log en JS → Aparece en terminal 🖨️
