const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Información del sistema
  platform: process.platform,
  isElectron: true,
  
  // Sistema de archivos (solo lectura segura)
  openFolder: () => ipcRenderer.send('open-folder'),
  
  // Eventos del editor
  onNewProject: (callback) => ipcRenderer.on('new-project', callback),
  onOpenFolder: (callback) => ipcRenderer.on('open-folder', (event, path) => callback(path)),
  onSaveFile: (callback) => ipcRenderer.on('save-file', callback),
  
  // Métodos de utilidad
  getVersion: () => '1.0.0',
  
  // Notificaciones
  showNotification: (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
});

// Prevenir navegación no deseada
window.addEventListener('DOMContentLoaded', () => {
  // Prevenir drag and drop de archivos en la ventana
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    return false;
  });
  
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    return false;
  });
});

console.log('🚀 Code Editor Pro - Versión de Escritorio cargada');
