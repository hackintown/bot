const config = require("../config/config");
const User = require("../models/user");

class ChannelService {
  static async verifyChannelMembership(ctx, userId) {
    try {
      const chatMember = await ctx.telegram.getChatMember(
        config.TELEGRAM_CHANNEL_ID,
        userId
      );
      const isChannelMember = ["member", "administrator", "creator"].includes(
        chatMember.status
      );

      if (isChannelMember) {
        await User.findOneAndUpdate(
          { telegramId: userId.toString() },
          { hasJoinedChannel: true },
          { upsert: true }
        );
      }

      return isChannelMember;
    } catch (error) {
      console.error("Error verifying channel membership:", error);
      return false;
    }
  }
}

module.exports = ChannelService;
