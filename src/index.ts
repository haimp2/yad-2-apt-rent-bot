import dotenv from 'dotenv-safe';
import initializeBot from './bot/bot';
import connectDB from './database/db-connection';
import logger from './utils/logger';

dotenv.config();

(async () => {
    try {
        await connectDB();
        initializeBot();

    } catch (error) {
        logger.error('Error starting the app:', error);
        process.exit(1);
    }
})();