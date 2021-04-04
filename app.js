// A bot that deletes old, profane messages from text channels

const routines = require("./routines.js");
require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const Filter = require("bad-words");
const filter = new Filter();

// The bot begins reacting to events after the ready event completes
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async message => {
  let lastInBatch = message;
  if (!routines.validate(message)) return;
  while (lastInBatch) lastInBatch = await routines.clean(lastInBatch);
});

client.login(process.env.DISCORD_TOKEN);

