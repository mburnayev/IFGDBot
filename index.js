import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.login(process.env.DISCORD_TOKEN);