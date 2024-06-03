import mongoose from 'mongoose';
import { logger } from '../../utils/logger';
import config from '../../config';

export async function connectDB() {
    try {
        const mongodbUri = config.mongodb_uri;
        await mongoose.connect(mongodbUri);
        logger.info('Connected to MongoDB');
    } catch (error: any) {
        logger.error('Error connecting to MongoDB:', error);
        throw error;
    }
}