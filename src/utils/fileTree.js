/**
 * Utilidades para manipular árboles de archivos
 * Centraliza la lógica de actualización, inserción, eliminación y movimiento
 * Evita duplicación de código en App.jsx
 */

/**
 * Actualiza un archivo o carpeta en el árbol
 * @param {Object} tree - Árbol de archivos actual
 * @param {string} path - Ruta del item (ej: 'carpeta/archivo.txt')
 * @param {Object} updates - Objeto con propiedades a actualizar
 * @returns {Object} - Nuevo árbol actualizado
 */
export function updateItemInTree(tree, path, updates) {
  if (!path) return tree;
  
  const parts = path.split('/');
  
  if (parts.length === 1) {
    // Item en la raíz
    return {
      ...tree,
      [parts[0]]: {
        ...tree[parts[0]],
        ...updates
      }
    };
  }
  
  // Item nested
  const [first, ...rest] = parts;
  return {
    ...tree,
    [first]: {
      ...tree[first],
      children: updateItemInTree(tree[first].children, rest.join('/'), updates)
    }
  };
}

/**
 * Inserta un nuevo item en el árbol
 * @param {Object} tree - Árbol de archivos actual
 * @param {string|null} parentPath - Ruta de la carpeta padre (null = raíz)
 * @param {string} itemName - Nombre del nuevo item
 * @param {Object} item - Objeto del item a insertar
 * @returns {Object} - Nuevo árbol con el item insertado
 */
export function insertItemInTree(tree, parentPath, itemName, item) {
  if (!parentPath) {
    // Insertar en raíz
    return {
      ...tree,
      [itemName]: item
    };
  }
  
  const parts = parentPath.split('/');
  
  if (parts.length === 1) {
    return {
      ...tree,
      [parts[0]]: {
        ...tree[parts[0]],
        children: {
          ...tree[parts[0]].children,
          [itemName]: item
        }
      }
    };
  }
  
  const [first, ...rest] = parts;
  return {
    ...tree,
    [first]: {
      ...tree[first],
      children: insertItemInTree(tree[first].children, rest.join('/'), itemName, item)
    }
  };
}

/**
 * Elimina un item del árbol
 * @param {Object} tree - Árbol de archivos actual
 * @param {string} path - Ruta del item a eliminar
 * @returns {Object} - Nuevo árbol sin el item
 */
export function deleteItemFromTree(tree, path) {
  if (!path) return tree;
  
  const parts = path.split('/');
  
  if (parts.length === 1) {
    // Eliminar de raíz
    const newTree = { ...tree };
    delete newTree[parts[0]];
    return newTree;
  }
  
  // Eliminar nested
  const [first, ...rest] = parts;
  return {
    ...tree,
    [first]: {
      ...tree[first],
      children: deleteItemFromTree(tree[first].children, rest.join('/'))
    }
  };
}

/**
 * Extrae un item del árbol (para moverlo)
 * @param {Object} tree - Árbol de archivos actual
 * @param {string} path - Ruta del item a extraer
 * @returns {Object} - { newTree, extractedItem }
 */
export function extractItemFromTree(tree, path) {
  if (!path) return { newTree: tree, extractedItem: null };
  
  const parts = path.split('/');
  
  if (parts.length === 1) {
    const newTree = { ...tree };
    const item = newTree[parts[0]];
    delete newTree[parts[0]];
    return { newTree, extractedItem: item };
  }
  
  const [first, ...rest] = parts;
  const { newTree: childTree, extractedItem } = extractItemFromTree(
    tree[first].children, 
    rest.join('/')
  );
  
  return {
    newTree: {
      ...tree,
      [first]: {
        ...tree[first],
        children: childTree
      }
    },
    extractedItem
  };
}

/**
 * Mueve un item de una ubicación a otra en el árbol
 * @param {Object} tree - Árbol de archivos actual
 * @param {string} sourcePath - Ruta origen
 * @param {string} targetFolderPath - Ruta destino (carpeta)
 * @returns {Object} - Nuevo árbol con el item movido
 */
export function moveItemInTree(tree, sourcePath, targetFolderPath) {
  if (!sourcePath || sourcePath === targetFolderPath) return tree;
  
  // Extraer item
  const { newTree, extractedItem } = extractItemFromTree(tree, sourcePath);
  
  if (!extractedItem) return tree;
  
  // Insertar en nueva ubicación
  return insertItemInTree(newTree, targetFolderPath, extractedItem.name, extractedItem);
}

/**
 * Obtiene un item del árbol por su ruta
 * @param {Object} tree - Árbol de archivos actual
 * @param {string} path - Ruta del item
 * @returns {Object|null} - Item encontrado o null
 */
export function getItemFromTree(tree, path) {
  if (!path) return null;
  
  const parts = path.split('/');
  let current = tree;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const entry = current?.[part];
    
    if (!entry) return null;
    
    // Última parte, retornar item
    if (i === parts.length - 1) {
      return entry;
    }
    
    // Es carpeta, bajar a children
    if (entry.type === 'folder' && entry.children) {
      current = entry.children;
    } else {
      return null;
    }
  }
  
  return null;
}

/**
 * Genera un nombre único para evitar duplicados
 * @param {Object} tree - Árbol o children donde se insertará
 * @param {string} baseName - Nombre base deseado
 * @returns {string} - Nombre único
 */
export function generateUniqueName(tree, baseName) {
  if (!tree || !tree[baseName]) return baseName;
  
  const extIndex = baseName.lastIndexOf('.');
  const name = extIndex > 0 ? baseName.slice(0, extIndex) : baseName;
  const ext = extIndex > 0 ? baseName.slice(extIndex) : '';
  
  let counter = 1;
  let candidate = `${name} (${counter})${ext}`;
  
  while (tree[candidate]) {
    counter++;
    candidate = `${name} (${counter})${ext}`;
  }
  
  return candidate;
}

/**
 * Cuenta total de archivos en el árbol
 * @param {Object} tree - Árbol de archivos
 * @returns {number} - Total de archivos
 */
export function countFiles(tree) {
  let count = 0;
  
  Object.values(tree || {}).forEach(item => {
    if (item.type === 'file') {
      count++;
    } else if (item.type === 'folder' && item.children) {
      count += countFiles(item.children);
    }
  });
  
  return count;
}

/**
 * Cuenta total de líneas de código en el árbol
 * @param {Object} tree - Árbol de archivos
 * @returns {number} - Total de líneas
 */
export function countLines(tree) {
  let lines = 0;
  
  Object.values(tree || {}).forEach(item => {
    if (item.type === 'file' && item.content && !item.isImage) {
      lines += item.content.split('\n').length;
    } else if (item.type === 'folder' && item.children) {
      lines += countLines(item.children);
    }
  });
  
  return lines;
}
