const User = require('../models/User');
const keyboards = require('../keyboards/keyboards');
const constants = require('../utils/constants');
const logger = require('../utils/logger');

class GameService {
  static generateSpinResult() {
    const { MIN_AMOUNT, MAX_AMOUNT } = constants.SPIN_REWARDS;
    return Math.floor(Math.random() * (MAX_AMOUNT - MIN_AMOUNT + 1)) + MIN_AMOUNT;
  }

  static async handleSpin(ctx, userId) {
    try {
      const user = await User.findOne({ telegramId: userId.toString() });
      
      if (!user || user.spinsRemaining <= 0) {
        await ctx.reply(
          'No spins remaining! Invite friends to earn more!',
          keyboards.inviteKeyboard
        );
        return;
      }

      const winAmount = this.generateSpinResult();
      user.totalWinnings += winAmount;
      user.spinsRemaining -= 1;
      await user.save();

      if (user.spinsRemaining === 0) {
        await ctx.reply(
          `🎉 You won ₹${winAmount}!\nTotal winnings: ₹${user.totalWinnings}\n\nInvite friends to earn more!`,
          keyboards.inviteKeyboard
        );
      } else {
        await ctx.reply(
          `🎉 You won ₹${winAmount}!\nSpins remaining: ${user.spinsRemaining}`,
          keyboards.spinKeyboard
        );
      }
    } catch (error) {
      logger.error('Error handling spin:', error);
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