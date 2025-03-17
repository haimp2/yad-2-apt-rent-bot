import dotenv from 'dotenv-safe';
dotenv.config();

import { initializeBot } from './bot/bot';
import connectDB from './database/db-connection';
import logger from './utils/logger';
import { PostsNotificationService } from './services/PostsNotificationService';
import UserService from './services/UserService';
import SubscriptionService from './services/SubscriptionService';
import Yad2ApiService from './services/yad-2-service/Yad2ApiService';

(async () => {
    try {
        await connectDB();
        initializeBot();
        const postsNotificationService = new PostsNotificationService(UserService, SubscriptionService, Yad2ApiService);
        // await postsNotificationService.start();
    } catch (error) {
        logger.error('Error starting the app:', error);
        process.exit(1);
    }
})();