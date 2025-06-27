const User = require("../models/User");

// All emoji mappings
const ITEM_EMOJIS = {
    stone: "🪨", leaf: "🍃", bone: "🦴", rope: "🪢",
    stick: "<:c_stick:1339239544809193545>", iron: "<:r_iron:1339239659284336814>",
    torch: "<:r_torch:1339239775613227211>", claw: "<:r_claw:1339239885680152597>",
    coin: "<:r_coin:1339240048134062212>", horn: "<:r_horn:1339240130086436927>",
    gold: "<:e_gold:1339240225708314644>", gem: "<:e_gem:1339240264224477265>",
    helmet: "<:e_helmet:1339240288232804362>", ring: "<:e_ring:1339240316322185340>",
    shield: "<:e_shield:1339240343534571621>", crystal: "<:m_crystal:1339240378980892682>",
    orb: "<:m_orb:1339240411184762910>", fang: "<:m_fang:1339240450334265426>",
    charm: "<:m_charm:1339241248480952381>", amulet: "<:m_amulet:1339241607760838708>",
    crown: "<a:l_crown:1339275652196728924>", sword: "<a:l_sword:1339277501335208020>",
    wings: "<:l_wings:1339278101959544862>", necklace: "<:l_necklace:1339439363544842270>",
    totem: "<:l_totem:1339439466305032242>", diamond: "<:d_diamond:1339439557485133966>",
    infinityblade: "<:d_infinityblade:1339439663118815315>", blade: "<:d_blade:1339439753811984394>",
    star: "<:d_star:1339439871525130260>", heart: "<:d_heart:1339439934460923946>"
};

function getItemNameFromEmoji(emoji) {
    return Object.keys(ITEM_EMOJIS).find(key => ITEM_EMOJIS[key] === emoji) || emoji;
}

function getItemEmoji(itemName) {
    return ITEM_EMOJIS[itemName] || itemName;
}

// ✅ Get a user's inventory (item names & quantities)
async function getUserItems(userId) {
    let user = await User.findOne({ userId });
    if (!user) {
        user = await User.create({ userId });
    }

    // Convert from Map to regular object
    const inventory = Object.fromEntries(user.inventory || []);
    return inventory;
}

// ✅ Save or update a user's items
async function setUserItems(userId, items) {
    let user = await User.findOne({ userId });
    if (!user) user = await User.create({ userId });

    const inventory = user.inventory || new Map();

    for (const item in items) {
        const count = items[item];
        if (count === 0) {
            inventory.delete(item);
        } else {
            inventory.set(item, count);
        }
    }

    user.inventory = inventory;
    await user.save();
    console.log(`✅ Saved items for ${userId}`, Object.fromEntries(inventory));
}

module.exports = {
    getUserItems,
    setUserItems,
    getItemNameFromEmoji,
    getItemEmoji
};
