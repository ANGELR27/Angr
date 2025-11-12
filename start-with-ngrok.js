import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let ngrokUrl = null;

// Función para obtener la URL de ngrok
async function getNgrokUrl(maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('http://127.0.0.1:4040/api/tunnels');
      const data = await response.json();
      
      if (data.tunnels && data.tunnels.length > 0) {
        const tunnel = data.tunnels.find(t => t.proto === 'https') || data.tunnels[0];
        return tunnel.public_url;
      }
    } catch (error) {
      // Esperar 1 segundo antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return null;
}

// Función para verificar si ngrok necesita configuración
async function checkNgrokAuth() {
  try {
    const testProcess = spawn('ngrok', ['--version'], { shell: true, stdio: 'pipe' });
    
    return new Promise((resolve) => {
      testProcess.on('close', (code) => {
        resolve(code === 0);
      });
      testProcess.on('error', () => resolve(false));
    });
  } catch {
    return false;
  }
}

// Verificar ngrok antes de iniciar
const ngrokInstalled = await checkNgrokAuth();

if (!ngrokInstalled) {
  console.log('\n❌ ngrok no está instalado o no se encuentra en PATH');
  console.log('\n📥 Para instalar ngrok:');
  console.log('   1. Ve a: https://ngrok.com/download');
  console.log('   2. Descarga ngrok para Windows');
  console.log('   3. Descomprime y mueve ngrok.exe a C:\\Windows\\System32\\');
  console.log('\n💡 Después ejecuta: npm run dev:public\n');
  process.exit(1);
}

// Iniciar ngrok
console.log('🚀 Iniciando ngrok...');
const ngrokProcess = spawn('ngrok', ['http', '3000', '--log=stdout'], {
  stdio: 'pipe',
  shell: true
});

ngrokProcess.on('error', (error) => {
  console.error('❌ Error al iniciar ngrok:', error.message);
  console.log('💡 Asegúrate de tener ngrok instalado: https://ngrok.com/download');
  process.exit(1);
});

let ngrokNeedsAuth = false;
ngrokProcess.stderr.on('data', (data) => {
  const output = data.toString();
  if (output.includes('authtoken') || output.includes('sign up')) {
    ngrokNeedsAuth = true;
  }
});

// Esperar a que ngrok esté listo
setTimeout(async () => {
  ngrokUrl = await getNgrokUrl();
  
  if (ngrokUrl) {
    console.log('\n✅ Túnel ngrok creado exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 URL Pública: \x1b[36m\x1b[1m${ngrokUrl}\x1b[0m`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📋 \x1b[32mAbre esta URL en tu navegador:\x1b[0m \x1b[36m\x1b[4m${ngrokUrl}\x1b[0m`);
    console.log('🤝 Los enlaces de sesión usarán esta URL automáticamente\n');
    
    // Guardar la URL en una variable de entorno para Vite
    process.env.VITE_PUBLIC_URL = ngrokUrl;
  } else {
    console.log('\n⚠️  No se pudo obtener la URL de ngrok');
    
    if (ngrokNeedsAuth) {
      console.log('\n🔑 ngrok necesita autenticación. Pasos:');
      console.log('   1. Ve a: https://dashboard.ngrok.com/get-started/your-authtoken');
      console.log('   2. Copia tu authtoken');
      console.log('   3. Ejecuta: ngrok config add-authtoken TU_TOKEN_AQUI');
      console.log('   4. Ejecuta de nuevo: npm run dev:public\n');
    } else {
      console.log('💡 Verifica que ngrok esté ejecutándose correctamente');
    }
    
    console.log('El servidor funcionará en localhost solo\n');
  }
  
  // Iniciar el servidor Vite con la variable de entorno
  console.log('🚀 Iniciando servidor Vite...\n');
  const viteEnv = {
    ...process.env,
    ...(ngrokUrl && { VITE_PUBLIC_URL: ngrokUrl })
  };
  
  const viteProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: viteEnv
  });

  viteProcess.on('error', (error) => {
    console.error('❌ Error al iniciar Vite:', error.message);
    ngrokProcess.kill();
    process.exit(1);
  });

  // Manejar cierre
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Cerrando servidor y túnel ngrok...');
    viteProcess.kill();
    ngrokProcess.kill();
    process.exit(0);
  });
}, 2000);

ngrokProcess.stdout.on('data', (data) => {
  // Opcional: mostrar output de ngrok
});

ngrokProcess.stderr.on('data', (data) => {
  // Ignorar errores menores de ngrok
});
