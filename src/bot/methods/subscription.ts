import { UserSubscriptionData } from 'src/database/models/subscription';

const escapeMarkdown = (text: string) => text.replace(/_/g, '\\_').replace(/\-/g, '\\-').replace(/\./g, '\\.')

export const generateSubscriptionMessage = (subscriptionData: UserSubscriptionData) => {
    const { location, minPrice, maxPrice, rooms, minSizeInMeter, maxSizeInMeter } = subscriptionData;
    return escapeMarkdown(`🌟 *הרשמה חדשה* 🌟
📍 *מיקום:* ${location.fullTitleText}
💰 *מחיר:* ${minPrice} - ${maxPrice} ₪
🏠 *חדרים:* ${rooms.join(', ')}
${minSizeInMeter ? `📏 *גודל:* ${minSizeInMeter} - ${maxSizeInMeter} מ"ר` : ''}`);
};