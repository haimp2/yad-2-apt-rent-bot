
import { Context } from 'telegraf';
import UserService from '../../services/UserService';
import logger from '../../utils/logger';


const createNewUserIfNotExist = async (ctx: Context, next: () => void) => {
    const chatId = ctx.chat?.id;
    if (!chatId) {
        return;
    }
    const user = await UserService.getUser(chatId);
    if (!user) {
        try {
            logger.info(`Creating a new user with chatId: ${chatId}`);
            await UserService.createUser(chatId);
        } catch (error) {
            logger.error(`Error while creating a new user: ${error}`);
        }
    }
    next();
}

export default createNewUserIfNotExist;