const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;

// Server HTTP per soddisfare l'health check di Northflank
const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Runner is active' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Northflank Server] Health check listening on port ${PORT}`);
  startRunner();
});

// Funzione per avviare il runner principale
function startRunner() {
  console.log('[Northflank Server] Starting Research Runner process...');
  
  // Esegue l'index.js (o lo script principale del runner)
  const runner = spawn('node', ['index.js'], {
    stdio: 'inherit',
    env: process.env
  });

  runner.on('close', (code) => {
    console.log(`[Northflank Server] Runner process exited with code ${code}`);
  });

  runner.on('error', (err) => {
    console.error('[Northflank Server] Failed to start runner:', err);
  });
}
