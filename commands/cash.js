const { getBalance } = require("../utils/currency");

module.exports = {
    name: "cash",
    async execute(message) {
        const userId = message.author.id;
        const balance = await getBalance(userId); // Await MongoDB fetch
        message.channel.send(
            `**${message.member.displayName}**, you currently have **__${balance.toLocaleString("en-US")}__** <:indo_cash:1337749441289129994>`
        );
    }
};
