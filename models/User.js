const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  dailyXp: { type: Number, default: 0 },
  lastXpReset: { type: Date, default: Date.now },
  lastDaily: { type: String }, // YYYY-MM-DD
  inventory: { type: Map, of: Number, default: {} },
});

module.exports = mongoose.model("User", userSchema);
