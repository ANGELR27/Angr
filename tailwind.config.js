/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores dinámicos del tema - se actualizan con CSS variables
        'theme-primary': 'var(--theme-primary)',
        'theme-secondary': 'var(--theme-secondary)',
        'theme-accent': 'var(--theme-accent)',
        'theme-bg': 'var(--theme-background)',
        'theme-bg-secondary': 'var(--theme-background-secondary)',
        'theme-bg-tertiary': 'var(--theme-background-tertiary)',
        'theme-surface': 'var(--theme-surface)',
        'theme-border': 'var(--theme-border)',
        'theme-text': 'var(--theme-text)',
        'theme-text-secondary': 'var(--theme-text-secondary)',
        'theme-text-muted': 'var(--theme-text-muted)',
        // Colores legacy (para compatibilidad)
        'editor-bg': 'var(--theme-background)',
        'sidebar-bg': 'var(--theme-background-secondary)',
        'tab-bg': 'var(--theme-background-tertiary)',
        'tab-active': 'var(--theme-background)',
        'border-color': 'var(--theme-border)',
      },
      boxShadow: {
        'theme-glow': '0 0 20px var(--theme-glow)',
        'theme-glow-lg': '0 0 40px var(--theme-glow)',
      }
    },
  },
  plugins: [],
}
