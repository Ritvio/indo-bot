require("dotenv").config();
const { Client, GatewayIntentBits, ActivityType, Collection, EmbedBuilder, PermissionsBitField } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { getUserData, setUserData } = require("./utils/userdata.js");
const currency = require("./utils/currency.js");
const connectDB = require("./database/connect");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
    ],
});

// ✅ Connect to MongoDB
connectDB();

// ✅ Load Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`✅ Loaded command: ${command.name}`);
}

// 🔹 Prefix Handling
const prefixFile = "prefix.json";
const defaultPrefix = "I";

function getPrefix(guildId) {
    if (fs.existsSync(prefixFile)) {
        const prefixes = JSON.parse(fs.readFileSync(prefixFile, "utf8"));
        return prefixes[guildId] || defaultPrefix;
    }
    return defaultPrefix;
}

// 📢 Bot Ready
client.on("ready", () => {
    console.log(`🚀 Indo is online as ${client.user.tag}`);

    const updateStatus = () => {
        client.user.setPresence({
            activities: [{
                name: `with ${client.guilds.cache.size} servers!`,
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/indobotplays",
            }],
            status: "online",
        });
    };

    updateStatus();
    setInterval(updateStatus, 5 * 60 * 1000);
});

// 📩 Message Command Handler
client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const guildId = message.guild.id;
    const prefix = getPrefix(guildId);
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = client.commands.get(commandName);
    if (!command) return;

    // ✅ XP & Leveling System
    const userId = message.author.id;
    let userData = await getUserData(userId);
    if (!userData) return;

    if (!userData.xp) userData.xp = 0;
    if (!userData.level) userData.level = 1;
    if (!userData.dailyXp) userData.dailyXp = 0;
    if (!userData.lastXpReset) userData.lastXpReset = Date.now();

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - userData.lastXpReset >= oneDay) {
        userData.dailyXp = 0;
        userData.lastXpReset = now;
    }

    if (userData.dailyXp < 5000) {
        userData.xp += 3;
        userData.dailyXp += 3;
    }

    let level = userData.level;
    let requiredXp = 5000 + level * 1000;

    let leveledUp = false;
    let lootboxes = 0;
    let cashReward = 0;

    while (userData.xp >= requiredXp) {
        userData.xp -= requiredXp;
        userData.level += 1;
        level = userData.level;
        requiredXp = 5000 + level * 1000;
        leveledUp = true;

        lootboxes = level * 2;
        cashReward = level * 10000;
        currency.updateBalance(userId, cashReward);

        if (!userData.inventory) userData.inventory = {};
        userData.inventory.lootbox = (userData.inventory.lootbox || 0) + lootboxes;
    }

    await setUserData(userId, userData);

    if (leveledUp) {
        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("🎉 Level Up!")
            .setDescription(`**${message.author.username}** reached **Level ${level}!**`)
            .addFields({ name: "🏆 Rewards", value: `📦 **${lootboxes} Lootboxes**\n💰 **${cashReward.toLocaleString()} Cash**` })
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }

    command.execute(message, args);
});

// 🔹 Slash Commands
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: "❌ Error executing command.", ephemeral: true });
    }
});

// 🔗 Server Join Logging
const LOG_CHANNEL_ID = "1344243036980510760";

client.on("guildCreate", async (guild) => {
    try {
        const channel = guild.channels.cache.find(ch =>
            ch.isTextBased() &&
            ch.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite)
        );

        if (!channel) return;

        const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
        const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
        if (logChannel) {
            logChannel.send(`✅ Joined: **${guild.name}** (\`${guild.id}\`)\n🔗 Invite: ${invite.url}`);
        }

    } catch (err) {
        console.error(`❌ Error creating invite:`, err);
    }
});

client.login(process.env.TOKEN);
