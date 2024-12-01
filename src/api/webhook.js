const { createServer } = require("http");
const { Telegraf } = require("telegraf");
const connectDB = require("../config/db");
const bot = require("../bot");

// Connect to MongoDB
connectDB();

// Create webhook endpoint
const app = createServer(async (req, res) => {
  if (req.method === "POST") {
    const { body } = req;
    await bot.handleUpdate(body);
    res.end("OK");
  } else {
    res.end("Listening to bot webhook!");
  }
});

// Set webhook
bot.telegram.setWebhook(process.env.WEBHOOK_URL).catch(console.error);

module.exports = app;
