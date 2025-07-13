// src/routes/guidesRoutes.ts
import { Router, Request, Response } from 'express';
import mysql from 'mysql2/promise';

// La configuration de la base de données ne devrait idéalement pas être ici.
// Pour la simplicité de l'exemple, nous allons la passer ou l'importer.

export const createGuidesRouter = (dbConnection: mysql.Connection) => {
    const router = Router();

    // Route API pour récupérer les guides
    router.get('/list', async (req: Request, res: Response) => {
        try {
            const query = 'SELECT id, title, author_id, text, created_at FROM Guides';
            const [rows] = await dbConnection.execute(query);
            res.json(rows);
        } catch (error) {
            console.error('Erreur lors de la récupération des guides :', error);
            res.status(500).json({ message: 'Erreur serveur lors de la récupération des guides.' });
        }
    });

    // Vous pouvez ajouter d'autres routes ici pour les guides (POST, PUT, DELETE, etc.)
    // router.post('/', async (req: Request, res: Response) => { ... });

    return router;
};