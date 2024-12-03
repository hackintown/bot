const { Telegraf } = require("telegraf");
const connectDB = require("../config/db");
const bot = require("../bot");
const logger = require("../utils/logger");

// Connect to MongoDB
connectDB();

// Set webhook
bot.telegram.setWebhook(process.env.WEBHOOK_URL).catch(console.error);

module.exports = async (req, res) => {
  try {
    if (req.method === "POST") {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } else {
      res.status(200).json({ status: "ok", message: "Webhook is active" });
    }
  } catch (error) {
    logger.error("Webhook error:", error);
    res.status(500).json({ error: "Failed to process update" });
  }
};
