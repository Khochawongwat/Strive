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