module.exports = {authenticate, clean, validate};

const Filter = require("bad-words");
const filter = new Filter();

/**
 *  Checks if a user has enough guild privileges to execute bot commands.
 *  @param {Permissions} permissions Permissions of the sender.
 *  @return {boolean} The user has sufficient privileges.
 */
function authenticate(permissions) {
  try {
    const admin = permissions.has("ADMINISTRATOR");
    const manage_messages = permissions.has("MANAGE_MESSAGES", false);
    const read_message_history = permissions.has("READ_MESSAGE_HISTORY", false);
    return admin || (manage_messages && read_message_history); 
  }
  catch (err) {
    console.log(`routines.js: authenticate() - ${err}`);
    return false;
  }
}

/**
 *  Deletes messages containing profanity from a channel
 *  @param {Message} message The message where cleaning begins.
 *  @return {Collection(Message), Message} The last cleaned message in the batch.
 */
async function clean(message) {
  try {
    const options = {limit: 100, before: message.id};
    const messages = await message.channel.messages.fetch(options);
    const profaneMessages = messages.filter(m => filter.isProfane(m.content));
    return {profaneMessages: profaneMessages, lastInBatch: messages.last()};
  }
  catch(err) {
    console.log(`routines.js: clean() - ${err}`);
    return null;
  }
}

/**
 *  Checks if a message is a command in a guild text channel
 *  @param {Message} message The message to validate.
 *  @return {boolean} The message is valid.
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

