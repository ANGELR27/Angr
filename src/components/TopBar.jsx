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
  MessageCircle,
  MoreVertical,
  Palette,
  Check,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  onToggleFeel,
  onToggleFade,
  tabs,
  activeTab,
  onTabClick,
  onTabClose,
  onOpenCollaboration,
  isCollaborating,
  collaborationUsers,
  // 🔥 Props de chat
  showChat,
  onToggleChat,
  chatMessagesCount,
  // 🔐 Props de autenticación
  isAuthenticated,
  user,
  onLogout,
  // 🎨 Fondo personalizado
  onOpenBackground,
  // 🎯 Modo Práctica
  practiceModeEnabled,
  onTogglePracticeMode,
  // 📝 Snippets
  onOpenSnippets,
  // 📂 Split View
  splitViewEnabled,
  onToggleSplitView,
  // 🔀 Git
  onOpenGit,
  // 🛠️ DevTools
  onOpenDevTools,
}) {
  const imageInputRef = useRef(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modesMenuOpen, setModesMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuPortalRef = useRef(null);
  const modesMenuRef = useRef(null);
  const modesMenuPortalRef = useRef(null);
  const isLite = currentTheme === "lite";
  const isFeel = currentTheme === "feel";
  const isFade = currentTheme === "fade";

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar si el click fue dentro del botón del menú o dentro del menú portal
      const isMenuButton = menuRef.current && menuRef.current.contains(event.target);
      const isMenuPortal = menuPortalRef.current && menuPortalRef.current.contains(event.target);
      
      if (!isMenuButton && !isMenuPortal && menuOpen) {
        console.log('Click fuera del menú, cerrando...');
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      // Pequeño delay para evitar que el click del botón cierre inmediatamente el menú
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Cerrar menú de modos al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isModesMenuButton = modesMenuRef.current && modesMenuRef.current.contains(event.target);
      const isModesMenuPortal = modesMenuPortalRef.current && modesMenuPortalRef.current.contains(event.target);
      
      if (!isModesMenuButton && !isModesMenuPortal && modesMenuOpen) {
        setModesMenuOpen(false);
      }
    };

    if (modesMenuOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modesMenuOpen]);

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
    const baseColor = (isLite || isFade) ? (isFade ? '#a1a1aa' : 'var(--theme-secondary)') : '';
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
        height: (isLite || isFade) ? "40px" : "48px",
        backgroundColor: isFade ? "#1f1f1f" : "var(--theme-background-tertiary)",
        boxShadow: (isLite || isFade) ? "none" : undefined,
        borderColor: isFade ? "#3f3f46" : undefined,
      }}
    >
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileSelect}
        className="hidden"
      />

      {!isLite && !isFade && (
        <div className="absolute inset-0 bg-gradient-to-r from-theme-primary/5 via-transparent to-theme-accent/5 pointer-events-none"></div>
      )}

      {/* Sección izquierda - Logo y estado (sobre el sidebar) */}
      <div className="flex items-center gap-3 relative z-10 px-3 flex-shrink-0" style={{ width: '256px' }}>
        <div
          className="relative"
          style={{ padding: isLite ? "4px" : "8px", borderRadius: "8px" }}
        >
          {!isLite && !isFade && (
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
            style={{ color: isFade ? "#a1a1aa" : "var(--theme-secondary)" }}
          />
        </div>
        <span
          className="text-sm font-semibold relative z-10"
          style={{ color: isFade ? "#e4e4e7" : "var(--theme-text)" }}
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

        {/* Terminal - siempre visible */}
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

        {/* 🔐 Indicador de Usuario Autenticado */}
        {!isLite && isAuthenticated && user && (
          <div className="flex items-center gap-2 px-2 py-1 rounded-md" style={{
            backgroundColor: "var(--theme-background-secondary)",
            border: "1px solid var(--theme-border)",
          }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{
              backgroundColor: "var(--theme-primary)",
              color: "white",
            }}>
              {(user.user_metadata?.display_name || user.email?.charAt(0) || "U").toUpperCase().charAt(0)}
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--theme-text)" }}>
              {user.user_metadata?.display_name || user.email?.split('@')[0] || "Usuario"}
            </span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="ml-1 px-2 py-0.5 text-[10px] rounded hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: "var(--theme-danger)",
                  color: "white",
                }}
                title="Cerrar sesión"
              >
                Salir
              </button>
            )}
          </div>
        )}

        {/* Menú de Modos */}
        <div className="relative" ref={modesMenuRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const newState = !modesMenuOpen;
              setModesMenuOpen(newState);
              if (!modesMenuOpen) {
                const rect = e.currentTarget.getBoundingClientRect();
                modesMenuRef.current.dataset.buttonRight = rect.right;
                modesMenuRef.current.dataset.buttonBottom = rect.bottom;
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all hover:scale-105"
            style={{
              backgroundColor: modesMenuOpen ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              border: `1px solid ${modesMenuOpen ? (isFade ? '#3f3f46' : 'var(--theme-border)') : 'transparent'}`,
              color: isFade ? "#e4e4e7" : "var(--theme-text)",
            }}
            title="Cambiar modo"
          >
            <Palette className="w-3.5 h-3.5" style={{ color: isFade ? "#a1a1aa" : "var(--theme-secondary)" }} />
            <span className="text-xs font-medium">Modos</span>
            <ChevronDown className="w-3 h-3" style={{ 
              color: isFade ? "#71717a" : "var(--theme-text-secondary)",
              transform: modesMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }} />
          </button>

          {/* Dropdown de modos con Portal */}
          {modesMenuOpen && typeof document !== 'undefined' && createPortal(
            <div
              ref={modesMenuPortalRef}
              onClick={(e) => e.stopPropagation()}
              className="fixed rounded-lg shadow-2xl overflow-hidden"
              style={{
                backgroundColor: isFade ? '#1f1f1f' : 'var(--theme-background-secondary)',
                width: '200px',
                border: isFade ? '1px solid #3f3f46' : '1px solid var(--theme-border)',
                zIndex: 999999,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                top: `${modesMenuRef.current?.dataset.buttonBottom || 0}px`,
                right: `${window.innerWidth - (modesMenuRef.current?.dataset.buttonRight || window.innerWidth)}px`,
              }}
            >
              {/* Lite Mode */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleLite();
                  setModesMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm transition-all flex items-center justify-between group"
                style={{
                  color: 'var(--theme-text)',
                  backgroundColor: currentTheme === 'lite' ? 'rgba(208, 252, 1, 0.1)' : 'transparent',
                  borderBottom: '1px solid var(--theme-border)'
                }}
                onMouseEnter={(e) => {
                  if (currentTheme !== 'lite') {
                    e.currentTarget.style.backgroundColor = 'var(--theme-surface)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme !== 'lite') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#D0FC01' }}></div>
                  <span>Lite</span>
                </div>
                {currentTheme === 'lite' && <Check className="w-4 h-4" style={{ color: '#D0FC01' }} />}
              </button>

              {/* Feel Mode */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFeel();
                  setModesMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm transition-all flex items-center justify-between group"
                style={{
                  color: 'var(--theme-text)',
                  backgroundColor: currentTheme === 'feel' ? 'rgba(255, 255, 227, 0.1)' : 'transparent',
                  borderBottom: '1px solid var(--theme-border)'
                }}
                onMouseEnter={(e) => {
                  if (currentTheme !== 'feel') {
                    e.currentTarget.style.backgroundColor = 'var(--theme-surface)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme !== 'feel') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFFFE3' }}></div>
                  <span style={{ fontFamily: currentTheme === 'feel' ? '"Comic Neue", "Comic Sans MS", cursive' : undefined }}>Feel</span>
                </div>
                {currentTheme === 'feel' && <Check className="w-4 h-4" style={{ color: '#FFFFE3' }} />}
              </button>

              {/* Fade Mode */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFade();
                  setModesMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm transition-all flex items-center justify-between group"
                style={{
                  color: 'var(--theme-text)',
                  backgroundColor: currentTheme === 'fade' ? 'rgba(161, 161, 170, 0.1)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (currentTheme !== 'fade') {
                    e.currentTarget.style.backgroundColor = 'var(--theme-surface)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme !== 'fade') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a1a1aa' }}></div>
                  <span>Fade</span>
                </div>
                {currentTheme === 'fade' && <Check className="w-4 h-4" style={{ color: '#a1a1aa' }} />}
              </button>
            </div>,
            document.body
          )}
        </div>

        {/* Menú de tres puntos */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Menu button clicked, current state:', menuOpen);
              const newMenuState = !menuOpen;
              setMenuOpen(newMenuState);
              // Guardar posición del botón para el menú fixed
              if (!menuOpen) {
                const rect = e.currentTarget.getBoundingClientRect();
                menuRef.current.dataset.buttonRight = rect.right;
                menuRef.current.dataset.buttonBottom = rect.bottom;
                console.log('Menu position:', { right: rect.right, bottom: rect.bottom });
              }
            }}
            className="flex items-center justify-center transition-all p-1.5 hover:scale-110 cursor-pointer"
            style={{
              color: "var(--theme-text)",
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
            }}
            title="Más opciones"
          >
            <MoreVertical className="w-4 h-4" style={{ color: "var(--theme-secondary)" }} />
          </button>

          {/* Menú dropdown con position fixed usando Portal */}
          {menuOpen && typeof document !== 'undefined' && (() => {
            console.log('Rendering menu portal, position:', {
              top: menuRef.current?.dataset.buttonBottom,
              right: window.innerWidth - (menuRef.current?.dataset.buttonRight || window.innerWidth)
            });
            return createPortal(
              <div
                ref={menuPortalRef}
                onClick={(e) => e.stopPropagation()}
                className="fixed rounded-md shadow-lg overflow-hidden"
                style={{
                  backgroundColor: "#000000",
                  width: "180px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  zIndex: 999999,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)",
                  top: `${menuRef.current?.dataset.buttonBottom || 0}px`,
                  right: `${window.innerWidth - (menuRef.current?.dataset.buttonRight || window.innerWidth)}px`,
                  pointerEvents: 'auto',
                }}
              >
              {/* Preview */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Preview clicked');
                  setShowPreview(!showPreview);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer"
                style={{
                  color: "#fff",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                }}
              >
                Preview
              </button>

              {/* Colaboración - solo en modo no-lite */}
              {!isLite && onOpenCollaboration && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Colaboración clicked');
                    onOpenCollaboration();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  Colaboración
                  {isCollaborating && collaborationUsers > 1 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "var(--theme-primary)", color: "white" }}>
                      {collaborationUsers}
                    </span>
                  )}
                </button>
              )}

              {/* Chat - solo si está colaborando */}
              {!isLite && isCollaborating && onToggleChat && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Chat clicked');
                    onToggleChat();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  Chat
                  {chatMessagesCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "var(--theme-accent)", color: "white" }}>
                      {chatMessagesCount > 9 ? '9+' : chatMessagesCount}
                    </span>
                  )}
                </button>
              )}

              {/* Gestor de imágenes - solo en modo no-lite */}
              {!isLite && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Imágenes clicked');
                    onOpenImageManager();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  Imágenes
                </button>
              )}

              {/* Snippets Personalizados */}
              {onOpenSnippets && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Snippets clicked');
                    onOpenSnippets();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  Snippets
                </button>
              )}

              {/* Control de Versiones */}
              {onOpenGit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Git clicked');
                    onOpenGit();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  Versiones (Git)
                </button>
              )}

              {/* Herramientas de Desarrollador */}
              {onOpenDevTools && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenDevTools();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  🛠️ Herramientas Dev
                </button>
              )}

              {/* Fondo del editor - solo en modo no-lite */}
              {!isLite && onOpenBackground && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Fondo clicked');
                    onOpenBackground();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  Fondo
                </button>
              )}

              {/* Exportar - solo en modo no-lite */}
              {!isLite && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Exportar clicked');
                    onExport();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  Exportar
                </button>
              )}

              {/* Atajos de teclado - solo en modo no-lite */}
              {!isLite && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Atajos clicked');
                    onOpenShortcuts();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  Atajos
                </button>
              )}

              {/* Modo Práctica */}
              {onTogglePracticeMode && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Modo Práctica clicked');
                    onTogglePracticeMode();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer flex items-center justify-between"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  <span>Modo Práctica</span>
                  <span className="ml-2 text-xs" style={{ 
                    color: practiceModeEnabled ? "#4ade80" : "#94a3b8",
                    fontWeight: "600"
                  }}>
                    {practiceModeEnabled ? "ON" : "OFF"}
                  </span>
                </button>
              )}

              {/* Split View */}
              {onToggleSplitView && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Split View clicked');
                    onToggleSplitView();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10 cursor-pointer flex items-center justify-between"
                  style={{
                    color: "#fff",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  <span>Split View</span>
                  <span className="ml-2 text-xs" style={{ 
                    color: splitViewEnabled ? "#4ade80" : "#94a3b8",
                    fontWeight: "600"
                  }}>
                    {splitViewEnabled ? "ON" : "OFF"}
                  </span>
                </button>
              )}

              {/* Resetear - solo en modo no-lite */}
              {!isLite && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Resetear clicked');
                    if (confirm("¿Estás seguro de que quieres resetear todo? Se eliminarán todos los datos guardados.")) {
                      onResetAll();
                      setMenuOpen(false);
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-xs transition-colors border-t hover:bg-red-500/20 cursor-pointer"
                  style={{
                    color: "#fca5a5",
                    backgroundColor: "transparent",
                    borderTopColor: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    outline: "none",
                  }}
                >
                  Resetear
                </button>
              )}
            </div>,
            document.body
          );
          })()}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
