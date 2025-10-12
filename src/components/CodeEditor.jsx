import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { getHTMLSnippets, getCSSSnippets, getJSSnippets } from '../utils/snippets';
import { defineCustomThemes } from '../utils/themes';

function CodeEditor({ value, language, onChange, projectFiles, projectImages, currentTheme, isImage }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const containerRef = useRef(null);
  const [fontSize, setFontSize] = useState(14);

  const handleEditorChange = (value) => {
    onChange(value);
  };

  // Aplicar tema del editor cuando cambia currentTheme (evita quedarse en blanco o tema incorrecto)
  useEffect(() => {
    if (monacoRef.current) {
      try {
        monacoRef.current.editor.setTheme(currentTheme || 'vs-dark');
      } catch (e) {
        // Si aún no está definido, mantener vs-dark
        monacoRef.current.editor.setTheme('vs-dark');
      }
    }
  }, [currentTheme]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const text = e.dataTransfer.getData('text/plain');
    if (text && editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      
      editor.executeEdits('drop', [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        },
        text: text
      }]);
      
      // Mover cursor al final del texto insertado
      const lines = text.split('\n');
      const lastLine = lines[lines.length - 1];
      editor.setPosition({
        lineNumber: position.lineNumber + lines.length - 1,
        column: lines.length === 1 ? position.column + text.length : lastLine.length + 1
      });
      
      editor.focus();
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Definir temas personalizados
    defineCustomThemes(monaco);
    // Aplicar tema actual al montar
    try {
      monaco.editor.setTheme(currentTheme || 'vs-dark');
    } catch {}

    // ===== ATAJOS DE TECLADO ÚTILES =====
    
    // Zoom
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal, () => {
      setFontSize(prev => Math.min(prev + 2, 32)); // Zoom in
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus, () => {
      setFontSize(prev => Math.max(prev - 2, 10)); // Zoom out
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0, () => {
      setFontSize(14); // Reset zoom
    });

    // Formatear código (Ctrl+Shift+F ya está integrado, pero lo hacemos más explícito)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });

    // Duplicar línea (Ctrl+D)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.getAction('editor.action.copyLinesDownAction')?.run();
    });

    // Seleccionar todas las ocurrencias (Ctrl+Shift+L)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyL, () => {
      editor.getAction('editor.action.selectHighlights')?.run();
    });

    // Guardar (Ctrl+S) - mensaje visual
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Mostrar notificación visual de guardado
      const notification = document.createElement('div');
      notification.textContent = '💾 ¡Guardado automático activo!';
      notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(34, 197, 94, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    });

    // Función auxiliar para obtener todas las rutas de archivos
    const getAllFilePaths = (files, basePath = '') => {
      let paths = [];
      Object.entries(files || {}).forEach(([key, item]) => {
        const currentPath = basePath ? `${basePath}/${key}` : key;
        if (item.type === 'file') {
          paths.push({
            path: currentPath,
            name: item.name,
            type: 'file',
            extension: item.name.split('.').pop()
          });
        } else if (item.type === 'folder' && item.children) {
          paths = paths.concat(getAllFilePaths(item.children, currentPath));
        }
      });
      return paths;
    };

    // HTML Snippets + Autocompletado de rutas
    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        let suggestions = getHTMLSnippets(monaco, range);

        // Detectar si estamos en un atributo src, href, etc.
        const inSrcAttribute = /(?:src|href|data)=["'][^"']*$/.test(textUntilPosition);
        
        if (inSrcAttribute) {
          // Agregar archivos del proyecto
          const filePaths = getAllFilePaths(projectFiles);
          const fileCompletions = filePaths.map(file => ({
            label: file.path,
            kind: monaco.languages.CompletionItemKind.File,
            insertText: file.path,
            documentation: `📁 Archivo del proyecto: ${file.name}`,
            detail: `Tipo: ${file.extension}`,
            range
          }));

          // Agregar imágenes cargadas
          const imageCompletions = (projectImages || []).map((image, index) => ({
            label: `${image.name} (imagen cargada)`,
            kind: monaco.languages.CompletionItemKind.File,
            insertText: image.data,
            documentation: `🖼️ Imagen cargada: ${image.name} (${(image.size / 1024).toFixed(1)} KB)`,
            detail: 'Data URL',
            sortText: `0${index}`, // Prioridad alta
            range
          }));

          suggestions = [...imageCompletions, ...fileCompletions, ...suggestions];
        }

        return { suggestions };
      }
    });

    // HTML: completar valores de class="" a partir de clases detectadas en modelos abiertos (CSS/HTML)
    monaco.languages.registerCompletionItemProvider('html', {
      triggerCharacters: [' ', '"', '.'],
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const inClassAttr = /class\s*=\s*["'][^"']*$/.test(textUntilPosition);
        const inForAttr = /for\s*=\s*["'][^"']*$/.test(textUntilPosition);

        if (!inClassAttr && !inForAttr) return { suggestions: [] };

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const models = monaco.editor.getModels();
        const classes = new Set();
        const ids = new Set();

        models.forEach(m => {
          const lang = monaco.editor.getModelLanguage(m.uri);
          const text = m.getValue();
          if (lang === 'css') {
            const re = /\.([_a-zA-Z][-_a-zA-Z0-9]*)/g;
            let match;
            while ((match = re.exec(text))) classes.add(match[1]);
          }
          if (lang === 'html') {
            const reClass = /class\s*=\s*["']([^"']+)["']/g;
            let mClass;
            while ((mClass = reClass.exec(text))) {
              mClass[1].split(/\s+/).forEach(c => c && classes.add(c));
            }
            const reId = /id\s*=\s*["']([^"']+)["']/g;
            let mId;
            while ((mId = reId.exec(text))) ids.add(mId[1]);
          }
        });

        if (inClassAttr) {
          const items = Array.from(classes).sort().map((c, i) => ({
            label: c,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: c,
            sortText: `a${i}`,
            range,
            commitCharacters: [' ']
          }));
          return { suggestions: items };
        }

        if (inForAttr) {
          const items = Array.from(ids).sort().map((idv, i) => ({
            label: idv,
            kind: monaco.languages.CompletionItemKind.Reference,
            insertText: idv,
            sortText: `a${i}`,
            range
          }));
          return { suggestions: items };
        }

        return { suggestions: [] };
      }
    });

    // CSS: sugerir clases usadas en HTML al escribir selectores .clase
    monaco.languages.registerCompletionItemProvider('css', {
      triggerCharacters: ['.'],
      provideCompletionItems: (model, position) => {
        const line = model.getLineContent(position.lineNumber).slice(0, position.column - 1);
        const afterDot = /\.[-_a-zA-Z0-9]*$/.test(line);
        if (!afterDot) return { suggestions: [] };

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const models = monaco.editor.getModels();
        const classes = new Set();
        models.forEach(m => {
          const lang = monaco.editor.getModelLanguage(m.uri);
          if (lang === 'html') {
            const text = m.getValue();
            const reClass = /class\s*=\s*["']([^"']+)["']/g;
            let mClass;
            while ((mClass = reClass.exec(text))) {
              mClass[1].split(/\s+/).forEach(c => c && classes.add(c));
            }
          }
        });

        const items = Array.from(classes).sort().map((c, i) => ({
          label: c,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: c,
          sortText: `a${i}`,
          range
        }));
        return { suggestions: items };
      }
    });

    // CSS: propiedades y valores comunes
    monaco.languages.registerCompletionItemProvider('css', {
      triggerCharacters: [':', '-', ' '],
      provideCompletionItems: (model, position) => {
        const line = model.getLineContent(position.lineNumber).slice(0, position.column - 1);
        const Kind = monaco.languages.CompletionItemKind.Property;
        const ValueKind = monaco.languages.CompletionItemKind.Value;
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        };

        const properties = [
          'display','position','top','right','bottom','left','z-index','flex','flex-direction','justify-content','align-items','gap','grid','grid-template-columns','grid-template-rows','place-items','place-content','width','height','min-width','max-width','min-height','max-height','padding','padding-inline','padding-block','margin','margin-inline','margin-block','color','background','background-color','background-image','background-size','border','border-radius','box-shadow','opacity','overflow','overflow-x','overflow-y','object-fit','object-position','transition','transform','cursor','pointer-events'
        ].map(p => ({ label: p, kind: Kind, insertText: `${p}: `, range }));

        const valuesMap = {
          display: ['block','inline','inline-block','flex','grid','none','contents'],
          position: ['static','relative','absolute','fixed','sticky'],
          'justify-content': ['flex-start','center','flex-end','space-between','space-around','space-evenly'],
          'align-items': ['stretch','flex-start','center','flex-end','baseline'],
          'flex-direction': ['row','row-reverse','column','column-reverse'],
          'object-fit': ['fill','contain','cover','none','scale-down'],
          overflow: ['visible','hidden','auto','scroll','clip'],
          cursor: ['default','pointer','move','text','not-allowed','crosshair','grab','zoom-in'],
          'background-size': ['auto','cover','contain'],
          'background-repeat': ['repeat','no-repeat','repeat-x','repeat-y','space','round'],
          'background-attachment': ['scroll','fixed','local'],
          'background-image': ['linear-gradient(${1:to right}, ${2:#667eea}, ${3:#764ba2})'],
          'box-shadow': ['${1:0 4px 6px} rgba(0,0,0,0.1)'],
          transition: ['all 0.3s ease','opacity 0.3s ease','transform 0.3s ease'],
          transform: ['scale(1.05)','translate(0, -2px)','rotate(3deg)'],
        };

        // Determinar si estamos escribiendo valor después de ':'
        const isValue = line.includes(':') && !line.trimEnd().endsWith(':');
        if (isValue) {
          const prop = line.split(':')[0].trim();
          const candidates = valuesMap[prop] || [];
          const suggestions = candidates.map(v => ({ label: v.replace(/\$\{\d+:?/g,''), kind: ValueKind, insertText: v, range }));
          return { suggestions };
        }

        return { suggestions: properties };
      }
    });

    // HTML: Atributos contextuales por etiqueta
    monaco.languages.registerCompletionItemProvider('html', {
      triggerCharacters: [' ', ':', '-', '"', '\''],
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // Detectar si estamos dentro de una etiqueta abierta
        // Ejemplo: <img |  o <img src="|"
        const openTagMatch = /<([a-zA-Z0-9\-]+)([^>]*)$/m.exec(model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        }));
        if (!openTagMatch) return { suggestions: [] };

        const tag = openTagMatch[1].toLowerCase();
        const existing = openTagMatch[2] || '';

        const Kind = monaco.languages.CompletionItemKind.Property;
        const Rule = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column
        };

        const addIfMissing = (name, item) => existing.includes(`${name}=`) ? null : item;

        const generalAttrs = [
          { label: 'class', insertText: 'class="${1}"', documentation: 'Clase CSS', kind: Kind, insertTextRules: Rule, range },
          { label: 'id', insertText: 'id="${1}"', documentation: 'ID único', kind: Kind, insertTextRules: Rule, range },
          { label: 'style', insertText: 'style="${1}"', documentation: 'Estilos inline', kind: Kind, insertTextRules: Rule, range },
          { label: 'data-*', insertText: 'data-${1:key}="${2:value}"', documentation: 'Atributo data-*', kind: Kind, insertTextRules: Rule, range },
          { label: 'aria-*', insertText: 'aria-${1:label}="${2}"', documentation: 'Atributo aria-*', kind: Kind, insertTextRules: Rule, range },
        ].map(a => addIfMissing(a.label.split('=')[0], a)).filter(Boolean);

        const byTag = {
          img: [
            addIfMissing('src', { label: 'src', kind: Kind, insertText: 'src="${1}"', documentation: 'Origen de imagen', insertTextRules: Rule, range }),
            addIfMissing('alt', { label: 'alt', kind: Kind, insertText: 'alt="${1}"', documentation: 'Texto alternativo', insertTextRules: Rule, range }),
            addIfMissing('width', { label: 'width', kind: Kind, insertText: 'width="${1}"', documentation: 'Ancho', insertTextRules: Rule, range }),
            addIfMissing('height', { label: 'height', kind: Kind, insertText: 'height="${1}"', documentation: 'Alto', insertTextRules: Rule, range }),
            addIfMissing('loading', { label: 'loading', kind: Kind, insertText: 'loading="${1|lazy,eager|}"', documentation: 'Carga diferida', insertTextRules: Rule, range }),
            addIfMissing('decoding', { label: 'decoding', kind: Kind, insertText: 'decoding="${1|async,auto,sync|}"', documentation: 'Decodificación', insertTextRules: Rule, range }),
            addIfMissing('referrerpolicy', { label: 'referrerpolicy', kind: Kind, insertText: 'referrerpolicy="${1|no-referrer,origin|}"', documentation: 'Política de referencia', insertTextRules: Rule, range })
          ],
          a: [
            addIfMissing('href', { label: 'href', kind: Kind, insertText: 'href="${1:#}"', documentation: 'Destino del enlace', insertTextRules: Rule, range }),
            addIfMissing('target', { label: 'target', kind: Kind, insertText: 'target="${1|_blank,_self,_parent,_top|}"', documentation: 'Destino/ventana', insertTextRules: Rule, range }),
            addIfMissing('rel', { label: 'rel', kind: Kind, insertText: 'rel="${1|noopener,noreferrer|}"', documentation: 'Relación del enlace', insertTextRules: Rule, range })
          ],
          script: [
            addIfMissing('src', { label: 'src', kind: Kind, insertText: 'src="${1}.js"', documentation: 'Origen del script', insertTextRules: Rule, range }),
            addIfMissing('type', { label: 'type', kind: Kind, insertText: 'type="${1|module,text/javascript|}"', documentation: 'Tipo de script', insertTextRules: Rule, range }),
            addIfMissing('defer', { label: 'defer', kind: Kind, insertText: 'defer', documentation: 'Diferir ejecución', insertTextRules: Rule, range }),
            addIfMissing('async', { label: 'async', kind: Kind, insertText: 'async', documentation: 'Ejecución asíncrona', insertTextRules: Rule, range })
          ],
          link: [
            addIfMissing('rel', { label: 'rel', kind: Kind, insertText: 'rel="${1|stylesheet,preload,icon|}"', documentation: 'Relación', insertTextRules: Rule, range }),
            addIfMissing('href', { label: 'href', kind: Kind, insertText: 'href="${1}.css"', documentation: 'Referencia', insertTextRules: Rule, range }),
            addIfMissing('as', { label: 'as', kind: Kind, insertText: 'as="${1|style,script,font,image|}"', documentation: 'Tipo de recurso', insertTextRules: Rule, range })
          ],
          video: [
            addIfMissing('controls', { label: 'controls', kind: Kind, insertText: 'controls', documentation: 'Controles de reproducción', insertTextRules: Rule, range }),
            addIfMissing('autoplay', { label: 'autoplay', kind: Kind, insertText: 'autoplay', documentation: 'Auto reproducir', insertTextRules: Rule, range }),
            addIfMissing('loop', { label: 'loop', kind: Kind, insertText: 'loop', documentation: 'Repetir', insertTextRules: Rule, range })
          ],
          audio: [
            addIfMissing('controls', { label: 'controls', kind: Kind, insertText: 'controls', documentation: 'Controles', insertTextRules: Rule, range }),
            addIfMissing('autoplay', { label: 'autoplay', kind: Kind, insertText: 'autoplay', documentation: 'Auto reproducir', insertTextRules: Rule, range })
          ],
          meta: [
            addIfMissing('name', { label: 'name', kind: Kind, insertText: 'name="${1|description,keywords,viewport|}"', documentation: 'Nombre meta', insertTextRules: Rule, range }),
            addIfMissing('content', { label: 'content', kind: Kind, insertText: 'content="${1}"', documentation: 'Contenido meta', insertTextRules: Rule, range })
          ],
          iframe: [
            addIfMissing('src', { label: 'src', kind: Kind, insertText: 'src="${1}"', documentation: 'URL embebida', insertTextRules: Rule, range }),
            addIfMissing('width', { label: 'width', kind: Kind, insertText: 'width="${1}"', documentation: 'Ancho', insertTextRules: Rule, range }),
            addIfMissing('height', { label: 'height', kind: Kind, insertText: 'height="${1}"', documentation: 'Alto', insertTextRules: Rule, range }),
            addIfMissing('allow', { label: 'allow', kind: Kind, insertText: 'allow="${1|fullscreen; autoplay; clipboard-write; encrypted-media|}"', documentation: 'Permisos', insertTextRules: Rule, range }),
            addIfMissing('loading', { label: 'loading', kind: Kind, insertText: 'loading="${1|lazy,eager|}"', documentation: 'Carga diferida', insertTextRules: Rule, range })
          ],
          form: [
            addIfMissing('action', { label: 'action', kind: Kind, insertText: 'action="${1}"', documentation: 'Destino del formulario', insertTextRules: Rule, range }),
            addIfMissing('method', { label: 'method', kind: Kind, insertText: 'method="${1|get,post|}"', documentation: 'Método HTTP', insertTextRules: Rule, range }),
            addIfMissing('enctype', { label: 'enctype', kind: Kind, insertText: 'enctype="${1|application/x-www-form-urlencoded,multipart/form-data,text/plain|}"', documentation: 'Tipo de contenido', insertTextRules: Rule, range })
          ],
          input: [
            addIfMissing('type', { label: 'type', kind: Kind, insertText: 'type="${1|text,number,email,password,checkbox,radio,file,date,color,range,search,tel,url,time,datetime-local,month,week|}"', documentation: 'Tipo de input', insertTextRules: Rule, range }),
            addIfMissing('name', { label: 'name', kind: Kind, insertText: 'name="${1}"', documentation: 'Nombre de campo', insertTextRules: Rule, range }),
            addIfMissing('id', { label: 'id', kind: Kind, insertText: 'id="${1}"', documentation: 'ID del campo', insertTextRules: Rule, range }),
            addIfMissing('placeholder', { label: 'placeholder', kind: Kind, insertText: 'placeholder="${1}"', documentation: 'Placeholder', insertTextRules: Rule, range }),
            addIfMissing('required', { label: 'required', kind: Kind, insertText: 'required', documentation: 'Campo requerido', insertTextRules: Rule, range }),
            addIfMissing('min', { label: 'min', kind: Kind, insertText: 'min="${1}"', documentation: 'Valor mínimo', insertTextRules: Rule, range }),
            addIfMissing('max', { label: 'max', kind: Kind, insertText: 'max="${1}"', documentation: 'Valor máximo', insertTextRules: Rule, range }),
            addIfMissing('step', { label: 'step', kind: Kind, insertText: 'step="${1}"', documentation: 'Incremento', insertTextRules: Rule, range }),
            addIfMissing('minlength', { label: 'minlength', kind: Kind, insertText: 'minlength="${1}"', documentation: 'Longitud mínima', insertTextRules: Rule, range }),
            addIfMissing('maxlength', { label: 'maxlength', kind: Kind, insertText: 'maxlength="${1}"', documentation: 'Longitud máxima', insertTextRules: Rule, range }),
            addIfMissing('pattern', { label: 'pattern', kind: Kind, insertText: 'pattern="${1}"', documentation: 'Expresión regular', insertTextRules: Rule, range }),
            addIfMissing('autocomplete', { label: 'autocomplete', kind: Kind, insertText: 'autocomplete="${1|on,off,name,email,username,new-password,current-password,one-time-code,street-address,postal-code,country|}"', documentation: 'Sugerencias del navegador', insertTextRules: Rule, range }),
            addIfMissing('checked', { label: 'checked', kind: Kind, insertText: 'checked', documentation: 'Marcado (checkbox/radio)', insertTextRules: Rule, range }),
            addIfMissing('value', { label: 'value', kind: Kind, insertText: 'value="${1}"', documentation: 'Valor inicial', insertTextRules: Rule, range }),
            addIfMissing('multiple', { label: 'multiple', kind: Kind, insertText: 'multiple', documentation: 'Múltiples valores', insertTextRules: Rule, range }),
            addIfMissing('accept', { label: 'accept', kind: Kind, insertText: 'accept="${1|image/*,audio/*,video/*,.pdf,.docx|}"', documentation: 'Tipos aceptados (file)', insertTextRules: Rule, range })
          ],
          source: [
            addIfMissing('src', { label: 'src', kind: Kind, insertText: 'src="${1}"', documentation: 'Origen de media', insertTextRules: Rule, range }),
            addIfMissing('type', { label: 'type', kind: Kind, insertText: 'type="${1|image/png,image/jpeg,video/mp4,audio/mpeg|}"', documentation: 'MIME type', insertTextRules: Rule, range })
          ],
          picture: [
            addIfMissing('media', { label: 'media', kind: Kind, insertText: 'media="${1:(max-width: 600px)}"', documentation: 'Media query', insertTextRules: Rule, range })
          ],
          label: [
            addIfMissing('for', { label: 'for', kind: Kind, insertText: 'for="${1:id}"', documentation: 'Asociar con id de input', insertTextRules: Rule, range })
          ]
        };

        const tagAttrs = (byTag[tag] || []).filter(Boolean);
        const suggestions = [...generalAttrs, ...tagAttrs];
        return { suggestions };
      }
    });

    // JavaScript Snippets + Autocompletado de rutas
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        let suggestions = getJSSnippets(monaco, range);

        // Detectar si estamos en un string (import, require, fetch, etc.)
        const inString = /["'][^"']*$/.test(textUntilPosition);
        const afterImportOrRequire = /(import|require|fetch)\s*\(?\s*["'][^"']*$/.test(textUntilPosition);
        
        if (inString && (afterImportOrRequire || textUntilPosition.includes('./'))) {
          const filePaths = getAllFilePaths(projectFiles);
          const jsFiles = filePaths.filter(f => 
            ['js', 'json', 'css', 'html'].includes(f.extension)
          );

          const fileCompletions = jsFiles.map(file => ({
            label: `./${file.path}`,
            kind: monaco.languages.CompletionItemKind.Module,
            insertText: `./${file.path}`,
            documentation: `📦 Módulo: ${file.name}`,
            range
          }));

          suggestions = [...fileCompletions, ...suggestions];
        }

        return { suggestions };
      }
    });
  };

  return (
    isImage && value ? (
      <div className="h-full bg-editor-bg flex items-center justify-center p-8">
        <div className="max-w-full max-h-full flex flex-col items-center gap-4">
          <img
            src={value}
            alt="Preview"
            className="max-w-full max-h-[calc(100vh-200px)] object-contain rounded-lg shadow-2xl border border-blue-500/30"
          />
          <p className="text-sm text-gray-400">Vista previa de imagen</p>
        </div>
      </div>
    ) : (
      <div
        ref={containerRef}
        className="h-full relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

        {/* Indicador visual de drag & drop */}
        {isDraggingOver && (
          <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 pointer-events-none z-50 flex items-center justify-center">
            <div className="bg-blue-500/90 text-white px-6 py-4 rounded-lg shadow-2xl flex flex-col items-center gap-2 animate-pulse">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-lg font-bold">Suelta aquí para insertar imagen</span>
              <span className="text-sm opacity-80">La etiqueta &lt;img&gt; se añadirá en la posición del cursor</span>
            </div>
          </div>
        )}

        <Editor
          height="100%"
          language={language}
          value={value}
          theme={currentTheme || "vs-dark"}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            ['semanticHighlighting.enabled']: false,
            tabSize: 2,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            fontFamily: "'Consolas', 'Courier New', monospace",
            fontLigatures: true,
            padding: { top: 16 },
            // Autocompletado robusto
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true
            },
            parameterHints: { enabled: true },
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: true,
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showClasses: true,
              showFunctions: true,
              showVariables: true,
              showModules: true,
              showProperties: true,
              showValues: true,
              showColors: true
            },
            // Autocerrado robusto
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoClosingOvertype: 'always',
            autoClosingDelete: 'always',
            autoSurround: 'languageDefined',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            // Formateo
            formatOnPaste: true,
            formatOnType: true,
            // Mejorar experiencia
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            mouseWheelZoom: true,
            dragAndDrop: true,
          }}
        />
      </div>
    )
  );
}

export default CodeEditor;
