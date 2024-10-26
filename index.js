// Imports
const { Client, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");

// Initialize environment variables and sets commands
require("dotenv").config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
var peterStatus = false;

client.on("ready", (c) => {
    const pOn = new SlashCommandBuilder().setName("peter_on").setDescription("Turns Peter on");
    const pOff = new SlashCommandBuilder().setName("peter_off").setDescription("Turns Peter off");
    client.application.commands.create(pOn);
    client.application.commands.create(pOff);

    client.user.setStatus("thinking bubble");
    console.log(`${c.user.tag} is ready!`);
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "peter_on") {
        peterStatus = true;
        await interaction.reply("You've made a grave mistake...");
    } else if (interaction.commandName === "peter_off") {
        peterStatus = false;
        await interaction.reply("Retep will be back...");
    }
})

client.login(process.env.DISCORD_TOKEN);