import express from "express";
import env from 'dotenv';
import pg from 'pg';
import router from './server/lib/router.js'


env.config()


const app = express();
const PORT = process.env.PORT || 4500;
console.log(PORT)

const client = new pg.Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5433,
});
async function connect_db() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');

        app.listen(PORT, () => {
            console.log(`app listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err.message);
    }
}

connect_db();

//default api route 


app.use('/api', router);