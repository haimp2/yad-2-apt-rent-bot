import SubscriptionService from '../../services/SubscriptionService';
import UserService from '../../services/UserService';

const maxSubscriptionLimit = async (ctx: any, next: () => void) => {
    const user = await UserService.getUser(ctx.from.id);
    const numberOfSubscriptions = await SubscriptionService.countUserSubscriptions(user._id);
    if (user.maxSubscriptions !== -1 && (user.maxSubscriptions <= numberOfSubscriptions) && ctx.message?.text === '/create_subscription') {
        ctx.reply('הגעת למגבלת המנויים המקסימלית שלך');
        return;
    }
    next();
}

export default maxSubscriptionLimit;