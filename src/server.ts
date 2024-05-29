import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import config from './config';
import { responseMiddleware } from './middleware/responseMiddleware';
import { setupRoutes } from './routes/setupRoutes';
import { connectDB } from './db/config/connection';

const app: Application = express();
const port = config.port;

app.use(bodyParser.json());
app.use(loggingMiddleware);
app.use(responseMiddleware);

setupRoutes(app);

connectDB();
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
