require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// MongoDB connection
require('./database/connect')(); // Will create this file next

client.once('ready', () => {
  console.log(`🤖 Indo is online as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
