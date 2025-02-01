import { Context } from 'telegraf';
import UserService from '../../services/UserService';
import logger from '../../utils/logger';
import { UserDocument } from 'src/database/models/user';

export interface CustomContext extends Context {
    user?: UserDocument
}

const createNewUserIfNotExist = async (ctx: CustomContext, next: () => Promise<void>) => {
    const chatId = ctx.chat?.id;
    if (!chatId) {
        return;
    }

    try {
        let user = await UserService.getUser(chatId) as UserDocument;

        // If user does not exist, create one
        if (!user) {
            const { first_name, last_name, username } = ctx.from || {};
            logger.info(`Creating a new user with chatId: ${chatId}`);
            user = await UserService.createUser(chatId, first_name, last_name, username) as unknown as UserDocument;
        }

        // Attach the user object to the context
        ctx.user = user;
    } catch (error) {
        logger.error(`Error in user middleware: ${error}`);
    }

    await next();
};

export default createNewUserIfNotExist;
