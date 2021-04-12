// A bot that deletes old, profane messages from Dicord guild text channels

const Routines = require("./routines.js");
const Cleaner = require("./Cleaner.js");

require("dotenv").config({path: "../.env"});
const Discord = require("discord.js");
const client = new Discord.Client();

// The bot begins reacting to events after the ready event completes
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  if (!Routines.authorize(message.member.permissionsIn(message.channel))) return;
  if (!Routines.validate(message)) return;
  console.log("Cleaning started");
  initialMessage.channel.send("Cleaning started");
  new Cleaner(message);
});

client.login(process.env.DISCORD_TOKEN);
