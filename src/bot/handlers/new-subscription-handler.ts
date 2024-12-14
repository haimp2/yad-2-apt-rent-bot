import { Context, Markup, Telegraf } from 'telegraf';
import UserService from '../../services/UserService';
import Yad2ApiService from '../../services/yad-2-service/Yad2ApiService';
import { validateCityName, validatePrice, validateRooms, validateSizeInMeter } from '../utils/validatores';
import SubscriptionService from '../../services/SubscriptionService';
import { generateSubscriptionMessage } from '../methods/subscription';
import { UserSubscriptionData } from '../../database/models/subscription';
import { Types } from 'mongoose';

const onUserSubscriptionEnd = async (ctx: Context, userId: Types.ObjectId, subscriptionData: UserSubscriptionData) => {
  ctx.reply(generateSubscriptionMessage(subscriptionData));
  SubscriptionService.subscribe(userId, subscriptionData);
  UserService.resetUserState(ctx.from.id);
};

const registerNewSubscriptionHandler = async (bot: Telegraf<Context>) => {
  bot.command('start', async (ctx) => {
    ctx.reply(`
      ברוכים הבאים לבוט חיפוש דירות של Yad2
      ניתן להפעיל את הבוט על ידי הקלדת הפקודות הבאות:
      /create_subscription - צור הרשמה חדשה לחיפוש דירה
      `);
  });

  bot.command('create_subscription', async (ctx) => {
    await UserService.resetUserState(ctx.from.id);
    ctx.reply('הקלד את שם העיר/שכונה לחיפוש:');
  });

  bot.hears(/.*/, async (ctx) => {
    const user = await UserService.getUser(ctx.from.id);
    const step = user.state.step;

    switch (step) {
      case 'location':
        const city = ctx.message.text;
        try {
          validateCityName(city);
        } catch (error) {
          ctx.reply(error.message);
          return;
        }

        // TODO: Add multi-city support
        const res = await Yad2ApiService.fetchCityOptions(ctx.message.text);
        if (res.length === 0) {
          ctx.reply('לא נמצאו תוצאות, נסה שוב');
          return;
        }
        UserService.setCurrentLocations(ctx.from.id, res);

        ctx.reply(
          'בחר עיר/שכונה מהרשימה:',
          Markup.inlineKeyboard(res.map(({ fullTitleText, id }) => [Markup.button.callback(fullTitleText, `location:${id}`)]))
        );
        break;
      case 'minPrice':
        let minPrice: number;
        try {
          minPrice = Number(ctx.message.text);
          if (!Number.isInteger(minPrice)) {
            throw new Error('מחיר לא תקין');
          }
          validatePrice(minPrice);
        } catch (error) {
          ctx.reply(error.message);
          return;
        }
        await UserService.updateUserState(ctx.from.id, 'maxPrice', { minPrice });
        ctx.reply('הזן את המחיר המקסימלי של הדירה:');
        break;
      case 'maxPrice':
        let maxPrice: number;
        try {
          maxPrice = Number(ctx.message.text);
          if (!Number.isInteger(maxPrice)) {
            throw new Error('מחיר לא תקין');
          }
          validatePrice(maxPrice, user.state.activeSubscriptionData.minPrice);
        } catch (error) {
          ctx.reply(error.message);
          return;
        }
        await UserService.updateUserState(ctx.from.id, 'rooms', { maxPrice });
        ctx.reply(`
          הזן את מספר החדרים בדירה:
          ניתן לבחור כמה אפשרויות ולהפריד בפסיק
          לדוגמא: 2, 3.5, 4
          `);
        break;
      case 'rooms':
        let rooms: number[];
        try {
          rooms = ctx.message.text.trim().split(',').map(room => Number(room));
          rooms = [...new Set(rooms)];
          if (rooms.some(room => isNaN(room))) {
            throw new Error('מספר חדרים לא תקין');
          }
          rooms.forEach(room => validateRooms(room));
        } catch (error) {
          ctx.reply(error.message);
          return;
        }
        await UserService.updateUserState(ctx.from.id, 'minSizeInMeter', { rooms });
        ctx.reply(`
          הזן את השטח המינימלי במ"ר:
          אם אין העדפה, השב ״איו״
          `);
        break;
      case 'minSizeInMeter':
        if (ctx.message.text === 'אין') {
          onUserSubscriptionEnd(ctx, user._id, user.state.activeSubscriptionData);
          return;
        }
        let minSizeInMeter: number;
        try {
          minSizeInMeter = Number(ctx.message.text);
          if (!Number.isInteger(minSizeInMeter)) {
            throw new Error('שטח לא תקין');
          }
          validateSizeInMeter(minSizeInMeter);
        } catch (error) {
          ctx.reply(error.message);
          return;
        }
        await UserService.updateUserState(ctx.from.id, 'maxSizeInMeter', { minSizeInMeter });
        ctx.reply(`הזן את השטח המקסימלי במ"ר:`);
        break;
      case 'maxSizeInMeter':
        let maxSizeInMeter: number;
        try {
          maxSizeInMeter = Number(ctx.message.text);
          if (!Number.isInteger(maxSizeInMeter)) {
            throw new Error('שטח לא תקין');
          }
          validateSizeInMeter(maxSizeInMeter, user.state.activeSubscriptionData.minSizeInMeter);
        } catch (error) {
          ctx.reply(error.message);
          return;
        }
        onUserSubscriptionEnd(ctx, user._id, { ...user.state.activeSubscriptionData, maxSizeInMeter });
        break;
      default:
        ctx.reply('לא ניתן להבין את הבקשה, נסה שוב');
        break;
    }
  });

  bot.action(/location:.*/, async (ctx) => {
    const [, id] = ctx.match.input.split(':');
    const user = await UserService.getUser(ctx.from.id);
    const location = user.state.currentLocations.find(location => location.id === Number(id));
    await UserService.updateUserState(ctx.from.id, 'minPrice', { location });
    ctx.reply('הקלד את המחיר המינימלי של הדירה:');
  });
}

export default registerNewSubscriptionHandler;