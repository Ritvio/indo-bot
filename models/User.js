const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    dailyXp: { type: Number, default: 0 },
    lastXpReset: { type: Number, default: Date.now },
    balance: { type: Number, default: 0 },
    inventory: {
        lootbox: { type: Number, default: 0 },
        // add more items later
    },
    // add autominer, scraps, etc. later
});

module.exports = mongoose.model("User", userSchema);
