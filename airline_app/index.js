import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import dotenv from 'dotenv';
import pg from 'pg';
import router from './server/lib/router.js';
import passport from "passport";
import bodyParser from "body-parser";
import { Strategy as LocalStrategy } from 'passport-local';
import session from "express-session";
import bcrypt from 'bcrypt';
import { Server } from 'socket.io'; // Importing Socket.IO
import http from 'http';
import Stripe from 'stripe';


dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT not specified

const httpServer = http.createServer(app); // Create an HTTP server
const io = new Server(httpServer); // Set up Socket.IO on the HTTP server

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');
app.use(express.json());

// Configure Stripe with the secret key from the environment variable
const stripe = Stripe(process.env.STRIPE_API_KEY);


// PostgreSQL client setup
const client = new pg.Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5433 // Default port or environment variable
});

// Express session middleware configuration
app.use(session({
    secret: 'my_secret_key',  // Use a secure, private key in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }  // Use `secure: true` in production with HTTPS
}));

// Function to connect to the database and start the server
async function connectDatabase() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');

        httpServer.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err.message);
    }
}

connectDatabase();

// Passport configuration for authentication
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.rows[0].id); // Serialize user by ID
});

passport.deserializeUser(async (id, done) => {
    const user = await client.query("SELECT id FROM users WHERE id = $1", [id]);
    if (user) {
        done(null, { id: user.id });
    } else {
        done(new Error("No user found with this ID"));
    }
});

// Local strategy for handling username and password authentication
passport.use('local', new LocalStrategy({ passReqToCallback: true },
    async (req, username, password, done) => {
        let user = await client.query("SELECT * FROM users WHERE email = $1", [username]);
        if (!user) {
            return done(null, false);
        }
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (isMatch) {
            return done(null, user);
        } else {
            return done('Incorrect username or password', null);
        }
    }
));

// Socket.IO handling for real-time chat functionality
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('chat message', (msg) => {
        console.log('Received message:', msg);
        let response = getBotResponse(msg);
        socket.emit('chat response', response);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Function to generate a response based on the received message
function getBotResponse(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
        return 'Hi! How can I assist you today?';
    } else if (lowerCaseMessage.includes('help')) {
        return 'Sure! What do you need help with?';
    } else if (lowerCaseMessage.includes('ticket')) {
        return 'For ticket-related inquiries, please visit our ticketing section if unable I can connect you with a live agent .';
    } else if (lowerCaseMessage.includes('refund')) {
        return 'For refund information, visit our refunds page or contact customer service.';
    } else {
        return 'I am here to help with airline-related queries. Could you please rephrase your question?';
    }
}

// Default API route
app.use('/', router);

export { client, stripe };
export default app;
