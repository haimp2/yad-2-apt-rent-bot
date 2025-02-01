import { UserSubscriptionData } from 'src/database/models/subscription';
import User, { UserDocument, UserStateStep } from '../database/models/user';
import { Location } from './yad-2-service/typings';

export class UserService {
    async createUser(chatId: number, firstName?: string, lastName?: string, username?: string) {
        await User.create({ chatId, firstName, lastName, username });
    }

    async getUser(chatId: number) {
        return User.findOne({ chatId }).lean() as unknown as UserDocument;
    }

    async updateUserState(
        chatId: number,
        step: UserStateStep,
        activeSubscriptionData: Partial<UserSubscriptionData>
    ) {
        const user = await User.findOne({ chatId });

        if (!user) {
            throw new Error('User not found');
        }

        const updatedActiveSubscriptionData = {
            ...user.state?.activeSubscriptionData,
            ...activeSubscriptionData
        };

        user.state = {
            ...user.state,
            step,
            activeSubscriptionData: updatedActiveSubscriptionData as any
        };

        return user.save();
    }

    async resetUserState(chatId: number) {
        return User.findOneAndUpdate({ chatId }, { state: { step: 'location', activeSubscriptionData: {} } }, { new: true });
    }

    async setCurrentLocations(chatId: number, locations: Location[]) {
        return User.findOneAndUpdate({ chatId }, { $set: { 'state.currentLocations': locations } });
    }
}

export default new UserService();