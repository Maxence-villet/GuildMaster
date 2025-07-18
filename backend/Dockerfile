# Utiliser l'image Node.js officielle avec Alpine Linux pour une image plus légère
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Compiler TypeScript
RUN npm run build

# Exposer le port sur lequel l'application écoute
EXPOSE 3001

# Commande pour démarrer l'application
CMD ["npm", "start"] 