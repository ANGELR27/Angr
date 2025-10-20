import {
  Plus,
  FolderPlus,
  Eye,
  EyeOff,
  Code2,
  Terminal,
  Image,
  RotateCcw,
  Keyboard,
  ChevronDown,
  ChevronUp,
  Download,
  X,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { validateFileName, sanitizeFileName } from "../utils/validation";
import { getFileIcon as getProFileIcon } from "../utils/fileIcons";

function TopBar({
  showPreview,
  setShowPreview,
  onNewFile,
  onNewFolder,
  showTerminal,
  setShowTerminal,
  onOpenImageManager,
  onAddImageFile,
  onResetAll,
  onOpenShortcuts,
  onExport,
  currentTheme,
  onToggleLite,
  tabs,
  activeTab,
  onTabClick,
  onTabClose,
  onOpenCollaboration,
  isCollaborating,
  collaborationUsers,
}) {
  const imageInputRef = useRef(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const isLite = currentTheme === "lite";

  const handleNewFile = () => {
    const fileName = prompt(
      "Nombre del nuevo archivo (ej: archivo.html, styles.css, script.js, imagen.png):"
    );
    
    if (!fileName) return;

    // Validar nombre del archivo
    const validation = validateFileName(fileName.trim(), false);
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Mostrar advertencia si existe
    if (validation.warning) {
      const confirmed = confirm(validation.warning + "\n\n¿Deseas continuar?");
      if (!confirmed) return;
    }

    const sanitized = sanitizeFileName(fileName.trim());

    // Verificar si es una imagen
    const imageExtensions = ["png", "jpg", "jpeg", "gif", "svg", "webp"];
    const extension = sanitized.split(".").pop()?.toLowerCase();

    if (imageExtensions.includes(extension)) {
      // Trigger file input para subir imagen
      imageInputRef.current?.click();
      imageInputRef.current.dataset.fileName = sanitized;
    } else {
      onNewFile(sanitized);
    }
  };

  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    const fileName = e.target.dataset.fileName;

    if (file && fileName) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onAddImageFile({
          name: fileName,
          data: event.target.result,
          size: file.size,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

  const handleNewFolder = () => {
    const folderName = prompt("Nombre de la nueva carpeta:");
    
    if (!folderName) return;

    // Validar nombre de carpeta
    const validation = validateFileName(folderName.trim(), true);
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const sanitized = sanitizeFileName(folderName.trim());
    onNewFolder(sanitized);
  };

  // 🎨 Usar iconos profesionales de cada tecnología
  const getFileIcon = (fileName) => {
    const baseColor = isLite ? 'var(--theme-secondary)' : '';
    return getProFileIcon(fileName, 14, baseColor);
  };

  const getFileName = (path) => {
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div
      className="border-b border-border-color flex items-center relative"
      style={{
        height: isLite ? "40px" : "48px",
        backgroundColor: "var(--theme-background-tertiary)",
        boxShadow: isLite ? "none" : undefined,
      }}
    >
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileSelect}
        className="hidden"
      />

      {!isLite && (
        <div className="absolute inset-0 bg-gradient-to-r from-theme-primary/5 via-transparent to-theme-accent/5 pointer-events-none"></div>
      )}

      {/* Sección izquierda - Logo y estado (sobre el sidebar) */}
      <div className="flex items-center gap-3 relative z-10 px-3 flex-shrink-0" style={{ width: '256px' }}>
        <div
          className="relative"
          style={{ padding: isLite ? "4px" : "8px", borderRadius: "8px" }}
        >
          {!isLite && (
            <div
              className="absolute inset-0 blur-2xl opacity-60"
              style={{
                backgroundColor: "var(--theme-primary)",
                animation: "pulseBlueGlow 2s ease-in-out infinite",
              }}
            ></div>
          )}
          <Code2
            className="w-5 h-5 relative z-10"
            style={{ color: "var(--theme-secondary)" }}
          />
        </div>
        <span
          className="text-sm font-semibold relative z-10"
          style={{ color: "var(--theme-text)" }}
        >
          Code Editor
        </span>
      </div>

      {/* Sección central - Pestañas */}
      <div
        className="flex-1 relative z-10"
        style={{ minWidth: 0 }}
      >
        <div
          className="flex items-center overflow-x-auto px-2 no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tabs &&
            tabs.map((tabPath) => {
            const fileName = getFileName(tabPath);
            const isActive = activeTab === tabPath;

            return (
              <div
                key={tabPath}
                className={`flex items-center gap-1.5 px-2.5 py-3 rounded-t cursor-pointer group transition-all flex-shrink-0 ${
                  isActive
                    ? "bg-theme-bg-secondary"
                    : "hover:bg-theme-bg-secondary/50"
                }`}
                onClick={() => onTabClick(tabPath)}
                style={{
                  userSelect: "none",
                  borderBottom: isActive
                    ? "2px solid var(--theme-primary)"
                    : "2px solid transparent",
                  marginBottom: "-2px",
                }}
              >
                {getFileIcon(fileName)}
                <span
                  className={`text-xs transition-colors ${
                    isActive ? "font-medium" : ""
                  }`}
                  style={{
                    color: isActive
                      ? "var(--theme-text)"
                      : "var(--theme-text-secondary)",
                    userSelect: "none",
                    cursor: "pointer",
                  }}
                >
                  {fileName}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tabPath);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded p-0.5 transition-all"
                >
                  <X
                    className="w-3 h-3"
                    style={{ color: "var(--theme-text-secondary)" }}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Gradientes de fade cuando hay muchas pestañas */}
        {tabs && tabs.length > 4 && (
          <>
            <div
              className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-20"
              style={{
                background: `linear-gradient(to right, var(--theme-background-tertiary), transparent)`,
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-20"
              style={{
                background: `linear-gradient(to left, var(--theme-background-tertiary), transparent)`,
              }}
            />
          </>
        )}
      </div>

      {/* Sección derecha - Acciones */}
      <div className="flex items-center gap-2 relative z-10 px-3 flex-shrink-0">
        <button
          onClick={handleNewFile}
          className="flex items-center justify-center transition-all p-1.5 hover:scale-110"
          style={{
            color: "var(--theme-text)",
            backgroundColor: "transparent",
          }}
          title="Nuevo archivo"
        >
          <Plus className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
        </button>

        {!isLite && (
          <button
            onClick={handleNewFolder}
            className="flex items-center justify-center transition-all p-1.5 hover:scale-110"
            style={{
              color: "var(--theme-text)",
              backgroundColor: "transparent",
            }}
            title="Nueva carpeta"
          >
            <FolderPlus
              className="w-4 h-4"
              style={{ color: "var(--theme-accent)" }}
            />
          </button>
        )}

        {!isLite && (
          <div
            className="w-px h-5 mx-1"
            style={{
              background:
                "linear-gradient(to bottom, rgba(100,100,100,0.3), rgba(150,150,150,0.3))",
            }}
          />
        )}

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center justify-center transition-all p-1.5 hover:scale-110"
          style={{
            color: "var(--theme-text)",
            backgroundColor: "transparent",
          }}
          title={showPreview ? "Ocultar preview" : "Mostrar preview"}
        >
          {showPreview ? (
            <EyeOff
              className="w-4 h-4"
              style={{ color: "var(--theme-secondary)" }}
            />
          ) : (
            <Eye
              className="w-4 h-4"
              style={{ color: "var(--theme-secondary)" }}
            />
          )}
        </button>

        <button
          onClick={() => setShowTerminal(!showTerminal)}
          className="flex items-center justify-center transition-all p-1.5 hover:scale-110"
          style={{
            color: "var(--theme-text)",
            backgroundColor: "transparent",
            opacity: showTerminal ? 1 : 0.7,
          }}
          title={showTerminal ? "Ocultar terminal" : "Mostrar terminal"}
        >
          <Terminal
            className="w-4 h-4"
            style={{ color: "var(--theme-accent)" }}
          />
        </button>

        {!isLite && (
          <button
            onClick={onOpenImageManager}
            className="flex items-center justify-center transition-all p-1.5 hover:scale-110"
            style={{
              color: "var(--theme-text)",
              backgroundColor: "transparent",
            }}
            title="Gestor de imágenes"
          >
            <Image
              className="w-4 h-4"
              style={{ color: "var(--theme-secondary)" }}
            />
          </button>
        )}

        {!isLite && onOpenCollaboration && (
          <button
            onClick={onOpenCollaboration}
            className="flex items-center justify-center transition-all p-1.5 hover:scale-110 relative"
            style={{
              color: "var(--theme-text)",
              backgroundColor: "transparent",
              opacity: isCollaborating ? 1 : 0.7,
            }}
            title={isCollaborating ? "Panel de colaboración" : "Iniciar colaboración en tiempo real"}
          >
            <Users
              className="w-4 h-4"
              style={{ color: isCollaborating ? "var(--theme-primary)" : "var(--theme-secondary)" }}
            />
            {isCollaborating && collaborationUsers > 1 && (
              <span 
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{
                  backgroundColor: "var(--theme-primary)",
                  color: "white",
                  border: "2px solid var(--theme-background-tertiary)",
                }}
              >
                {collaborationUsers}
              </span>
            )}
          </button>
        )}

        {!isLite && (
          <button
            onClick={onExport}
            className="flex items-center justify-center transition-all p-1.5 hover:scale-110"
            style={{
              color: "var(--theme-text)",
              backgroundColor: "transparent",
            }}
            title="Exportar proyecto (ZIP)"
          >
            <Download
              className="w-4 h-4"
              style={{ color: "var(--theme-primary)" }}
            />
          </button>
        )}

        {!isLite && (
          <button
            onClick={onOpenShortcuts}
            className="flex items-center justify-center transition-all p-1.5 hover:scale-110"
            style={{
              color: "var(--theme-text)",
              backgroundColor: "transparent",
            }}
            title="Atajos de teclado (F1 o ?)"
          >
            <Keyboard
              className="w-4 h-4"
              style={{ color: "var(--theme-accent)" }}
            />
          </button>
        )}

        <button
          onClick={onToggleLite}
          className="flex items-center justify-center transition-all p-1.5 hover:scale-110"
          style={{
            backgroundColor: "transparent",
            color:
              currentTheme === "lite" ? "#D0FC01" : "var(--theme-secondary)",
          }}
          title={
            currentTheme === "lite" ? "Salir de modo Lite" : "Activar modo Lite"
          }
        >
          <span style={{ fontSize: "14px" }}>●</span>
        </button>

        {!isLite && (
          <button
            onClick={onResetAll}
            className="flex items-center justify-center transition-all p-1.5 hover:scale-110"
            style={{
              color: "var(--theme-text)",
              backgroundColor: "transparent",
            }}
            title="Resetear todo (eliminar datos guardados)"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
}

export default TopBar;
