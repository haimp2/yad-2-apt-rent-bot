import { Context, Markup, Telegraf } from 'telegraf';

const registerNewSubscriptionHandler = (bot: Telegraf<Context>) => {
  bot.command('start', async (ctx) => {
    // await updateUserState(ctx.from.id, 'city', {});
    ctx.reply(
      'Please select a city:',
      Markup.inlineKeyboard([
        [Markup.button.callback('New York', 'city:NewYork')],
        [Markup.button.callback('Los Angeles', 'city:LosAngeles')],
        [Markup.button.callback('Chicago', 'city:Chicago')],
        [Markup.button.callback('Houston', 'city:Houston')],
      ])
    );
  });
}

export default registerNewSubscriptionHandler;