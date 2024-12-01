require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Make sure the URL uses HTTPS and port 443 (default for HTTPS)
const webhookUrl = "https://hackintown-bots.vercel.app/api/webhook";

bot.telegram
  .setWebhook(webhookUrl)
  .then((success) => {
    console.log(`Webhook successfully set to ${webhookUrl}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to set webhook:", error);
    process.exit(1);
  });
