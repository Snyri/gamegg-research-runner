# Game.gg Research Runner

Repository Node.js **one-shot** pensato per demo editoriali e test di orchestrazione.

> Questa versione è deliberatamente research-safe: non effettua login reali, voti,
> automazione CAPTCHA/Turnstile, bypass anti-bot o uso di token utente reali.

## Avvio locale

```bash
cp .env.example .env
```

Su macOS/Linux:

```bash
export BOT_ID=1234567890
export HARMONY_TOKENS=demo-1,demo-2
npm start
```

## Docker

```bash
docker build -t gamegg-research-runner .
docker run --rm   -e BOT_ID=1234567890   -e HARMONY_TOKENS=demo-1,demo-2   gamegg-research-runner
```

Il processo esegue una sola sessione simulata e termina con exit code `0`.

## GitHub privato

### Con GitHub CLI

Dalla cartella del progetto:

```bash
git init
git add .
git commit -m "Initial research runner"
gh repo create gamegg-research-runner --private --source=. --remote=origin --push
```

### Senza GitHub CLI

1. Crea su GitHub un nuovo repository.
2. Imposta la visibilità su **Private**.
3. Non inizializzarlo con README o `.gitignore`.
4. Poi esegui:

```bash
git init
git add .
git commit -m "Initial research runner"
git branch -M main
git remote add origin <URL-DEL-TUO-REPO-PRIVATO>
git push -u origin main
```

## Segreti

Non committare mai `.env`, token reali, password, cookie o credenziali.
Le variabili vanno configurate nel secret/environment manager della piattaforma.
