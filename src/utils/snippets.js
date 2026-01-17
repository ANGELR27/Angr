// Snippets completos para el editor
export const getHTMLSnippets = (monaco, range) => {
  const Kind = monaco.languages.CompletionItemKind.Snippet;
  const Rule = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
  
  const base = [
    // 🚀 Snippet principal "!" - HTML5 completo
    { 
      label: '!', 
      kind: Kind, 
      insertText: '<!DOCTYPE html>\n<html lang="es">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${1:Document}</title>\n</head>\n<body>\n    ${2}\n</body>\n</html>', 
      insertTextRules: Rule, 
      documentation: '✨ Estructura HTML5 completa (escriba "!" y presione Tab o Enter)', 
      detail: 'HTML5 Boilerplate',
      sortText: '0000', // Prioridad máxima
      range 
    },
    { 
      label: 'html5', 
      kind: Kind, 
      insertText: '<!DOCTYPE html>\n<html lang="es">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${1:Document}</title>\n</head>\n<body>\n    ${2}\n</body>\n</html>', 
      insertTextRules: Rule, 
      documentation: '✨ Estructura HTML5 completa', 
      detail: 'HTML5 Boilerplate',
      range 
    },
    { label: 'div', kind: Kind, insertText: '<div>\n\t${1}\n</div>', insertTextRules: Rule, documentation: '📦 Div', range },
    { label: 'div.', kind: Kind, insertText: '<div class="${1:class-name}">\n\t${2}\n</div>', insertTextRules: Rule, documentation: '📦 Div con clase (rápido)', range },
    { label: 'div#', kind: Kind, insertText: '<div id="${1:id-name}">\n\t${2}\n</div>', insertTextRules: Rule, documentation: '📦 Div con ID', range },
    { label: 'span', kind: Kind, insertText: '<span class="${1}">${2}</span>', insertTextRules: Rule, documentation: '📝 Span', range },
    { label: 'p', kind: Kind, insertText: '<p>${1}</p>', insertTextRules: Rule, documentation: '📝 Párrafo', range },
    { label: 'h1', kind: Kind, insertText: '<h1>${1}</h1>', insertTextRules: Rule, documentation: 'Encabezado 1', range },
    { label: 'h2', kind: Kind, insertText: '<h2>${1}</h2>', insertTextRules: Rule, documentation: 'Encabezado 2', range },
    { label: 'h3', kind: Kind, insertText: '<h3>${1}</h3>', insertTextRules: Rule, documentation: 'Encabezado 3', range },
    { label: 'section', kind: Kind, insertText: '<section class="${1}">\n\t<h2>${2}</h2>\n\t${3}\n</section>', insertTextRules: Rule, documentation: '📄 Sección', range },
    { label: 'article', kind: Kind, insertText: '<article>\n\t<h2>${1}</h2>\n\t<p>${2}</p>\n</article>', insertTextRules: Rule, documentation: '📰 Artículo', range },
    { label: 'header', kind: Kind, insertText: '<header>\n\t<nav>${1}</nav>\n</header>', insertTextRules: Rule, documentation: '🎯 Cabecera', range },
    { label: 'footer', kind: Kind, insertText: `<footer>\n\t<p>&copy; \${1:${new Date().getFullYear()}}. Todos los derechos reservados.</p>\n</footer>`, insertTextRules: Rule, documentation: '👣 Pie', range },
    { label: 'nav', kind: Kind, insertText: '<nav>\n\t<ul>\n\t\t<li><a href="${1:#}">${2}</a></li>\n\t</ul>\n</nav>', insertTextRules: Rule, documentation: '🧭 Navegación', range },
    { label: 'ul', kind: Kind, insertText: '<ul>\n\t<li>${1}</li>\n</ul>', insertTextRules: Rule, documentation: '📋 Lista', range },
    { label: 'ol', kind: Kind, insertText: '<ol>\n\t<li>${1}</li>\n</ol>', insertTextRules: Rule, documentation: '📋 Lista ordenada', range },
    { label: 'a', kind: Kind, insertText: '<a href="${1:#}" target="${2:_blank}">${3}</a>', insertTextRules: Rule, documentation: '🔗 Enlace', range },
    { label: 'img', kind: Kind, insertText: '<img src="${1}" alt="${2}" width="${3}" height="${4}" />', insertTextRules: Rule, documentation: '🖼️ Imagen', range },
    { label: 'button', kind: Kind, insertText: '<button type="${1:button}" class="${2}">${3}</button>', insertTextRules: Rule, documentation: '🔘 Botón', range },
    { label: 'input', kind: Kind, insertText: '<input type="${1:text}" id="${2}" name="${3}" placeholder="${4}" />', insertTextRules: Rule, documentation: '✍️ Input', range },
    { label: 'form', kind: Kind, insertText: '<form action="${1}" method="${2:post}">\n\t${3}\n\t<button type="submit">${4:Enviar}</button>\n</form>', insertTextRules: Rule, documentation: '📝 Formulario', range },
    { label: 'table', kind: Kind, insertText: '<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>${1}</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>${2}</td>\n\t\t</tr>\n\t</tbody>\n</table>', insertTextRules: Rule, documentation: '📊 Tabla', range },
    { label: 'video', kind: Kind, insertText: '<video width="${1:640}" height="${2:360}" controls>\n\t<source src="${3}" type="video/mp4">\n</video>', insertTextRules: Rule, documentation: '🎥 Video', range },
    { label: 'audio', kind: Kind, insertText: '<audio controls>\n\t<source src="${1}" type="audio/mpeg">\n</audio>', insertTextRules: Rule, documentation: '🔊 Audio', range },
    { label: 'script', kind: Kind, insertText: '<script src="${1}.js"></script>', insertTextRules: Rule, documentation: '📜 Script', range },
    { label: 'link:css', kind: Kind, insertText: '<link rel="stylesheet" href="${1}.css">', insertTextRules: Rule, documentation: '🎨 CSS', range },
    { label: 'meta:description', kind: Kind, insertText: '<meta name="description" content="${1}">', insertTextRules: Rule, documentation: '📝 Meta description', range },
    { label: 'meta:keywords', kind: Kind, insertText: '<meta name="keywords" content="${1}">', insertTextRules: Rule, documentation: '🔑 Meta keywords', range },
    { label: 'meta:og', kind: Kind, insertText: '<meta property="og:title" content="${1}">\n<meta property="og:description" content="${2}">\n<meta property="og:image" content="${3}">', insertTextRules: Rule, documentation: '📱 Open Graph meta', range },
    { label: 'select', kind: Kind, insertText: '<select id="${1}" name="${2}">\n\t<option value="${3}">${4}</option>\n</select>', insertTextRules: Rule, documentation: '🎯 Select', range },
    { label: 'textarea', kind: Kind, insertText: '<textarea id="${1}" name="${2}" rows="${3:4}" placeholder="${4}"></textarea>', insertTextRules: Rule, documentation: '📝 Textarea', range },
    { label: 'label', kind: Kind, insertText: '<label for="${1}">${2}</label>', insertTextRules: Rule, documentation: '🏷️ Label', range },
    { label: 'input:text', kind: Kind, insertText: '<input type="text" id="${1}" name="${2}" placeholder="${3}" />', insertTextRules: Rule, documentation: '✍️ Input texto', range },
    { label: 'input:number', kind: Kind, insertText: '<input type="number" id="${1}" name="${2}" min="${3}" max="${4}" />', insertTextRules: Rule, documentation: '🔢 Input número', range },
    { label: 'input:checkbox', kind: Kind, insertText: '<input type="checkbox" id="${1}" name="${2}" />\n<label for="${1}">${3}</label>', insertTextRules: Rule, documentation: '☑️ Checkbox', range },
    { label: 'input:radio', kind: Kind, insertText: '<input type="radio" id="${1}" name="${2}" value="${3}" />\n<label for="${1}">${4}</label>', insertTextRules: Rule, documentation: '🔘 Radio', range },
    { label: 'input:file', kind: Kind, insertText: '<input type="file" id="${1}" name="${2}" accept="${3:image/*}" />', insertTextRules: Rule, documentation: '📁 Input file', range },
    { label: 'br', kind: Kind, insertText: '<br />', insertTextRules: Rule, documentation: '↩️ Salto de línea', range },
    { label: 'hr', kind: Kind, insertText: '<hr />', insertTextRules: Rule, documentation: '➖ Línea horizontal', range },
    { label: 'strong', kind: Kind, insertText: '<strong>${1}</strong>', insertTextRules: Rule, documentation: '💪 Texto fuerte', range },
    { label: 'em', kind: Kind, insertText: '<em>${1}</em>', insertTextRules: Rule, documentation: '✨ Texto énfasis', range },
    { label: 'code', kind: Kind, insertText: '<code>${1}</code>', insertTextRules: Rule, documentation: '💻 Código inline', range },
    { label: 'pre', kind: Kind, insertText: '<pre><code>${1}</code></pre>', insertTextRules: Rule, documentation: '📝 Bloque de código', range },
    { label: 'blockquote', kind: Kind, insertText: '<blockquote>\n\t<p>${1}</p>\n\t<cite>${2}</cite>\n</blockquote>', insertTextRules: Rule, documentation: '💬 Cita', range },
    { label: 'iframe', kind: Kind, insertText: '<iframe src="${1}" width="${2:100%}" height="${3:400}" frameborder="0" allowfullscreen></iframe>', insertTextRules: Rule, documentation: '🖼️ Iframe', range },
    { label: 'canvas', kind: Kind, insertText: '<canvas id="${1:myCanvas}" width="${2:800}" height="${3:600}"></canvas>', insertTextRules: Rule, documentation: '🎨 Canvas', range },
    { label: 'details', kind: Kind, insertText: '<details>\n\t<summary>${1:Clic para expandir}</summary>\n\t${2}\n</details>', insertTextRules: Rule, documentation: '📋 Detalles colapsables', range },
    { label: 'svg', kind: Kind, insertText: '<svg width="${1:100}" height="${2:100}" viewBox="0 0 ${1:100} ${2:100}">\n\t${3}\n</svg>', insertTextRules: Rule, documentation: '🎨 SVG', range }
  ];

  return base.map((item, index) => {
    const sortText = item.sortText ?? String(index + 1).padStart(4, "0");
    const preselect = item.preselect ?? true;
    return { ...item, sortText, preselect };
  });
};

