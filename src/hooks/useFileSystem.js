import { useState, useCallback } from 'react';

/**
 * Custom hook para manejar el sistema de archivos del editor
 * Separa toda la lógica de archivos y carpetas de App.jsx
 * 
 * @param {Object} initialFiles - Estructura inicial de archivos
 * @returns {Object} Métodos y estado del sistema de archivos
 */
export function useFileSystem(initialFiles) {
  const [files, setFiles] = useState(initialFiles);

  /**
   * Obtiene un archivo por su ruta
   */
  const getFileByPath = useCallback((path) => {
    if (!path) return null;
    
    const parts = path.split('/');
    let currentLevel = files;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const entry = currentLevel?.[part];
      
      if (!entry) return null;

      if (i === parts.length - 1) {
        return entry;
      }

      if (entry.type === 'folder' && entry.children) {
        currentLevel = entry.children;
      } else {
        return null;
      }
    }

    return null;
  }, [files]);

  /**
   * Actualiza el contenido de un archivo
   */
  const updateFileContent = useCallback((filePath, newContent) => {
    const parts = filePath.split('/');
    
    const updateNested = (obj, path, content) => {
      if (path.length === 1) {
        return {
          ...obj,
          [path[0]]: {
            ...obj[path[0]],
            content: content
          }
        };
      }
      
      const [first, ...rest] = path;
      return {
        ...obj,
        [first]: {
          ...obj[first],
          children: updateNested(obj[first].children, rest, content)
        }
      };
    };
    
    setFiles(updateNested(files, parts, newContent));
  }, [files]);

  /**
   * Crea un nuevo archivo
   */
  const createFile = useCallback((fileName, parentPath = null, initialContent = '') => {
    const language = fileName.endsWith('.html') ? 'html' :
                    fileName.endsWith('.css') ? 'css' :
                    fileName.endsWith('.js') ? 'javascript' :
                    fileName.endsWith('.json') ? 'json' : 
                    fileName.endsWith('.md') ? 'markdown' :
                    fileName.endsWith('.py') ? 'python' : 'plaintext';
    
    const newFile = {
      name: fileName,
      type: 'file',
      language,
      content: initialContent
    };

    if (!parentPath) {
      setFiles({ ...files, [fileName]: newFile });
    } else {
      const parts = parentPath.split('/');
      const updateNested = (obj, path) => {
        if (path.length === 1) {
          return {
            ...obj,
            [path[0]]: {
              ...obj[path[0]],
              children: {
                ...obj[path[0]].children,
                [fileName]: newFile
              }
            }
          };
        }
        const [first, ...rest] = path;
        return {
          ...obj,
          [first]: {
            ...obj[first],
            children: updateNested(obj[first].children, rest)
          }
        };
      };
      setFiles(updateNested(files, parts));
    }

    return parentPath ? `${parentPath}/${fileName}` : fileName;
  }, [files]);

  /**
   * Crea una nueva carpeta
   */
  const createFolder = useCallback((folderName, parentPath = null) => {
    const newFolder = {
      name: folderName,
      type: 'folder',
      children: {}
    };

    if (!parentPath) {
      setFiles({ ...files, [folderName]: newFolder });
    } else {
      const parts = parentPath.split('/');
      const updateNested = (obj, path) => {
        if (path.length === 1) {
          return {
            ...obj,
            [path[0]]: {
              ...obj[path[0]],
              children: {
                ...obj[path[0]].children,
                [folderName]: newFolder
              }
            }
          };
        }
        const [first, ...rest] = path;
        return {
          ...obj,
          [first]: {
            ...obj[first],
            children: updateNested(obj[first].children, rest)
          }
        };
      };
      setFiles(updateNested(files, parts));
    }
  }, [files]);

  /**
   * Elimina un archivo o carpeta
   */
  const deleteItem = useCallback((itemPath) => {
    const parts = itemPath.split('/');
    
    const deleteNested = (obj, path) => {
      if (path.length === 1) {
        const newObj = { ...obj };
        delete newObj[path[0]];
        return newObj;
      }
      
      const [first, ...rest] = path;
      return {
        ...obj,
        [first]: {
          ...obj[first],
          children: deleteNested(obj[first].children, rest)
        }
      };
    };
    
    setFiles(deleteNested(files, parts));
  }, [files]);

  /**
   * Renombra un archivo o carpeta
   */
  const renameItem = useCallback((oldPath, newName) => {
    const parts = oldPath.split('/');
    const parentPath = parts.slice(0, -1);
    const oldName = parts[parts.length - 1];
    
    const renameNested = (obj, path, newName) => {
      if (path.length === 0) {
        const newObj = { ...obj };
        const item = newObj[oldName];
        delete newObj[oldName];
        newObj[newName] = {
          ...item,
          name: newName
        };
        return newObj;
      }
      
      const [first, ...rest] = path;
      return {
        ...obj,
        [first]: {
          ...obj[first],
          children: renameNested(obj[first].children, rest, newName)
        }
      };
    };
    
    setFiles(renameNested(files, parentPath, newName));
    
    // Retornar nueva ruta
    return parentPath.length > 0 ? `${parentPath.join('/')}/${newName}` : newName;
  }, [files]);

  /**
   * Mueve un archivo o carpeta a otra ubicación
   */
  const moveItem = useCallback((sourcePath, targetFolderPath) => {
    if (!sourcePath || sourcePath === targetFolderPath) return null;

    const pathParts = sourcePath.split('/');
    const itemName = pathParts[pathParts.length - 1];

    // Extraer el item
    const extractItem = (obj, path) => {
      if (path.length === 1) {
        const newObj = { ...obj };
        const item = newObj[path[0]];
        delete newObj[path[0]];
        return { newTree: newObj, item };
      }
      const [first, ...rest] = path;
      const { newTree, item } = extractItem(obj[first].children, rest);
      return {
        newTree: {
          ...obj,
          [first]: { ...obj[first], children: newTree }
        },
        item
      };
    };

    // Insertar el item
    const insertItem = (obj, targetPath, item) => {
      if (targetPath.length === 1) {
        return {
          ...obj,
          [targetPath[0]]: {
            ...obj[targetPath[0]],
            children: {
              ...obj[targetPath[0]].children,
              [item.name]: item
            }
          }
        };
      }
      const [first, ...rest] = targetPath;
      return {
        ...obj,
        [first]: {
          ...obj[first],
          children: insertItem(obj[first].children, rest, item)
        }
      };
    };

    // No permitir mover carpeta dentro de sí misma
    if (targetFolderPath && targetFolderPath.startsWith(sourcePath)) return null;

    const { newTree, item } = extractItem(files, pathParts);
    
    let newPath;
    if (targetFolderPath === null || targetFolderPath === undefined) {
      setFiles({
        ...newTree,
        [item.name]: item
      });
      newPath = item.name;
    } else {
      const targetParts = targetFolderPath.split('/');
      setFiles(insertItem(newTree, targetParts, item));
      newPath = `${targetFolderPath}/${itemName}`;
    }

    return newPath;
  }, [files]);

  /**
   * Agrega un archivo de imagen
   */
  const addImageFile = useCallback((imageData, parentPath = null) => {
    const newFile = {
      name: imageData.name,
      type: 'file',
      language: 'plaintext',
      content: imageData.data,
      isImage: true
    };

    if (!parentPath) {
      setFiles({
        ...files,
        [imageData.name]: newFile
      });
    } else {
      const parts = parentPath.split('/');
      const updateNested = (obj, path) => {
        if (path.length === 1) {
          return {
            ...obj,
            [path[0]]: {
              ...obj[path[0]],
              children: {
                ...obj[path[0]].children,
                [imageData.name]: newFile
              }
            }
          };
        }
        const [first, ...rest] = path;
        return {
          ...obj,
          [first]: {
            ...obj[first],
            children: updateNested(obj[first].children, rest)
          }
        };
      };
      setFiles(updateNested(files, parts));
    }

    return parentPath ? `${parentPath}/${imageData.name}` : imageData.name;
  }, [files]);

  return {
    files,
    setFiles,
    getFileByPath,
    updateFileContent,
    createFile,
    createFolder,
    deleteItem,
    renameItem,
    moveItem,
    addImageFile
  };
}
