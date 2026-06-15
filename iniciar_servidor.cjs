const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

const server = http.createServer((req, res) => {
  // Limpiar la URL de parámetros de consulta
  let safeUrl = req.url.split('?')[0];
  
  // Ruta por defecto
  if (safeUrl === '/') {
    safeUrl = '/index.html';
  }

  let filePath = path.join(DIST_DIR, safeUrl);

  // Comprobar si el archivo físico existe
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Si el archivo no existe y no parece ser un archivo estático con extensión,
      // redirigimos a index.html para soportar el enrutamiento del lado del cliente (SPA)
      const ext = path.extname(safeUrl);
      if (!ext) {
        filePath = path.join(DIST_DIR, 'index.html');
        serveFile(filePath, res);
      } else {
        // Si tiene extensión y no existe, devolvemos un 404 clásico
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Archivo no encontrado');
      }
    } else {
      serveFile(filePath, res);
    }
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Error del servidor: ${err.code}`);
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content, 'utf-8');
    }
  });
}

const { exec } = require('child_process');

server.listen(PORT, () => {
  console.log('===================================================');
  console.log(`Servidor de Producción Local iniciado exitosamente`);
  console.log(`Disponible en: http://localhost:${PORT}`);
  console.log(`Directorio servido: ${DIST_DIR}`);
  console.log('===================================================');
  console.log('Presiona Ctrl+C para detener el servidor.');

  // Abrir el navegador automáticamente una vez que el servidor está listo
  const url = `http://localhost:${PORT}`;
  const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  
  exec(`${startCmd} ${url}`, (err) => {
    if (err) {
      console.log(`[Info] No se pudo abrir el navegador de forma automática: ${err.message}`);
    }
  });
});
