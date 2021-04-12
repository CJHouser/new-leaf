module.exports = {
  name: "!coinflip",
  description: "Fifty-fifty.",
  execute(message) {
    if (Math.random() < 0.5) message.reply("Heads!");
    else message.reply("Tails!");
  }
};
