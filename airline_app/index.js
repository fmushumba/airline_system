import express, { json } from "express";
import expressEjsLayouts from "express-ejs-layouts";
import env from 'dotenv';
import pg from 'pg';
import router from './server/lib/router.js';
import passport from "passport";
import bodyParser from "body-parser";
import { Strategy as LocalStrategy } from 'passport-local';
import cookieSession from "cookie-session";
import bcrypt from 'bcrypt'



env.config()


const app = express();
const PORT = process.env.PORT || 4500;
console.log(PORT)
app.use(bodyParser.urlencoded({ extended: false }))

const client = new pg.Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5433,
});
app.use(cookieSession({
    name: 'app-auth',
    keys: ['secret_new', 'secret_old'],
    maxAge: 60 * 60 * 24
}))
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


await connect_db();

app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.set('layout', './layouts/main')
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    console.log(user.rows[0].id)
    console.log(`4----------------------------- serialize`)
    return done(null, user.rows[0].id)
})
passport.deserializeUser(async (id, done) => {
    console.log(`5----------------------------- serialize`)
    console.log(id)
    const user = await client.query("SELECT id FROM users WHERE id = $1", [id])
    if (user) {
        return done(null, { id: user.id })
    } else {
        return done(new Error("no user with id "))
    }

})

passport.use('local', new LocalStrategy({ passReqToCallback: true },
    async (req, username, password, done) => {
        let user = await client.query("SELECT * FROM users WHERE email = $1", [username])

        console.log(user.rows[0].password)
        let storedHashedPassword = user.rows[0].password
        if (!user) {
            return done(null, false)
        }
        const result = await new Promise((resolve, reject) => {
            bcrypt.compare(password, storedHashedPassword, (err, res) => {
                if (err) reject(err);
                resolve(res)

            })
        })
        console.log(result)
        if (result) {
            return done(null, user)
        } else {
            return done('password or usernamr=e incorrect', null)
        }

    }

))

//default api route 


app.use('/', router);

export default client;