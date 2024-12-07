import { Schema, model } from 'mongoose';

export interface UserStateData {
    city?: string;
    neighborhood?: string;
    minPrice?: number;
    maxPrice?: number;
    minSizeInMeter?: number;
    maxSizeInMeter?: number;
    minRooms?: number;
    maxRooms?: number;
}

const userSchema = new Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true,
    },
    state: {
        step: {
            type: String,
            enum: ['start', 'city', 'neighborhood', 'minPrice', 'maxPrice', 'minSizeInMeter', 'maxSizeInMeter', 'minRooms', 'maxRooms'],
            default: null
        },
        data: {
            type: Object,
            default: {},
        }
    },
    maxSubscriptions: {
        type: Number,
        default: 1,
    }
});

const user = model('User', userSchema);

export default user;