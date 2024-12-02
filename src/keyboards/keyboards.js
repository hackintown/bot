module.exports = {
  startKeyboard: {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Start Playing', callback_data: 'start_playing' }
      ]]
    }
  },
  
  channelKeyboard: {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Join Channel', url: 'https://t.me/hackintown' },
        { text: 'Continue', callback_data: 'verify_membership' }
      ]]
    }
  },

  spinKeyboard: {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Spin!', callback_data: 'spin' }
      ]]
    }
  },

  inviteKeyboard: {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Invite Friends', callback_data: 'invite' },
        { text: 'Withdraw', callback_data: 'withdraw' }
      ]]
    }
  }
};