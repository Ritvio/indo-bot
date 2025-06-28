const { getUserData, setUserData, updateBalance } = require("../utils/userDB");

function getTodayDateIST() {
    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 5.5); // Convert to IST
    return now.toISOString().split("T")[0];   // Get "YYYY-MM-DD"
}

module.exports = {
    name: "daily",
    async execute(message) {
        const userId = message.author.id;
        const user = await getUserData(userId);
        const today = getTodayDateIST();

        if (user.lastDaily === today) {
            return message.reply("⏳ You've already claimed your daily reward today!\nCome back after midnight (IST).");
        }

        const reward = 1000;
        await updateBalance(userId, reward);
        user.lastDaily = today;
        await setUserData(userId, user);

        message.channel.send(`🎉 You claimed your **daily reward** of **${reward.toLocaleString()}** <:indo_cash:1337749441289129994>!`);
    }
};
