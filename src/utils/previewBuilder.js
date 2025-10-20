/**
 * Constructor de Preview Dinámico
 * Genera HTML para preview basándose en archivos del proyecto
 */

/**
 * Obtener archivo por ruta
 */
const getFileByPath = (files, path) => {
  const parts = path.split('/');
  let current = files;

  for (const part of parts) {
    if (!current || !current[part]) return null;
    
    if (current[part].type === 'folder') {
      current = current[part].children;
    } else {
      return current[part];
    }
  }

  return null;
};

/**
 * Buscar todos los archivos de un tipo específico
 */
const findFilesByExtension = (files, extensions, basePath = '') => {
  let results = [];

  Object.entries(files || {}).forEach(([key, item]) => {
    const currentPath = basePath ? `${basePath}/${key}` : key;

    if (item.type === 'file') {
      const ext = item.name.split('.').pop()?.toLowerCase();
      if (extensions.includes(ext)) {
        results.push({
          path: currentPath,
          name: item.name,
          content: item.content || '',
          language: item.language
        });
      }
    } else if (item.type === 'folder' && item.children) {
      results = results.concat(findFilesByExtension(item.children, extensions, currentPath));
    }
  });

  return results;
};

/**
 * Buscar primer archivo HTML en el proyecto
 */
const findFirstHTMLFile = (files) => {
  const htmlFiles = findFilesByExtension(files, ['html', 'htm']);
  
  // Prioridad: index.html > cualquier otro
  const indexFile = htmlFiles.find(f => f.name.toLowerCase() === 'index.html');
  if (indexFile) return indexFile;
  
  return htmlFiles[0] || null;
};

/**
 * Inyectar CSS en el HTML
 */
const injectCSS = (html, cssFiles) => {
  if (!cssFiles || cssFiles.length === 0) return html;

  let result = html;
  const cssContent = cssFiles.map(f => f.content).join('\n\n');

  // Buscar </head> y agregar antes
  if (result.includes('</head>')) {
    result = result.replace('</head>', `<style>\n${cssContent}\n</style>\n</head>`);
  } else {
    // Si no hay </head>, agregar al inicio
    result = `<style>\n${cssContent}\n</style>\n${result}`;
  }

  return result;
};

/**
 * Inyectar JS en el HTML
 */
const injectJS = (html, jsFiles) => {
  if (!jsFiles || jsFiles.length === 0) return html;

  let result = html;
  const jsContent = jsFiles.map(f => f.content).join('\n\n');

  // Buscar </body> y agregar antes
  if (result.includes('</body>')) {
    result = result.replace('</body>', `<script>\n${jsContent}\n</script>\n</body>`);
  } else {
    // Si no hay </body>, agregar al final
    result = `${result}\n<script>\n${jsContent}\n</script>`;
  }

  return result;
};

/**
 * Construir preview desde archivo activo
 * Si el archivo activo es HTML, lo usa como base
 * Si no, busca cualquier HTML en el proyecto
 */
export const buildPreviewFromActiveFile = (files, activeFilePath) => {
  let htmlFile = null;

  // 1. Si el archivo activo es HTML, usarlo
  if (activeFilePath && activeFilePath.endsWith('.html')) {
    const activeFile = getFileByPath(files, activeFilePath);
    if (activeFile && activeFile.type === 'file') {
      htmlFile = {
        path: activeFilePath,
        name: activeFile.name,
        content: activeFile.content || '',
        language: activeFile.language
      };
    }
  }

  // 2. Si no, buscar cualquier HTML
  if (!htmlFile) {
    htmlFile = findFirstHTMLFile(files);
  }

  // 3. Si no hay HTML, retornar vacío
  if (!htmlFile) {
    return '';
  }

  let html = htmlFile.content;

  // 4. Buscar y aplicar TODOS los CSS
  const cssFiles = findFilesByExtension(files, ['css']);
  html = injectCSS(html, cssFiles);

  // 5. Buscar y aplicar TODOS los JS
  const jsFiles = findFilesByExtension(files, ['js', 'javascript']);
  html = injectJS(html, jsFiles);

  return html;
};

/**
 * Construir preview con nombres específicos (modo legacy)
 * Mantener compatibilidad con código anterior
 */
export const buildPreviewLegacy = (files) => {
  const htmlFile = getFileByPath(files, 'index.html');
  const cssFile = getFileByPath(files, 'styles.css');
  const jsFile = getFileByPath(files, 'script.js');

  if (!htmlFile) return '';

  let html = htmlFile.content || '';

  // Inyectar CSS inline
  if (cssFile && cssFile.content) {
    html = injectCSS(html, [{ content: cssFile.content }]);
  }

  // Inyectar JS inline
  if (jsFile && jsFile.content) {
    html = injectJS(html, [{ content: jsFile.content }]);
  }

  return html;
};

/**
 * Construir preview inteligente
 * Intenta modo dinámico, fallback a legacy
 */
export const buildPreview = (files, activeFilePath) => {
  // Intentar preview dinámico
  const dynamicPreview = buildPreviewFromActiveFile(files, activeFilePath);
  
  if (dynamicPreview) {
    return dynamicPreview;
  }

  // Fallback a modo legacy
  return buildPreviewLegacy(files);
};

export default {
  buildPreview,
  buildPreviewFromActiveFile,
  buildPreviewLegacy,
  findFilesByExtension,
  findFirstHTMLFile
};
