const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors")
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const rateLimitMiddleware = require('./middlewares/ratelimit');

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

var app = express()

const port = 3000

app.use('/auth', rateLimitMiddleware)

app.use(cors(corsOptions))

app.use(bodyParser.json())

app.use(cookieParser())

app.listen(port, () => {
    console.log("Listening to port: " + port)
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.post('/auth/sessionLogin', (req, res) => {
    try {
        const expiresIn = 60 * 60 * 24 * 1000 * 5;
        const idToken = req.body.idToken.toString();
        const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        };
        res.cookie('session', idToken, options);
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/auth/retrieveSession', (req, res) => {
    try {
        const sessionCookie = req.cookies.session;
        const decodedToken = jwt.decode(sessionCookie);

        if (!sessionCookie) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        if (decodedToken.exp * 1000 < Date.now()) {
            return res.status(401).json({ status: 'error', message: 'Session expired' });
        }

        res.status(200).json({ status: 'success', session: sessionCookie });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
