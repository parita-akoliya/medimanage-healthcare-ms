import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import config from './config';
import { responseMiddleware } from './middleware/responseMiddleware';
import { setupRoutes } from './routes/setupRoutes';
import { connectDB } from './db/config/connection';
import { logger } from './utils/logger';
import cors from 'cors'

const app: Application = express();
const port = config.port;

app.use(bodyParser.json());
app.use(loggingMiddleware);
app.use(responseMiddleware);
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
setupRoutes(app);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (error: any) {
        logger.error('Error initializing MongoDB:', error);
        process.exit(1);
    }
};

startServer();
