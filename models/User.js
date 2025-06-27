const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    inventory: { type: Object, default: {} },
    lastXpReset: { type: Date, default: Date.now },
    dailyXp: { type: Number, default: 0 },
    lastDaily: { type: String, default: null }  // ✅ This line is important
});

module.exports = mongoose.model("User", userSchema);
