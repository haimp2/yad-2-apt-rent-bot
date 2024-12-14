import { UserSubscriptionData } from 'src/database/models/subscription';

export const generateSubscriptionMessage = (subscriptionData: UserSubscriptionData) => {
    const { location, minPrice, maxPrice, rooms, minSizeInMeter, maxSizeInMeter } = subscriptionData;
    return `הרשמה חדשה:
    מיקום: ${location.fullTitleText}
    מחיר: ${minPrice} - ${maxPrice}
    חדרים: ${rooms.join(', ')}
    ${minSizeInMeter ? `גודל: ${minSizeInMeter} - ${maxSizeInMeter}` : ''}`;
};