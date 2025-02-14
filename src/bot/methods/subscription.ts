import { UserSubscriptionData } from 'src/database/models/subscription';

export const escapeMarkdown = (text: string) => text.replace(/_/g, '\\_').replace(/\-/g, '\\-').replace(/\./g, '\\.').replace(/\!/g, '\\!')

export const generateSubscriptionMessage = (subscriptionData: UserSubscriptionData, newSubscription?: boolean) => {
    const { location, minPrice, maxPrice, minRooms, maxRooms, minSizeInMeter, maxSizeInMeter, _id } = subscriptionData;

    let message = newSubscription ? '🌟 *הרשמה חדשה* 🌟' : '';

    if (_id) {
        message += `🔍 *מזהה:* \`${_id}\``;
    }

    if (location) {
        message += `\n📍 *מיקום:* ${location.fullTitleText}`;
    }

    if (minPrice && maxPrice) {
        message += `\n💰 *מחיר:* ${minPrice} - ${maxPrice} ₪`;
    }

    if (minRooms && maxRooms) {
        message += `\n🏠 *חדרים:* ${minRooms} - ${maxRooms}`;
    }

    if (minSizeInMeter && maxSizeInMeter) {
        message += `\n📏 *גודל:* ${minSizeInMeter} - ${maxSizeInMeter} מ"ר`;
    }

    return escapeMarkdown(message);
};