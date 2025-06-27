const { updateBalance } = require("../utils/currency");
const User = require("../models/User");

module.exports = {
    name: "daily",
    async execute(message) {
        const userId = message.author.id;

        let user = await User.findOne({ userId });
        if (!user) {
            user = await User.create({ userId });
        }

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (user.lastDaily && now - user.lastDaily < oneDay) {
            const nextClaim = new Date(user.lastDaily + oneDay);
            return message.reply(`⏳ You already claimed your daily reward!\nCome back <t:${Math.floor(nextClaim / 1000)}:R>.`);
        }

        // Grant reward
        const reward = 1000;
        await updateBalance(userId, reward);
        user.lastDaily = now;
        await user.save();

        message.channel.send(`🎉 You claimed your **daily reward** of **${reward.toLocaleString()}** <:indo_cash:1337749441289129994>!`);
    }
};
