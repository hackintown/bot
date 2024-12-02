require('dotenv').config();
const validateEnv = require('../utils/validateEnv');

validateEnv();

const config = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID,
  MONGODB_URI: process.env.MONGODB_URI,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  PORT: process.env.NODE_ENV === 'production' ? 443 : 3000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = config;