// src/routes/membersRoutes.ts
import { Router, Request, Response } from 'express';
import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
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
        const { name, role } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Member name is required.' });
        }

        if (!role) {
            return res.status(400).json({ message: 'Member role is required.' });
        }

        try {
            // Check total members
            const [totalCountResult] = await dbConnection.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM Members');
            const totalCount = totalCountResult[0].count;
            if (totalCount >= 50) {
                return res.status(400).json({ message: 'Cannot add member: Maximum of 50 members reached.' });
            }

            // Check Lieutenant count if role is Lieutenant
            if (role === 'Lieutenant') {
                const [lieutenantCountResult] = await dbConnection.execute<RowDataPacket[]>(
                    'SELECT COUNT(*) as count FROM Members WHERE role = ?',
                    ['Lieutenant']
                );
                const lieutenantCount = lieutenantCountResult[0].count;
                if (lieutenantCount >= 4) {
                    return res.status(400).json({ message: 'Cannot add Lieutenant: Maximum of 4 Lieutenants reached.' });
                }
            }

            // Check Leader count if role is Leader
            if (role === 'Leader') {
                const [leaderCountResult] = await dbConnection.execute<RowDataPacket[]>(
                    'SELECT COUNT(*) as count FROM Members WHERE role = ?',
                    ['Leader']
                );
                const leaderCount = leaderCountResult[0].count;
                if (leaderCount >= 1) {
                    return res.status(400).json({ message: 'Cannot add Leader: Maximum of 1 Leader reached.' });
                }
            }

            const randomString = Math.random().toString(36) + Date.now();
            const code = crypto.createHash('sha1').update(randomString).digest('hex');

            const query = 'INSERT INTO Members (name, code, role) VALUES (?, ?, ?)';
            const [result] = await dbConnection.execute<ResultSetHeader>(query, [name, code, role]);

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

    router.post('/', async (req: Request, res: Response) => {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({ message: 'Name and code are required.' });
        }

        try {
            const query = 'SELECT id, name, code, role, created_at FROM Members WHERE name = ? AND code = ?';
            const [rows] = await dbConnection.execute(query, [name, code]);

            if (Array.isArray(rows) && rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).json({ message: 'Member not found or credentials do not match.' });
            }
        } catch (error) {
            console.error('Error checking member credentials:', error);
            res.status(500).json({ message: 'Server error while checking member credentials.' });
        }
    });

    return router;
};