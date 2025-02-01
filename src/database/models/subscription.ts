
import { Schema, Types, model } from 'mongoose';
import { Location } from 'src/services/yad-2-service/typings';


export interface UserSubscriptionData {
    _id: Types.ObjectId,
    location?: Location;
    minPrice?: number;
    maxPrice?: number;
    minRooms?: number;
    maxRooms?: number;
    minSizeInMeter?: number;
    maxSizeInMeter?: number;
}

export const locationSchema = {
    fullTitleText: { type: String, required: true },
    areaId: { type: String, required: true },
    hoodId: { type: String, required: false },
    cityId: { type: String, required: false }
}

export const subscriptionDataSchema = {
    location: {
        type: locationSchema,
        required: false
    },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    minRooms: { type: Number },
    maxRooms: { type: Number },
    minSizeInMeter: { type: Number },
    maxSizeInMeter: { type: Number },
}

const subscriptionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    ...subscriptionDataSchema
});

const subscription = model('Subscription', subscriptionSchema);

export default subscription;