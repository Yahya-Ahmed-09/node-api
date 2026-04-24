const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* -------------------------
   READ ALL USERS
------------------------- */
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -------------------------
   READ SINGLE USER
------------------------- */
app.get('/api/users/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -------------------------
   CREATE USER
------------------------- */
app.post('/api/users', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email required' });
        }

        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -------------------------
   UPDATE USER
------------------------- */
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, email } = req.body;

        const result = await pool.query(
            'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *',
            [name, email, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -------------------------
   DELETE USER
------------------------- */
app.delete('/api/users/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM users WHERE id=$1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -------------------------
   START SERVER
------------------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});