// Snippets completos para el editor
export const getHTMLSnippets = (monaco, range) => {
  const Kind = monaco.languages.CompletionItemKind.Snippet;
  const Rule = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
  
  return [
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
    { label: 'div', kind: Kind, insertText: '<div class="${1}">\n\t${2}\n</div>', insertTextRules: Rule, documentation: '📦 Div con clase', range },
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