export const getCSSSnippets = (monaco, range) => {
  const Kind = monaco.languages.CompletionItemKind.Snippet;
  const Rule = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
  
  return [
    { label: 'flex', kind: Kind, insertText: 'display: flex;\njustify-content: ${1:center};\nalign-items: ${2:center};', insertTextRules: Rule, documentation: '📦 Flexbox centrado', range },
    { label: 'flex:wrap', kind: Kind, insertText: 'display: flex;\nflex-wrap: wrap;\njustify-content: ${1:space-between};\nalign-items: ${2:flex-start};\ngap: ${3:1rem};', insertTextRules: Rule, documentation: '📦 Flexbox con wrap', range },
    { label: 'flex:column', kind: Kind, insertText: 'display: flex;\nflex-direction: column;\njustify-content: ${1:flex-start};', insertTextRules: Rule, documentation: '📦 Flex columna', range },
    { label: 'grid', kind: Kind, insertText: 'display: grid;\ngrid-template-columns: ${1:repeat(3, 1fr)};\ngap: ${2:1rem};', insertTextRules: Rule, documentation: '📊 Grid', range },
    { label: 'grid:responsive', kind: Kind, insertText: 'display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(${1:250px}, 1fr));\ngap: ${2:1.5rem};', insertTextRules: Rule, documentation: '📊 Grid responsive', range },
    { label: 'transition', kind: Kind, insertText: 'transition: ${1:all} ${2:0.3s} ${3:ease};', insertTextRules: Rule, documentation: '✨ Transición', range },
    { label: 'animation', kind: Kind, insertText: 'animation: ${1:name} ${2:1s} ${3:ease} ${4:infinite};', insertTextRules: Rule, documentation: '✨ Animación', range },
    { label: 'keyframes', kind: Kind, insertText: '@keyframes ${1:name} {\n\t0% { ${2} }\n\t100% { ${3} }\n}', insertTextRules: Rule, documentation: '🎬 Keyframes', range },
    { label: 'gradient', kind: Kind, insertText: 'background: linear-gradient(${1:to right}, ${2:#667eea}, ${3:#764ba2});', insertTextRules: Rule, documentation: '🌈 Gradiente', range },
    { label: 'shadow', kind: Kind, insertText: 'box-shadow: ${1:0 4px 6px} rgba(0, 0, 0, ${2:0.1});', insertTextRules: Rule, documentation: '💫 Sombra', range },
    { label: 'center', kind: Kind, insertText: 'position: absolute;\ntop: 50%;\nleft: 50%;\ntransform: translate(-50%, -50%);', insertTextRules: Rule, documentation: '🎯 Centrar', range },
    { label: 'media:mobile', kind: Kind, insertText: '@media (max-width: 768px) {\n\t${1}\n}', insertTextRules: Rule, documentation: '📱 Mobile', range },
    { label: 'reset', kind: Kind, insertText: '* {\n\tmargin: 0;\n\tpadding: 0;\n\tbox-sizing: border-box;\n}', insertTextRules: Rule, documentation: '🔄 Reset', range },
    { label: 'font-face', kind: Kind, insertText: '@font-face {\n\tfont-family: "${1:FontName}";\n\tsrc: url("${2:font.woff2}") format("woff2");\n\tfont-weight: ${3:normal};\n\tfont-style: ${4:normal};\n}', insertTextRules: Rule, documentation: '🔤 Font-face', range },
    { label: 'hover', kind: Kind, insertText: '&:hover {\n\t${1}\n}', insertTextRules: Rule, documentation: '👆 Hover state', range },
    { label: 'before', kind: Kind, insertText: '&::before {\n\tcontent: "${1}";\n\t${2}\n}', insertTextRules: Rule, documentation: '◀️ Pseudo before', range },
    { label: 'after', kind: Kind, insertText: '&::after {\n\tcontent: "${1}";\n\t${2}\n}', insertTextRules: Rule, documentation: '▶️ Pseudo after', range },
    { label: 'transform:center', kind: Kind, insertText: 'transform: translate(-50%, -50%);', insertTextRules: Rule, documentation: '🎯 Transform center', range },
    { label: 'transform:scale', kind: Kind, insertText: 'transform: scale(${1:1.1});', insertTextRules: Rule, documentation: '🔍 Transform scale', range },
    { label: 'transform:rotate', kind: Kind, insertText: 'transform: rotate(${1:45}deg);', insertTextRules: Rule, documentation: '🔄 Transform rotate', range },
    { label: 'truncate', kind: Kind, insertText: 'white-space: nowrap;\noverflow: hidden;\ntext-overflow: ellipsis;', insertTextRules: Rule, documentation: '✂️ Truncar texto', range },
    { label: 'scrollbar', kind: Kind, insertText: '&::-webkit-scrollbar {\n\twidth: ${1:8px};\n}\n&::-webkit-scrollbar-thumb {\n\tbackground: ${2:#888};\n\tborder-radius: ${3:4px};\n}', insertTextRules: Rule, documentation: '📜 Scrollbar personalizado', range },
    { label: 'container', kind: Kind, insertText: 'max-width: ${1:1200px};\nmargin: 0 auto;\npadding: ${2:0 1rem};', insertTextRules: Rule, documentation: '📦 Container centrado', range },
    { label: 'aspectratio', kind: Kind, insertText: 'aspect-ratio: ${1:16} / ${2:9};', insertTextRules: Rule, documentation: '📐 Aspect ratio', range }
  ];
};

