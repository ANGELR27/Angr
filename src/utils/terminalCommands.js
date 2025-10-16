// Sistema de comandos avanzados para la Terminal

/**
 * Obtiene información de archivos del proyecto
 */
export const getFileInfo = (files, path = '') => {
  const parts = path.split('/').filter(Boolean);
  let current = files;
  
  for (const part of parts) {
    if (!current[part]) return null;
    current = current[part].type === 'folder' ? current[part].children : current[part];
  }
  
  return current;
};

/**
 * Lista archivos y carpetas (comando ls)
 */
export const listFiles = (files, path = '', options = {}) => {
  const target = path ? getFileInfo(files, path) : files;
  
  if (!target) {
    return { error: `ls: no se puede acceder a '${path}': No existe el archivo o el directorio` };
  }
  
  if (typeof target.type === 'string' && target.type === 'file') {
    return { items: [{ name: target.name, type: 'file', size: target.content?.length || 0 }] };
  }
  
  const items = [];
  Object.entries(target).forEach(([key, item]) => {
    if (item.type === 'folder') {
      items.push({ 
        name: key, 
        type: 'folder',
        count: Object.keys(item.children || {}).length
      });
    } else if (item.type === 'file') {
      items.push({ 
        name: item.name, 
        type: 'file',
        size: item.content?.length || 0,
        language: item.language
      });
    }
  });
  
  return { items: options.sort ? items.sort((a, b) => a.name.localeCompare(b.name)) : items };
};

/**
 * Lee contenido de un archivo (comando cat)
 */
export const catFile = (files, path) => {
  const file = getFileInfo(files, path);
  
  if (!file) {
    return { error: `cat: ${path}: No existe el archivo o el directorio` };
  }
  
  if (file.type === 'folder') {
    return { error: `cat: ${path}: Es un directorio` };
  }
  
  return { content: file.content || '', language: file.language };
};

/**
 * Busca archivos por nombre (comando find)
 */
export const findFiles = (files, pattern, basePath = '') => {
  const results = [];
  
  const search = (obj, currentPath) => {
    Object.entries(obj).forEach(([key, item]) => {
      const itemPath = currentPath ? `${currentPath}/${key}` : key;
      
      if (item.name && item.name.toLowerCase().includes(pattern.toLowerCase())) {
        results.push({
          path: itemPath,
          name: item.name,
          type: item.type
        });
      }
      
      if (item.type === 'folder' && item.children) {
        search(item.children, itemPath);
      }
    });
  };
  
  search(files, basePath);
  return results;
};

/**
 * Busca contenido en archivos (comando grep)
 */
export const grepFiles = (files, pattern, options = {}) => {
  const results = [];
  const regex = options.regex ? new RegExp(pattern, options.caseInsensitive ? 'gi' : 'g') : null;
  
  const search = (obj, currentPath = '') => {
    Object.entries(obj).forEach(([key, item]) => {
      const itemPath = currentPath ? `${currentPath}/${key}` : key;
      
      if (item.type === 'file' && item.content) {
        const lines = item.content.split('\n');
        lines.forEach((line, lineNum) => {
          let match = false;
          
          if (regex) {
            match = regex.test(line);
          } else {
            match = options.caseInsensitive 
              ? line.toLowerCase().includes(pattern.toLowerCase())
              : line.includes(pattern);
          }
          
          if (match) {
            results.push({
              file: itemPath,
              line: lineNum + 1,
              content: line.trim()
            });
          }
        });
      }
      
      if (item.type === 'folder' && item.children) {
        search(item.children, itemPath);
      }
    });
  };
  
  search(files);
  return results;
};

/**
 * Obtiene estadísticas del proyecto
 */
export const getProjectStats = (files) => {
  const stats = {
    files: 0,
    folders: 0,
    totalSize: 0,
    byLanguage: {},
    largestFile: { name: '', size: 0 }
  };
  
  const analyze = (obj) => {
    Object.values(obj).forEach(item => {
      if (item.type === 'folder') {
        stats.folders++;
        if (item.children) analyze(item.children);
      } else if (item.type === 'file') {
        stats.files++;
        const size = item.content?.length || 0;
        stats.totalSize += size;
        
        if (!stats.byLanguage[item.language]) {
          stats.byLanguage[item.language] = { count: 0, size: 0 };
        }
        stats.byLanguage[item.language].count++;
        stats.byLanguage[item.language].size += size;
        
        if (size > stats.largestFile.size) {
          stats.largestFile = { name: item.name, size };
        }
      }
    });
  };
  
  analyze(files);
  return stats;
};

/**
 * Evalúa expresiones matemáticas
 */
