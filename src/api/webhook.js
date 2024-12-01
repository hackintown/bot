const { Telegraf } = require("telegraf");
const connectDB = require("../config/db");
const bot = require("../bot");

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
      res.status(200).send("Listening to bot webhook!");
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Failed to process update" });
  }
};
