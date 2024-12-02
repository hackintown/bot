const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: String,
  hasJoinedChannel: {
    type: Boolean,
    default: false
  },
  spinsRemaining: {
    type: Number,
    default: 3
  },
  totalWinnings: {
    type: Number,
    default: 0
  },
  wallet: {
    type: Number,
    default: 0
  },
  inviteCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);