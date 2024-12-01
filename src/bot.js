const { Telegraf, Markup } = require("telegraf");
const User = require("./models/user");
const {
  verifyUserInChannel,
  generateSpinResult,
} = require("./services/telegramService");
const { createSpinWheel } = require("./services/wheelService");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const telegramId = ctx.from.id;
  const username = ctx.from.username;
  const referralCode = ctx.message.text.split(" ")[1];

  let user = await User.findOne({ telegramId });

  if (!user) {
    user = await User.create({ telegramId, username });

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        user.referredBy = referrer.telegramId;
        referrer.wallet += 10;
        referrer.referralCount += 1;
        await referrer.save();
        await ctx.telegram.sendMessage(
          referrer.telegramId,
          `🎉 New referral! You earned ₹10!`
        );
      }
    }
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
  try {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (user && (await verifyUserInChannel(ctx.from.id))) {
      user.hasJoinedChannel = true;
      await user.save();
      await ctx.reply(
        "You're verified! Let's start spinning!",
        Markup.inlineKeyboard([
          [Markup.button.callback("Spin the Wheel", "SPIN_WHEEL")],
        ])
      );
    } else {
      await ctx.reply("Please join the channel first to continue.");
    }
  } catch (error) {
    console.error("Continue command error:", error);
    await ctx.reply("Sorry, something went wrong. Please try again later.");
  }
});

bot.action("SPIN_WHEEL", async (ctx) => {
  const user = await User.findOne({ telegramId: ctx.from.id });

  if (user.spinCount > 0) {
    const spinResult = generateSpinResult(user.spinCount);
    user.spinCount -= 1;
    user.totalEarned += spinResult;
    await user.save();

    const wheelMessage = await createSpinWheel(spinResult);
    await ctx.reply(wheelMessage);
    await ctx.reply(
      `🎉 You won ₹${spinResult}!\nSpins left: ${user.spinCount}\nTotal earned: ₹${user.totalEarned}`
    );

    if (user.spinCount === 0) {
      await ctx.reply(
        "🎯 Invite friends to get more spins and earn ₹100 to withdraw!",
        Markup.inlineKeyboard([
          Markup.button.callback("Get Referral Link", "GET_REFERRAL"),
        ])
      );
    }
  } else {
    await ctx.reply("No spins left. Invite friends to earn more spins!");
  }
});

bot.action("WITHDRAW", async (ctx) => {
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (user && user.wallet >= 100) {
    // Implement withdrawal logic here
    await ctx.reply("Please enter your UPI ID to receive payment:");
    // Set user state to await UPI input
  } else {
    await ctx.reply(
      "You need ₹100 to withdraw. Keep playing and referring friends!"
    );
  }
});

bot.command("balance", async (ctx) => {
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (user) {
    await ctx.reply(
      `💰 Your Balance:\nWallet: ₹${user.wallet}\nTotal Earned: ₹${user.totalEarned}`
    );

    if (user.wallet >= 100) {
      await ctx.reply(
        "You can now withdraw your earnings!",
        Markup.inlineKeyboard([
          Markup.button.callback("Withdraw ₹100", "WITHDRAW"),
        ])
      );
    }
  }
});

bot.command("refer", async (ctx) => {
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (user) {
    const botUsername = ctx.botInfo.username;
    const referralLink = `https://t.me/${botUsername}?start=${user.referralCode}`;
    await ctx.reply(
      `🎁 Share your referral link with friends:\n${referralLink}\n\nYou'll earn ₹10 for each friend who joins!`
    );
  }
});

// Remove or comment out the bot.launch() at the bottom
// bot.launch();

// Export the bot instance
module.exports = bot;
