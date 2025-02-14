import { UserDocument } from "src/database/models/user";
import UserService from "../../services/UserService";
import { CustomContext } from "../middleware/create-new-user";

export const editOrReply = async (ctx: CustomContext, text: string, extra?: any) => {
  if (ctx.user.state.lastMessageId) {
    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        ctx.user.state.lastMessageId,
        undefined,
        text,
        extra
      );
    } catch (error) {
      const message = await ctx.reply(text, extra);
      await UserService.updateUserLastMessageId(ctx.from.id, message.message_id);
    }
  } else {
    const message = await ctx.reply(text, extra);
    await UserService.updateUserLastMessageId(ctx.from.id, message.message_id);
  }
};

export const getUserFullName = (user: UserDocument) => {
  const fullName = user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user._id;
  return `${fullName}`;
};