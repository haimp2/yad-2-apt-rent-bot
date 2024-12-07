import mongoose from 'mongoose';
import logger from '../utils/logger';

if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
}

async function connectDB() {
    try {
        await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`);
        logger.info('Connected to MongoDB');

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB connection lost. Retrying...');
            connectDB();
        });
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error.message);
        throw error;
    }
}

export default connectDB;
