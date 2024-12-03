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
      res
        .status(200)
        .json({ status: "ok", message: "Telegram bot is running!" });
    });

    const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

    // Command handlers
    bot.command("start", (ctx) => handleStart(ctx));
    bot.on("callback_query", (ctx) => handleCallback(ctx));

    // Initialize bot based on environment
    let botInstance = null;

    if (config.NODE_ENV === "production") {
      // Webhook mode for production
      const webhookPath = `/webhook/${config.TELEGRAM_BOT_TOKEN}`;
      const webhookUrl = `${config.WEBHOOK_URL}${webhookPath}`;

      await bot.telegram.setWebhook(webhookUrl);
      app.use(webhookPath, (req, res) => bot.handleUpdate(req.body, res));
      logger.info(`Webhook set to ${webhookUrl}`);
    } else {
      // Polling mode for development
      botInstance = await bot.launch();
      logger.info("Bot started in polling mode");
    }

    // Error handlers
    bot.catch((err, ctx) => {
      logger.error("Bot error:", err);
    });

    process.on("unhandledRejection", (error) => {
      logger.error("Unhandled rejection:", error);
    });

    // Enable graceful stop
    process.once("SIGINT", async () => {
      logger.info("SIGINT received. Shutting down gracefully...");
      if (config.NODE_ENV === "production") {
        await bot.telegram.deleteWebhook();
      } else if (botInstance) {
        await bot.stop();
      }
      process.exit(0);
    });

    process.once("SIGTERM", async () => {
      logger.info("SIGTERM received. Shutting down gracefully...");
      if (config.NODE_ENV === "production") {
        await bot.telegram.deleteWebhook();
      } else if (botInstance) {
        await bot.stop();
      }
      process.exit(0);
    });

    // Start Express server
    const PORT =
      config.NODE_ENV === "production" ? process.env.PORT || 3000 : 3000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
