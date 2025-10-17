import { useEffect, useRef, useState } from 'react';
import { RefreshCw, ExternalLink, Smartphone, Tablet, Monitor, RotateCw, ZoomIn, ZoomOut, Maximize2, Grid3x3, X } from 'lucide-react';

// Presets de viewport
const VIEWPORT_PRESETS = {
  desktop: { width: '100%', height: '100%', label: 'Desktop', icon: Monitor },
  tablet: { width: 768, height: 1024, label: 'Tablet', icon: Tablet },
  mobile: { width: 375, height: 667, label: 'Mobile', icon: Smartphone },
  iphone14: { width: 390, height: 844, label: 'iPhone 14', icon: Smartphone },
  ipad: { width: 820, height: 1180, label: 'iPad', icon: Tablet },
  custom: { width: 800, height: 600, label: 'Custom', icon: Monitor }
};

function Preview({ content, onConsoleLog, projectFiles, projectImages, currentTheme }) {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [key, setKey] = useState(0);
  const [previewWindow, setPreviewWindow] = useState(null);
  const [viewport, setViewport] = useState('desktop');
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);
  const [isRotated, setIsRotated] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const isLite = currentTheme === 'lite';

  // Función para escapar caracteres especiales en expresiones regulares
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Función para resolver rutas de imágenes
  const resolveImagePaths = (htmlContent) => {
    let processedContent = htmlContent;

    // Reemplazar imágenes del proyecto por sus data URLs en atributos HTML
    if (projectImages && projectImages.length > 0) {
      projectImages.forEach(image => {
        const escapedName = escapeRegExp(image.name);
        const attrByName = new RegExp(`(src|href)=["']${escapedName}["']`, 'gi');
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
      const escapedName = escapeRegExp(image.name);
      const escapedPath = escapeRegExp(image.path);
      
      const byName = new RegExp(`(src|href)=["']${escapedName}["']`, 'gi');
      processedContent = processedContent.replace(byName, `$1="${image.data}"`);

      const byPath = new RegExp(`(src|href)=["']${escapedPath}["']`, 'gi');
      processedContent = processedContent.replace(byPath, `$1="${image.data}"`);

      const byRelPath = new RegExp(`(src|href)=["']\\./${escapedPath}["']`, 'gi');
      processedContent = processedContent.replace(byRelPath, `$1="${image.data}"`);

      // Cualquier ruta que termine en el nombre (con ./, ../ y subcarpetas)
      const byAnyEndingWithName = new RegExp(`(src|href)=["'](?:\./|(?:\.\./)+)?[^"']*?${escapedName}["']`, 'gi');
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
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const consoleInterceptor = `
        <script>
          (function() {
            // Evitar múltiples inicializaciones
            if (window.__consoleInterceptorInitialized) return;
            window.__consoleInterceptorInitialized = true;
            
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;
            
            console.log = function(...args) {
              window.parent.postMessage({
                type: 'console',
                method: 'log',
                args: args.map(arg => String(arg))
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
            let errorTimer = null;
            
            window.addEventListener('error', function(e) {
              // Prevenir la propagación por defecto
              e.preventDefault();
              
              const errorMsg = 'Error: ' + (e.message || 'Unknown error');
              const fullErrorMsg = errorMsg + (e.lineno ? ' at line ' + e.lineno : '');
              
              if (errorMsg === lastError) {
                errorCount++;
                if (errorCount > 3) {
                  if (errorCount === 4) {
                    window.parent.postMessage({
                      type: 'console',
                      method: 'warn',
                      args: ['⚠ Errores repetitivos suprimidos para evitar spam']
                    }, '*');
                  }
                  return;
                }
              } else {
                lastError = errorMsg;
                errorCount = 1;
              }
              
              // Resetear contador después de 2 segundos
              clearTimeout(errorTimer);
              errorTimer = setTimeout(() => {
                errorCount = 0;
                lastError = '';
              }, 2000);
              
              window.parent.postMessage({
                type: 'console',
                method: 'error',
                args: [fullErrorMsg]
              }, '*');
            });
            
            // Capturar promesas rechazadas no manejadas
            window.addEventListener('unhandledrejection', function(e) {
              e.preventDefault();
              window.parent.postMessage({
                type: 'console',
                method: 'error',
                args: ['Unhandled Promise Rejection: ' + (e.reason || 'Unknown reason')]
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
  }, [content, key]);

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

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);
  const handleZoomFit = () => {
    if (viewport !== 'desktop' && containerRef.current) {
      const container = containerRef.current;
      const preset = VIEWPORT_PRESETS[viewport];
      const width = isRotated ? preset.height : preset.width;
      const height = isRotated ? preset.width : preset.height;
      
      if (typeof width === 'number' && typeof height === 'number') {
        const scaleX = (container.clientWidth - 40) / width;
        const scaleY = (container.clientHeight - 40) / height;
        setZoom(Math.min(scaleX, scaleY, 1));
      }
    }
  };

  const handleRotate = () => setIsRotated(prev => !prev);
  
  const getIframeDimensions = () => {
    const preset = VIEWPORT_PRESETS[viewport];
    let width = viewport === 'custom' ? customWidth : preset.width;
    let height = viewport === 'custom' ? customHeight : preset.height;
    
    if (isRotated && typeof width === 'number' && typeof height === 'number') {
      [width, height] = [height, width];
    }
    
    return { width, height };
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

  const { width: iframeWidth, height: iframeHeight } = getIframeDimensions();
  const isResponsiveMode = viewport !== 'desktop';

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Header con controles sutiles */}
      <div 
        className="h-10 border-b flex items-center justify-between px-3 relative group"
        style={{
          backgroundColor: 'var(--theme-background-tertiary)',
          borderColor: isLite ? 'var(--theme-border)' : 'rgba(139, 92, 246, 0.3)'
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {!isLite && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent pointer-events-none"></div>
        )}
        
        {/* Título y dimensiones */}
        <div className="flex items-center gap-2 relative z-10">
          <span 
            className="text-sm font-medium"
            style={{ color: isLite ? 'var(--theme-secondary)' : '#c4b5fd' }}
          >
            Vista Previa
          </span>
          {isResponsiveMode && (
            <span className="text-xs opacity-60" style={{ color: 'var(--theme-text-secondary)' }}>
              {iframeWidth}x{iframeHeight} ({Math.round(zoom * 100)}%)
            </span>
          )}
        </div>

        {/* Controles sutiles */}
        <div className={`flex items-center gap-1 relative z-10 transition-opacity ${showControls ? 'opacity-100' : 'opacity-60'}`}>
          {/* Presets de viewport */}
          {Object.entries(VIEWPORT_PRESETS).map(([key, preset]) => {
            const Icon = preset.icon;
            return (
              <button
                key={key}
                onClick={() => {
                  setViewport(key);
                  setIsRotated(false);
                  setZoom(1);
                }}
                className="p-1 rounded transition-all"
                style={{
                  backgroundColor: viewport === key ? (isLite ? 'rgba(143, 104, 249, 0.15)' : 'rgba(139, 92, 246, 0.2)') : 'transparent',
                  color: viewport === key ? (isLite ? '#8F68F9' : '#c4b5fd') : (isLite ? 'var(--theme-text-secondary)' : '#9ca3af'),
                  border: viewport === key ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent'
                }}
                title={preset.label}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}

          {isResponsiveMode && (
            <>
              <div className="w-px h-4 mx-0.5" style={{ backgroundColor: 'var(--theme-border)' }} />
              
              {/* Rotate */}
              <button
                onClick={handleRotate}
                className="p-1 rounded transition-all"
                style={{
                  backgroundColor: isRotated ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  color: isLite ? 'var(--theme-text)' : '#9ca3af'
                }}
                title="Rotar (Portrait/Landscape)"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Zoom controls */}
              <button onClick={handleZoomOut} className="p-1 rounded" style={{ color: isLite ? 'var(--theme-text)' : '#9ca3af' }} title="Zoom Out">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleZoomReset} className="px-1.5 py-0.5 rounded text-xs" style={{ color: isLite ? 'var(--theme-text)' : '#9ca3af' }} title="Reset Zoom">
                {Math.round(zoom * 100)}%
              </button>
              <button onClick={handleZoomIn} className="p-1 rounded" style={{ color: isLite ? 'var(--theme-text)' : '#9ca3af' }} title="Zoom In">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleZoomFit} className="p-1 rounded" style={{ color: isLite ? 'var(--theme-text)' : '#9ca3af' }} title="Ajustar a pantalla">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <div className="w-px h-4 mx-0.5" style={{ backgroundColor: 'var(--theme-border)' }} />

          {/* Grid toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="p-1 rounded transition-all"
            style={{
              backgroundColor: showGrid ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: isLite ? 'var(--theme-text)' : '#9ca3af'
            }}
            title="Toggle Grid"
          >
            <Grid3x3 className="w-3.5 h-3.5" />
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="p-1 rounded transition-all"
            style={{ color: isLite ? '#8F68F9' : '#c084fc' }}
            title="Refrescar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Open in new tab */}
          <button
            onClick={handleOpenInNewTab}
            className="p-1 rounded transition-all"
            style={{ color: isLite ? 'var(--theme-secondary)' : '#4ade80' }}
            title="Abrir en nueva pestaña"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex items-center justify-center relative"
        style={{
          backgroundColor: isResponsiveMode ? (isLite ? '#f3f4f6' : '#1a1a1a') : 'white'
        }}
      >
        {/* Grid overlay */}
        {showGrid && isResponsiveMode && (
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}

        {/* Iframe container */}
        <div
          className="relative transition-all"
          style={{
            width: iframeWidth,
            height: iframeHeight,
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            boxShadow: isResponsiveMode ? '0 20px 60px rgba(0,0,0,0.3)' : 'none',
            border: isResponsiveMode ? '8px solid #333' : 'none',
            borderRadius: isResponsiveMode ? '12px' : '0',
            backgroundColor: 'white',
            overflow: 'hidden'
          }}
        >
          {/* Device notch (solo en mobile) */}
          {isResponsiveMode && viewport.includes('iphone') && !isRotated && (
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20"
              style={{
                width: '150px',
                height: '25px',
                backgroundColor: '#000',
                borderRadius: '0 0 20px 20px'
              }}
            />
          )}

          <iframe
            key={key}
            ref={iframeRef}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-popups allow-modals"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}

export default Preview;
