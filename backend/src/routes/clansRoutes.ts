// src/routes/clansRoutes.ts
import { Router, Request, Response } from 'express';
import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export const createClansRouter = (dbConnection: mysql.Connection) => {
    const router = Router();

    // Create a new clan
    router.post('/add', async (req: Request, res: Response) => {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Clan name is required.' });
        }

        try {
            // Check if clan name already exists
            const [existingClan] = await dbConnection.execute<RowDataPacket[]>(
                'SELECT id FROM Clan WHERE name = ?',
                [name.trim()]
            );

            if (existingClan.length > 0) {
                return res.status(400).json({ message: 'Clan name already exists.' });
            }

            const query = 'INSERT INTO Clan (name) VALUES (?)';
            const [result] = await dbConnection.execute<ResultSetHeader>(query, [name.trim()]);

            if ('insertId' in result) {
                res.status(201).json({
                    message: 'Clan created successfully',
                    clan: { 
                        id: result.insertId, 
                        name: name.trim(),
                        created_at: new Date().toISOString()
                    }
                });
            } else {
                res.status(201).json({
                    message: 'Clan created successfully (ID might not be returned)',
                    clan: { 
                        name: name.trim(),
                        created_at: new Date().toISOString()
                    }
                });
            }
        } catch (error) {
            console.error('Error creating clan:', error);
            res.status(500).json({ message: 'Server error while creating clan.' });
        }
    });

    // Get clan info by ID
    router.get('/:id', async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Clan ID is required.' });
        }

        try {
            const query = 'SELECT id, name, created_at FROM Clan WHERE id = ?';
            const [rows] = await dbConnection.execute<RowDataPacket[]>(query, [id]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Clan not found.' });
            }

            res.json(rows[0]);
        } catch (error) {
            console.error('Error fetching clan:', error);
            res.status(500).json({ message: 'Server error while fetching clan.' });
        }
    });

    // Delete clan by ID
    router.delete('/delete/:id', async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Clan ID is required.' });
        }

        try {
            // Check if clan exists
            const [clanCheck] = await dbConnection.execute<RowDataPacket[]>(
                'SELECT id FROM Clan WHERE id = ?',
                [id]
            );

            if (clanCheck.length === 0) {
                return res.status(404).json({ message: 'Clan not found.' });
            }

            // Check if clan has members (due to foreign key constraint)
            const [membersCheck] = await dbConnection.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM Members WHERE clan_id = ?',
                [id]
            );

            // only a leader can delete a clan and leader can't delete himself
            if (membersCheck[0].count > 1) {
                return res.status(400).json({ 
                    message: 'Cannot delete clan: It has members. Please remove all members first.' 
                });
            }

            const query = 'DELETE FROM Clan WHERE id = ?';
            const [result] = await dbConnection.execute<ResultSetHeader>(query, [id]);

            if ('affectedRows' in result && result.affectedRows === 0) {
                return res.status(404).json({ message: 'Clan not found.' });
            }

            res.status(200).json({ message: 'Clan deleted successfully.' });
        } catch (error) {
            console.error('Error deleting clan:', error);
            res.status(500).json({ message: 'Server error while deleting clan.' });
        }
    });

    return router;
};
