import { UserSubscriptionData } from 'src/database/models/subscription';

export const escapeMarkdown = (text: string) => text.replace(/_/g, '\\_').replace(/\-/g, '\\-').replace(/\./g, '\\.').replace(/\!/g, '\\!')

export const generateSubscriptionMessage = (subscriptionData: UserSubscriptionData) => {
    const { location, minPrice, maxPrice, minRooms, maxRooms, minSizeInMeter, maxSizeInMeter } = subscriptionData;
    return escapeMarkdown(`🌟 *הרשמה חדשה* 🌟
📍 *מיקום:* ${location.fullTitleText}
💰 *מחיר:* ${minPrice} - ${maxPrice} ₪
🏠 *חדרים:* ${minRooms} - ${maxRooms}
${minSizeInMeter ? `📏 *גודל:* ${minSizeInMeter} - ${maxSizeInMeter} מ"ר` : ''}`);
};