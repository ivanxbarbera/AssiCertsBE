# Frontend Dockerfile - Ambiente sviluppo
FROM node:20.18 as assihubbedev

# Imposta le variabili d'ambiente
ENV ADDRESS=0.0.0.0 
ENV PORT=4000
ENV ENCORE_INSTALL="/root/.encore"
ENV PATH="$ENCORE_INSTALL/bin:$PATH"

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa tutte le dipendenze, comprese quelle di sviluppo
RUN npm install

# Installa Encore CLI
RUN curl -L https://encore.dev/install.sh | bash

# Copia i sorgenti
COPY . .

# Espone la porta dell'applicazione
EXPOSE ${PORT}

# Avvia il server di sviluppo
CMD ["encore", "run", "--listen=0.0.0.0:4000", "--browser=never"]
