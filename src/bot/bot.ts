import { Telegraf } from 'telegraf';
import registerNewSubscriptionHandler from './handlers/new-subscription-handler';
import logger from '../utils/logger';
import checkAllowedUsers from './middleware/allowed-users';
import createNewUserIfNotExist from './middleware/create-new-user';
import maxSubscriptionLimit from './middleware/max-subscription-limit';
import registerManageSubscriptionsHandler from './handlers/manage-subscriptions-handler';

export const bot = new Telegraf(process.env.BOT_TOKEN);

export const initializeBot = () => {
    logger.info('Starting the bot...');

    bot.telegram.setMyCommands([
        { command: 'start', description: 'התחל את הבוט' },
        { command: 'create_subscription', description: 'צור הרשמה חדשה לחיפוש דירה' },
        { command: 'get_subscriptions', description: 'קבל את רשימת ההרשמות שלך' },
        { command: 'delete_subscription', description: 'מחק הרשמה לחיפוש רכב' }
    ]);

    // Register middleware
    bot.use(checkAllowedUsers);
    bot.use(createNewUserIfNotExist);
    bot.use(maxSubscriptionLimit);

    // Register handlers
    registerManageSubscriptionsHandler(bot);
    registerNewSubscriptionHandler(bot);

    bot.launch().then(() => {
        logger.info('Bot started');
    });
};