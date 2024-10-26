/*
    @author: @Misha Burnayev
    @description: Intrusive Family Guy Discord Bot (IFGDBot)
    @version: 0.1.0

    Holy tome of consultation if something that should work isn't working:
    https://discord.com/developers/docs/events/gateway#list-of-intents

    Holy tome of consultation if you have run into an impossible error:
    https://openbible.com/textfiles/kjv.txt
*/

// Imports
const { Client, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

// Initialize environment variables and sets commands
require("dotenv").config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});
var peterStatus = false;
var vcConnection = null;
// var currChannel = null;

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
    console.log("voiceStateUpdate event triggered");
    // if ((newState.channelId && oldState.channelId !== newState.channelId) && vcConnection == null) {
    //     // Join a VC if a user joined one and the bot isn't already in one
    //     currChannel = newState.guild.channels.cache.get(newState.channelId);
    //     var members = currChannel.members;
    //     if (members.size > 0 && peterStatus == true) {
    //         vcConnection = joinVoiceChannel({
    //             channelId: currChannel.id,
    //             guildId: currChannel.guild.id,
    //             adapterCreator: currChannel.guild.voiceAdapterCreator,
    //             selfDeaf: false
    //         });
    //     }
    // }
    // // Disconnect from vc if the bot is the only one left in the vc
    // else if ((newState.channelId && oldState.channelId !== newState.channelId) && vcConnection != null) {
    //     var members = currChannel.members;
    //     // console.log("members: ", members);
    //     if (members.size == 1 && peterStatus == true) {
    //         vcConnection.disconnect();
    //         vcConnection = null;
    //     }
    // }
    // console.log("members.size: ", members.size);
    const USER_LEFT = !newState.channel;
    const USER_JOINED = !oldState.channel;
    const USER_MOVED = (newState.channel?.id !== oldState.channel?.id) && (!USER_JOINED);

    if (USER_JOINED && (peterStatus == true) && (vcConnection === null)) {
        var currChannel = newState.guild.channels.cache.get(newState.channelId);
        var members = currChannel.members;
        if (members.size > 0) {
            vcConnection = joinVoiceChannel({
                channelId: currChannel.id,
                guildId: currChannel.guild.id,
                adapterCreator: currChannel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
        }
    }
    else if (USER_MOVED && (peterStatus == true) && (vcConnection !== null)) {
        var channel = oldState.guild.channels.cache.get(oldState.channelId);
        var members = channel.members;
        if (members.size == 1) {
            vcConnection.disconnect();
            vcConnection = null;
        }
        channel = newState.guild.channels.cache.get(newState.channelId);
        members = channel.members;
        if (members.size > 0) {
            vcConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
        }
    }
    else if (USER_LEFT && (vcConnection !== null)) {
        var currChannel = oldState.guild.channels.cache.get(oldState.channelId);
        var members = currChannel.members;
        if (members.size == 1) {
            vcConnection.disconnect();
            vcConnection = null;
        }
    }
})

client.login(process.env.DISCORD_TOKEN);