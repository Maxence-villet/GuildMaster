// src/routes/membersRoutes.ts
import { Router, Request, Response } from 'express';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

export const createMembersRouter = (dbConnection: mysql.Connection) => {
    const router = Router();

    router.get('/list', async (req: Request, res: Response) => {
        try {
            const query = 'SELECT id, name, code, role, created_at FROM Members';
            const [rows] = await dbConnection.execute(query);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching members:', error);
            res.status(500).json({ message: 'Server error while fetching members.' });
        }
    });

    router.post('/add', async (req: Request, res: Response) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Member name is required.' });
        }

        try {
            const role = 'member';
            const randomString = Math.random().toString(36) + Date.now();
            const code = crypto.createHash('sha1').update(randomString).digest('hex');

            const query = 'INSERT INTO Members (name, code, role) VALUES (?, ?, ?)';
            const [result] = await dbConnection.execute(query, [name, code, role]);

            if ('insertId' in result) {
                res.status(201).json({
                    message: 'Member added successfully',
                    member: { id: result.insertId, name, code, role }
                });
            } else {
                // This case handles situations where insertId might not be directly available,
                // for example, with some specific database configurations or drivers.
                // It's a fallback for type safety with ResultSetHeader.
                res.status(201).json({
                    message: 'Member added successfully (ID might not be returned)',
                    member: { name, code, role }
                });
            }
        } catch (error) {
            console.error('Error adding member:', error);
            res.status(500).json({ message: 'Server error while adding member.' });
        }
    });

    router.delete('/delete/:id', async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Member ID is required.' });
        }

        try {
            const query = 'DELETE FROM Members WHERE id = ?';
            const [result] = await dbConnection.execute(query, [id]);

            if ('affectedRows' in result && result.affectedRows === 0) {
                return res.status(404).json({ message: 'Member not found.' });
            }

            res.status(200).json({ message: 'Member deleted successfully.' });
        } catch (error) {
            console.error('Error deleting member:', error);
            res.status(500).json({ message: 'Server error while deleting member.' });
        }
    });

    return router;
};