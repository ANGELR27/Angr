# ▶️ Ejecutar Código JavaScript - Guía Completa

## 🚀 Nueva Característica: Botón Ejecutar

La terminal ahora incluye un **botón de ejecución** que permite ejecutar código JavaScript directamente y ver los resultados en tiempo real.

---

## 🎯 Cómo Funciona

### **Botón "Ejecutar"**
- 📍 **Ubicación**: Esquina superior derecha de la terminal
- 🎨 **Estilo**: Botón sutil verde con ícono Play ▶️
- ⚡ **Función**: Ejecuta el código del archivo JavaScript activo

### **Características:**
✅ Ejecuta código JavaScript del archivo abierto
✅ Captura todos los `console.log()`
✅ Captura `console.error()`, `console.warn()`, `console.info()`
✅ Maneja errores y los muestra en rojo
✅ Abre la terminal automáticamente si está cerrada
✅ Timestamp en cada log
✅ Colores por tipo de mensaje

---

## 📝 Cómo Usar

### **Paso 1: Escribe código JavaScript**
```javascript
// En script.js
console.log('¡Hola Mundo!');
console.log('2 + 2 =', 2 + 2);

const nombre = 'Juan';
console.log(`Hola, ${nombre}`);

const numeros = [1, 2, 3, 4, 5];
console.log('Números:', numeros);

const usuario = { nombre: 'Ana', edad: 25 };
console.log('Usuario:', usuario);
```

### **Paso 2: Click en "Ejecutar" ▶️**
- Botón verde en la terminal
- O presiona el botón si la terminal está cerrada

### **Paso 3: Ver resultados**
```
$ Ejecutando código JavaScript...
[23:13:48] ¡Hola Mundo!
[23:13:48] 2 + 2 = 4
[23:13:48] Hola, Juan
[23:13:48] Números: [1,2,3,4,5]
[23:13:48] Usuario: {"nombre":"Ana","edad":25}
```

---

## 🎨 Tipos de Console Soportados

### **1. console.log()**
```javascript
console.log('Mensaje normal');
console.log('Múltiples', 'argumentos', 123);
console.log({ key: 'value' });
```

**Resultado:**
```
[23:13:48] Mensaje normal
[23:13:48] Múltiples argumentos 123
[23:13:48] {"key":"value"}
```

### **2. console.error()**
```javascript
console.error('Esto es un error');
console.error('Error:', new Error('Algo salió mal'));
```

**Resultado (en rojo):**
```
[23:13:48] Esto es un error
[23:13:48] Error: Error: Algo salió mal
```

### **3. console.warn()**
```javascript
console.warn('Advertencia importante');
console.warn('Valor deprecated:', value);
```

**Resultado (en amarillo):**
```
[23:13:48] Advertencia importante
[23:13:48] Valor deprecated: undefined
```

### **4. console.info()**
```javascript
console.info('Información del sistema');
console.info('Versión:', '1.0.0');
```

**Resultado (en azul):**
```
[23:13:48] Información del sistema
[23:13:48] Versión: 1.0.0
```

### **5. console.table()**
```javascript
const datos = [
  { nombre: 'Ana', edad: 25 },
  { nombre: 'Luis', edad: 30 }
];
console.table(datos);
```

**Resultado:**
```
[23:13:48] [{"nombre":"Ana","edad":25},{"nombre":"Luis","edad":30}]
```

---

## ⚠️ Manejo de Errores

### **Errores de Sintaxis:**
```javascript
// Código con error
const x = ;
console.log(x);
```

**Resultado:**
```
$ Ejecutando código JavaScript...
[23:13:48] ✗ Error: Unexpected token ';'
```

### **Errores de Ejecución:**
```javascript
const obj = null;
console.log(obj.propiedad); // Error!
```

**Resultado:**
```
$ Ejecutando código JavaScript...
[23:13:48] ✗ Error: Cannot read property 'propiedad' of null
```

### **Código sin salida:**
```javascript
const x = 5;
const y = 10;
const suma = x + y;
// Sin console.log
```

**Resultado:**
```
$ Ejecutando código JavaScript...
[23:13:48] ✓ Código ejecutado correctamente (sin salida)
```

---

## 🧪 Ejemplos de Uso

### **Ejemplo 1: Calculadora**
```javascript
function sumar(a, b) {
  return a + b;
}

function restar(a, b) {
  return a - b;
}

console.log('Suma: 5 + 3 =', sumar(5, 3));
console.log('Resta: 10 - 4 =', restar(10, 4));
```

**Terminal:**
```
[23:13:48] Suma: 5 + 3 = 8
[23:13:48] Resta: 10 - 4 = 6
```

### **Ejemplo 2: Manipulación de Arrays**
```javascript
const numeros = [1, 2, 3, 4, 5];

const dobles = numeros.map(n => n * 2);
console.log('Dobles:', dobles);

const pares = numeros.filter(n => n % 2 === 0);
console.log('Pares:', pares);

const suma = numeros.reduce((acc, n) => acc + n, 0);
console.log('Suma total:', suma);
```

**Terminal:**
```
[23:13:48] Dobles: [2,4,6,8,10]
[23:13:48] Pares: [2,4]
[23:13:48] Suma total: 15
```

### **Ejemplo 3: Objetos**
```javascript
const persona = {
  nombre: 'María',
  edad: 28,
  ciudad: 'Madrid'
};

console.log('Persona:', persona);
console.log('Nombre:', persona.nombre);
console.log('Edad:', persona.edad);
```

