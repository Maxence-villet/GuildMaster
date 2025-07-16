// src/routes/guidesRoutes.ts
import { Router, Request, Response } from 'express';
import mysql from 'mysql2/promise';


export const createGuidesRouter = (dbConnection: mysql.Connection) => {
    const router = Router();

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

    router.get('/:id', async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Guide ID is required.' });
        }

        try {
            const query = `
                SELECT 
                    G.id, 
                    G.title, 
                    G.author_id, 
                    G.text, 
                    G.created_at,
                    M.name AS authorName
                FROM 
                    Guides AS G
                JOIN 
                    Members AS M ON G.author_id = M.id
                WHERE 
                    G.id = ?`;
            const [rows] = await dbConnection.execute(query, [id]) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Guide not found.' });
            }

            res.json(rows[0]);
        } catch (error) {
            console.error('Error fetching guide by ID:', error);
            res.status(500).json({ message: 'Server error while fetching guide.' });
        }
    });


    router.post('/add', async (req: Request, res: Response) => {
        const { title, author_id, text } = req.body;

        if (!title || !author_id || !text) {
            return res.status(400).json({ message: 'Title, author_id, and text are required.' });
        }

        try {
            const query = 'INSERT INTO Guides (title, author_id, text) VALUES (?, ?, ?)';
            const [result] = await dbConnection.execute(query, [title, author_id, text]);

            if ('insertId' in result) {
                res.status(201).json({
                    message: 'Guide created successfully',
                    guide: { id: result.insertId, title, author_id, text }
                });
            } else {
                res.status(201).json({
                    message: 'Guide created successfully (ID might not be returned)',
                    guide: { title, author_id, text }
                });
            }
        } catch (error) {
            console.error('Error creating guide:', error);
            res.status(500).json({ message: 'Server error while creating guide.' });
        }
    });

    router.delete('/delete/:id', async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Guide ID is required.' });
        }

        try {
            const query = 'DELETE FROM Guides WHERE id = ?';
            const [result] = await dbConnection.execute(query, [id]) as [mysql.OkPacket, mysql.FieldPacket[]];

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Guide not found.' });
            }

            res.status(200).json({ message: 'Guide deleted successfully.' });
        } catch (error) {
            console.error('Error deleting guide:', error);
            res.status(500).json({ message: 'Server error while deleting guide.' });
        }
    });

    return router;
};