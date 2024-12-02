const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config');
const connectToDatabase = require('./database/connection');
const handleStart = require('./handlers/startHandler');
const handleCallback = require('./handlers/callbackHandler');
const logger = require('./utils/logger');

async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase(config.MONGODB_URI);

    const app = express();
    app.use(express.json());

    // Health check endpoint
    app.get('/', (req, res) => {
      res.send('Telegram bot is running!');
    });

    let bot;
    
    // Initialize bot based on environment
    if (config.NODE_ENV === 'production') {
      // Webhook mode for production
      bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, {
        webHook: { port: config.PORT }
      });
      
      const webhookUrl = `${config.WEBHOOK_URL}/bot${config.TELEGRAM_BOT_TOKEN}`;
      await bot.setWebHook(webhookUrl);
      logger.info(`Webhook set to ${webhookUrl}`);

      // Webhook endpoint
      app.post(`/bot${config.TELEGRAM_BOT_TOKEN}`, (req, res) => {
        bot.processUpdate(req.body);
        res.sendStatus(200);
      });
    } else {
      // Polling mode for development
      bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });
      logger.info('Bot started polling');
    }

    // Command handlers
    bot.onText(/\/start/, (msg) => handleStart(bot, msg));
    bot.on('callback_query', (query) => handleCallback(bot, query));

    // Error handlers
    bot.on('polling_error', (error) => {
      logger.error('Polling error:', error);
    });

    bot.on('webhook_error', (error) => {
      logger.error('Webhook error:', error);
    });

    process.on('unhandledRejection', (error) => {
      logger.error('Unhandled rejection:', error);
    });

    // Start Express server
    app.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();