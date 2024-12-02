const User = require('../models/User');
const ChannelService = require('../services/channelService');
const GameService = require('../services/gameService');
const keyboards = require('../keyboards/keyboards');
const logger = require('../utils/logger');

async function handleCallback(ctx) {
  const userId = ctx.from.id;
  const data = ctx.callbackQuery.data;

  try {
    switch (data) {
      case 'start_playing':
        await ctx.reply(
          'Join our telegram channel and get 3 free spins!',
          keyboards.channelKeyboard
        );
        break;

      case 'verify_membership':
        const isMember = await ChannelService.verifyChannelMembership(ctx, userId);
        if (isMember) {
          await ctx.reply(
            'Great! You have 3 spins. Click Spin to try your luck!',
            keyboards.spinKeyboard
          );
        } else {
          await ctx.reply(
            'Please join our channel first to continue!',
            keyboards.channelKeyboard
          );
        }
        break;

      case 'spin':
        await GameService.handleSpin(ctx, userId);
        break;

      case 'invite':
        const inviteLink = `https://t.me/HackintownBot?start=${userId}`;
        await ctx.reply(
          `Share this link with your friends and earn ₹10 for each invite!\n${inviteLink}`
        );
        break;

      case 'withdraw':
        await GameService.handleWithdrawal(ctx, userId);
        break;
    }
  } catch (error) {
    logger.error('Error in callback handler:', error);
  }
}

module.exports = handleCallback;