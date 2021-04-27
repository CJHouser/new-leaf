// A bot that deletes old, profane messages from Dicord guild text channels

require("dotenv").config({path: "../.env"});
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// The bot begins reacting to events after the ready event completes
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  if (!client.commands.has(message.content)) return;
  let command = client.commands.get(message.content);
  if (command.authorize(message)) command.execute(message);
});

client.login(process.env.DISCORD_TOKEN);
