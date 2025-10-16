import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'fs'

// Plugin para servir la URL de ngrok
const ngrokPlugin = () => ({
  name: 'ngrok-url-server',
  configureServer(server) {
    server.middlewares.use('/api/ngrok-url', (req, res) => {
      try {
        if (existsSync('.ngrok-url')) {
          const url = readFileSync('.ngrok-url', 'utf-8').trim();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ url }));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'ngrok URL not found' }));
        }
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), ngrokPlugin()],
  server: {
    port: 3000,
    open: false // Cambiar a false para evitar abrir localhost
  }
})
