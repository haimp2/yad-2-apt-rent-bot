import { Telegraf } from 'telegraf';
import registerNewSubscriptionHandler from './handlers/new-subscription-handler';
import logger from '../utils/logger';
import checkAllowedUsers from './middleware/allowed-users';
import createNewUserIfNotExist from './middleware/create-new-user';
import maxSubscriptionLimit from './middleware/max-subscription-limit';

const initializeBot = () => {
    logger.info('Starting the bot...');

    const bot = new Telegraf(process.env.BOT_TOKEN);

    bot.telegram.setMyCommands([
        { command: 'start', description: 'התחל את הבוט' },
        { command: 'create_subscription', description: 'צור הרשמה חדשה לחיפוש דירה' },
    ]);

    // Register middleware
    bot.use(checkAllowedUsers);
    bot.use(createNewUserIfNotExist);
    bot.use(maxSubscriptionLimit);

    // Register handlers
    registerNewSubscriptionHandler(bot);

    bot.launch().then(() => {
        logger.info('Bot started');
    });
};

export default initializeBot;
