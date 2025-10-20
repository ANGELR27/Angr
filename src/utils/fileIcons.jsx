/**
 * Sistema centralizado de iconos de archivos
 * Usa react-icons con logos oficiales de cada tecnología
 */

import { 
  FaPython, FaHtml5, FaCss3Alt, FaJs, FaReact, FaJava, FaPhp, 
  FaRust, FaSwift, FaDatabase, FaMarkdown, FaFileCode, FaFileImage,
  FaFileAlt, FaCog, FaNpm, FaGitAlt, FaDocker
} from 'react-icons/fa';
import { 
  SiTypescript, SiKotlin, SiGo, SiRuby, SiCplusplus, 
  SiC, SiYaml, SiVuedotjs, SiSvelte
} from 'react-icons/si';
import { VscTerminalBash, VscJson, VscFile } from 'react-icons/vsc';

/**
 * Obtiene el icono profesional para un archivo
 * @param {string} fileName - Nombre del archivo
 * @param {number} size - Tamaño del icono (default: 16)
 * @param {string} baseColor - Color base (para temas)
 * @returns {JSX.Element} - Componente de icono
 */
export const getFileIcon = (fileName, size = 16, baseColor = '') => {
  // 🖼️ IMÁGENES
  if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp'].some(e => fileName.endsWith(e))) {
    return <FaFileImage size={size} style={{color: baseColor || '#f472b6'}} />;
  }
  
  // 🌐 HTML
  if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
    return <FaHtml5 size={size} style={{color: baseColor || '#e34c26'}} />;
  }
  
  // 🎨 CSS
  if (fileName.endsWith('.css') || fileName.endsWith('.scss') || fileName.endsWith('.sass') || fileName.endsWith('.less')) {
    return <FaCss3Alt size={size} style={{color: baseColor || '#264de4'}} />;
  }
  
  // 💛 JAVASCRIPT
  if (fileName.endsWith('.js') || fileName.endsWith('.mjs') || fileName.endsWith('.cjs')) {
    return <FaJs size={size} style={{color: baseColor || '#f7df1e'}} />;
  }
  
  // 🔷 TYPESCRIPT
  if (fileName.endsWith('.ts')) {
    return <SiTypescript size={size} style={{color: baseColor || '#3178c6'}} />;
  }
  
  // ⚛️ REACT (JSX/TSX)
  if (fileName.endsWith('.jsx') || fileName.endsWith('.tsx')) {
    return <FaReact size={size} style={{color: baseColor || '#61dafb'}} />;
  }
  
  // 📋 JSON
  if (fileName.endsWith('.json')) {
    return <VscJson size={size} style={{color: baseColor || '#f7df1e'}} />;
  }
  
  // 🐍 PYTHON
  if (fileName.endsWith('.py') || fileName.endsWith('.pyw') || fileName.endsWith('.pyx')) {
    return <FaPython size={size} style={{color: baseColor || '#3776ab'}} />;
  }
  
  // ☕ JAVA
  if (fileName.endsWith('.java')) {
    return <FaJava size={size} style={{color: baseColor || '#f89820'}} />;
  }
  
  // 🟣 KOTLIN
  if (fileName.endsWith('.kt') || fileName.endsWith('.kts')) {
    return <SiKotlin size={size} style={{color: baseColor || '#7f52ff'}} />;
  }
  
  // 🔵 C
  if (fileName.endsWith('.c') || fileName.endsWith('.h')) {
    return <SiC size={size} style={{color: baseColor || '#a8b9cc'}} />;
  }
  
  // 🔷 C++
  if (fileName.endsWith('.cpp') || fileName.endsWith('.cc') || fileName.endsWith('.cxx') || fileName.endsWith('.hpp')) {
    return <SiCplusplus size={size} style={{color: baseColor || '#00599c'}} />;
  }
  
  // 🟢 C#
  if (fileName.endsWith('.cs')) {
    return <FaFileCode size={size} style={{color: baseColor || '#239120'}} />;
  }
  
  // 🦀 RUST
  if (fileName.endsWith('.rs')) {
    return <FaRust size={size} style={{color: baseColor || '#dea584'}} />;
  }
  
  // 🔷 GO
  if (fileName.endsWith('.go')) {
    return <SiGo size={size} style={{color: baseColor || '#00add8'}} />;
  }
  
  // 🍎 SWIFT
  if (fileName.endsWith('.swift')) {
    return <FaSwift size={size} style={{color: baseColor || '#fa7343'}} />;
  }
  
  // 🐘 PHP
  if (fileName.endsWith('.php')) {
    return <FaPhp size={size} style={{color: baseColor || '#777bb4'}} />;
  }
  
  // 💎 RUBY
  if (fileName.endsWith('.rb') || fileName.endsWith('.erb')) {
    return <SiRuby size={size} style={{color: baseColor || '#cc342d'}} />;
  }
  
  // 📝 MARKDOWN
  if (fileName.endsWith('.md') || fileName.endsWith('.markdown')) {
    return <FaMarkdown size={size} style={{color: baseColor || '#083fa1'}} />;
  }
  
  // 📄 TEXTO
  if (fileName.endsWith('.txt') || fileName.endsWith('.log')) {
    return <FaFileAlt size={size} style={{color: baseColor || '#9ca3af'}} />;
  }
  
  // ⚙️ YAML
  if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) {
    return <SiYaml size={size} style={{color: baseColor || '#cb171e'}} />;
  }
  
  // 🔧 CONFIGURACIÓN
  if (fileName.endsWith('.xml') || fileName.endsWith('.toml') || fileName.endsWith('.ini') || fileName.endsWith('.conf') || fileName.endsWith('.config')) {
    return <FaCog size={size} style={{color: baseColor || '#6b7280'}} />;
  }
  
  // 🔑 ENV
  if (fileName.endsWith('.env')) {
    return <FaCog size={size} style={{color: baseColor || '#ecd53f'}} />;
  }
  
  // 🗄️ BASE DE DATOS
  if (fileName.endsWith('.sql') || fileName.endsWith('.db') || fileName.endsWith('.sqlite')) {
    return <FaDatabase size={size} style={{color: baseColor || '#4479a1'}} />;
  }
  
  // 📦 NPM
  if (fileName === 'package.json' || fileName === 'package-lock.json') {
    return <FaNpm size={size} style={{color: baseColor || '#cb3837'}} />;
  }
  
  // 🔒 LOCK FILES
  if (fileName.endsWith('.lock') || fileName === 'yarn.lock' || fileName === 'pnpm-lock.yaml') {
    return <FaCog size={size} style={{color: baseColor || '#6b7280'}} />;
  }
  
  // 💻 BASH
  if (fileName.endsWith('.sh') || fileName.endsWith('.bash') || fileName.endsWith('.zsh')) {
    return <VscTerminalBash size={size} style={{color: baseColor || '#4eaa25'}} />;
  }
  
  // 🔵 POWERSHELL
  if (fileName.endsWith('.ps1')) {
    return <FaFileCode size={size} style={{color: baseColor || '#012456'}} />;
  }
  
  // 🪟 BAT
  if (fileName.endsWith('.bat') || fileName.endsWith('.cmd')) {
    return <FaFileCode size={size} style={{color: baseColor || '#6b7280'}} />;
  }
  
  // 🟢 VUE
  if (fileName.endsWith('.vue')) {
    return <SiVuedotjs size={size} style={{color: baseColor || '#42b883'}} />;
  }
  
  // 🟠 SVELTE
  if (fileName.endsWith('.svelte')) {
    return <SiSvelte size={size} style={{color: baseColor || '#ff3e00'}} />;
  }
  
  // 🔷 GIT
  if (fileName === '.gitignore' || fileName === '.gitattributes') {
    return <FaGitAlt size={size} style={{color: baseColor || '#f05032'}} />;
  }
  
  // 🐳 DOCKER
  if (fileName === 'Dockerfile' || fileName === 'docker-compose.yml') {
    return <FaDocker size={size} style={{color: baseColor || '#2496ed'}} />;
  }
  
  // 📄 DEFAULT
  return <VscFile size={size} style={{color: baseColor || '#9ca3af'}} />;
};

export default getFileIcon;
