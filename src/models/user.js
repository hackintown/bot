const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String },
  hasJoinedChannel: { type: Boolean, default: false },
  spinCount: { type: Number, default: 3 },
  totalEarned: { type: Number, default: 0 },
  wallet: { type: Number, default: 0 },
  referredBy: { type: String },
  referralCode: { type: String, unique: true },
  referralCount: { type: Number, default: 0 },
});

// Generate unique referral code before saving
UserSchema.pre("save", function (next) {
  if (!this.referralCode) {
    this.referralCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
