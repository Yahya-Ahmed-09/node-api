const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', async(req, res)=>{
    res.json({message: "API "});
});


// Create Post Request
app.post('/api/users', async(req, res)=>{
    try {
        const {name, email} = req.body;

        if(!name || !email){
            res.status(400).json({
                message: "Name and Email are Required"
            });
        }

        const result = await pool.query(
             `INSERT INTO users(name, email) VALUES ('${name}', '${email}')`
        );

        res.json({
            message: "User Created Successfully",
            user: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Update User

app.put('api/users/:id', async(req, res)=>{
    try {
        const { id } = req.params
        const {name, email} = req.body;

        if(!name || !email){
            res.status(400).json({
                message: "Please Enter Somthing fro updating user"
            });
        }

        const user = await pool.query(
            `Select * from users WHERE ID = $1`,
            [id]
        )

        
        if((await user).rows.length === 0){
            return res.json.status(404).json({
                message: "User Not Found"
            });
        }
        
        const currentUser = user.rows[0];

        const updatedName = name || currentUser.name;
        const updatedEmail = email || currentUser.email;

        const result = await pool.query(
            `UPDATE user Set name = $1, email = $2 WHERE id = $3`,
            [updatedName, updatedEmail, id]
        )

        res.status(200).json({
            message:"User Updated Successfully",
            user: result.rows[0]
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
});

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