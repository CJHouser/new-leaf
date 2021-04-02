const Filter = require("bad-words");
const filter = new Filter();

/**
 * Checks if a message is a command in a guild text channel
 * @param {Discord.Message} message Message object to validate.
 * @return {boolean} The message is valid.
 */
function validate(message) {
  try {
    const isTextChannel = message.channel.type === "text";
    const isCommand = message.content === "!clean";
    return isTextChannel && isCommand;
  }
  catch(err) {
    console.log(`routines.js: validate() - ${err}`);
    return false;
  }
}

/**
 * Deletes messages containing profanity from a channel
 * @param {Discord.Message} delimitingMessage The Message object where cleaning begins.
 * @return {Discord.Message} The last cleaned Message object in the batch.
 */
async function clean(delimitingMessage) {
  try {
    const options = {limit: 100, before: delimitingMessage.id};
    const messages = await delimitingMessage.channel.messages.fetch(options);
    messages.map(m => {filter.isProfane(m.content) &&  m.delete();});
    return messages.last();
  }
  catch(err) {
    console.log(`routines.js: clean() - ${err}`);
    return null;
  }
}

module.exports = {validate, clean};
