const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    dailyXp: { type: Number, default: 0 },
    lastXpReset: { type: Number, default: Date.now },
    inventory: {
        lootbox: { type: Number, default: 0 },
        // Add more items as needed
    },
    // Add other fields like scraps, autominer, etc. later
});

module.exports = mongoose.model("User", userSchema);
