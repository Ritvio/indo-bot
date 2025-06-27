const User = require("../models/User");

async function getBalance(userId) {
    let user = await User.findOne({ userId });
    if (!user) {
        user = await User.create({ userId });
    }
    return user.balance || 0;
}

async function updateBalance(userId, amount) {
    let user = await User.findOne({ userId });

    if (!user) {
        user = await User.create({ userId, balance: amount });
        return;
    }

    const newBalance = (user.balance || 0) + amount;
    user.balance = newBalance;
    await user.save();
}

module.exports = {
    getBalance,
    updateBalance,
};
