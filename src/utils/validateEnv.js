const logger = require('./logger');

function validateEnv() {
  const requiredEnvVars = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHANNEL_ID',
    'MONGODB_URI',
    'WEBHOOK_URL'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingEnvVars.join(', ')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  return true;
}

module.exports = validateEnv;