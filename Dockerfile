FROM node:latest

WORKDIR /usr/local/app

# Aggiorna pacchetti OS per sicurezza
RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "/usr/local/app/dist/we-act/server/server.mjs"]