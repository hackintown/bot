const express = require("express");
const { Telegraf } = require("telegraf");
const config = require("./config/config");
const connectToDatabase = require("./database/connection");
const handleStart = require("./handlers/startHandler");
const handleCallback = require("./handlers/callbackHandler");
const logger = require("./utils/logger");

async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase(config.MONGODB_URI);

    const app = express();
    app.use(express.json());

    // Health check endpoint
    app.get("/", (req, res) => {
      res.send("Telegram bot is running!");
    });

    const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

    // Command handlers
    bot.command("start", (ctx) => handleStart(ctx));
    bot.on("callback_query", (ctx) => handleCallback(ctx));

    if (config.NODE_ENV === "production") {
      // Webhook mode for production
      const webhookPath = `/webhook/${config.TELEGRAM_BOT_TOKEN}`;
      const webhookUrl = `${config.WEBHOOK_URL}${webhookPath}`;
      await bot.telegram.setWebhook(webhookUrl);
      app.use(webhookPath, (req, res) => bot.handleUpdate(req.body, res));
      logger.info(`Webhook set to ${webhookUrl}`);
    } else {
      // Polling mode for development
      await bot.launch();
      logger.info("Bot started polling");
    }

    // Error handlers
    bot.catch((err, ctx) => {
      logger.error("Bot error:", err);
    });

    process.on("unhandledRejection", (error) => {
      logger.error("Unhandled rejection:", error);
    });

    // Enable graceful stop
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));

    // Start Express server
    app.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
