const User = require("../models/user");
const ChannelService = require("../services/channelService");
const GameService = require("../services/gameService");
const keyboards = require("../keyboards/keyboards");
const logger = require("../utils/logger");

async function handleCallback(ctx) {
  const userId = ctx.from.id;
  const data = ctx.callbackQuery.data;

  try {
    switch (data) {
      case "start_playing":
        // Step 2: Prompt to join channel
        await ctx.reply(
          "🎁 Join our Telegram channel to get 3 FREE spins!\n\n" +
            '1. Click "Join Channel" below\n' +
            "2. Join @hackintown\n" +
            '3. Come back and click "Continue"',
          keyboards.channelKeyboard
        );
        break;

      case "verify_membership":
        // Step 3: Verify channel membership
        const isMember = await ChannelService.verifyChannelMembership(
          ctx,
          userId
        );
        if (isMember) {
          const user = await User.findOne({ telegramId: userId.toString() });
          await ctx.reply(
            `🎯 Great! You have ${user.spinsRemaining} spins.\n` +
              "Click Spin to try your luck! 🎰",
            keyboards.spinKeyboard
          );
        } else {
          await ctx.reply(
            "❌ Please join our channel first to continue!\n" +
              "Click the Join Channel button below.",
            keyboards.channelKeyboard
          );
        }
        break;

      case "spin":
        // Step 4: Handle spin game
        await GameService.handleSpin(ctx, userId);
        break;

      case "invite":
        // Step 5: Handle invites
        const inviteLink = `https://t.me/HackintownBot?start=${userId}`;
        await ctx.reply(
          "🤝 Invite Friends & Earn!\n\n" +
            "• Get ₹10 for each friend who joins\n" +
            "• Withdraw when you reach ₹100\n\n" +
            `Share your invite link:\n${inviteLink}`,
          keyboards.inviteKeyboard
        );
        break;

      case "withdraw":
        await GameService.handleWithdrawal(ctx, userId);
        break;
    }

    // Clear loading state
    await ctx.answerCbQuery();
  } catch (error) {
    logger.error("Error in callback handler:", error);
    await ctx.answerCbQuery("Sorry, something went wrong. Please try again.");
  }
}

module.exports = handleCallback;
