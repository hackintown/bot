const User = require('../models/User');
const keyboards = require('../keyboards/keyboards');
const logger = require('../utils/logger');

async function handleStart(bot, msg) {
  try {
    const userId = msg.from.id;
    
    await User.findOneAndUpdate(
      { telegramId: userId.toString() },
      { 
        username: msg.from.username,
        $setOnInsert: { spinsRemaining: 3 }
      },
      { upsert: true, new: true }
    );

    await bot.sendMessage(
      userId, 
      'Welcome to Spin and Win! Click the button to play',
      keyboards.startKeyboard
    );
  } catch (error) {
    logger.error('Error in start handler:', error);
  }
}

module.exports = handleStart;