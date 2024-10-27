/*
    @author: @Misha Burnayev
    @description: Intrusive Family Guy Discord Bot (IFGDBot)

    Holy tome of consultation if something that should work isn't working:
    https://discord.com/developers/docs/events/gateway#list-of-intents

    Holy tome of consultation if you have run into an impossible error:
    https://openbible.com/textfiles/kjv.txt
*/

// Imports
const fs = require("fs");
const { Client, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");

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
const filesPath = "./assets/sounds/";
var filesList = [];
fs.readdir(filesPath, { withFileTypes: true }, (err, item) => {
    filesList.push(item);
});
var peterStatus = false;
var vcConnection = null;
var audioPlayer = null;
var audioResource = null;

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
    const USER_LEFT = !newState.channel;
    const USER_JOINED = !oldState.channel;
    const USER_MOVED = (newState.channel?.id !== oldState.channel?.id) && !USER_JOINED && !USER_LEFT;

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
            console.log("made it here");
            audioPlayer = createAudioPlayer();
            vcConnection.subscribe(audioPlayer);
            selectResource = filesList[Math.floor(Math.random() * (filesList.length - 1 + 1)) + 1];
            console.log(filesPath + selectResource);
            audioResource = createAudioResource(filesPath + selectResource);
            audioPlayer.play(audioResource);
            console.log("made it here x2");
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
            audioPlayer.stop();
            audioPlayer = null;
        }
    }
})

client.login(process.env.DISCORD_TOKEN);