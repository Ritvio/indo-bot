const { getBalance } = require("../utils/userDB");

module.exports = {
    name: "cash",
    async execute(message) {
        const userId = message.author.id;
        const balance = await getBalance(userId);
        message.channel.send(`**${message.member.displayName}**, you currently have **__${balance.toLocaleString("en-US")}__** <:indo_cash:1337749441289129994>`);
    }
};
