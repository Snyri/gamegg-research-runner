const { AutoClient } = require('top.gg-voter');

if (!process.env.DISCORD_TOKENS || !process.env.BOT_ID) {
  console.error("[ERRORE] Variabili d'ambiente DISCORD_TOKENS o BOT_ID mancanti!");
  process.exit(1);
}

const tokenList = process.env.DISCORD_TOKENS.split(',').map(t => t.trim());
const botId = process.env.BOT_ID;
const proxies = process.env.PROXIES ? process.env.PROXIES.split(',').map(p => p.trim()) : undefined;
const runInParallel = process.env.RUN_IN_PARALLEL === 'true';

console.log(`[${new Date().toISOString()}] Avvio sessione programmata.`);

const client = new AutoClient({
  tokenList: tokenList,
  botId: botId,
  cooldown: 1000, 
  runInParallel: runInParallel,
  proxies: proxies,
  verbose: true,
  errorLog: (error) => { console.error(`[ERRORE VOTO]: ${error.message}`); }
});

async function runSession() {
  try {
    client.autovoteBot();

    const monitorInterval = setInterval(() => {
      if (client.stats) {
        const processati = client.stats.success + client.stats.failed + client.stats.invalid;
        if (processati >= client.stats.total && client.stats.total > 0) {
          console.log(`[FINISH] Successi: ${client.stats.success} | Falliti: ${client.stats.failed}`);
          clearInterval(monitorInterval);
          process.exit(0); 
        }
      }
    }, 5000);

    // Timeout di sicurezza di 10 minuti per evitare container appesi se Puppeteer si blocca
    setTimeout(() => {
      console.log(`[TIMEOUT] Sessione terminata per tempo limite.`);
      process.exit(0);
    }, 10 * 60 * 1000);

  } catch (err) {
    console.error("[CRITICO]", err);
    process.exit(1);
  }
}

runSession();
