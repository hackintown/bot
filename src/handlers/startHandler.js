const User = require('../models/User');
const keyboards = require('../keyboards/keyboards');
const logger = require('../utils/logger');

async function handleStart(ctx) {
  try {
    const userId = ctx.from.id;
    
    await User.findOneAndUpdate(
      { telegramId: userId.toString() },
      { 
        username: ctx.from.username,
        $setOnInsert: { spinsRemaining: 3 }
      },
      { upsert: true, new: true }
    );

    await ctx.reply(
      'Welcome to Spin and Win! Click the button to play',
      keyboards.startKeyboard
    );
  } catch (error) {
    logger.error('Error in start handler:', error);
  }
}

module.exports = handleStart;