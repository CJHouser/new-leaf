// A bot that deletes old, profane messages from text channels

const ph = require("perf_hooks");
const routines = require("./routines.js");
require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

// The bot begins reacting to events after the ready event completes
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async message => {
  if (!routines.authenticate(message.member.permissionsIn(message.channel))) return;
  if (!routines.validate(message)) return;
  const start = ph.performance.now();
  console.log("Started");
  let messagesToDelete = new Discord.Collection();
  let lastInBatch = message;
  const options = {limit: 100, before: message.id};
  while (lastInBatch) {
    const messagesToCheck = await message.channel.messages.fetch(options);
    tuple = await routines.clean(lastInBatch);
    lastInBatch = tuple.lastInBatch;
    messagesToDelete = messagesToDelete.concat(tuple.profaneMessages);
  }
  // Bulk deletion only works for messages younger than 14 days
  const deletedMessages = await message.channel.bulkDelete(messagesToDelete, true);
  // Difference returns the messages older than 14 days for one-by-one deletion
  const olderMessagesToDelete = deletedMessages.difference(messagesToDelete);
  console.log(deletedMessages.size);
  console.log(olderMessagesToDelete.size)
  olderMessagesToDelete.forEach(m => m.delete());
  console.log(`Deleted ${messagesToDelete.size} messages`);
  console.log(`Finished after ${(ph.performance.now() - start)/1000} seconds`);
});

client.login(process.env.DISCORD_TOKEN);

