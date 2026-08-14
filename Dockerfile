FROM node:20-slim

# Installa i pacchetti di sistema richiesti da Puppeteer/Chrome per aprirsi in modalità headless
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libnss3 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Imposta la directory di lavoro all'interno del container
WORKDIR /usr/src/app

# Copia i file delle dipendenze
COPY package*.json ./

# Installa in modo pulito le dipendenze di Node
RUN npm ci

# Copia tutto il resto del codice sorgente
COPY . .

# Avvia l'applicazione
CMD [ "npm", "start" ]
