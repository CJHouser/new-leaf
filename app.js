// A bot that deletes old, profane messages from text channels

const routines = require("./routines.js");
require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

// The bot begins reacting to events after the ready event completes
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async message => {
  if (!routines.authorize(message.member.permissionsIn(message.channel))) return;
  if (!routines.validate(message)) return;
  routines.clean(message);
});

client.login(process.env.DISCORD_TOKEN);

