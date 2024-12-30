import { Schema, model } from 'mongoose';
import { locationSchema, subscriptionDataSchema } from './subscription';

export const userStateSteps = ['start', 'location', 'minPrice', 'maxPrice', 'minRooms', 'maxRooms', 'minSizeInMeter', 'maxSizeInMeter'] as const;

export type UserStateStep = typeof userStateSteps[number];

const userSchema = new Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true,
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
        default: [],
    },
    maxSubscriptions: {
        type: Number,
        default: 1,
    }
});

const user = model('User', userSchema);

export default user;