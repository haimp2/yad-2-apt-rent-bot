import { Types } from 'mongoose';
import Subscription, { UserSubscriptionData } from '../database/models/subscription';

export class SubscriptionService {
    public async subscribe(userId: Types.ObjectId, subscriptionData: UserSubscriptionData): Promise<void> {
        Subscription.create({ userId, ...subscriptionData });
    }

    public async countUserSubscriptions(userId: Types.ObjectId): Promise<number> {
        return Subscription.countDocuments({ userId });
    }

    public async getAllSubscriptions() {
        return Subscription.find()
            .populate('userId')
            .lean();
    }
}

export default new SubscriptionService();