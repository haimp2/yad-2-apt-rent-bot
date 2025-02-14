import { Types } from 'mongoose';
import Subscription, { UserSubscriptionData } from '../database/models/subscription';
import { UserDocument } from '../database/models/user';

export class SubscriptionService {
    public async subscribe(userId: Types.ObjectId, subscriptionData: UserSubscriptionData): Promise<void> {
        Subscription.create({ userId, ...subscriptionData });
    }

    public async countUserSubscriptions(userId: Types.ObjectId): Promise<number> {
        return Subscription.countDocuments({ userId });
    }

    public async getUserSubscriptions(userId: Types.ObjectId): Promise<UserSubscriptionData[]> {
        const subscriptions = await Subscription.find({ userId }).lean().exec();
        return subscriptions.map(subscription => subscription as unknown as UserSubscriptionData);
    }


    public async getAllSubscriptions() {
        return Subscription.find()
            .populate('userId')
            .lean()
            .exec() as unknown as (UserSubscriptionData & { userId: UserDocument })[];
    }

    public async deleteSubscription(subscriptionId: string): Promise<void> {
        Subscription
            .findByIdAndDelete(subscriptionId)
            .exec();
    };

}

export default new SubscriptionService();