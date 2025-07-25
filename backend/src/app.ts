// src/app.ts
import express from 'express';
import mysql from 'mysql2/promise'; // Utiliser 'mysql2/promise' pour les promesses
import { createMembersRouter } from './routes/membersRoutes';
import { createGuidesRouter } from './routes/guidesRoutes';
import cors from 'cors';
import { createClansRouter } from './routes/clansRoutes';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configuration de la connexion à la base de données MySQL
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function connectToDatabase(): Promise<mysql.Connection> {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connecté à la base de données MySQL !');
        return connection;
    } catch (error) {
        console.error('Erreur de connexion à la base de données :', error);
        process.exit(1); // Arrêter l'application en cas d'erreur de connexion critique
    }
}

// Variable pour stocker la connexion à la base de données
let dbConnection: mysql.Connection;

// Démarrage de l'application et de la connexion à la BDD
async function startServer() {
    try {
        dbConnection = await connectToDatabase();

        app.use(cors());

        // Middleware pour parser le JSON
        app.use(express.json());

        // Création et montage des routeurs
        const membersRouter = createMembersRouter(dbConnection);
        const guidesRouter = createGuidesRouter(dbConnection);
        const clansRouter = createClansRouter(dbConnection);

        app.use('/api/member', membersRouter);
        app.use('/api/guide', guidesRouter);
        app.use('/api/clan', clansRouter);

        // Démarrage du serveur
        app.listen(port, () => {
            console.log(`Serveur Node.js démarré sur http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Échec du démarrage du serveur :", error);
        process.exit(1);
    }
}

startServer();