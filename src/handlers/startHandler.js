const User = require("../models/user");
const keyboards = require("../keyboards/keyboards");
const logger = require("../utils/logger");

async function handleStart(ctx) {
  try {
    const userId = ctx.from.id;
    const username = ctx.from.username;

    // Create or update user with initial spins
    await User.findOneAndUpdate(
      { telegramId: userId.toString() },
      {
        username,
        $setOnInsert: {
          spinsRemaining: 3,
          hasJoinedChannel: false,
          totalWinnings: 0,
          wallet: 0,
        },
      },
      { upsert: true, new: true }
    );

    // Send welcome message with start button
    await ctx.reply(
      "🎮 Welcome to Spin and Win! Click the button below to start playing and win exciting rewards! 🎁",
      keyboards.startKeyboard
    );
  } catch (error) {
    logger.error("Error in start handler:", error);
    await ctx.reply("Sorry, something went wrong. Please try again later.");
  }
}

module.exports = handleStart;
