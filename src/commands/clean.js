const Cleaner = require("../classes/Cleaner");

module.exports = {
  name: "!clean",
  description: "Removes messages containing profanity from a Discord text channel.",
  async execute(message) {
    message.reply("Cleaning started.");
    const cleaner = new Cleaner(message);
    await cleaner.start();
    message.reply("Cleaning finished.");
  },
  authorize(message) {
    const permissions = message.member.permissionsIn(message.channel);
    // The second parameter of .has() allows admin privileges to override
    const manage_messages = permissions.has("MANAGE_MESSAGES", true);
    const read_message_history = permissions.has("READ_MESSAGE_HISTORY", true);
    return manage_messages && read_message_history;
  }
};
