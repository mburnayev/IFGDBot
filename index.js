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
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");

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
const filesList = fs.readdirSync(filesPath);

var peterStatus = false;
var vcConnection = null;
const audioPlayer = createAudioPlayer();
var audioResource = null;

function initConnection(channel) {
    vcConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false
    });
}

function terminateConnection() {
    audioPlayer.stop();
    audioResource = null;
    vcConnection.disconnect();
    vcConnection = null;
}

function subscribePlayer() {
    vcSubscription = vcConnection.subscribe(audioPlayer);
}

function playSFX() {
    var selectResource = filesList[Math.floor(Math.random() * filesList.length)];
    audioResource = createAudioResource(filesPath + selectResource);
    try {
        audioPlayer.play(audioResource);
    } catch (error) {
        console.log("Failed to play SFX");
    }
}

client.on("ready", (message) => {
    const pOn = new SlashCommandBuilder().setName("peter_on").setDescription("Turns Intrusive Family Guy on");
    const pOff = new SlashCommandBuilder().setName("peter_off").setDescription("Turns Intrusive Family Guy off");
    const pPing = new SlashCommandBuilder().setName("peter_ping").setDescription("Pings Intrusive Family Guy");
    client.application.commands.create(pOn);
    client.application.commands.create(pOff);
    client.application.commands.create(pPing);

    console.log(`${message.user.tag} is ready!`);
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "peter_on") {
        peterStatus = true;
        await interaction.reply("You've made a grave mistake...");
    }
    else if (interaction.commandName === "peter_off") {
        peterStatus = false;
        if (vcConnection !== null) {
            terminateConnection();
        }
        await interaction.reply("Retep will be back...");
    }
    else if (interaction.commandName === "peter_ping") {
        await interaction.reply("nyehehe!");
    }
})

client.on("voiceStateUpdate", (oldState, newState) => {
    const USER_LEFT = !newState.channel;
    const USER_JOINED = !oldState.channel;
    const USER_MOVED = (newState.channel?.id !== oldState.channel?.id) && !USER_JOINED && !USER_LEFT;

    // If user joined and IFGDB hasn't spoken yet or user moved and IFGDB already spoke and DC'd, connect and play SFX
    if ((USER_JOINED && (peterStatus == true) && (vcConnection === null)) || (USER_MOVED && (peterStatus == true) && (vcConnection === null))) {
        var currChannel = newState.guild.channels.cache.get(newState.channelId);
        var members = currChannel.members;
        if (members.size > 0) {
            initConnection(currChannel);
            subscribePlayer();
            playSFX();
        }
    }
    // User switching while SFX playing is just disconnect and connect stitched together
    else if (USER_MOVED && (peterStatus == true) && (vcConnection !== null)) {
        var channel = oldState.guild.channels.cache.get(oldState.channelId);
        var members = channel.members;
        if (members.size == 1) {
            terminateConnection();
        }
        channel = newState.guild.channels.cache.get(newState.channelId);
        members = channel.members;
        if (members.size > 0) {
            initConnection(channel);
            subscribePlayer();
            playSFX();
        }
    }
    // If user leaves, IFGDB leaves as well
    else if (USER_LEFT && (vcConnection !== null)) {
        var currChannel = oldState.guild.channels.cache.get(oldState.channelId);
        var members = currChannel.members;
        if (members.size == 1) {
            terminateConnection();
        }
    }
})

audioPlayer.on("stateChange", (oldState, newState) => {
    // If audio player finishes playing SFX, disconnect
    if (newState.status === AudioPlayerStatus.Idle) {
        terminateConnection();
    }
})

client.login(process.env.DISCORD_TOKEN);
