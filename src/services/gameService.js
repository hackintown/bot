const User = require('../models/User');
const keyboards = require('../keyboards/keyboards');
const constants = require('../utils/constants');
const logger = require('../utils/logger');

class GameService {
  static generateSpinResult(spinsRemaining, currentWinnings) {
    const { MIN_AMOUNT, MAX_AMOUNT, TARGET_TOTAL } = constants.SPIN_REWARDS;
    
    // Calculate remaining possible winnings to stay within target range
    const remainingSpins = spinsRemaining - 1;
    const remainingTarget = TARGET_TOTAL - currentWinnings;
    const maxPossible = remainingSpins > 0 
      ? remainingTarget - (MIN_AMOUNT * remainingSpins)
      : remainingTarget;

    // Generate random amount within controlled range
    const actualMax = Math.min(MAX_AMOUNT, maxPossible);
    return Math.floor(Math.random() * (actualMax - MIN_AMOUNT + 1)) + MIN_AMOUNT;
  }

  static async handleSpin(ctx, userId) {
    try {
      const user = await User.findOne({ telegramId: userId.toString() });
      
      if (!user || user.spinsRemaining <= 0) {
        await ctx.reply(
          '❌ No spins remaining!\n\n' +
          '👥 Invite friends to earn more spins and rewards!',
          keyboards.inviteKeyboard
        );
        return;
      }

      // Generate win amount based on remaining spins and current winnings
      const winAmount = this.generateSpinResult(
        user.spinsRemaining,
        user.totalWinnings
      );

      // Update user stats
      user.totalWinnings += winAmount;
      user.spinsRemaining -= 1;
      await user.save();

      // Send appropriate message based on remaining spins
      if (user.spinsRemaining === 0) {
        await ctx.reply(
          `🎉 Congratulations! You won ₹${winAmount}!\n\n` +
          `💰 Total winnings: ₹${user.totalWinnings}\n\n` +
          '👥 Invite friends to earn more rewards!',
          keyboards.inviteKeyboard
        );
      } else {
        await ctx.reply(
          `🎉 You won ₹${winAmount}!\n` +
          `🎯 Spins remaining: ${user.spinsRemaining}`,
          keyboards.spinKeyboard
        );
      }
    } catch (error) {
      logger.error('Error handling spin:', error);
      await ctx.reply('Sorry, something went wrong with the spin. Please try again.');
    }
  }

  static async handleWithdrawal(ctx, userId) {
    try {
      const user = await User.findOne({ telegramId: userId.toString() });
      
      if (!user) return;

      if (user.totalWinnings >= constants.MIN_WITHDRAWAL_AMOUNT) {
        await ctx.reply(
          'Your withdrawal request has been submitted! We will process it soon.'
        );
      } else {
        await ctx.reply(
          `You need at least ₹${constants.MIN_WITHDRAWAL_AMOUNT} to withdraw!`
        );
      }
    } catch (error) {
      logger.error('Error handling withdrawal:', error);
    }
  }

  static async processInvite(userId) {
    try {
      const user = await User.findOneAndUpdate(
        { telegramId: userId },
        { 
          $inc: { 
            wallet: constants.INVITE_REWARD,
            inviteCount: 1
          }
        },
        { new: true }
      );
      return !!user;
    } catch (error) {
      logger.error('Error processing invite:', error);
      return false;
    }
  }
}

module.exports = GameService;