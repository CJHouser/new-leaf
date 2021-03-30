//A bot that deletes old, profane messages from text channels

require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const Filter = require("bad-words");
const filter = new Filter();

// Begin reacting to events after the ready event
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async message => {
  // Ignore non-command messages and messages heard outside guild text channels
  if (message.channel.type != "text") {return;}
  if (message.content != "!clean") {return;}

  // Check message history for profanity
  var last = message;
  while (last) {
    var messages = await message.channel.messages.fetch(
      {limit: 100, before: last.id}
    );
    messages.map(m => {filter.isProfane(m.content) &&  m.delete();});
    last = messages.last();
  }
});

client.login(process.env.DISCORD_TOKEN);

