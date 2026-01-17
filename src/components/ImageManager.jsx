import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Copy, Check, Move } from 'lucide-react';

function ImageManager({ isOpen, onClose, images, onAddImage, onRemoveImage }) {
  const [copied, setCopied] = useState(null);
  const [draggingImage, setDraggingImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onAddImage({
            id: Date.now() + Math.random(),
            name: file.name,
            data: event.target.result,
            size: file.size,
            type: file.type
          });
        };
        reader.readAsDataURL(file);
      }
    });
    
    e.target.value = '';
  };

  const copyToClipboard = (imageName, imageData) => {
    navigator.clipboard.writeText(imageData);
    setCopied(imageName);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleImageDragStart = (e, image) => {
    setDraggingImage(image);
    // Crear código HTML para la imagen
    const imgTag = `<img src="${image.data}" alt="${image.name.split('.')[0]}" width="300" />`;
    e.dataTransfer.setData('text/angr-image-html', imgTag);
    e.dataTransfer.setData('text/plain', imgTag);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleImageDragEnd = () => {
    setDraggingImage(null);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-blue-500/30 rounded-lg w-[800px] max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(59,130,246,0.3)]">
        {/* Header */}
        <div className="h-12 bg-gray-800 border-b border-blue-500/30 flex items-center justify-between px-4 rounded-t-lg relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent pointer-events-none rounded-t-lg"></div>
          <div className="flex items-center gap-2 relative z-10">
            <ImageIcon className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-blue-200 font-medium">Gestor de Imágenes</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-500/20 rounded transition-all border border-transparent hover:border-red-500/40 relative z-10"
          >
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Upload Area */}
          <div 
            className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 mb-4 hover:border-blue-500/50 transition-all cursor-pointer bg-blue-500/5"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-white mb-2">Click para subir imágenes</p>
              <p className="text-gray-400 text-sm">o arrastra y suelta archivos aquí</p>
              <p className="text-gray-500 text-xs mt-2">Formatos: JPG, PNG, GIF, SVG, WebP</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Images Grid */}
          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p>No hay imágenes cargadas</p>
              <p className="text-sm mt-2">Sube imágenes para usarlas en tu código</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {images.map((image) => (
                <div 
                  key={image.id}
                  draggable
                  onDragStart={(e) => handleImageDragStart(e, image)}
                  onDragEnd={handleImageDragEnd}
                  className={`bg-gray-800 border border-border-color rounded-lg overflow-hidden hover:border-blue-500/50 transition-all group cursor-move ${
                    draggingImage?.id === image.id ? 'opacity-50 scale-95' : ''
                  }`}
                  title="Arrastra esta imagen al editor"
                >
                  <div className="aspect-video bg-gray-700 flex items-center justify-center overflow-hidden relative">
                    <img 
                      src={image.data} 
                      alt={image.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <Move className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate mb-1">{image.name}</p>
                    <p className="text-gray-400 text-xs mb-3">{formatSize(image.size)}</p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(image.name, image.data)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded transition-all border border-blue-500/30"
                      >
                        {copied === image.name ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar src</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onRemoveImage(image.id)}
                        className="px-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-all border border-red-500/30"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 bg-gray-800 border-t border-border-color px-4 flex items-center justify-between rounded-b-lg">
          <p className="text-gray-400 text-sm">
            {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} cargadas
          </p>
          <p className="text-gray-500 text-xs">
            Tip: Copia el src de la imagen y pégalo en tu HTML
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImageManager;
