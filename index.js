const { AutoClient } = require('top.gg-voter');

// Verifica la presenza delle credenziali fondamentali erogate da Northflank
if (!process.env.DISCORD_TOKENS || !process.env.BOT_ID) {
  console.error("[ERRORE] Variabili d'ambiente DISCORD_TOKENS o BOT_ID mancanti!");
  process.exit(1);
}

// Estrae i dati convertendoli nei formati corretti
const tokenList = process.env.DISCORD_TOKENS.split(',').map(t => t.trim());
const botId = process.env.BOT_ID;
const proxies = process.env.PROXIES ? process.env.PROXIES.split(',').map(p => p.trim()) : undefined;
const runInParallel = process.env.RUN_IN_PARALLEL === 'true';

console.log(`[${new Date().toISOString()}] --- Avvio Sessione di Voto ---`);
console.log(`[INFO] Bot target ID: ${botId}`);
console.log(`[INFO] Numero di token caricati: ${tokenList.length}`);
console.log(`[INFO] Esecuzione parallela: ${runInParallel}`);

// Inizializza il client di voto
const client = new AutoClient({
  tokenList: tokenList,
  botId: botId,
  cooldown: 1000, // Valore fittizio basso perché il ciclo temporale è gestito da Northflank
  runInParallel: runInParallel,
  proxies: proxies,
  verbose: true,
  errorLog: (error) => {
    console.error(`[ERRORE DURANTE IL VOTO]: ${error.message}`);
  }
});

// Funzione di gestione del ciclo di vita del container su Northflank
async function runSession() {
  try {
    // Avvia la procedura di voto automatica della libreria
    client.autovoteBot();

    // Controlliamo periodicamente lo stato delle statistiche per capire quando spegnere il container
    const monitorInterval = setInterval(() => {
      if (client.stats) {
        const processati = client.stats.success + client.stats.failed + client.stats.invalid;
        const totali = client.stats.total;

        if (processati >= totali && totali > 0) {
          console.log(`\n[${new Date().toISOString()}] --- Sessione Completata ---`);
          console.log(`[STATISTICHE] Totali: ${client.stats.total} | Successi: ${client.stats.success} | Falliti: ${client.stats.failed} | Invalidi: ${client.stats.invalid}`);
          
          clearInterval(monitorInterval);
          process.exit(0); // Chiude il container con successo su Northflank
        }
      }
    }, 5000);

    // Timeout globale (5 minuti): impedisce al container di rimanere appeso all'infinito consumando crediti
    setTimeout(() => {
      console.log(`[TIMEOUT] Raggiunto limite massimo di 5 minuti. Forzo lo spegnimento.`);
      process.exit(0);
    }, 5 * 60 * 1000);

  } catch (err) {
    console.error("[CRITICO] Errore generale nell'applicazione:", err);
    process.exit(1); // Chiude il container segnalando un fallimento del processo
  }
}

runSession();
