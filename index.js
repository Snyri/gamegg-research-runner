// Assicurati che le variabili d'ambiente siano caricate
require('dotenv').config();

async function runRunner() {
  console.log('[Runner] Avvio del processo di ricerca/voto...');

  try {
    // 1. Inizializzazione del tuo client/bot
    // const client = new YourClientClass(...);

    // 2. Chiamata ASINCRONA CORRETTA con await
    if (typeof client !== 'undefined' && client.autovoteBot) {
      console.log('[Runner] Esecuzione autovoteBot()...');
      await client.autovoteBot(); 
    }

    // 3. Monitoraggio dello stato con Gestione Errori e Timeout Reale
    const TIMEOUT_MS = 10 * 60 * 1000; // 10 Minuti
    const CHECK_INTERVAL_MS = 5000;     // 5 Secondi
    const startTime = Date.now();

    await new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;

        // Se il client ha terminato con successo
        if (typeof client !== 'undefined' && client.stats && client.stats.completed) {
          clearInterval(interval);
          return resolve();
        }

        // FAILED TIMEOUT: Se va in timeout, DEVE lanciare un errore (exit code 1)
        if (elapsedTime >= TIMEOUT_MS) {
          clearInterval(interval);
          return reject(new Error('TIMEOUT: La sessione del runner ha superato i 10 minuti senza completarsi.'));
        }
      }, CHECK_INTERVAL_MS);
    });

    console.log('[Runner] Processo completato con successo!');
  } catch (error) {
    console.error('[Runner ERRORE]:', error.message);
    // CRUCIALE: Esci con codice 1 per notificare a Northflank che il job è FALLITO
    process.exit(1); 
  }
}

runRunner();
