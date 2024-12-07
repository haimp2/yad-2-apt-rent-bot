import { Context } from 'telegraf';
import logger from '../../utils/logger';

const ALLOWED_CHAT_IDS = [
    296200165
];

const checkAllowedUsers = async (ctx: Context, next: () => void) => {
    const chatId = ctx.chat?.id;
    if (!chatId || !ALLOWED_CHAT_IDS.includes(chatId)) {
        logger.warn(`Unauthorized access from chatId: ${chatId}`);
        ctx.reply('Unauthorized access. You are not allowed to use this bot.');
        return;
    }
    next();
}

export default checkAllowedUsers;