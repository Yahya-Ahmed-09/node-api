const express = require('express');
const { Pool } = require('pg');
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    ssl : {
        rejectUnauthorized : false
    }
});

app.get('/',async(req,res)=>{
    try{
        res.json({message : "CONNECTED SUCCESSFULLY......!"});
    }catch(err)
    {
        res.status(500).json({erro:err.message});
    }
});

app.get('/users',async(req,res)=>{
    try{
        const result = await pool.query('select * from users');
        res.json(result.rows);
    }catch(err)
    {
        res.status(500).json({erro:err.message});
    }
});



const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
})