FROM node:20-slim

# Installa dipendenze di sistema necessarie
RUN apt-get update && apt-get install -y \
    procps \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia i file delle dipendenze
COPY package*.json ./

# Usa npm install se package-lock.json manca, altrimenti npm ci
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --only=production; fi

# Copia il codice sorgente
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