export const getJSSnippets = (monaco, range) => {
  const Kind = monaco.languages.CompletionItemKind.Snippet;
  const Rule = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
  
  return [
    { label: 'log', kind: Kind, insertText: 'console.log(${1});', insertTextRules: Rule, documentation: '🖨️ Console log', range },
    { label: 'error', kind: Kind, insertText: 'console.error(${1});', insertTextRules: Rule, documentation: '❌ Error', range },
    { label: 'warn', kind: Kind, insertText: 'console.warn(${1});', insertTextRules: Rule, documentation: '⚠️ Warning', range },
    { label: 'func', kind: Kind, insertText: 'function ${1:name}(${2}) {\n\t${3}\n}', insertTextRules: Rule, documentation: '🔧 Función', range },
    { label: 'arrow', kind: Kind, insertText: 'const ${1:name} = (${2}) => {\n\t${3}\n};', insertTextRules: Rule, documentation: '➡️ Arrow', range },
    { label: 'foreach', kind: Kind, insertText: '${1:array}.forEach((${2:item}) => {\n\t${3}\n});', insertTextRules: Rule, documentation: '🔁 ForEach', range },
    { label: 'map', kind: Kind, insertText: '${1:array}.map((${2:item}) => ${3});', insertTextRules: Rule, documentation: '🗺️ Map', range },
    { label: 'filter', kind: Kind, insertText: '${1:array}.filter((${2:item}) => ${3});', insertTextRules: Rule, documentation: '🔍 Filter', range },
    { label: 'reduce', kind: Kind, insertText: '${1:array}.reduce((${2:acc}, ${3:item}) => {\n\t${4}\n}, ${5:0});', insertTextRules: Rule, documentation: '📉 Reduce', range },
    { label: 'fetch', kind: Kind, insertText: 'fetch(${1:url})\n\t.then(res => res.json())\n\t.then(data => {\n\t\t${2}\n\t})\n\t.catch(err => console.error(err));', insertTextRules: Rule, documentation: '🌐 Fetch', range },
    { label: 'async', kind: Kind, insertText: 'async function ${1:name}(${2}) {\n\ttry {\n\t\t${3}\n\t} catch (error) {\n\t\tconsole.error(error);\n\t}\n}', insertTextRules: Rule, documentation: '⚡ Async', range },
    { label: 'promise', kind: Kind, insertText: 'new Promise((resolve, reject) => {\n\t${1}\n});', insertTextRules: Rule, documentation: '🤝 Promise', range },
    { label: 'class', kind: Kind, insertText: 'class ${1:Name} {\n\tconstructor(${2}) {\n\t\t${3}\n\t}\n\t\n\t${4:method}() {\n\t\t${5}\n\t}\n}', insertTextRules: Rule, documentation: '🏗️ Clase', range },
    { label: 'import', kind: Kind, insertText: 'import ${1:module} from \'${2:path}\';', insertTextRules: Rule, documentation: '📥 Import', range },
    { label: 'export', kind: Kind, insertText: 'export ${1:default} ${2};', insertTextRules: Rule, documentation: '📤 Export', range },
    { label: 'setTimeout', kind: Kind, insertText: 'setTimeout(() => {\n\t${1}\n}, ${2:1000});', insertTextRules: Rule, documentation: '⏱️ Timeout', range },
    { label: 'setInterval', kind: Kind, insertText: 'setInterval(() => {\n\t${1}\n}, ${2:1000});', insertTextRules: Rule, documentation: '⏲️ Interval', range },
    { label: 'eventListener', kind: Kind, insertText: '${1:element}.addEventListener(\'${2:click}\', (e) => {\n\t${3}\n});', insertTextRules: Rule, documentation: '👂 Event listener', range },
    { label: 'querySelector', kind: Kind, insertText: 'document.querySelector(\'${1:selector}\');', insertTextRules: Rule, documentation: '🔍 Query selector', range },
    { label: 'createElement', kind: Kind, insertText: 'const ${1:element} = document.createElement(\'${2:div}\');\n${1}.textContent = \'${3}\';\n${4:parent}.appendChild(${1});', insertTextRules: Rule, documentation: '🏗️ Create element', range },
    { label: 'if', kind: Kind, insertText: 'if (${1:condition}) {\n\t${2}\n}', insertTextRules: Rule, documentation: '❓ If statement', range },
    { label: 'ifelse', kind: Kind, insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}', insertTextRules: Rule, documentation: '❓ If-else', range },
    { label: 'for', kind: Kind, insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3}\n}', insertTextRules: Rule, documentation: '🔁 For loop', range },
    { label: 'while', kind: Kind, insertText: 'while (${1:condition}) {\n\t${2}\n}', insertTextRules: Rule, documentation: '🔁 While loop', range },
    { label: 'switch', kind: Kind, insertText: 'switch (${1:expression}) {\n\tcase ${2:value}:\n\t\t${3}\n\t\tbreak;\n\tdefault:\n\t\t${4}\n}', insertTextRules: Rule, documentation: '🔀 Switch statement', range },
    { label: 'try', kind: Kind, insertText: 'try {\n\t${1}\n} catch (${2:error}) {\n\tconsole.error(${2});\n}', insertTextRules: Rule, documentation: '⚠️ Try-catch', range },
    { label: 'tryfinally', kind: Kind, insertText: 'try {\n\t${1}\n} catch (${2:error}) {\n\tconsole.error(${2});\n} finally {\n\t${3}\n}', insertTextRules: Rule, documentation: '⚠️ Try-catch-finally', range },
    { label: 'const', kind: Kind, insertText: 'const ${1:name} = ${2:value};', insertTextRules: Rule, documentation: '📌 Const variable', range },
    { label: 'let', kind: Kind, insertText: 'let ${1:name} = ${2:value};', insertTextRules: Rule, documentation: '📌 Let variable', range },
    { label: 'destructure', kind: Kind, insertText: 'const { ${1:prop} } = ${2:object};', insertTextRules: Rule, documentation: '📦 Destructuring', range },
    { label: 'spread', kind: Kind, insertText: '...${1:array}', insertTextRules: Rule, documentation: '📤 Spread operator', range },
    { label: 'ternary', kind: Kind, insertText: '${1:condition} ? ${2:true} : ${3:false}', insertTextRules: Rule, documentation: '❓ Ternary operator', range },
    { label: 'template', kind: Kind, insertText: '`${${1:variable}}`', insertTextRules: Rule, documentation: '📝 Template literal', range },
    { label: 'awaitfetch', kind: Kind, insertText: 'const response = await fetch(${1:url});\nconst data = await response.json();\nconsole.log(data);', insertTextRules: Rule, documentation: '🌐 Async fetch', range },
    { label: 'find', kind: Kind, insertText: '${1:array}.find((${2:item}) => ${3});', insertTextRules: Rule, documentation: '🔍 Array find', range },
    { label: 'some', kind: Kind, insertText: '${1:array}.some((${2:item}) => ${3});', insertTextRules: Rule, documentation: '✓ Array some', range },
    { label: 'every', kind: Kind, insertText: '${1:array}.every((${2:item}) => ${3});', insertTextRules: Rule, documentation: '✓✓ Array every', range },
    { label: 'sort', kind: Kind, insertText: '${1:array}.sort((a, b) => ${2:a - b});', insertTextRules: Rule, documentation: '🔃 Array sort', range },
    { label: 'localstorage:set', kind: Kind, insertText: 'localStorage.setItem(\'${1:key}\', JSON.stringify(${2:value}));', insertTextRules: Rule, documentation: '💾 LocalStorage set', range },
    { label: 'localstorage:get', kind: Kind, insertText: 'const ${1:data} = JSON.parse(localStorage.getItem(\'${2:key}\'));', insertTextRules: Rule, documentation: '📂 LocalStorage get', range },
    { label: 'debounce', kind: Kind, insertText: 'const debounce = (fn, delay) => {\n\tlet timeoutId;\n\treturn (...args) => {\n\t\tclearTimeout(timeoutId);\n\t\ttimeoutId = setTimeout(() => fn(...args), delay);\n\t};\n};', insertTextRules: Rule, documentation: '⏳ Debounce function', range },
    { label: 'throttle', kind: Kind, insertText: 'const throttle = (fn, limit) => {\n\tlet inThrottle;\n\treturn (...args) => {\n\t\tif (!inThrottle) {\n\t\t\tfn(...args);\n\t\t\tinThrottle = true;\n\t\t\tsetTimeout(() => inThrottle = false, limit);\n\t\t}\n\t};\n};', insertTextRules: Rule, documentation: '⏱️ Throttle function', range }
  ];
};

