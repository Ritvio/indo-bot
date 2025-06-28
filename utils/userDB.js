const User = require("../models/User");

// ✅ Helper: Get or create user
async function getUser(userId) {
  let user = await User.findOne({ userId });
  if (!user) user = await User.create({ userId });
  return user;
}

// ✅ BALANCE
async function getBalance(userId) {
  const user = await getUser(userId);
  return user.balance;
}

async function updateBalance(userId, amount) {
  await User.updateOne(
    { userId },
    { $inc: { balance: amount } },
    { upsert: true }
  );
}

// ✅ XP & LEVEL
async function getXP(userId) {
  const user = await getUser(userId);
  return { xp: user.xp, level: user.level, dailyXp: user.dailyXp };
}

async function updateXP(userId, amount) {
  const user = await getUser(userId);

  const now = Date.now();
  const oneDay = 86400000;

  if (!user.lastXpReset || now - user.lastXpReset >= oneDay) {
    user.dailyXp = 0;
    user.lastXpReset = new Date();
  }

  if (user.dailyXp < 5000) {
    user.xp += amount;
    user.dailyXp += amount;

    let requiredXp = 5000 + user.level * 1000;
    while (user.xp >= requiredXp) {
      user.xp -= requiredXp;
      user.level += 1;
      requiredXp = 5000 + user.level * 1000;
    }

    await user.save(); // okay here due to level logic
  }
}

// ✅ INVENTORY
async function getInventory(userId) {
  const user = await getUser(userId);
  const inv = {};
  for (let [item, qty] of user.inventory.entries()) {
    if (qty > 0) inv[item] = qty;
  }
  return inv;
}

async function setInventory(userId, items) {
  const filtered = {};
  for (let item in items) {
    if (items[item] > 0) filtered[`inventory.${item}`] = items[item];
    else filtered[`inventory.${item}`] = 0;
  }

  await User.updateOne(
    { userId },
    { $set: filtered },
    { upsert: true }
  );
}

// ✅ DAILY
async function hasClaimedDaily(userId, todayStr) {
  const user = await getUser(userId);
  return user.lastDaily === todayStr;
}

async function setClaimedDaily(userId, todayStr) {
  await User.updateOne({ userId }, { $set: { lastDaily: todayStr } });
}

module.exports = {
  getUser,
  getBalance,
  updateBalance,
  getXP,
  updateXP,
  getInventory,
  setInventory,
  hasClaimedDaily,
  setClaimedDaily,
};
