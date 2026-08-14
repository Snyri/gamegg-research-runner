const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;
let isRunnerHealthy = true;
let runnerErrorMessage = '';

// Server HTTP per l'Health Check di Northflank
const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    if (isRunnerHealthy) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', message: 'Runner active' }));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: runnerErrorMessage }));
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Northflank] Healthcheck server attivo sulla porta ${PORT}`);
  startRunnerProcess();
});

function startRunnerProcess() {
  console.log('[Northflank] Avvio del child process index.js...');
  
  const runner = spawn('node', ['index.js'], {
    stdio: 'inherit',
    env: process.env
  });

  runner.on('close', (code) => {
    if (code !== 0) {
      console.error(`[Northflank] Il runner è fallito con codice di uscita: ${code}`);
      isRunnerHealthy = false;
      runnerErrorMessage = `Runner process failed with exit code ${code}`;
    } else {
      console.log('[Northflank] Il runner ha terminato con successo.');
    }
  });
}