// ☕ Snippets de Java estilo IntelliJ IDEA
export const getJavaSnippets = (monaco, range) => {
  const Kind = monaco.languages.CompletionItemKind.Snippet;
  const Rule = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
  
  return [
    // ⚡ ATAJOS PRINCIPALES DE INTELLIJ
    { label: 'sout', kind: Kind, insertText: 'System.out.println(${1});', insertTextRules: Rule, documentation: '🖨️ System.out.println (IntelliJ)', detail: 'sout → System.out.println', sortText: '0000', range },
    { label: 'soutv', kind: Kind, insertText: 'System.out.println("${1:variable} = " + ${1});', insertTextRules: Rule, documentation: '🖨️ Print variable con nombre', detail: 'soutv → System.out.println con variable', sortText: '0001', range },
    { label: 'souf', kind: Kind, insertText: 'System.out.printf("${1:%s}\\n", ${2});', insertTextRules: Rule, documentation: '🖨️ System.out.printf', detail: 'souf → System.out.printf', sortText: '0002', range },
    { label: 'serr', kind: Kind, insertText: 'System.err.println(${1});', insertTextRules: Rule, documentation: '❌ System.err.println', detail: 'serr → System.err.println', sortText: '0003', range },
    
    // MÉTODOS Y CLASES
    { label: 'psvm', kind: Kind, insertText: 'public static void main(String[] args) {\n\t${1}\n}', insertTextRules: Rule, documentation: '🚀 Main method', detail: 'psvm → public static void main', sortText: '0004', range },
    { label: 'main', kind: Kind, insertText: 'public static void main(String[] args) {\n\t${1}\n}', insertTextRules: Rule, documentation: '🚀 Main method', detail: 'main → public static void main', sortText: '0005', range },
    { label: 'psf', kind: Kind, insertText: 'public static final ${1:type} ${2:NAME} = ${3};', insertTextRules: Rule, documentation: '📌 Constante pública estática', detail: 'psf → public static final', range },
    { label: 'prsf', kind: Kind, insertText: 'private static final ${1:type} ${2:NAME} = ${3};', insertTextRules: Rule, documentation: '📌 Constante privada estática', detail: 'prsf → private static final', range },
    { label: 'psfi', kind: Kind, insertText: 'public static final int ${1:NAME} = ${2:0};', insertTextRules: Rule, documentation: '📌 Constante int', detail: 'psfi → public static final int', range },
    { label: 'psfs', kind: Kind, insertText: 'public static final String ${1:NAME} = "${2}";', insertTextRules: Rule, documentation: '📌 Constante String', detail: 'psfs → public static final String', range },
    
    // LOOPS
    { label: 'fori', kind: Kind, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3}\n}', insertTextRules: Rule, documentation: '🔁 For loop con índice', detail: 'fori → for (int i = 0; ...)', range },
    { label: 'iter', kind: Kind, insertText: 'for (${1:Type} ${2:item} : ${3:collection}) {\n\t${4}\n}', insertTextRules: Rule, documentation: '🔁 Enhanced for loop', detail: 'iter → for-each loop', range },
    { label: 'itar', kind: Kind, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:Type} ${4:item} = ${2:array}[${1:i}];\n\t${5}\n}', insertTextRules: Rule, documentation: '🔁 Iterar array', detail: 'itar → iterate array', range },
    { label: 'itco', kind: Kind, insertText: 'for (Iterator<${1:Type}> ${2:iterator} = ${3:collection}.iterator(); ${2}.hasNext(); ) {\n\t${1:Type} ${4:item} = ${2}.next();\n\t${5}\n}', insertTextRules: Rule, documentation: '🔁 Iterar con Iterator', detail: 'itco → iterate collection', range },
    { label: 'itli', kind: Kind, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:list}.size(); ${1:i}++) {\n\t${3:Type} ${4:item} = ${2:list}.get(${1:i});\n\t${5}\n}', insertTextRules: Rule, documentation: '🔁 Iterar List', detail: 'itli → iterate list', range },
    { label: 'ritar', kind: Kind, insertText: 'for (int ${1:i} = ${2:array}.length - 1; ${1:i} >= 0; ${1:i}--) {\n\t${3:Type} ${4:item} = ${2:array}[${1:i}];\n\t${5}\n}', insertTextRules: Rule, documentation: '🔁 Iterar array reverso', detail: 'ritar → reverse iterate array', range },
    
    // CONDICIONALES
    { label: 'ifn', kind: Kind, insertText: 'if (${1:variable} == null) {\n\t${2}\n}', insertTextRules: Rule, documentation: '❓ If null', detail: 'ifn → if null', range },
    { label: 'inn', kind: Kind, insertText: 'if (${1:variable} != null) {\n\t${2}\n}', insertTextRules: Rule, documentation: '❓ If not null', detail: 'inn → if not null', range },
    
    // VARIABLES Y CONSTANTES
    { label: 'St', kind: Kind, insertText: 'String ${1:name} = ${2:""};', insertTextRules: Rule, documentation: '📝 String variable', detail: 'St → String', range },
    { label: 'thr', kind: Kind, insertText: 'throw new ${1:Exception}("${2}");', insertTextRules: Rule, documentation: '⚠️ Throw exception', detail: 'thr → throw new', range },
    
    // GETTER/SETTER
    { label: 'getter', kind: Kind, insertText: 'public ${1:Type} get${2:Name}() {\n\treturn ${3:field};\n}', insertTextRules: Rule, documentation: '📖 Getter method', detail: 'getter → generate getter', range },
    { label: 'setter', kind: Kind, insertText: 'public void set${1:Name}(${2:Type} ${3:field}) {\n\tthis.${3} = ${3};\n}', insertTextRules: Rule, documentation: '✍️ Setter method', detail: 'setter → generate setter', range },
    
    // CLASES Y CONSTRUCTORES
    { label: 'ctor', kind: Kind, insertText: 'public ${1:ClassName}(${2}) {\n\t${3}\n}', insertTextRules: Rule, documentation: '🏗️ Constructor', detail: 'ctor → constructor', range },
    { label: 'singleton', kind: Kind, insertText: 'private static ${1:ClassName} instance;\n\nprivate ${1:ClassName}() {\n\t${2}\n}\n\npublic static ${1:ClassName} getInstance() {\n\tif (instance == null) {\n\t\tinstance = new ${1:ClassName}();\n\t}\n\treturn instance;\n}', insertTextRules: Rule, documentation: '🔒 Singleton pattern', detail: 'singleton → Singleton pattern', range },
    
    // TRY-CATCH
    { label: 'try', kind: Kind, insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${4:e}.printStackTrace();\n}', insertTextRules: Rule, documentation: '⚠️ Try-catch', detail: 'try → try-catch block', range },
    { label: 'trycatch', kind: Kind, insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${4:e}.printStackTrace();\n}', insertTextRules: Rule, documentation: '⚠️ Try-catch', detail: 'trycatch → try-catch block', range },
    { label: 'tryf', kind: Kind, insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${4:e}.printStackTrace();\n} finally {\n\t${5}\n}', insertTextRules: Rule, documentation: '⚠️ Try-catch-finally', detail: 'tryf → try-catch-finally', range },
    { label: 'twr', kind: Kind, insertText: 'try (${1:Resource} ${2:resource} = new ${1:Resource}(${3})) {\n\t${4}\n} catch (${5:Exception} ${6:e}) {\n\t${7:e}.printStackTrace();\n}', insertTextRules: Rule, documentation: '⚠️ Try-with-resources', detail: 'twr → try-with-resources', range },
    
    // COLECCIONES
    { label: 'lst', kind: Kind, insertText: 'List<${1:Type}> ${2:list} = new ArrayList<>();', insertTextRules: Rule, documentation: '📋 ArrayList', detail: 'lst → new ArrayList', range },
    { label: 'map', kind: Kind, insertText: 'Map<${1:KeyType}, ${2:ValueType}> ${3:map} = new HashMap<>();', insertTextRules: Rule, documentation: '🗺️ HashMap', detail: 'map → new HashMap', range },
    { label: 'set', kind: Kind, insertText: 'Set<${1:Type}> ${2:set} = new HashSet<>();', insertTextRules: Rule, documentation: '📦 HashSet', detail: 'set → new HashSet', range },
    
    // STREAMS Y LAMBDAS (Java 8+)
    { label: 'lambda', kind: Kind, insertText: '(${1:params}) -> ${2:expression}', insertTextRules: Rule, documentation: '➡️ Lambda expression', detail: 'lambda → lambda expression', range },
    { label: 'foreach', kind: Kind, insertText: '${1:collection}.forEach(${2:item} -> {\n\t${3}\n});', insertTextRules: Rule, documentation: '🔁 forEach lambda', detail: 'foreach → forEach with lambda', range },
    { label: 'stream', kind: Kind, insertText: '${1:collection}.stream()\n\t.${2:filter}(${3:item} -> ${4})\n\t.${5:collect}(Collectors.toList());', insertTextRules: Rule, documentation: '🌊 Stream API', detail: 'stream → Stream API', range },
    
    // TOSTRING, EQUALS, HASHCODE
    { label: 'tostring', kind: Kind, insertText: '@Override\npublic String toString() {\n\treturn "${1:ClassName}{" +\n\t\t"${2:field}=" + ${2} +\n\t\t"}";\n}', insertTextRules: Rule, documentation: '📝 toString method', detail: 'tostring → generate toString', range },
    { label: 'equals', kind: Kind, insertText: '@Override\npublic boolean equals(Object o) {\n\tif (this == o) return true;\n\tif (o == null || getClass() != o.getClass()) return false;\n\t${1:ClassName} that = (${1:ClassName}) o;\n\treturn Objects.equals(${2:field}, that.${2});\n}', insertTextRules: Rule, documentation: '⚖️ equals method', detail: 'equals → generate equals', range },
    { label: 'hashcode', kind: Kind, insertText: '@Override\npublic int hashCode() {\n\treturn Objects.hash(${1:field});\n}', insertTextRules: Rule, documentation: '#️⃣ hashCode method', detail: 'hashcode → generate hashCode', range },
    
    // COMENTARIOS Y DOCUMENTACIÓN
    { label: 'javadoc', kind: Kind, insertText: '/**\n * ${1:Description}\n * \n * @param ${2:param} ${3:description}\n * @return ${4:description}\n */', insertTextRules: Rule, documentation: '📖 Javadoc comment', detail: 'javadoc → Javadoc comment', range },
    { label: 'author', kind: Kind, insertText: '/**\n * @author ${1:name}\n * @version ${2:1.0}\n * @since ${3:date}\n */', insertTextRules: Rule, documentation: '👤 Author javadoc', detail: 'author → @author tag', range },
    
    // TESTS (JUnit)
    { label: 'test', kind: Kind, insertText: '@Test\npublic void ${1:testName}() {\n\t${2}\n}', insertTextRules: Rule, documentation: '🧪 JUnit test', detail: 'test → @Test method', range },
    { label: 'before', kind: Kind, insertText: '@Before\npublic void setUp() {\n\t${1}\n}', insertTextRules: Rule, documentation: '🔧 @Before setup', detail: 'before → @Before method', range },
    { label: 'after', kind: Kind, insertText: '@After\npublic void tearDown() {\n\t${1}\n}', insertTextRules: Rule, documentation: '🧹 @After teardown', detail: 'after → @After method', range },
    
    // CLASE COMPLETA
    { label: 'class', kind: Kind, insertText: 'public class ${1:ClassName} {\n\t// Atributos\n\tprivate ${2:Type} ${3:field};\n\t\n\t// Constructor\n\tpublic ${1:ClassName}(${2:Type} ${3:field}) {\n\t\tthis.${3} = ${3};\n\t}\n\t\n\t// Getters y Setters\n\tpublic ${2:Type} get${3/(.*)/${1:/capitalize}/}() {\n\t\treturn ${3};\n\t}\n\t\n\tpublic void set${3/(.*)/${1:/capitalize}/}(${2:Type} ${3:field}) {\n\t\tthis.${3} = ${3};\n\t}\n\t\n\t// Métodos\n\t${4}\n}', insertTextRules: Rule, documentation: '🏗️ Clase completa', detail: 'class → Complete class', range },
    
    // INTERFAZ
    { label: 'interface', kind: Kind, insertText: 'public interface ${1:InterfaceName} {\n\t${2:void method();};\n}', insertTextRules: Rule, documentation: '📐 Interface', detail: 'interface → Create interface', range },
    
    // ENUM
    { label: 'enum', kind: Kind, insertText: 'public enum ${1:EnumName} {\n\t${2:VALUE1}, ${3:VALUE2}, ${4:VALUE3}\n}', insertTextRules: Rule, documentation: '🎯 Enum', detail: 'enum → Create enum', range },
    
    // SWITCH MEJORADO (Java 12+)
    { label: 'switch', kind: Kind, insertText: 'switch (${1:variable}) {\n\tcase ${2:value1} -> ${3:result1};\n\tcase ${4:value2} -> ${5:result2};\n\tdefault -> ${6:defaultResult};\n}', insertTextRules: Rule, documentation: '🔀 Switch expression', detail: 'switch → Switch expression', range },
    
    // LECTURA DE DATOS
    { label: 'scanner', kind: Kind, insertText: 'Scanner ${1:scanner} = new Scanner(System.in);\nSystem.out.print("${2:Enter value}: ");\n${3:String} ${4:input} = ${1:scanner}.nextLine();\n${1:scanner}.close();', insertTextRules: Rule, documentation: '⌨️ Scanner input', detail: 'scanner → Scanner input', range }
  ];
};
