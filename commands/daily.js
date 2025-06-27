const { updateBalance } = require("../utils/currency");
const User = require("../models/User");

function getTodayDateIST() {
    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 5.5); // Convert to IST
    return now.toISOString().split("T")[0];   // Get "YYYY-MM-DD"
}

module.exports = {
    name: "daily",
    async execute(message) {
        const userId = message.author.id;

        let user = await User.findOne({ userId });
        if (!user) {
            user = await User.create({ userId });
        }

        const today = getTodayDateIST();

        if (user.lastDaily === today) {
            return message.reply("⏳ You've already claimed your daily reward today!\nCome back after midnight (IST).");
        }

        // ✅ Grant reward
        const reward = 1000;
        await updateBalance(userId, reward);
        user.lastDaily = today;
        await user.save();

        message.channel.send(`🎉 You claimed your **daily reward** of **${reward.toLocaleString()}** <:indo_cash:1337749441289129994>!`);
    }
};
