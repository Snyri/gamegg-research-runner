const REQUIRED = ["BOT_ID"];

for (const name of REQUIRED) {
  if (!process.env[name]) {
    console.error(`[BOOT] Missing required environment variable: ${name}`);
    process.exit(1);
  }
}

const botId = process.env.BOT_ID;
const tokenList = (process.env.HARMONY_TOKENS || "demo-token-1,demo-token-2")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const proxies = (process.env.PROXIES || "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const runInParallel = process.env.RUN_IN_PARALLEL === "true";
const delayMs = Number(process.env.SIMULATED_DELAY_MS || 750);

const stats = {
  total: tokenList.length,
  success: 0,
  failed: 0,
  invalid: 0
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function simulateOne(token, index) {
  const masked = token.length <= 6
    ? "***"
    : `${token.slice(0, 3)}...${token.slice(-3)}`;

  const proxy = proxies.length ? proxies[index % proxies.length] : "direct";

  console.log(
    `[${new Date().toISOString()}] [SIM] bot=${botId} token=${masked} proxy=${proxy}`
  );

  await sleep(delayMs);

  // Safe simulation only: no external voting, login, captcha or anti-bot bypass.
  stats.success += 1;
}

async function main() {
  console.log(`[${new Date().toISOString()}] Starting one-shot research run.`);
  console.log(`[CONFIG] tokens=${stats.total} parallel=${runInParallel}`);

  if (runInParallel) {
    await Promise.all(tokenList.map(simulateOne));
  } else {
    for (let i = 0; i < tokenList.length; i++) {
      await simulateOne(tokenList[i], i);
    }
  }

  console.log(`[${new Date().toISOString()}] Run complete.`);
  console.log(JSON.stringify(stats, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[FATAL]", err);
    process.exit(1);
  });
