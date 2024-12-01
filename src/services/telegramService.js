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

const generateSpinResult = () => {
  return Math.floor(Math.random() * 30) + 10; // Random amount between 10 and 40
};

module.exports = { verifyUserInChannel, generateSpinResult };
