const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimitMiddleware = require('./backend/middlewares/ratelimit');
const { userRouter } = require('./backend/routes/user.route');
const {
    client,
    connectToMongoDB,
    closeMongoDBConnection,
} = require('./backend/utils/general.function');

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

async function startServer() {
    try {
        const app = express();
        const port = 3000;

        console.log("Starting server at port: " + port)

        await connectToMongoDB()

        app.use('/auth', rateLimitMiddleware);
        app.use(cors(corsOptions));
        app.use(bodyParser.json());
        app.use(cookieParser());

        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            if (req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
            next();
        });

        app.use('/api', userRouter);

        app.listen(port, () => {
            console.log("Listening to port: " + port);
        });

        process.on('SIGINT', async () => {
            await closeMongoDBConnection();
            process.exit();
        });
        
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
}

startServer();
