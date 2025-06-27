const User = require("../models/User");

async function getUserData(userId) {
    try {
        let user = await User.findOne({ userId });
        if (!user) {
            user = await User.create({ userId });
        }
        return user;
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
        return null;
    }
}

async function setUserData(userId, newData) {
    try {
        await User.updateOne({ userId }, { $set: newData }, { upsert: true });
    } catch (error) {
        console.error("❌ Error saving user data:", error);
    }
}

module.exports = {
    getUserData,
    setUserData,
};