**Terminal:**
```
[23:13:48] Persona: {"nombre":"María","edad":28,"ciudad":"Madrid"}
[23:13:48] Nombre: María
[23:13:48] Edad: 28
```

### **Ejemplo 4: Bucles**
```javascript
console.log('Contando del 1 al 5:');

for (let i = 1; i <= 5; i++) {
  console.log(`Número ${i}`);
}

console.log('¡Terminado!');
```

**Terminal:**
```
[23:13:48] Contando del 1 al 5:
[23:13:48] Número 1
[23:13:48] Número 2
[23:13:48] Número 3
[23:13:48] Número 4
[23:13:48] Número 5
[23:13:48] ¡Terminado!
```

### **Ejemplo 5: Debugging**
```javascript
function calcularPromedio(numeros) {
  console.log('Entrada:', numeros);
  
  const suma = numeros.reduce((a, b) => a + b, 0);
  console.log('Suma:', suma);
  
  const promedio = suma / numeros.length;
  console.log('Promedio:', promedio);
  
  return promedio;
}

const resultado = calcularPromedio([10, 20, 30, 40]);
console.log('Resultado final:', resultado);
```

**Terminal:**
```
[23:13:48] Entrada: [10,20,30,40]
[23:13:48] Suma: 100
[23:13:48] Promedio: 25
[23:13:48] Resultado final: 25
```

---

## 🎯 Validaciones

El botón ejecutar incluye validaciones automáticas:

### **1. Sin archivo abierto:**
```
[23:13:48] ✗ No hay archivo abierto
```

### **2. Archivo no JavaScript:**
```
[23:13:48] ✗ Solo se puede ejecutar código JavaScript
```

### **3. Archivo vacío:**
```
[23:13:48] ✗ El archivo está vacío
```

---

## 🔧 Características Técnicas

### **Ejecución Segura:**
✅ Código ejecutado en contexto aislado
✅ No afecta el DOM principal
✅ Captura de errores completa
✅ Console personalizado inyectado

### **Soporte Completo:**
✅ Variables y constantes
✅ Funciones (tradicionales y arrow)
✅ Objetos y arrays
✅ Template literals
✅ Destructuring
✅ Spread operator
✅ Operaciones matemáticas
✅ Bucles (for, while, forEach, map, etc.)
✅ Condicionales (if, else, switch, ternary)
✅ Try-catch

### **Limitaciones:**
❌ No soporta `import` o `require` (código standalone)
❌ No tiene acceso al DOM (sin `document` o `window`)
❌ No soporta APIs asíncronas con callbacks externos
❌ No puede modificar archivos del proyecto

---

## 💡 Tips de Uso

### **Tip 1: Debugging Rápido**
Agrega `console.log()` en puntos clave de tu código para ver el flujo de ejecución.

### **Tip 2: Testing de Funciones**
Prueba funciones individuales sin necesidad de crear HTML.

### **Tip 3: Experimentos**
Escribe código experimental y ejecútalo al instante para ver resultados.

### **Tip 4: Logs Múltiples**
Usa múltiples `console.log()` para ver el progreso paso a paso.

### **Tip 5: Objetos Complejos**
Los objetos se stringify automáticamente para verlos completos.

---

## 🎨 Esquema de Colores

| Tipo | Color | Uso |
|------|-------|-----|
| `console.log()` | Gris claro | Mensajes normales |
| `console.error()` | Rojo | Errores |
| `console.warn()` | Amarillo | Advertencias |
| `console.info()` | Azul | Información |
| Comando | Cyan | Comando ejecutado |
| Éxito | Verde | Ejecución exitosa |

---

## 🚀 Flujo de Trabajo

### **Desarrollo típico:**
1. **Escribe código** en el archivo `.js`
2. **Click "Ejecutar"** ▶️ en la terminal
3. **Ve resultados** inmediatamente
4. **Corrige** si hay errores
5. **Re-ejecuta** para verificar

### **Debug típico:**
1. Agregar `console.log()` estratégicos
2. Ejecutar código
3. Analizar salida
4. Encontrar y corregir bug
5. Limpiar logs innecesarios

---

## 📊 Casos de Uso

### **✅ Ideal para:**
- Testing de funciones
- Debugging de lógica
- Experimentación con JavaScript
- Aprendizaje de JavaScript
- Verificación rápida de código
- Cálculos matemáticos
- Manipulación de datos

### **❌ No ideal para:**
- Código que requiere DOM
- Llamadas a APIs externas
- Código con imports
- Manipulación de archivos
- Operaciones asíncronas complejas

---

## 🎉 Beneficios

### **Para Desarrollo:**
✅ **Feedback instantáneo** - Ve resultados al momento
✅ **Sin configuración** - No necesitas setup adicional
✅ **Debugging fácil** - Logs claros con colores
✅ **Productividad** - Prueba código sin salir del editor

### **Para Aprendizaje:**
✅ **Experimentación** - Prueba conceptos al instante
✅ **Visualización** - Ve cómo funciona el código
✅ **Errores claros** - Mensajes de error comprensibles
✅ **Interactivo** - Aprende haciendo

---

**¡El botón ejecutar está completamente funcional!** ▶️

**Pruébalo ahora:**
1. Abre o crea archivo `.js`
2. Escribe: `console.log('¡Hola!')`
3. Click en "Ejecutar" ▶️ verde
4. ¡Ve el resultado en la terminal!
