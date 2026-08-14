# Northflank

## Tipo di workload

Usa un **Job** schedulato, non un servizio sempre acceso.

Il container è progettato per:

1. partire;
2. eseguire una singola sessione;
3. terminare con `exit 0`.

## Build

Configura Northflank per buildare dal repository usando il `Dockerfile`.

## Variabili d'ambiente

Minimo:

```text
BOT_ID=1234567890
```

Opzionali:

```text
HARMONY_TOKENS=demo-token-1,demo-token-2
PROXIES=
RUN_IN_PARALLEL=false
SIMULATED_DELAY_MS=750
```

Per dati sensibili usa sempre variabili/secrets di Northflank, non il repository.

## Scheduling

Imposta la cron expression direttamente nella configurazione del Job Northflank.
Il processo non contiene loop interni: ogni invocazione corrisponde a una singola run.

Per evitare sovrapposizioni, scegli una concurrency policy che impedisca più run
contemporanee quando appropriato.
