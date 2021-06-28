const Cleaner = require("../classes/Cleaner");
const parse = require("minimist");

let parseConfig = {
  boolean: ["blocks", "links", "quotes"],
  alias: {b: "blocks", q: "quotes", l: "links"}
};

module.exports = {
  name: "!clean",
  description: "Removes messages containing profanity from a Discord text channel.",
  async execute(message) {
    let args = parse(message.content.split(' ').slice(1), parseConfig);
    if (args && Object.keys(args).length == parseConfig.boolean.length + Object.keys(parseConfig.alias).length + 1) {
      const cleaner = new Cleaner(message, args)
      message.reply("Cleaning started.");
      await cleaner.start();
      message.reply("Cleaning finished.");
    }
    else {
      message.reply("Git gud.");
    }
  },
  authorize(message) {
    const permissions = message.member.permissionsIn(message.channel);
    return permissions.has(["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"], true);
  },
};
