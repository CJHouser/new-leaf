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
  authorize(member) {
    const permissions = member.permissionsIn(message.channel);
    const admin = permissions.has("ADMINISTRATOR");
    const manage_messages = permissions.has("MANAGE_MESSAGES", false);
    const read_message_history = permissions.has("READ_MESSAGE_HISTORY", false);
    return admin || (manage_messages && read_message_history);
  }
};
