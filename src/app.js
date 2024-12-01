require("dotenv").config();
const connectDB = require("./config/db");
const bot = require("./bot");

// Connect to MongoDB
connectDB();

// Launch bot
bot.launch().catch((err) => console.error("Bot launch failed:", err));

// Enable graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
