const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String },
  hasJoinedChannel: { type: Boolean, default: false },
  spinCount: { type: Number, default: 3 },
  totalEarned: { type: Number, default: 0 },
  wallet: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
