import { spawn } from 'child_process';
import http from 'http';

console.log('\n🚀 Iniciando servidor con ngrok...\n');

// Primero iniciar el servidor Vite
console.log('📦 Iniciando Vite...');
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true
});

let vitePort = null;

// Capturar el puerto que usa Vite
viteProcess.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  // Detectar el puerto de Vite
  const portMatch = output.match(/localhost:(\d+)/);
  if (portMatch && !vitePort) {
    vitePort = portMatch[1];
    console.log(`\n✅ Vite iniciado en puerto ${vitePort}`);
    
    // Esperar 2 segundos y luego iniciar ngrok
    setTimeout(() => {
      startNgrok(vitePort);
    }, 2000);
  }
});

viteProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

function startNgrok(port) {
  console.log(`\n🌐 Iniciando túnel ngrok en puerto ${port}...`);
  
  const ngrokProcess = spawn('ngrok', ['http', port], {
    stdio: 'pipe',
    shell: true
  });

  ngrokProcess.on('error', (error) => {
    console.error('\n❌ Error al iniciar ngrok:', error.message);
    console.log('💡 Verifica que ngrok esté instalado correctamente\n');
  });

  // Esperar a que ngrok esté listo
  setTimeout(async () => {
    const url = await getNgrokUrl();
    
    if (url) {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✅ TÚNEL PÚBLICO CREADO EXITOSAMENTE!`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n🌍 URL PÚBLICA: \x1b[36m\x1b[1m${url}\x1b[0m`);
      console.log(`\n📋 \x1b[32mABRE ESTA URL EN TU NAVEGADOR:\x1b[0m`);
      console.log(`   \x1b[36m\x1b[4m${url}\x1b[0m`);
      console.log(`\n🤝 Cuando crees una sesión desde esta URL,`);
      console.log(`   el enlace generado será público automáticamente.\n`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Guardar en archivo temporal para que el navegador lo use
      const fs = await import('fs');
      fs.writeFileSync('.ngrok-url', url);
    } else {
      console.log('\n⚠️  No se pudo obtener la URL de ngrok');
      console.log('💡 Verifica en http://127.0.0.1:4040 si ngrok está corriendo');
      console.log('💡 O ejecuta manualmente: ngrok http ' + port + '\n');
    }
  }, 3000);

  // Manejar cierre
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Cerrando servidor y túnel...');
    try {
      viteProcess.kill();
      ngrokProcess.kill();
    } catch (e) {}
    process.exit(0);
  });
}

async function getNgrokUrl(maxRetries = 15) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('http://127.0.0.1:4040/api/tunnels');
      const data = await response.json();
      
      if (data.tunnels && data.tunnels.length > 0) {
        const tunnel = data.tunnels.find(t => t.proto === 'https') || data.tunnels[0];
        return tunnel.public_url;
      }
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return null;
}

viteProcess.on('error', (error) => {
  console.error('❌ Error al iniciar Vite:', error.message);
  process.exit(1);
});
