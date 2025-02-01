import mongoose from 'mongoose';
import logger from '../utils/logger';

if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
}

async function connectDB() {
    try {
        const [user, pass, host, db, cluster] = [process.env.MONGO_USER, process.env.MONGO_PASS, process.env.MONGO_HOST, process.env.MONGO_DB, process.env.MONGO_CLUSTER];

        await mongoose.connect(`mongodb+srv://${user}:${pass}@${host}?retryWrites=true&w=majority&appName=${cluster}`, {
            dbName: db,
        });
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
