const axios = require("axios");

const verifyUserInChannel = async (telegramId) => {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`,
      {
        params: {
          chat_id: process.env.CHANNEL_ID,
          user_id: telegramId,
        },
      }
    );
    const status = response.data.result.status;
    return status === "member" || status === "administrator";
  } catch (err) {
    console.error(err);
    return false;
  }
};

const generateSpinResult = (remainingSpins) => {
  const maxPossible = 90 - remainingSpins * 20;
  const minPossible = 60 - remainingSpins * 15;
  return (
    Math.floor(Math.random() * (maxPossible - minPossible + 1)) + minPossible
  );
};

module.exports = { verifyUserInChannel, generateSpinResult };
