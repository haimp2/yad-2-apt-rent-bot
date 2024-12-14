import { Context } from 'telegraf';
import SubscriptionService from '../../services/SubscriptionService';
import UserService from '../../services/UserService';

const maxSubscriptionLimit = async (ctx: Context, next: () => void) => {
    const user = await UserService.getUser(ctx.from.id);
    const numberOfSubscriptions = await SubscriptionService.countUserSubscriptions(user._id);
    if (user.maxSubscriptions !== -1 && (user.maxSubscriptions <= numberOfSubscriptions)) {
        ctx.reply('הגעת למגבלת המנויים המקסימלית שלך');
        return;
    }
    next();
}

export default maxSubscriptionLimit;