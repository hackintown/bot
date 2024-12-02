const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  username: {
    type: String,
    sparse: true,
  },
  email: {
    type: String,
    sparse: true,
  },
  hasJoinedChannel: {
    type: Boolean,
    default: false,
  },
  spinsRemaining: {
    type: Number,
    default: 3,
  },
  totalWinnings: {
    type: Number,
    default: 0,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  inviteCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
