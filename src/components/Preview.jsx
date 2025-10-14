import { useEffect, useRef, useState } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';

function Preview({ content, onConsoleLog, projectFiles, projectImages }) {
  const iframeRef = useRef(null);
  const [key, setKey] = useState(0);
  const [previewWindow, setPreviewWindow] = useState(null);

  // Función para resolver rutas de imágenes
  const resolveImagePaths = (htmlContent) => {
    let processedContent = htmlContent;

    // Reemplazar imágenes del proyecto por sus data URLs en atributos HTML
    if (projectImages && projectImages.length > 0) {
      projectImages.forEach(image => {
        const attrByName = new RegExp(`(src|href)=["']${image.name}["']`, 'gi');
        processedContent = processedContent.replace(attrByName, `$1="${image.data}"`);
      });
    }

    // Buscar archivos de imagen en el árbol del proyecto
    const getAllImageFiles = (files, basePath = '') => {
      let images = [];
      Object.entries(files || {}).forEach(([key, item]) => {
        const currentPath = basePath ? `${basePath}/${key}` : key;
        if (item.type === 'file' && item.isImage && item.content) {
          images.push({ path: currentPath, name: item.name, data: item.content });
        } else if (item.type === 'folder' && item.children) {
          images = images.concat(getAllImageFiles(item.children, currentPath));
        }
      });
      return images;
    };

    const imageFiles = getAllImageFiles(projectFiles);

    // Helpers de normalización
    const stripQuotes = (s) => s.replace(/^['"]|['"]$/g, '');
    const stripLeadingDots = (s) => s.replace(/^(\.\/)+/, '').replace(/^(\.\.\/)+/, '');
    const stripLeadingSlashes = (s) => s.replace(/^\/+/, '');
    const basename = (s) => s.split('?')[0].split('#')[0].split('/').pop();

    // Reemplazos en atributos HTML (src/href) directos y relativos
    imageFiles.forEach(image => {
      const byName = new RegExp(`(src|href)=["']${image.name}["']`, 'gi');
      processedContent = processedContent.replace(byName, `$1="${image.data}"`);

      const byPath = new RegExp(`(src|href)=["']${image.path}["']`, 'gi');
      processedContent = processedContent.replace(byPath, `$1="${image.data}"`);

      const byRelPath = new RegExp(`(src|href)=["']\\./${image.path}["']`, 'gi');
      processedContent = processedContent.replace(byRelPath, `$1="${image.data}"`);

      // Cualquier ruta que termine en el nombre (con ./, ../ y subcarpetas)
      const byAnyEndingWithName = new RegExp(`(src|href)=["'](?:\./|(?:\.\./)+)?[^"']*?${image.name}["']`, 'gi');
      processedContent = processedContent.replace(byAnyEndingWithName, (m) => m.replace(/(src|href)=["'][^"']+["']/, `$1="${image.data}"`));
    });

    // Pase genérico: (src|href)="..." => si basename coincide, reemplazar
    processedContent = processedContent.replace(/\b(src|href)=["']([^"']+)["']/gi, (full, attr, url) => {
      const clean = stripLeadingSlashes(stripLeadingDots(stripQuotes(url)));
      const base = basename(clean);
      const found = imageFiles.find(img => img.name === base) || (projectImages || []).find(img => img.name === base);
      return found ? `${attr}="${found.data}"` : full;
    });

    // Manejar srcset: lista separada por comas con descriptores (1x, 2x, widths)
    const replaceSrcset = (srcsetValue) => {
      return srcsetValue.split(',').map(part => {
        const trimmed = part.trim();
        const [urlPart, descriptor] = trimmed.split(/\s+/, 2);
        const clean = stripLeadingSlashes(stripLeadingDots(stripQuotes(urlPart)));
        const base = basename(clean);
        const found = imageFiles.find(img => img.name === base) || (projectImages || []).find(img => img.name === base);
        const newUrl = found ? found.data : urlPart;
        return descriptor ? `${newUrl} ${descriptor}` : newUrl;
      }).join(', ');
    };

    processedContent = processedContent.replace(/\bsrcset=["']([^"']+)["']/gi, (full, val) => `srcset="${replaceSrcset(val)}"`);

    // Reemplazos dentro de CSS: url(...)
    const replaceCssUrl = (content, match, urlValue) => {
      // urlValue puede venir con o sin comillas. Limpiar ./ y ../ iniciales y comillas.
      const cleanedRaw = urlValue.trim();
      const cleanedNoQuotes = stripQuotes(cleanedRaw);
      const cleaned = stripLeadingSlashes(stripLeadingDots(cleanedNoQuotes));
      const cleanBase = basename(cleaned);
      // Buscar por ruta exacta, luego por nombre de archivo (basename)
      const img = imageFiles.find(img => img.path === cleaned || img.name === cleaned || img.name === cleanBase) ||
                  (projectImages || []).find(img => img.name === cleaned || img.name === cleanBase);
      if (img) {
        return match.replace(urlValue, `'${img.data}'`);
      }
      // Intento adicional: quitar más ../ profundos y comparar por basename
      const cleanedMore = cleaned.replace(/^(\.\.\/)+/, '');
      const img2 = imageFiles.find(img => img.name === basename(cleanedMore) || img.path === cleanedMore);
      if (img2) {
        return match.replace(urlValue, `'${img2.data}'`);
      }
      return match;
    };

    // Aplicar a todas las apariciones de url(...) en el documento completo (incluye <style> inyectado)
    processedContent = processedContent.replace(/url\(([^)]+)\)/gi, (m, p1) => replaceCssUrl(processedContent, m, p1));

    return processedContent;
  };

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Inyectar código para interceptar console.log
      const consoleInterceptor = `
        <script>
          (function() {
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;
            
            console.log = function(...args) {
              window.parent.postMessage({
                type: 'console',
                method: 'log',
                args: args.map(arg => {
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return String(arg);
                    }
                  }
                  return String(arg);
                })
              }, '*');
              originalLog.apply(console, args);
            };
            
            console.error = function(...args) {
              window.parent.postMessage({
                type: 'console',
                method: 'error',
                args: args.map(arg => String(arg))
              }, '*');
              originalError.apply(console, args);
            };
            
            console.warn = function(...args) {
              window.parent.postMessage({
                type: 'console',
                method: 'warn',
                args: args.map(arg => String(arg))
              }, '*');
              originalWarn.apply(console, args);
            };
            
            console.info = function(...args) {
              window.parent.postMessage({
                type: 'console',
                method: 'info',
                args: args.map(arg => String(arg))
              }, '*');
              originalInfo.apply(console, args);
            };
            
            // Debounce para errores repetitivos
            let lastError = '';
            let errorCount = 0;
            window.addEventListener('error', function(e) {
              const errorMsg = 'Error: ' + e.message;
              if (errorMsg === lastError) {
                errorCount++;
                if (errorCount > 3) return; // No enviar si se repite más de 3 veces
              } else {
                lastError = errorMsg;
                errorCount = 1;
              }
              window.parent.postMessage({
                type: 'console',
                method: 'error',
                args: [errorMsg + ' at line ' + e.lineno]
              }, '*');
            });

          })();
        </script>
      `;
      
      // Resolver rutas de imágenes
      let processedContent = resolveImagePaths(content);
      
      // Insertar el interceptor antes del contenido
      processedContent = processedContent.replace('<head>', '<head>' + consoleInterceptor);
      
      doc.open();
      doc.write(processedContent);
      doc.close();
    }
  }, [content, key, projectFiles, projectImages]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'console' && onConsoleLog) {
        onConsoleLog(event.data.method, event.data.args);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleLog]);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const handleOpenInNewTab = () => {
    // Resolver rutas de imágenes
    const processedContent = resolveImagePaths(content);
    
    // Crear un blob con el contenido HTML
    const blob = new Blob([processedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Abrir en nueva pestaña
    const newWindow = window.open(url, '_blank');
    setPreviewWindow(newWindow);
    
    // Limpiar URL después de abrir
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Actualizar la ventana externa cuando cambia el contenido
  useEffect(() => {
    if (previewWindow && !previewWindow.closed) {
      const processedContent = resolveImagePaths(content);
      const blob = new Blob([processedContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      previewWindow.location.href = url;
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, [content, projectFiles, projectImages]);

  return (
    <div className="h-full flex flex-col bg-white relative">
      <div className="h-10 bg-tab-bg border-b border-purple-500/30 flex items-center justify-between px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent pointer-events-none"></div>
        <span className="text-sm text-purple-200 font-medium relative z-10">Vista Previa</span>
        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={handleOpenInNewTab}
            className="p-1.5 hover:bg-green-500/20 rounded transition-all border border-transparent hover:border-green-500/40 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            title="Abrir en nueva pestaña (Live Server)"
          >
            <ExternalLink className="w-4 h-4 text-green-400" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-purple-500/20 rounded transition-all border border-transparent hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            title="Refrescar preview"
          >
            <RefreshCw className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>
      <iframe
        key={key}
        ref={iframeRef}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin allow-popups allow-modals"
        title="Preview"
      />
    </div>
  );
}

export default Preview;
