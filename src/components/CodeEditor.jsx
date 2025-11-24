import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  getHTMLSnippets,
  getCSSSnippets,
  getJSSnippets,
  getJavaSnippets,
} from "../utils/snippets";
import { defineCustomThemes } from "../utils/themes";
import {
  analyzeProject,
  getHTMLAttributeSuggestions,
} from "../utils/intellisense";
import { setupAutoclosing } from "../utils/autoclosing";
import { setupSyntaxValidation } from "../utils/syntaxChecking";
import { SemanticAnalyzer, AutoImportSystem } from "../utils/semanticAnalysis";
import { HoverProvider } from "../utils/hoverProvider";
import { IntelligentSnippetProvider } from "../utils/intelligentSnippets";
import { AdvancedSnippetEngine } from "../utils/advancedSnippets";
import { UniversalSnippetEngine } from "../utils/universalSnippets";
import SearchWidget from "./SearchWidget";
import CommandPalette from "./CommandPalette";
import TypingIndicator from "./TypingIndicator";
// import { MonacoBinding } from "y-monaco"; // 🔥 Yjs binding - COMENTADO TEMPORALMENTE (problema de dependencia)
import collaborationService from "../services/collaborationServiceV2"; // 🔥 Servicio V2

function CodeEditor({
  value,
  language,
  onChange,
  projectFiles,
  projectImages,
  currentTheme,
  isImage,
  activePath,
  onAddImageFile,
  hasCustomBackground = false,
  onRealtimeChange,
  isCollaborating,
  remoteCursors,
  onCursorMove,
  currentUser,
  activeFile,
  typingUsers,
  onExecuteCode,
  practiceModeEnabled = false,
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showSearchWidget, setShowSearchWidget] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const containerRef = useRef(null);
  const [fontSize, setFontSize] = useState(14);
  const disposablesRef = useRef([]);
  const projectFilesRef = useRef(projectFiles);
  const projectImagesRef = useRef(projectImages);
  const activePathRef = useRef(activePath);
  const isApplyingRemoteChangeRef = useRef(false);
  const realtimeTimeoutRef = useRef(null);
  const cursorDecorationsRef = useRef([]);
  const cursorWidgetsRef = useRef([]);
  const cursorMoveTimeoutRef = useRef(null);
  const yjsBindingRef = useRef(null); // 🔥 Yjs Monaco binding
  
  // 🧠 Sistemas inteligentes
  const semanticAnalyzerRef = useRef(new SemanticAnalyzer());
  const autoImportSystemRef = useRef(new AutoImportSystem());
  const hoverProviderRef = useRef(new HoverProvider());
  const intelligentSnippetProviderRef = useRef(new IntelligentSnippetProvider());
  const advancedSnippetEngineRef = useRef(new AdvancedSnippetEngine());
  const universalSnippetEngineRef = useRef(new UniversalSnippetEngine());

  // Memo: listas aplanadas de archivos/carpetas
  const buildAllFilePaths = (files, basePath = "") => {
    let paths = [];
    Object.entries(files || {}).forEach(([key, item]) => {
      const currentPath = basePath ? `${basePath}/${key}` : key;
      if (item.type === "file") {
        paths.push({
          path: currentPath,
          name: item.name,
          extension: item.name.split(".").pop(),
          isImage: !!item.isImage,
          data: item.isImage ? item.content : undefined,
        });
      } else if (item.type === "folder" && item.children) {
        paths = paths.concat(buildAllFilePaths(item.children, currentPath));
      }
    });
    return paths;
  };
  const buildAllFolderPaths = (files, basePath = "") => {
    let folders = [];
    Object.entries(files || {}).forEach(([key, item]) => {
      const currentPath = basePath ? `${basePath}/${key}` : key;
      if (item.type === "folder") {
        folders.push({ path: currentPath + "/", name: item.name });
        if (item.children)
          folders = folders.concat(
            buildAllFolderPaths(item.children, currentPath)
          );
      }
    });
    return folders;
  };

  useEffect(() => {
    projectFilesRef.current = projectFiles;
  }, [projectFiles]);
  useEffect(() => {
    projectImagesRef.current = projectImages;
  }, [projectImages]);
  useEffect(() => {
    activePathRef.current = activePath;
  }, [activePath]);

  // 🎨 Renderizar cursores remotos y etiquetas
  useEffect(() => {
    console.log("🎨🎨🎨 useEffect de cursores remotos ejecutado:", {
      hasEditor: !!editorRef.current,
      hasMonaco: !!monacoRef.current,
      isCollaborating,
      totalRemoteCursors: Object.keys(remoteCursors || {}).length,
      activePath,
    });

    if (!editorRef.current || !monacoRef.current || !isCollaborating) {
      console.warn("⚠️ Saltando renderizado de cursores:", {
        hasEditor: !!editorRef.current,
        hasMonaco: !!monacoRef.current,
        isCollaborating,
      });
      return;
    }

    const editor = editorRef.current;
    const monaco = monacoRef.current;

    // Filtrar cursores que están en el archivo actual
    const cursorsInCurrentFile = Object.entries(remoteCursors || {}).filter(
      ([userId, cursor]) => cursor.filePath === activePath
    );

    console.log("📍 Cursores en archivo actual:", {
      totalCursors: cursorsInCurrentFile.length,
      cursors: cursorsInCurrentFile.map(([id, c]) => ({
        id,
        user: c.userName,
        path: c.filePath,
      })),
    });

    // Limpiar decoraciones y widgets anteriores
    if (cursorDecorationsRef.current.length > 0) {
      cursorDecorationsRef.current = editor.deltaDecorations(
        cursorDecorationsRef.current,
        []
      );
    }
    cursorWidgetsRef.current.forEach((widget) => {
      try {
        editor.removeContentWidget(widget);
      } catch (e) {}
    });
    cursorWidgetsRef.current = [];

    if (cursorsInCurrentFile.length === 0) return;

    // Crear nuevas decoraciones para cada cursor remoto
    const decorations = [];
    cursorsInCurrentFile.forEach(([userId, cursor]) => {
      const position = cursor.position;
      if (!position || !position.lineNumber || !position.column) return;

      // Decoración de línea vertical del cursor
      decorations.push({
        range: new monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          className: `remote-cursor-line-${userId}`,
          stickiness:
            monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          zIndex: 1000,
        },
      });

      // Si hay selección, resaltarla
      if (cursor.selection) {
        const sel = cursor.selection;
        decorations.push({
          range: new monaco.Range(
            sel.startLineNumber,
            sel.startColumn,
            sel.endLineNumber,
            sel.endColumn
          ),
          options: {
            className: `remote-selection-${userId}`,
            stickiness:
              monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          },
        });
      }

      // Crear widget flotante para la etiqueta del usuario (Content Widget)
      const userLabel = {
        getId: () => `remote-cursor-label-${userId}`,
        getDomNode: () => {
          const domNode = document.createElement("div");
          domNode.className = "remote-cursor-label-widget";
          domNode.style.cssText = `
            position: absolute;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            color: white;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1001;
            background: ${cursor.userColor || "#888"};
            box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.2);
            transform: translateY(-24px);
            line-height: 1.3;
            transition: all 0.15s cubic-bezier(0.4, 0.0, 0.2, 1);
            animation: cursorLabelFadeIn 0.2s ease-out;
            border: 1px solid rgba(255, 255, 255, 0.2);
          `;
          domNode.textContent = cursor.userName || "Usuario";
          return domNode;
        },
        getPosition: () => ({
          position: position,
          preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE],
        }),
      };

      editor.addContentWidget(userLabel);
      cursorWidgetsRef.current.push(userLabel);
    });

    // Aplicar decoraciones
    cursorDecorationsRef.current = editor.deltaDecorations([], decorations);

    // Inyectar estilos CSS dinámicos para cursores y selecciones
    const styleId = "remote-cursor-styles";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    let css = `
      @keyframes remote-cursor-blink {
        0%, 49% { 
          opacity: 1; 
          transform: scaleY(1);
        }
        50%, 100% { 
          opacity: 0.5; 
          transform: scaleY(0.98);
        }
      }
      
      @keyframes cursorLabelFadeIn {
        0% {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateY(-24px) scale(1);
        }
      }
      
      @keyframes cursorPulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
        }
        50% {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }
      }
    `;

    // Agregar estilos específicos por usuario
    cursorsInCurrentFile.forEach(([userId, cursor]) => {
      const color = cursor.userColor || "#888";
      css += `
        .remote-cursor-line-${userId} {
          border-left: 3px solid ${color} !important;
          animation: remote-cursor-blink 1s ease-in-out infinite;
          transition: all 0.12s cubic-bezier(0.4, 0.0, 0.2, 1);
          position: relative;
        }
        
        .remote-cursor-line-${userId}::before {
          content: '';
          position: absolute;
          left: -5px;
          top: -2px;
          width: 8px;
          height: 8px;
          background: ${color};
          border-radius: 50%;
          animation: cursorPulse 2s ease-in-out infinite;
          box-shadow: 0 0 6px ${color};
        }
        
        .remote-selection-${userId} {
          background: linear-gradient(90deg, ${color}35 0%, ${color}25 100%) !important;
          border: 1px solid ${color}90;
          border-radius: 2px;
          transition: all 0.15s ease;
          box-shadow: inset 0 0 8px ${color}20;
        }
      `;
    });

    styleEl.textContent = css;

    // Cleanup al desmontar
    return () => {
      cursorWidgetsRef.current.forEach((widget) => {
        try {
          editor.removeContentWidget(widget);
        } catch (e) {}
      });
      cursorWidgetsRef.current = [];
    };
  }, [remoteCursors, activePath, isCollaborating]);

  // 🎯 Registrar listener de movimiento de cursor dinámicamente
  useEffect(() => {
    if (!editorRef.current || !isCollaborating || !onCursorMove) {
      console.warn("⚠️⚠️⚠️ Listener de cursor NO registrado:", {
        hasEditor: !!editorRef.current,
        isCollaborating,
        hasOnCursorMove: !!onCursorMove,
      });
      return;
    }

    const editor = editorRef.current;
    console.log("✅✅✅ REGISTRANDO LISTENER DE CURSOR para colaboración");

    // Registrar evento de cambio de posición del cursor
    const disposable = editor.onDidChangeCursorPosition((e) => {
      // Limpiar timeout anterior
      if (cursorMoveTimeoutRef.current) {
        clearTimeout(cursorMoveTimeoutRef.current);
      }

      // Enviar posición después de 50ms (tiempo real ultra-rápido)
      cursorMoveTimeoutRef.current = setTimeout(() => {
        const position = e.position;
        const selection = editor.getSelection();

        console.log("📍 Enviando posición de cursor:", {
          filePath: activePath,
          lineNumber: position.lineNumber,
          column: position.column,
          hasSelection: selection && !selection.isEmpty(),
        });

        onCursorMove(
          activePath,
          {
            lineNumber: position.lineNumber,
            column: position.column,
          },
          selection && !selection.isEmpty()
            ? {
                startLineNumber: selection.startLineNumber,
                startColumn: selection.startColumn,
                endLineNumber: selection.endLineNumber,
                endColumn: selection.endColumn,
              }
            : null
        );
      }, 50);
    });

    // Cleanup: remover listener cuando cambie la dependencia
    return () => {
      console.log("🧹 Limpiando listener de cursor");
      if (cursorMoveTimeoutRef.current) {
        clearTimeout(cursorMoveTimeoutRef.current);
      }
      if (disposable) {
        disposable.dispose();
      }
    };
  }, [isCollaborating, onCursorMove, activePath]);

  // 🔥 SOLUCIÓN 2: Detectar cambios remotos por timestamp
  useEffect(() => {
    if (activeFile?._remoteUpdate && editorRef.current && isCollaborating) {
      console.log("🔥 CAMBIO REMOTO DETECTADO por _remoteUpdate flag");
      console.log("🎨 Aplicando forzosamente al editor...");

      isApplyingRemoteChangeRef.current = true;

      const currentPosition = editorRef.current.getPosition();
      editorRef.current.setValue(value || "");

      if (currentPosition) {
        editorRef.current.setPosition(currentPosition);
      }

      console.log("✅ Cambio remoto aplicado forzosamente");

      setTimeout(() => {
        isApplyingRemoteChangeRef.current = false;
      }, 50);
    }
  }, [activeFile?._lastModified, isCollaborating]);

  // Analizar proyecto para IntelliSense (con memoization)
  const projectData = useMemo(() => {
    return analyzeProject(projectFiles);
  }, [projectFiles]);

  // Cache simple por referencia del objeto
  const filesCacheRef = useRef({ key: null, files: [], folders: [] });
  const getCachedPaths = () => {
    const key = projectFilesRef.current;
    if (filesCacheRef.current.key !== key) {
      filesCacheRef.current = {
        key,
        files: buildAllFilePaths(key),
        folders: buildAllFolderPaths(key),
      };
    }
    return filesCacheRef.current;
  };

  // Cleanup providers al desmontar
  useEffect(
    () => () => {
      disposablesRef.current.forEach((d) => {
        try {
          d && d.dispose && d.dispose();
        } catch {}
      });
      disposablesRef.current = [];
    },
    []
  );

  const handleEditorChange = (value) => {
    // Si estamos aplicando un cambio remoto, no propagar
    if (isApplyingRemoteChangeRef.current) {
      console.log("⏸️ Cambio remoto - no propagar");
      return;
    }

    // Guardar cambio local inmediatamente
    onChange(value);

    // 🔥 SISTEMA HÍBRIDO: Verificar si Yjs está REALMENTE sincronizado
    const ydoc = collaborationService.getYDoc?.();
    const yjsProvider = collaborationService.yjsProvider;
    
    // Yjs está listo SOLO si provider está sincronizado
    const yjsFullyReady = ydoc && yjsProvider && yjsProvider.synced === true;
    
    // SIEMPRE usar broadcast legacy si Yjs no está 100% sincronizado
    const shouldBroadcast = isCollaborating && onRealtimeChange && !yjsFullyReady;
    
    console.log("📝 handleEditorChange:", {
      isCollaborating,
      hasYDoc: !!ydoc,
      hasProvider: !!yjsProvider,
      providerSynced: yjsProvider?.synced,
      yjsFullyReady,
      shouldBroadcast,
      decision: yjsFullyReady ? 'Yjs maneja' : 'Broadcast legacy',
      contentLength: value?.length,
    });

    // Enviar broadcast si Yjs NO está totalmente listo
    if (shouldBroadcast) {
      // Limpiar timeout anterior
      if (realtimeTimeoutRef.current) {
        clearTimeout(realtimeTimeoutRef.current);
      }

      // Enviar después de 150ms (más rápido para mejor UX)
      realtimeTimeoutRef.current = setTimeout(() => {
        const editor = editorRef.current;
        const position = editor?.getPosition();

        console.log("📡 ENVIANDO cambio en tiempo real (sistema legacy):", {
          filePath: activePath,
          contentLength: value.length,
          position,
        });

        onRealtimeChange({
          filePath: activePath,
          content: value,
          cursorPosition: position
            ? {
                lineNumber: position.lineNumber,
                column: position.column,
              }
            : null,
        });
      }, 150); // 🔥 Reducido de 300ms a 150ms para respuesta más rápida
    } else if (yjsFullyReady) {
      console.log("✅ Yjs sincronizado - Yjs maneja cambios automáticamente");
    } else {
      console.log("⏸️ No se envía broadcast:", {
        isCollaborating,
        yjsFullyReady,
        hasCallback: !!onRealtimeChange,
      });
    }
  };

  // Aplicar cambios remotos cuando el value cambia desde colaboración
  useEffect(() => {
    console.log("🔄 useEffect [value] ejecutado:", {
      isCollaborating,
      hasEditor: !!editorRef.current,
      valueLength: value?.length,
      valueIsDefined: value !== undefined,
      hasRemoteUpdate: !!activeFile?._remoteUpdate,
    });

    // 🔥 SOLUCIÓN 3: Si hay flag remoto, aplicar sin comparar
    if (
      isCollaborating &&
      editorRef.current &&
      value !== undefined &&
      activeFile?._remoteUpdate
    ) {
      console.log("🔥 APLICANDO CAMBIO REMOTO SIN COMPARAR (flag detectado)");
      isApplyingRemoteChangeRef.current = true;

      const currentPosition = editorRef.current.getPosition();
      editorRef.current.setValue(value);

      if (currentPosition) {
        editorRef.current.setPosition(currentPosition);
      }

      console.log("✅ setValue() ejecutado - cambio remoto aplicado");

      setTimeout(() => {
        isApplyingRemoteChangeRef.current = false;
      }, 50);

      return; // ← Salir temprano
    }

    // Lógica normal para cambios locales
    if (isCollaborating && editorRef.current && value !== undefined) {
      const currentValue = editorRef.current.getValue();

      console.log("📊 Comparando valores:", {
        currentValueLength: currentValue.length,
        newValueLength: value.length,
        areDifferent: currentValue !== value,
      });

      // Solo aplicar si el valor es diferente (viene de otro usuario)
      if (currentValue !== value) {
        console.log("🎨 APLICANDO CAMBIO VISUAL AL EDITOR MONACO");
        isApplyingRemoteChangeRef.current = true;

        // Guardar posición actual del cursor
        const currentPosition = editorRef.current.getPosition();

        // Aplicar el nuevo valor
        editorRef.current.setValue(value);
        console.log("✅ setValue() ejecutado - debería verse ahora");

        // Restaurar posición del cursor si es posible
        if (currentPosition) {
          editorRef.current.setPosition(currentPosition);
        }

        // Resetear flag después de aplicar
        setTimeout(() => {
          isApplyingRemoteChangeRef.current = false;
        }, 50);
      } else {
        console.log("⏸️ Valores idénticos - no aplicar");
      }
    } else {
      console.warn("⚠️ NO se aplicará cambio visual:", {
        isCollaborating,
        hasEditor: !!editorRef.current,
        valueUndefined: value === undefined,
      });
    }
  }, [value, isCollaborating, activeFile?._lastModified]);

  // Aplicar tema del editor cuando cambia currentTheme (evita quedarse en blanco o tema incorrecto)
  useEffect(() => {
    if (monacoRef.current) {
      try {
        monacoRef.current.editor.setTheme(currentTheme || "vs-dark");
      } catch (e) {
        // Si aún no está definido, mantener vs-dark
        monacoRef.current.editor.setTheme("vs-dark");
      }
    }
  }, [currentTheme]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    // 0) Movimiento desde FileExplorer hacia el editor (inserción de referencia)
    const explorerPath = e.dataTransfer.getData("text/source-path");
    if (explorerPath && editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      const fromDir = activePathRef.current
        ? activePathRef.current.split("/").slice(0, -1).join("/")
        : "";
      const rel = (function relativePath(fromDir, toPath) {
        if (!fromDir) return toPath;
        const fp = fromDir.split("/").filter(Boolean);
        const tp = toPath.split("/").filter(Boolean);
        let i = 0;
        while (i < fp.length && i < tp.length && fp[i] === tp[i]) i++;
        const up = new Array(fp.length - i).fill("..");
        const down = tp.slice(i);
        const r = [...up, ...down].join("/");
        return r || "./";
      })(fromDir, explorerPath);

      const ext = (explorerPath.split(".").pop() || "").toLowerCase();
      const isImg = [
        "png",
        "jpg",
        "jpeg",
        "gif",
        "svg",
        "webp",
        "avif",
      ].includes(ext);

      let insertText = rel;
      if (language === "html") {
        insertText = isImg
          ? `<img src="${rel}" alt="${
              explorerPath.split("/").pop().split(".")[0]
            }" />`
          : rel;
      } else if (language === "css") {
        insertText = isImg ? `url('${rel}')` : rel;
      }

      editor.executeEdits("drop-explorer", [
        {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
          text: insertText,
        },
      ]);
      editor.setPosition({
        lineNumber: position.lineNumber,
        column: position.column + insertText.length,
      });
      editor.focus();
      return; // no continuar con otros manejos
    }

    // 1) Archivos externos (imágenes)
    const filesList = e.dataTransfer.files;
    if (filesList && filesList.length > 0) {
      const imgFiles = Array.from(filesList).filter(
        (f) => f.type && f.type.startsWith("image/")
      );
      if (imgFiles.length && onAddImageFile && editorRef.current) {
        const editor = editorRef.current;
        const position = editor.getPosition();
        const fromDir = activePathRef.current
          ? activePathRef.current.split("/").slice(0, -1).join("/")
          : "";

        imgFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            const imageData = {
              name: file.name,
              data: dataUrl,
              size: file.size,
              type: file.type,
            };
            const parentPath = fromDir || null;
            // Crear archivo de imagen en el árbol
            onAddImageFile(imageData, parentPath);
            // Ruta creada
            const createdPath = parentPath
              ? `${parentPath}/${file.name}`
              : file.name;
            // Insertar referencia relativa según lenguaje
            const rel = (function relativePath(fromDir, toPath) {
              if (!fromDir) return toPath;
              const fp = fromDir.split("/").filter(Boolean);
              const tp = toPath.split("/").filter(Boolean);
              let i = 0;
              while (i < fp.length && i < tp.length && fp[i] === tp[i]) i++;
              const up = new Array(fp.length - i).fill("..");
              const down = tp.slice(i);
              const r = [...up, ...down].join("/");
              return r || "./";
            })(fromDir, createdPath);

            let insertText = rel;
            if (language === "html") {
              insertText = `<img src="${rel}" alt="${
                file.name.split(".")[0]
              }" />`;
            } else if (language === "css") {
              insertText = `url('${rel}')`;
            }

            editor.executeEdits("drop-image", [
              {
                range: {
                  startLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endLineNumber: position.lineNumber,
                  endColumn: position.column,
                },
                text: insertText,
              },
            ]);
            editor.setPosition({
              lineNumber: position.lineNumber,
              column: position.column + insertText.length,
            });
            editor.focus();
          };
          reader.readAsDataURL(file);
        });
        return; // no procesar texto si se manejaron archivos
      }
    }

    // 2) Texto arrastrado (desde gestor de imágenes u otras fuentes)
    const text = e.dataTransfer.getData("text/plain");
    if (text && editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      editor.executeEdits("drop", [
        {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
          text,
        },
      ]);
      const lines = text.split("\n");
      const lastLine = lines[lines.length - 1];
      editor.setPosition({
        lineNumber: position.lineNumber + lines.length - 1,
        column:
          lines.length === 1
            ? position.column + text.length
            : lastLine.length + 1,
      });
      editor.focus();
    }
  };

  // 🔥 useEffect: Actualizar Yjs binding cuando cambia el archivo activo
  useEffect(() => {
    if (isCollaborating && editorRef.current && activePath) {
      console.log('📂 Archivo cambió, actualizando Yjs binding:', activePath);
      
      // Verificar que Yjs esté listo antes de crear binding
      const updateBinding = () => {
        if (collaborationService.getYDoc()) {
          setupYjsBinding(editorRef.current);
        } else {
          console.log('⏳ Yjs no listo aún, esperando...');
          setTimeout(updateBinding, 200);
        }
      };
      
      setTimeout(updateBinding, 100);
    }
  }, [activePath, isCollaborating]);

  // 🔥 useEffect: Cleanup Yjs binding al desmontar
  useEffect(() => {
    return () => {
      if (yjsBindingRef.current) {
        try {
          yjsBindingRef.current.destroy();
          yjsBindingRef.current = null;
          console.log('🧹 Yjs binding destruido (unmount)');
        } catch (e) {
          console.error('Error al destruir binding en cleanup:', e);
        }
      }
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Definir temas personalizados
    defineCustomThemes(monaco);
    // Aplicar tema actual al montar
    try {
      monaco.editor.setTheme(currentTheme || "vs-dark");
    } catch {}
    
    // Configurar autocompletado y autocerrado avanzado
    setupAutoclosing(monaco, editor);
    
    // Configurar validación de sintaxis avanzada
    setupSyntaxValidation(monaco, editor);

    // 🧠 CONFIGURAR SISTEMAS INTELIGENTES
    
    // Inicializar auto-import system
    autoImportSystemRef.current.initializeCommonModules();
    
    // Registrar hover provider inteligente
    const hoverProvider = monaco.languages.registerHoverProvider('javascript', {
      provideHover: (model, position) => {
        const projectAnalysis = analyzeProject(projectFiles);
        return hoverProviderRef.current.provideHover(model, position, projectAnalysis);
      }
    });
    disposablesRef.current.push(hoverProvider);
    
    // 🚀 REGISTRAR COMPLETION PROVIDERS UNIVERSALES PARA TODOS LOS LENGUAJES
    const supportedLanguages = universalSnippetEngineRef.current.getSupportedLanguages();
    
    // Registrar completion providers para cada lenguaje soportado
    supportedLanguages.forEach(lang => {
      const completionProvider = monaco.languages.registerCompletionItemProvider(lang, {
        triggerCharacters: ['.', '(', '<', '"', "'", '/', '@', ' ', 'c', 'f', 'i', 'w', 't', 'a', 'p', 'd', 's', 'm', 'e', 'n', 'r', 'u', 'v', 'l'],
        provideCompletionItems: async (model, position) => {
          // Solo actuar si el modo práctica está desactivado
          if (practiceModeEnabled) {
            return { suggestions: [] };
          }

          const word = model.getWordUntilPosition(position);
          const line = model.getLineContent(position.lineNumber);
          
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          let suggestions = [];

          // 🎯 PRIORIDAD 1: SNIPPETS UNIVERSALES ESPECÍFICOS DEL LENGUAJE
          if (word.word && word.word.length >= 1) {
            try {
              const universalSuggestions = universalSnippetEngineRef.current.getUniversalSuggestions(
                word.word, 
                lang, 
                range
              );
              suggestions.push(...universalSuggestions);
              
              console.log(`🎯 [${lang}] Universal snippets found:`, universalSuggestions.length);
            } catch (error) {
              console.warn(`⚠️ Error getting universal suggestions for ${lang}:`, error);
            }
          }

          // 🎯 PRIORIDAD 2: Sugerencias de archivos en strings (solo para lenguajes que lo soporten)
          if (['javascript', 'typescript', 'jsx', 'tsx', 'python', 'java'].includes(lang)) {
            const textUntilPosition = model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            });
            
            const inString = /["'][^"']*$/.test(textUntilPosition);
            const afterImportOrRequire = /(import|require|fetch|from)\s*\(?\s*["'][^"']*$/.test(textUntilPosition);
            
            if (inString && (afterImportOrRequire || textUntilPosition.includes("./"))) {
              const filePaths = getCachedPaths().files;
              const relevantFiles = filePaths.filter((f) => {
                const allowedExts = {
                  'javascript': ['js', 'json', 'css', 'html', 'ts', 'jsx', 'tsx'],
                  'typescript': ['ts', 'tsx', 'js', 'json', 'css'],
                  'jsx': ['js', 'jsx', 'ts', 'tsx', 'json', 'css'],
                  'tsx': ['ts', 'tsx', 'js', 'jsx', 'json'],
                  'python': ['py', 'txt', 'json'],
                  'java': ['java', 'properties', 'xml']
                };
                return (allowedExts[lang] || ['js']).includes(f.extension);
              });

              relevantFiles.forEach((file, index) => {
                suggestions.push({
                  label: `./${file.path}`,
                  kind: monaco.languages.CompletionItemKind.Module,
                  insertText: `./${file.path}`,
                  documentation: `📦 ${lang === 'python' ? 'Módulo' : 'Módulo'}: ${file.name}`,
                  sortText: String(200 + index).padStart(4, '0'),
                  range
                });
              });
            }
          }

          // 🎯 PRIORIDAD 3: Auto-imports (solo para JavaScript/TypeScript)
          if (['javascript', 'typescript', 'jsx', 'tsx'].includes(lang) && 
              suggestions.length === 0 && word.word && word.word.length > 2) {
            const fileContent = model.getValue();
            const fileAnalysis = semanticAnalyzerRef.current.analyzeFile(fileContent, activePath, lang);
            const autoImports = autoImportSystemRef.current.suggestImports(word.word, fileAnalysis.imports);
            
            autoImports.forEach((imp, index) => {
              suggestions.push({
                label: `${imp.symbolName} (auto-import)`,
                kind: monaco.languages.CompletionItemKind.Module,
                insertText: imp.symbolName,
                detail: `Auto-import from ${imp.moduleName}`,
                documentation: `Importará automáticamente: ${imp.importStatement}`,
                additionalTextEdits: [{
                  range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 },
                  text: imp.importStatement + '\n'
                }],
                sortText: String(300 + index).padStart(4, '0')
              });
            });
          }

          return { suggestions };
        }
      });
      
      disposablesRef.current.push(completionProvider);
    });

    console.log(`🎉 Registered completion providers for ${supportedLanguages.length} languages:`, supportedLanguages);
    
    // 🔍 DEBUG: Verificar que el sistema universal funciona correctamente
    const snippetStats = universalSnippetEngineRef.current.debugLanguageSupport();
    console.log('📊 Universal Snippet Engine Stats:', snippetStats);

    // ===== ATAJOS DE TECLADO ÚTILES =====

    // Zoom
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal, () => {
      setFontSize((prev) => Math.min(prev + 2, 32)); // Zoom in
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus, () => {
      setFontSize((prev) => Math.max(prev - 2, 10)); // Zoom out
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0, () => {
      setFontSize(14); // Reset zoom
    });

    // Buscar (Ctrl+F) - Abre nuestro widget personalizado
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      setShowSearchWidget(true);
    });

    // Panel de comandos (Ctrl+Shift+P)
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
      () => {
        setShowCommandPalette(true);
      }
    );

    // Formatear código (Ctrl+Shift+F ya está integrado, pero lo hacemos más explícito)
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
      () => {
        editor.getAction("editor.action.formatDocument")?.run();
      }
    );
    
    // Activar autocompletado inteligente (Ctrl+Space)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      editor.trigger('keyboard', 'editor.action.triggerSuggest', {});
    });
    
    // Activar parameter hints (Ctrl+Shift+Space)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Space, () => {
      editor.trigger('keyboard', 'editor.action.triggerParameterHints', {});
    });

    // Duplicar línea (Ctrl+D)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.getAction("editor.action.copyLinesDownAction")?.run();
    });

    // Seleccionar todas las ocurrencias (Ctrl+Shift+L)
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyL,
      () => {
        editor.getAction("editor.action.selectHighlights")?.run();
      }
    );

    // Comentar/Descomentar línea (Ctrl+/)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      editor.getAction("editor.action.commentLine")?.run();
    });

    // Mover línea arriba (Alt+Up)
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
      editor.getAction("editor.action.moveLinesUpAction")?.run();
    });

    // Mover línea abajo (Alt+Down)
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.getAction("editor.action.moveLinesDownAction")?.run();
    });

    // Eliminar línea (Ctrl+Shift+K)
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK,
      () => {
        editor.getAction("editor.action.deleteLines")?.run();
      }
    );

    // Expandir selección (Shift+Alt+Right)
    editor.addCommand(
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.RightArrow,
      () => {
        editor.getAction("editor.action.smartSelect.expand")?.run();
      }
    );

    // Contraer selección (Shift+Alt+Left)
    editor.addCommand(
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.LeftArrow,
      () => {
        editor.getAction("editor.action.smartSelect.shrink")?.run();
      }
    );

    // Ir a línea (Ctrl+G)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
      editor.getAction("editor.action.gotoLine")?.run();
    });

    // Toggle minimap (Ctrl+M)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM, () => {
      const currentOptions = editor.getOptions();
      const minimapEnabled = currentOptions.get(
        monaco.editor.EditorOption.minimap
      ).enabled;
      editor.updateOptions({ minimap: { enabled: !minimapEnabled } });
    });

    // Guardar (Ctrl+S) - formatear y ejecutar código si está disponible
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      // 🎨 Formatear código automáticamente antes de guardar
      try {
        await editor.getAction("editor.action.formatDocument")?.run();
      } catch (e) {
        console.log("Formateo no disponible para este lenguaje");
      }

      // Ejecutar código JavaScript/Python si la función está disponible
      if (
        onExecuteCode &&
        (language === "javascript" ||
          activePath?.endsWith(".js") ||
          activePath?.endsWith(".py"))
      ) {
        onExecuteCode();
        // Mostrar notificación de ejecución
        const notification = document.createElement("div");
        notification.textContent = "▶️ ¡Código formateado y ejecutado!";
        notification.style.cssText = `
          position: fixed;
          top: 80px;
          right: 20px;
          background: rgba(139, 92, 246, 0.9);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
      } else {
        // Mostrar notificación visual de guardado y formateo
        const notification = document.createElement("div");
        notification.textContent = "✨ ¡Código formateado y guardado!";
        notification.style.cssText = `
          position: fixed;
          top: 80px;
          right: 20px;
          background: rgba(34, 197, 94, 0.9);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
      }
    });

    // NOTA: El listener de cursor ahora está en un useEffect para que se active dinámicamente

    // 🚀 Auto-expansión del snippet "!" para HTML5
    editor.onDidChangeModelContent((e) => {
      const model = editor.getModel();
      if (!model || language !== "html") return;

      // Verificar si el cambio fue de un solo carácter
      if (e.changes.length !== 1) return;
      const change = e.changes[0];

      // Verificar si el texto insertado fue "!"
      if (change.text === "!") {
        const position = editor.getPosition();
        const lineContent = model.getLineContent(position.lineNumber);

        // Verificar si el "!" está al inicio de la línea (opcionalmente con espacios)
        const textBeforeExclamation = lineContent
          .substring(0, position.column - 1)
          .trim();

        if (textBeforeExclamation === "") {
          // Eliminar el "!" que acabamos de escribir
          const range = new monaco.Range(
            position.lineNumber,
            position.column - 1,
            position.lineNumber,
            position.column
          );

          // Insertar el HTML5 boilerplate
          editor.executeEdits("html5-snippet", [
            {
              range: range,
              text: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`,
              forceMoveMarkers: true,
            },
          ]);

          // Mover el cursor al título
          setTimeout(() => {
            editor.setPosition({
              lineNumber: position.lineNumber + 5,
              column: 12,
            });
            editor.setSelection(
              new monaco.Selection(
                position.lineNumber + 5,
                12,
                position.lineNumber + 5,
                20
              )
            );
          }, 0);
        }
      }
    });

    // Función auxiliar para obtener todas las rutas de archivos
    const getAllFilePaths = (files, basePath = "") => {
      let paths = [];
      Object.entries(files || {}).forEach(([key, item]) => {
        const currentPath = basePath ? `${basePath}/${key}` : key;
        if (item.type === "file") {
          paths.push({
            path: currentPath,
            name: item.name,
            type: "file",
            extension: item.name.split(".").pop(),
          });
        } else if (item.type === "folder" && item.children) {
          paths = paths.concat(getAllFilePaths(item.children, currentPath));
        }
      });
      return paths;
    };

    // Función auxiliar para obtener todas las rutas de carpetas (para sugerir "img/" etc.)
    const getAllFolderPaths = (files, basePath = "") => {
      let folders = [];
      Object.entries(files || {}).forEach(([key, item]) => {
        const currentPath = basePath ? `${basePath}/${key}` : key;
        if (item.type === "folder") {
          folders.push({ path: currentPath + "/", name: item.name });
          if (item.children) {
            folders = folders.concat(
              getAllFolderPaths(item.children, currentPath)
            );
          }
        }
      });
      return folders;
    };

    // Utils ruta relativa
    const getDirname = (p) => {
      if (!p) return "";
      const parts = p.split("/");
      if (parts.length <= 1) return "";
      parts.pop();
      return parts.join("/");
    };
    const relativePath = (fromDir, toPath) => {
      if (!fromDir) return toPath;
      const fromParts = fromDir.split("/").filter(Boolean);
      const toParts = toPath.split("/").filter(Boolean);
      // encontrar común
      let i = 0;
      while (
        i < fromParts.length &&
        i < toParts.length &&
        fromParts[i] === toParts[i]
      )
        i++;
      const up = new Array(fromParts.length - i).fill("..");
      const down = toParts.slice(i);
      const rel = [...up, ...down].join("/");
      return rel || "./";
    };

    // Fuzzy score simple
    const normalize = (s) => (s || "").toLowerCase();
    const fuzzyScore = (label, q) => {
      if (!q) return 0;
      const L = normalize(label);
      const Q = normalize(q);
      if (L === Q) return 1000;
      if (L.startsWith(Q)) return 800 - (L.length - Q.length);
      if (L.includes("/" + Q)) return 700;
      if (L.includes(Q)) return 500 - L.indexOf(Q);
      // subsequence score
      let i = 0;
      for (const ch of Q) {
        const pos = L.indexOf(ch, i);
        if (pos === -1) return 0;
        i = pos + 1;
      }
      return 300 - (L.length - Q.length);
    };
    const sortByFuzzy = (items, getLabel, q) => {
      if (!q) return items;
      return items
        .map((it) => ({ it, s: fuzzyScore(getLabel(it), q) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.it);
    };
    const extractHtmlAttrQuery = (textUntilPosition) => {
      // intenta obtener texto dentro de "... o '...
      const m = textUntilPosition.match(/(?:src|href|data)=["']([^"']*)$/);
      return m ? m[1] : "";
    };
    const extractCssUrlQuery = (before) => {
      const m = before.match(/url\(([^)]*)$/); // contenido antes de )
      if (!m) return "";
      return m[1].replace(/^\s*["']?/, "").replace(/["']?\s*$/, "");
    };

    // HTML Snippets + Autocompletado de rutas
    // HTML Provider mejorado con autocompletado de etiquetas
const htmlProvider = monaco.languages.registerCompletionItemProvider(
      "html",
      {
        triggerCharacters: ["!", "<", ".", "#", " "],
        provideCompletionItems: (model, position) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });

          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          // Detectar si estamos en un atributo src, href, etc.
          const inSrcAttribute = /(?:src|href|data)=["'][^"']*$/.test(
            textUntilPosition
          );

          if (inSrcAttribute) {
            // Cuando estamos dentro de un atributo, SOLO mostrar rutas de archivos
            const { files: filePaths } = getCachedPaths();
            const fromDir = getDirname(activePathRef.current || "");
            const query = extractHtmlAttrQuery(textUntilPosition);
            const fileCompletions = filePaths.map((file) => ({
              label: file.path,
              kind: monaco.languages.CompletionItemKind.File,
              insertText: relativePath(fromDir, file.path),
              documentation:
                file.isImage && file.data
                  ? {
                      value: `📁 Archivo del proyecto: ${file.name}\n\n![${file.name}](${file.data})`,
                    }
                  : `📁 Archivo del proyecto: ${file.name}`,
              detail: `Tipo: ${file.extension}`,
              range,
            }));

            // Agregar carpetas del proyecto
            const { folders: folderPaths } = getCachedPaths();
            const folderCompletions = folderPaths.map((folder, index) => ({
              label: folder.path,
              kind: monaco.languages.CompletionItemKind.Folder,
              insertText: relativePath(
                fromDir,
                folder.path.replace(/\/$/, "/")
              ),
              documentation: `📂 Carpeta: ${folder.name}`,
              sortText: `0${index}`,
              range,
            }));

            // Agregar imágenes cargadas
            const imageCompletions = (projectImagesRef.current || []).map(
              (image, index) => ({
                label: `${image.name} (imagen cargada)`,
                kind: monaco.languages.CompletionItemKind.File,
                insertText: image.data,
                documentation: {
                  value: `🖼️ Imagen cargada: ${image.name} (${(
                    image.size / 1024
                  ).toFixed(1)} KB)\n\n![${image.name}](${image.data})`,
                },
                detail: "Data URL",
                sortText: `0${index}`, // Prioridad alta
                range,
              })
            );

            // Solo sugerir rutas cuando estamos dentro de src=""
            const allCompletions = [
              ...sortByFuzzy(folderCompletions, (x) => x.label, query),
              ...sortByFuzzy(imageCompletions, (x) => x.label || "", query),
              ...sortByFuzzy(fileCompletions, (x) => x.label, query),
            ];

            // Eliminar duplicados basado en label
            const seen = new Set();
            const suggestions = allCompletions.filter((item) => {
              if (seen.has(item.label)) return false;
              seen.add(item.label);
              return true;
            });

            return { suggestions };
          }

          // Si no estamos en un atributo, mostrar snippets HTML normales
          const suggestions = getHTMLSnippets(monaco, range);
          return { suggestions };
        },
      }
    );
    disposablesRef.current.push(htmlProvider);

    // CSS: autocompletar rutas dentro de url(...)
    const cssUrlProvider = monaco.languages.registerCompletionItemProvider(
      "css",
      {
        triggerCharacters: ["/", ".", '"', "'", "("],
        provideCompletionItems: (model, position) => {
          const lineContent = model.getLineContent(position.lineNumber);
          const before = lineContent.slice(0, position.column - 1);
          // Detectar si estamos dentro de url( ... ) sin cerrar
          const insideUrl = /url\([^\)]*$/.test(before);
          if (!insideUrl) return { suggestions: [] };

          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const { files: allFiles, folders } = getCachedPaths();
          const fromDir = getDirname(activePathRef.current || "");
          const imageExts = new Set([
            "png",
            "jpg",
            "jpeg",
            "gif",
            "svg",
            "webp",
            "avif",
          ]);
          const imageFiles = allFiles.filter((f) =>
            imageExts.has(String(f.extension || "").toLowerCase())
          );
          const query = extractCssUrlQuery(before);

          const fileItems = imageFiles.map((f) => ({
            label: f.path,
            kind: monaco.languages.CompletionItemKind.File,
            insertText: relativePath(fromDir, f.path),
            documentation:
              f.isImage && f.data
                ? { value: `🖼️ ${f.name}\n\n![${f.name}](${f.data})` }
                : `🖼️ ${f.name}`,
            range,
          }));

          const folderItems = folders.map((d, i) => ({
            label: d.path,
            kind: monaco.languages.CompletionItemKind.Folder,
            insertText: relativePath(fromDir, d.path),
            documentation: `📂 Carpeta: ${d.name}`,
            sortText: `0${i}`,
            range,
          }));

          // Solo sugerir rutas cuando estamos dentro de url()
          const allItems = [
            ...sortByFuzzy(folderItems, (x) => x.label, query),
            ...sortByFuzzy(fileItems, (x) => x.label, query),
          ];

          // Eliminar duplicados basado en label
          const seen = new Set();
          const ranked = allItems.filter((item) => {
            if (seen.has(item.label)) return false;
            seen.add(item.label);
            return true;
          });

          return { suggestions: ranked };
        },
      }
    );
    disposablesRef.current.push(cssUrlProvider);

    // HTML: completar valores de class="" a partir de clases detectadas en modelos abiertos (CSS/HTML)
    monaco.languages.registerCompletionItemProvider("html", {
      triggerCharacters: [" ", '"', "."],
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const inClassAttr = /class\s*=\s*["'][^"']*$/.test(textUntilPosition);
        const inForAttr = /for\s*=\s*["'][^"']*$/.test(textUntilPosition);

        if (!inClassAttr && !inForAttr) return { suggestions: [] };

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const models = monaco.editor.getModels();
        const classes = new Set();
        const ids = new Set();

        models.forEach((m) => {
          const lang = m.getLanguageId();
          const text = m.getValue();
          if (lang === "css") {
            const re = /\.([_a-zA-Z][-_a-zA-Z0-9]*)/g;
            let match;
            while ((match = re.exec(text))) classes.add(match[1]);
          }
          if (lang === "html") {
            const reClass = /class\s*=\s*["']([^"']+)["']/g;
            let mClass;
            while ((mClass = reClass.exec(text))) {
              mClass[1].split(/\s+/).forEach((c) => c && classes.add(c));
            }
            const reId = /id\s*=\s*["']([^"']+)["']/g;
            let mId;
            while ((mId = reId.exec(text))) ids.add(mId[1]);
          }
        });

        if (inClassAttr) {
          const items = Array.from(classes)
            .sort()
            .map((c, i) => ({
              label: c,
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: c,
              sortText: `a${i}`,
              range,
              commitCharacters: [" "],
            }));
          return { suggestions: items };
        }

        if (inForAttr) {
          const items = Array.from(ids)
            .sort()
            .map((idv, i) => ({
              label: idv,
              kind: monaco.languages.CompletionItemKind.Reference,
              insertText: idv,
              sortText: `a${i}`,
              range,
            }));
          return { suggestions: items };
        }

        return { suggestions: [] };
      },
    });

    // CSS: sugerir clases usadas en HTML al escribir selectores .clase
    monaco.languages.registerCompletionItemProvider("css", {
      triggerCharacters: ["."],
      provideCompletionItems: (model, position) => {
        const line = model
          .getLineContent(position.lineNumber)
          .slice(0, position.column - 1);
        const afterDot = /\.[-_a-zA-Z0-9]*$/.test(line);
        if (!afterDot) return { suggestions: [] };

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const models = monaco.editor.getModels();
        const classes = new Set();
        models.forEach((m) => {
          const lang = m.getLanguageId();
          if (lang === "html") {
            const text = m.getValue();
            const reClass = /class\s*=\s*["']([^"']+)["']/g;
            let mClass;
            while ((mClass = reClass.exec(text))) {
              mClass[1].split(/\s+/).forEach((c) => c && classes.add(c));
            }
          }
        });

        const items = Array.from(classes)
          .sort()
          .map((c, i) => ({
            label: c,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: c,
            sortText: `a${i}`,
            range,
          }));
        return { suggestions: items };
      },
    });

    // CSS: propiedades y valores comunes
    monaco.languages.registerCompletionItemProvider("css", {
      triggerCharacters: [":", "-", " "],
      provideCompletionItems: (model, position) => {
        const line = model
          .getLineContent(position.lineNumber)
          .slice(0, position.column - 1);
        const Kind = monaco.languages.CompletionItemKind.Property;
        const ValueKind = monaco.languages.CompletionItemKind.Value;
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        };

        const properties = [
          "display",
          "position",
          "top",
          "right",
          "bottom",
          "left",
          "z-index",
          "flex",
          "flex-direction",
          "justify-content",
          "align-items",
          "gap",
          "grid",
          "grid-template-columns",
          "grid-template-rows",
          "place-items",
          "place-content",
          "width",
          "height",
          "min-width",
          "max-width",
          "min-height",
          "max-height",
          "padding",
          "padding-inline",
          "padding-block",
          "margin",
          "margin-inline",
          "margin-block",
          "color",
          "background",
          "background-color",
          "background-image",
          "background-size",
          "border",
          "border-radius",
          "box-shadow",
          "opacity",
          "overflow",
          "overflow-x",
          "overflow-y",
          "object-fit",
          "object-position",
          "transition",
          "transform",
          "cursor",
          "pointer-events",
        ].map((p) => ({ label: p, kind: Kind, insertText: `${p}: `, range }));

        const valuesMap = {
          display: [
            "block",
            "inline",
            "inline-block",
            "flex",
            "grid",
            "none",
            "contents",
          ],
          position: ["static", "relative", "absolute", "fixed", "sticky"],
          "justify-content": [
            "flex-start",
            "center",
            "flex-end",
            "space-between",
            "space-around",
            "space-evenly",
          ],
          "align-items": [
            "stretch",
            "flex-start",
            "center",
            "flex-end",
            "baseline",
          ],
          "flex-direction": ["row", "row-reverse", "column", "column-reverse"],
          "object-fit": ["fill", "contain", "cover", "none", "scale-down"],
          overflow: ["visible", "hidden", "auto", "scroll", "clip"],
          cursor: [
            "default",
            "pointer",
            "move",
            "text",
            "not-allowed",
            "crosshair",
            "grab",
            "zoom-in",
          ],
          "background-size": ["auto", "cover", "contain"],
          "background-repeat": [
            "repeat",
            "no-repeat",
            "repeat-x",
            "repeat-y",
            "space",
            "round",
          ],
          "background-attachment": ["scroll", "fixed", "local"],
          "background-image": [
            "linear-gradient(${1:to right}, ${2:#667eea}, ${3:#764ba2})",
          ],
          "box-shadow": ["${1:0 4px 6px} rgba(0,0,0,0.1)"],
          transition: [
            "all 0.3s ease",
            "opacity 0.3s ease",
            "transform 0.3s ease",
          ],
          transform: ["scale(1.05)", "translate(0, -2px)", "rotate(3deg)"],
        };

        // Determinar si estamos escribiendo valor después de ':'
        const isValue = line.includes(":") && !line.trimEnd().endsWith(":");
        if (isValue) {
          const prop = line.split(":")[0].trim();
          const candidates = valuesMap[prop] || [];
          const suggestions = candidates.map((v) => ({
            label: v.replace(/\$\{\d+:?/g, ""),
            kind: ValueKind,
            insertText: v,
            range,
          }));
          return { suggestions };
        }

        return { suggestions: properties };
      },
    });

    // HTML: Atributos contextuales por etiqueta
    monaco.languages.registerCompletionItemProvider("html", {
      triggerCharacters: [" ", ":", "-", '"', "'"],
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // Detectar si estamos dentro de una etiqueta abierta
        // Ejemplo: <img |  o <img src="|"
        const openTagMatch = /<([a-zA-Z0-9\-]+)([^>]*)$/m.exec(
          model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          })
        );
        if (!openTagMatch) return { suggestions: [] };

        const tag = openTagMatch[1].toLowerCase();
        const existing = openTagMatch[2] || "";

        const Kind = monaco.languages.CompletionItemKind.Property;
        const Rule =
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        };

        const addIfMissing = (name, item) =>
          existing.includes(`${name}=`) ? null : item;

        const generalAttrs = [
          {
            label: "class",
            insertText: 'class="${1}"',
            documentation: "Clase CSS",
            kind: Kind,
            insertTextRules: Rule,
            range,
          },
          {
            label: "id",
            insertText: 'id="${1}"',
            documentation: "ID único",
            kind: Kind,
            insertTextRules: Rule,
            range,
          },
          {
            label: "style",
            insertText: 'style="${1}"',
            documentation: "Estilos inline",
            kind: Kind,
            insertTextRules: Rule,
            range,
          },
          {
            label: "data-*",
            insertText: 'data-${1:key}="${2:value}"',
            documentation: "Atributo data-*",
            kind: Kind,
            insertTextRules: Rule,
            range,
          },
          {
            label: "aria-*",
            insertText: 'aria-${1:label}="${2}"',
            documentation: "Atributo aria-*",
            kind: Kind,
            insertTextRules: Rule,
            range,
          },
        ]
          .map((a) => addIfMissing(a.label.split("=")[0], a))
          .filter(Boolean);

        const byTag = {
          img: [
            addIfMissing("src", {
              label: "src",
              kind: Kind,
              insertText: 'src="${1}"',
              documentation: "Origen de imagen",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("alt", {
              label: "alt",
              kind: Kind,
              insertText: 'alt="${1}"',
              documentation: "Texto alternativo",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("width", {
              label: "width",
              kind: Kind,
              insertText: 'width="${1}"',
              documentation: "Ancho",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("height", {
              label: "height",
              kind: Kind,
              insertText: 'height="${1}"',
              documentation: "Alto",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("loading", {
              label: "loading",
              kind: Kind,
              insertText: 'loading="${1|lazy,eager|}"',
              documentation: "Carga diferida",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("decoding", {
              label: "decoding",
              kind: Kind,
              insertText: 'decoding="${1|async,auto,sync|}"',
              documentation: "Decodificación",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("referrerpolicy", {
              label: "referrerpolicy",
              kind: Kind,
              insertText: 'referrerpolicy="${1|no-referrer,origin|}"',
              documentation: "Política de referencia",
              insertTextRules: Rule,
              range,
            }),
          ],
          a: [
            addIfMissing("href", {
              label: "href",
              kind: Kind,
              insertText: 'href="${1:#}"',
              documentation: "Destino del enlace",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("target", {
              label: "target",
              kind: Kind,
              insertText: 'target="${1|_blank,_self,_parent,_top|}"',
              documentation: "Destino/ventana",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("rel", {
              label: "rel",
              kind: Kind,
              insertText: 'rel="${1|noopener,noreferrer|}"',
              documentation: "Relación del enlace",
              insertTextRules: Rule,
              range,
            }),
          ],
          script: [
            addIfMissing("src", {
              label: "src",
              kind: Kind,
              insertText: 'src="${1}.js"',
              documentation: "Origen del script",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("type", {
              label: "type",
              kind: Kind,
              insertText: 'type="${1|module,text/javascript|}"',
              documentation: "Tipo de script",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("defer", {
              label: "defer",
              kind: Kind,
              insertText: "defer",
              documentation: "Diferir ejecución",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("async", {
              label: "async",
              kind: Kind,
              insertText: "async",
              documentation: "Ejecución asíncrona",
              insertTextRules: Rule,
              range,
            }),
          ],
          link: [
            addIfMissing("rel", {
              label: "rel",
              kind: Kind,
              insertText: 'rel="${1|stylesheet,preload,icon|}"',
              documentation: "Relación",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("href", {
              label: "href",
              kind: Kind,
              insertText: 'href="${1}.css"',
              documentation: "Referencia",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("as", {
              label: "as",
              kind: Kind,
              insertText: 'as="${1|style,script,font,image|}"',
              documentation: "Tipo de recurso",
              insertTextRules: Rule,
              range,
            }),
          ],
          video: [
            addIfMissing("controls", {
              label: "controls",
              kind: Kind,
              insertText: "controls",
              documentation: "Controles de reproducción",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("autoplay", {
              label: "autoplay",
              kind: Kind,
              insertText: "autoplay",
              documentation: "Auto reproducir",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("loop", {
              label: "loop",
              kind: Kind,
              insertText: "loop",
              documentation: "Repetir",
              insertTextRules: Rule,
              range,
            }),
          ],
          audio: [
            addIfMissing("controls", {
              label: "controls",
              kind: Kind,
              insertText: "controls",
              documentation: "Controles",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("autoplay", {
              label: "autoplay",
              kind: Kind,
              insertText: "autoplay",
              documentation: "Auto reproducir",
              insertTextRules: Rule,
              range,
            }),
          ],
          meta: [
            addIfMissing("name", {
              label: "name",
              kind: Kind,
              insertText: 'name="${1|description,keywords,viewport|}"',
              documentation: "Nombre meta",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("content", {
              label: "content",
              kind: Kind,
              insertText: 'content="${1}"',
              documentation: "Contenido meta",
              insertTextRules: Rule,
              range,
            }),
          ],
          iframe: [
            addIfMissing("src", {
              label: "src",
              kind: Kind,
              insertText: 'src="${1}"',
              documentation: "URL embebida",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("width", {
              label: "width",
              kind: Kind,
              insertText: 'width="${1}"',
              documentation: "Ancho",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("height", {
              label: "height",
              kind: Kind,
              insertText: 'height="${1}"',
              documentation: "Alto",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("allow", {
              label: "allow",
              kind: Kind,
              insertText:
                'allow="${1|fullscreen; autoplay; clipboard-write; encrypted-media|}"',
              documentation: "Permisos",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("loading", {
              label: "loading",
              kind: Kind,
              insertText: 'loading="${1|lazy,eager|}"',
              documentation: "Carga diferida",
              insertTextRules: Rule,
              range,
            }),
          ],
          form: [
            addIfMissing("action", {
              label: "action",
              kind: Kind,
              insertText: 'action="${1}"',
              documentation: "Destino del formulario",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("method", {
              label: "method",
              kind: Kind,
              insertText: 'method="${1|get,post|}"',
              documentation: "Método HTTP",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("enctype", {
              label: "enctype",
              kind: Kind,
              insertText:
                'enctype="${1|application/x-www-form-urlencoded,multipart/form-data,text/plain|}"',
              documentation: "Tipo de contenido",
              insertTextRules: Rule,
              range,
            }),
          ],
          input: [
            addIfMissing("type", {
              label: "type",
              kind: Kind,
              insertText:
                'type="${1|text,number,email,password,checkbox,radio,file,date,color,range,search,tel,url,time,datetime-local,month,week|}"',
              documentation: "Tipo de input",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("name", {
              label: "name",
              kind: Kind,
              insertText: 'name="${1}"',
              documentation: "Nombre de campo",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("id", {
              label: "id",
              kind: Kind,
              insertText: 'id="${1}"',
              documentation: "ID del campo",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("placeholder", {
              label: "placeholder",
              kind: Kind,
              insertText: 'placeholder="${1}"',
              documentation: "Placeholder",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("required", {
              label: "required",
              kind: Kind,
              insertText: "required",
              documentation: "Campo requerido",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("min", {
              label: "min",
              kind: Kind,
              insertText: 'min="${1}"',
              documentation: "Valor mínimo",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("max", {
              label: "max",
              kind: Kind,
              insertText: 'max="${1}"',
              documentation: "Valor máximo",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("step", {
              label: "step",
              kind: Kind,
              insertText: 'step="${1}"',
              documentation: "Incremento",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("minlength", {
              label: "minlength",
              kind: Kind,
              insertText: 'minlength="${1}"',
              documentation: "Longitud mínima",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("maxlength", {
              label: "maxlength",
              kind: Kind,
              insertText: 'maxlength="${1}"',
              documentation: "Longitud máxima",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("pattern", {
              label: "pattern",
              kind: Kind,
              insertText: 'pattern="${1}"',
              documentation: "Expresión regular",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("autocomplete", {
              label: "autocomplete",
              kind: Kind,
              insertText:
                'autocomplete="${1|on,off,name,email,username,new-password,current-password,one-time-code,street-address,postal-code,country|}"',
              documentation: "Sugerencias del navegador",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("checked", {
              label: "checked",
              kind: Kind,
              insertText: "checked",
              documentation: "Marcado (checkbox/radio)",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("value", {
              label: "value",
              kind: Kind,
              insertText: 'value="${1}"',
              documentation: "Valor inicial",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("multiple", {
              label: "multiple",
              kind: Kind,
              insertText: "multiple",
              documentation: "Múltiples valores",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("accept", {
              label: "accept",
              kind: Kind,
              insertText: 'accept="${1|image/*,audio/*,video/*,.pdf,.docx|}"',
              documentation: "Tipos aceptados (file)",
              insertTextRules: Rule,
              range,
            }),
          ],
          source: [
            addIfMissing("src", {
              label: "src",
              kind: Kind,
              insertText: 'src="${1}"',
              documentation: "Origen de media",
              insertTextRules: Rule,
              range,
            }),
            addIfMissing("type", {
              label: "type",
              kind: Kind,
              insertText:
                'type="${1|image/png,image/jpeg,video/mp4,audio/mpeg|}"',
              documentation: "MIME type",
              insertTextRules: Rule,
              range,
            }),
          ],
          picture: [
            addIfMissing("media", {
              label: "media",
              kind: Kind,
              insertText: 'media="${1:(max-width: 600px)}"',
              documentation: "Media query",
              insertTextRules: Rule,
              range,
            }),
          ],
          label: [
            addIfMissing("for", {
              label: "for",
              kind: Kind,
              insertText: 'for="${1:id}"',
              documentation: "Asociar con id de input",
              insertTextRules: Rule,
              range,
            }),
          ],
        };

        const tagAttrs = (byTag[tag] || []).filter(Boolean);
        const suggestions = [...generalAttrs, ...tagAttrs];
        return { suggestions };
      },
    });

    // ELIMINADO: JavaScript Provider duplicado que causaba conflictos
    // El autocompletado de JavaScript ahora se maneja en el provider unificado

    // ☕ Java Snippets estilo IntelliJ IDEA
    monaco.languages.registerCompletionItemProvider("java", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = getJavaSnippets(monaco, range);
        return { suggestions };
      },
    });

    // 🔥 Inicializar Yjs binding si estamos colaborando
    if (isCollaborating) {
      console.log('🚀 Iniciando proceso de binding Yjs...');
      
      let retryCount = 0;
      const maxRetries = 25; // 5 segundos máximo (25 * 200ms)
      
      // Esperar a que Yjs esté completamente inicializado
      const initYjsBinding = () => {
        retryCount++;
        const ydoc = collaborationService.getYDoc();
        
        if (ydoc) {
          console.log(`✅ Yjs disponible después de ${retryCount} intentos`);
          setupYjsBinding(editor);
        } else if (retryCount < maxRetries) {
          console.log(`⏳ Esperando Yjs... intento ${retryCount}/${maxRetries}`);
          setTimeout(initYjsBinding, 200);
        } else {
          console.warn('⚠️ Yjs no se inicializó - usando sistema legacy');
        }
      };
      
      setTimeout(initYjsBinding, 300);
    }
  };

  // 🔥 FUNCIÓN: Setup Yjs binding
  const setupYjsBinding = (editor) => {
    if (!editor || !isCollaborating) {
      console.warn('⚠️ No se puede crear Yjs binding');
      return;
    }

    if (!collaborationService.getYDoc()) {
      console.warn('⚠️ Yjs no inicializado aún');
      return;
    }

    if (!activePath) {
      console.warn('⚠️ No hay archivo activo');
      return;
    }

    console.log('🔥 Configurando Yjs binding para:', activePath);

    // Destruir binding anterior si existe
    if (yjsBindingRef.current) {
      try {
        yjsBindingRef.current.destroy();
        yjsBindingRef.current = null;
        console.log('🧹 Binding anterior destruido');
      } catch (e) {
        console.error('Error al destruir binding:', e);
      }
    }

    // Obtener o crear YText para este archivo
    const ytext = collaborationService.setActiveFile(activePath);
    
    if (!ytext) {
      console.warn('⚠️ No se pudo obtener YText para:', activePath);
      return;
    }

    // 🔥 SINCRONIZACIÓN INICIAL: Contenido Monaco ↔ Yjs
    const currentContent = editor.getValue();
    const ytextContent = ytext.toString();

    console.log('📊 Estado sincronización:', {
      ytextLength: ytextContent.length,
      monacoLength: currentContent.length,
      ytextEmpty: ytextContent.length === 0,
      monacoEmpty: currentContent.length === 0,
    });

    // Si Yjs está vacío pero Monaco tiene contenido → Cargar Monaco a Yjs
    if (ytextContent.length === 0 && currentContent.length > 0) {
      console.log('📤 Cargando contenido de Monaco a Yjs:', currentContent.length, 'caracteres');
      ytext.insert(0, currentContent);
    }
    // Si Yjs tiene contenido pero Monaco está vacío → Cargar Yjs a Monaco
    else if (ytextContent.length > 0 && currentContent.length === 0) {
      console.log('📥 Cargando contenido de Yjs a Monaco:', ytextContent.length, 'caracteres');
      editor.setValue(ytextContent);
    }
    // Si ambos tienen contenido diferente → Yjs gana (el más reciente)
    else if (ytextContent.length > 0 && ytextContent !== currentContent) {
      console.log('🔄 Sincronizando Yjs → Monaco (Yjs tiene contenido más reciente)');
      editor.setValue(ytextContent);
    }

    try {
      // Crear nuevo binding Monaco ↔ Yjs
      // TEMPORALMENTE DESHABILITADO - y-monaco tiene problemas de compatibilidad
      // yjsBindingRef.current = new MonacoBinding(
      //   ytext,
      //   editor.getModel(),
      //   new Set([editor]),
      //   collaborationService.yjsProvider?.awareness
      // );

      console.log('⚠️ Yjs binding temporalmente deshabilitado (problema de dependencia)');
    } catch (error) {
      console.error('❌ Error al crear Yjs binding:', error);
    }
  };

  return isImage && value ? (
    <div
      className={`h-full flex items-center justify-center p-8 ${
        !hasCustomBackground ? "bg-editor-bg" : ""
      }`}
    >
      <div className="max-w-full max-h-full flex flex-col items-center gap-4">
        <img
          src={value}
          alt="Preview"
          className="max-w-full max-h-[calc(100vh-200px)] object-contain rounded-lg shadow-2xl border border-blue-500/30"
        />
        <p className="text-sm text-gray-400">Vista previa de imagen</p>
      </div>
    </div>
  ) : (
    <div
      ref={containerRef}
      className="h-full relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Estilos CSS personalizados para línea actual muy transparente */}
      <style>{`
          .monaco-editor .current-line,
          .monaco-editor .view-overlays .current-line {
            background-color: rgba(0, 0, 0, 0.10) !important;
            border: none !important;
          }
          .monaco-editor .margin-view-overlays .current-line {
            background-color: rgba(0, 0, 0, 0.06) !important;
            border: none !important;
          }
        `}</style>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      {/* Widget de búsqueda y reemplazo */}
      <SearchWidget
        isOpen={showSearchWidget}
        onClose={() => setShowSearchWidget(false)}
        editor={editorRef.current}
        currentTheme={currentTheme}
      />

      {/* Panel de comandos */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        editor={editorRef.current}
        onExecuteCommand={(cmd) => {
          if (cmd === "search") setShowSearchWidget(true);
        }}
        currentTheme={currentTheme}
      />

      {/* Indicador visual de drag & drop */}
      {isDraggingOver && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-blue-500/90 text-white px-6 py-4 rounded-lg shadow-2xl flex flex-col items-center gap-2 animate-pulse">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-lg font-bold">
              Suelta aquí para insertar imagen
            </span>
            <span className="text-sm opacity-80">
              La etiqueta &lt;img&gt; se añadirá en la posición del cursor
            </span>
          </div>
        </div>
      )}

      <Editor
        height="100%"
        language={language}
        value={value}
        theme={currentTheme || "vs-dark"}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: fontSize,
          minimap: {
            enabled: true,
            showSlider: 'mouseover',
            renderCharacters: true,
            maxColumn: 120,
            side: 'right'
          },
          scrollBeyondLastLine: true,
          wordWrap: "on",
          automaticLayout: true,
          ["semanticHighlighting.enabled"]: false,
          tabSize: 2,
          lineNumbers: "on",
          renderLineHighlight: "all",
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: "line",
          fontFamily: "'Consolas', 'Courier New', monospace",
          fontLigatures: true,
          padding: { top: 16, bottom: 120 },
          // 🎯 Autocompletado Súper Reforzado - desactivado solo en Modo Práctica
          suggestOnTriggerCharacters: !practiceModeEnabled,
          quickSuggestions: practiceModeEnabled
            ? false
            : {
                other: true,
                comments: true,
                strings: true,
              },
          quickSuggestionsDelay: practiceModeEnabled ? 0 : 100, // Más rápido
          parameterHints: { 
            enabled: !practiceModeEnabled,
            cycle: true // Navegar entre parameter hints
          },
          acceptSuggestionOnCommitCharacter: !practiceModeEnabled,
          acceptSuggestionOnEnter: practiceModeEnabled ? "off" : "on",
          tabCompletion: practiceModeEnabled ? "off" : "onlySnippets", // Solo snippets con tab
          wordBasedSuggestions: !practiceModeEnabled ? "allDocuments" : false, // Mejorado
          suggest: {
            showKeywords: !practiceModeEnabled,
            showSnippets: !practiceModeEnabled,
            showClasses: !practiceModeEnabled,
            showMethods: !practiceModeEnabled,
            showFunctions: !practiceModeEnabled,
            showVariables: !practiceModeEnabled,
            showConstants: !practiceModeEnabled,
            showValues: !practiceModeEnabled,
            showFields: !practiceModeEnabled,
            showConstructors: !practiceModeEnabled,
            showEnums: !practiceModeEnabled,
            showFiles: !practiceModeEnabled,
            showFolders: !practiceModeEnabled,
            showTypeParameters: !practiceModeEnabled,
            filterGraceful: true,
            snippetsPreventQuickSuggestions: false,
            showUsers: true,
            insertMode: 'replace', // Cambiar a replace para mejor experiencia
            localityBonus: true,
            shareSuggestSelections: true, // Compartir selecciones entre editores
            selectionHighlight: true,
            wordDistance: true, // Priorizar por distancia en el documento
            showModules: !practiceModeEnabled,
            showProperties: !practiceModeEnabled,
            showColors: !practiceModeEnabled,
          },
          // Autocerrado y validación robusta
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          autoIndent: "full",
          formatOnPaste: true,
          formatOnType: true,
          autoClosingOvertype: "always",
          autoClosingDelete: "always",
          autoSurround: "languageDefined",
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          // 📁 Code Folding - Plegado de código
          folding: true,
          foldingStrategy: "auto",
          showFoldingControls: "always",
          foldingHighlight: true,
          foldingImportsByDefault: false,
          unfoldOnClickAfterEndOfLine: true,
          // Mejorar experiencia
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          mouseWheelZoom: true,
          dragAndDrop: true,
        }}
      />

      {/* Indicador de usuarios escribiendo (estilo Google Docs) */}
      {isCollaborating && (
        <TypingIndicator
          typingUsers={typingUsers}
          activePath={activePath}
          remoteCursors={remoteCursors}
        />
      )}
    </div>
  );
}

export default CodeEditor;
