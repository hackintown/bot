const logger = require('./logger');

function validateEnv() {
  const requiredEnvVars = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHANNEL_ID',
    'MONGODB_URI',
    'WEBHOOK_URL'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      const errorMessage = `Missing required environment variable: ${envVar}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Validate PORT
  const port = process.env.PORT || 3000;
  if (isNaN(port)) {
    const errorMessage = 'PORT must be a number';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  return true;
}

module.exports = validateEnv;