export const calculate = (expression) => {
  try {
    // Sanitizar la expresión (permitir solo números y operadores)
    const sanitized = expression.replace(/[^0-9+\-*/.()%\s]/g, '');
    if (!sanitized) return { error: 'Expresión inválida' };
    
    // Evaluar de forma segura
    const result = Function('"use strict"; return (' + sanitized + ')')();
    return { result: result };
  } catch (error) {
    return { error: `Error al calcular: ${error.message}` };
  }
};

/**
 * Formatea JSON
 */
export const formatJSON = (jsonString, options = {}) => {
  try {
    const parsed = JSON.parse(jsonString);
    const formatted = JSON.stringify(parsed, null, options.compact ? 0 : 2);
    return { result: formatted, parsed };
  } catch (error) {
    return { error: `JSON inválido: ${error.message}` };
  }
};

/**
 * Codifica/decodifica Base64
 */
export const base64Encode = (text) => {
  try {
    return { result: btoa(unescape(encodeURIComponent(text))) };
  } catch (error) {
    return { error: `Error al codificar: ${error.message}` };
  }
};

export const base64Decode = (text) => {
  try {
    return { result: decodeURIComponent(escape(atob(text))) };
  } catch (error) {
    return { error: `Error al decodificar: ${error.message}` };
  }
};

/**
 * Genera hash simple (no criptográfico, solo para demostración)
 */
export const simpleHash = (text) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return { result: Math.abs(hash).toString(16) };
};

/**
 * Obtiene información del sistema (navegador)
 */
export const getSystemInfo = () => {
  return {
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
    cores: navigator.hardwareConcurrency || 'N/A',
    memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A',
    screen: `${screen.width}x${screen.height}`,
    colorDepth: `${screen.colorDepth} bits`
  };
};

/**
 * Parser de pipes (cmd1 | cmd2 | cmd3)
 */
export const parsePipes = (commandLine) => {
  return commandLine.split('|').map(cmd => cmd.trim()).filter(Boolean);
};

/**
 * Parser de redirección (cmd > file, cmd >> file)
 */
export const parseRedirection = (commandLine) => {
  const appendMatch = commandLine.match(/^(.+?)\s*>>\s*(.+)$/);
  if (appendMatch) {
    return {
      command: appendMatch[1].trim(),
      file: appendMatch[2].trim(),
      mode: 'append'
    };
  }
  
  const writeMatch = commandLine.match(/^(.+?)\s*>\s*(.+)$/);
  if (writeMatch) {
    return {
      command: writeMatch[1].trim(),
      file: writeMatch[2].trim(),
      mode: 'write'
    };
  }
  
  return null;
};

/**
 * Autocompletado de comandos
 */
export const getCommandSuggestions = (input, availableCommands) => {
  if (!input) return availableCommands;
  
  const lowerInput = input.toLowerCase();
  return availableCommands.filter(cmd => 
    cmd.toLowerCase().startsWith(lowerInput)
  );
};

/**
 * Autocompletado de rutas de archivos
 */
export const getPathSuggestions = (input, files) => {
  const parts = input.split('/');
  const currentPart = parts[parts.length - 1];
  const basePath = parts.slice(0, -1).join('/');
  
  const target = basePath ? getFileInfo(files, basePath) : files;
  if (!target) return [];
  
  const items = [];
  Object.entries(target).forEach(([key, item]) => {
    if (key.toLowerCase().startsWith(currentPart.toLowerCase())) {
      const fullPath = basePath ? `${basePath}/${key}` : key;
      items.push({
        name: key,
        path: fullPath,
        type: item.type,
        isFolder: item.type === 'folder'
      });
    }
  });
  
  return items;
};

/**
 * Convierte bytes a formato legible
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Genera una tabla ASCII simple
 */
export const createASCIITable = (data, headers) => {
  if (!data || data.length === 0) return '';
  
  // Calcular anchos de columnas
  const widths = headers.map((h, i) => {
    const maxDataWidth = Math.max(...data.map(row => String(row[i] || '').length));
    return Math.max(h.length, maxDataWidth);
  });
  
  // Línea superior
  const topLine = '┌' + widths.map(w => '─'.repeat(w + 2)).join('┬') + '┐';
  
  // Headers
  const headerLine = '│ ' + headers.map((h, i) => h.padEnd(widths[i])).join(' │ ') + ' │';
  
  // Línea separadora
  const sepLine = '├' + widths.map(w => '─'.repeat(w + 2)).join('┼') + '┤';
  
  // Datos
  const dataLines = data.map(row => 
    '│ ' + row.map((cell, i) => String(cell || '').padEnd(widths[i])).join(' │ ') + ' │'
  );
  
  // Línea inferior
  const bottomLine = '└' + widths.map(w => '─'.repeat(w + 2)).join('┴') + '┘';
  
  return [topLine, headerLine, sepLine, ...dataLines, bottomLine].join('\n');
};
