const Cleaner = require("../classes/Cleaner");

module.exports = {
  name: "!clean",
  description: "Removes messages containing profanity from a Discord text channel.",
  execute(message) {
    message.reply("Cleaning started");
    const cleaner = new Cleaner(message);
    cleaner.start();
  }
};
