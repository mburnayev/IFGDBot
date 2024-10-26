// Imports
const { Client, GatewayIntentBits, SlashCommandBuilder, ChannelType } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

// Initialize environment variables and sets commands
require("dotenv").config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
var peterStatus = false;
var vcConnection = null;

client.on("ready", (message) => {
    const pOn = new SlashCommandBuilder().setName("peter_on").setDescription("Turns Intrusive Family Guy on");
    const pOff = new SlashCommandBuilder().setName("peter_off").setDescription("Turns Intrusive Family Guy off");
    client.application.commands.create(pOn);
    client.application.commands.create(pOff);

    client.user.setStatus("thinking bubble");
    console.log(`${message.user.tag} is ready!`);
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

client.on("voiceStateUpdate", (oldState, newState) => {
    console.log("event listener triggered");
    if (newState.channelId && oldState.channelId !== newState.channelId) {
        // Join a voice channel if a user joined one and the bot isn't already in one
        if (vcConnection == null) {
            // User joined a voice channel
            const channel = newState.guild.channels.cache.get(newState.channelId);
            const members = channel.members;
            if (members.size > 0 && peterStatus == true) {
                console.log("joining voice channel");
                vcConnection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: false
                });
            }
        }
        // If the bot is already in a voice channel, dc if there are no users remaining
        else {
            if (members.size == 0) {
                console.log("disconnecting from voice channel");
                vcConnection.disconnect();
                vcConnection = null;
            }
        }
    }
})

client.login(process.env.DISCORD_TOKEN);