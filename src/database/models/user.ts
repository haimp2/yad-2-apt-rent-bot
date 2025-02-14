import { Schema, Types, model } from 'mongoose';
import { locationSchema, subscriptionDataSchema, UserSubscriptionData } from './subscription';

export const userStateSteps = ['start', 'location', 'minPrice', 'maxPrice', 'minRooms', 'maxRooms', 'minSizeInMeter', 'maxSizeInMeter'] as const;

export type UserStateStep = typeof userStateSteps[number];

interface UserState {
    step: UserStateStep;
    lastMessageId?: number;
    activeSubscriptionData: UserSubscriptionData;
    currentLocations: {
        id: number;
        fullTitleText: string;
        areaId: string;
        hoodId?: string;
        cityId?: string;
    }[];
}

export interface UserDocument extends Document {
    _id: Types.ObjectId
    chatId: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    state: UserState;
    maxSubscriptions: number;
    admin?: boolean;
}

const userSchema = new Schema<UserDocument>({
    chatId: {
        type: Number,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        default: null,
    },
    lastName: {
        type: String,
        default: null,
    },
    username: {
        type: String,
        default: null,
    },
    state: {
        step: {
            type: String,
            enum: userStateSteps,
            default: null
        },
        activeSubscriptionData: {
            type: subscriptionDataSchema,
            default: {},
        },
        currentLocations: [{
            ...locationSchema,
            id: { type: Number, required: true }
        }],
        lastMessageId: {
            type: Number,
            default: null,
        },
    },
    maxSubscriptions: {
        type: Number,
        default: 1,
    }
});

const user = model('User', userSchema);

export default user;