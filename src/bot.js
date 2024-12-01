const { Telegraf, Markup } = require("telegraf");
const User = require("./models/user");
const {
  verifyUserInChannel,
  generateSpinResult,
} = require("./services/telegramService");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const telegramId = ctx.from.id;
  const username = ctx.from.username;

  let user = await User.findOne({ telegramId });
  if (!user) {
    user = await User.create({ telegramId, username });
  }

  await ctx.reply(
    "Welcome to Spin and Win! Click the button to play.",
    Markup.inlineKeyboard([
      Markup.button.callback("Start Playing", "START_PLAYING"),
    ])
  );
});

bot.action("START_PLAYING", async (ctx) => {
  await ctx.reply(
    "Join the Telegram channel and get 3 spins for free.",
    Markup.inlineKeyboard([
      Markup.button.url("Join Channel", "https://t.me/hackintown"),
    ])
  );
});

bot.hears("continue", async (ctx) => {
  const telegramId = ctx.from.id;
  const user = await User.findOne({ telegramId });

  if (user && (await verifyUserInChannel(ctx.from.id))) {
    user.hasJoinedChannel = true;
    await user.save();
    await ctx.reply(
      "You’re verified! Let’s start spinning!",
      Markup.button.callback("Spin the Wheel", "SPIN_WHEEL")
    );
  } else {
    await ctx.reply("Please join the channel first to continue.");
  }
});

bot.action("SPIN_WHEEL", async (ctx) => {
  const user = await User.findOne({ telegramId: ctx.from.id });

  if (user.spinCount > 0) {
    const spinResult = generateSpinResult();
    user.spinCount -= 1;
    user.totalEarned += spinResult;
    await user.save();

    await ctx.reply(`🎉 You won ₹${spinResult}! Spins left: ${user.spinCount}`);
    if (user.spinCount === 0) {
      await ctx.reply(
        "Please invite friends to get more spins and withdraw ₹100."
      );
    }
  } else {
    await ctx.reply("No spins left. Invite friends to earn more spins!");
  }
});

bot.launch();
