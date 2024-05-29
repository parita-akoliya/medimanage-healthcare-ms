import mongoose from 'mongoose';
import { logger } from '../../utils/logger';
import { MongooseOptions } from '../../types/MongooseOptions';
import config from '../../config';
import { initializeCollections } from './initializeCollections';

export async function connectDB() {
    try {
        const mongodbUri = config.mongodb_uri;
        const mongooseOptions: MongooseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        await mongoose.connect(mongodbUri, mongooseOptions);
        await initializeCollections();
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
