import SubscriptionService from "../../services/SubscriptionService";
import UserService from "../../services/UserService";
import { Context, Telegraf } from "telegraf";
import { generateSubscriptionMessage } from "../methods/subscription";
import { editOrReply } from "../utils/message-utils";
import { CustomContext } from "../middleware/create-new-user";

const registerManageSubscriptionsHandler = (bot: Telegraf<Context>) => {
    bot.command('get_subscriptions', async (ctx: CustomContext) => {
        const user = await UserService.getUser(ctx.from.id);
        const subscriptions = await SubscriptionService.getUserSubscriptions(user._id);
        if (subscriptions.length === 0) {
            editOrReply(ctx, "אין לך הרשמות פעילות");
        } else {
            editOrReply(ctx, `
            ${subscriptions.map(sub => generateSubscriptionMessage(sub)).join('\n----------------------------\n'.replace(/\-/g, '\\-'))}
            `, { parse_mode: 'MarkdownV2' });

            UserService.resetUserState(ctx.chat.id, true);
        }
    });

    bot.command('delete_subscription', async (ctx) => {
        const user = await UserService.getUser(ctx.from.id);
        const subscriptions = await SubscriptionService.getUserSubscriptions(user._id);
        if (subscriptions.length === 0) {
            editOrReply(ctx, "אין לך הרשמות פעילות");
        } else {
            const subscriptionIds = subscriptions.map(sub => sub._id);
            editOrReply(ctx, 'בחר את המודעה אותה תרצה למחוק:', {
                reply_markup: {
                    inline_keyboard: subscriptionIds.map(id => [{ text: id.toString(), callback_data: `delete_subscription:${id}` }])
                }
            });
        }
    });

    bot.action(/delete_subscription:(.*)/, async (ctx: CustomContext & { match: any }) => {
        const subscriptionId = ctx.match[1];
        await SubscriptionService.deleteSubscription(subscriptionId);
        ctx.answerCbQuery('Subscription deleted');
        await ctx.deleteMessage(ctx.user.state.lastMessageId);
        await UserService.resetUserState(ctx.chat.id, true);
    });
};

export default registerManageSubscriptionsHandler;