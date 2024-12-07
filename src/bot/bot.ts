import { Telegraf } from 'telegraf';
import registerNewSubscriptionHandler from './handlers/new-subscription-handler';
import logger from '../utils/logger';
import checkAllowedUsers from './middleware/allowed-users';
import createNewUserIfNotExist from './middleware/create-new-user';

const initializeBot = () => {
    logger.info('Starting the bot...');
    
    const bot = new Telegraf(process.env.BOT_TOKEN);
    
    bot.telegram.setMyCommands([
        { command: 'start', description: 'Start the bot' },
        { command: 'help', description: 'Get help information' },
    ]);
    
    // Register middleware
    bot.use(checkAllowedUsers);
    bot.use(createNewUserIfNotExist);

    // Register handlers
    registerNewSubscriptionHandler(bot);

    bot.launch().then(() => {
        logger.info('Bot started');
    });
};

export default initializeBot;
