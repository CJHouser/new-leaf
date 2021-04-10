module.exports = {authorize, clean, validate};

const Filter = require("bad-words");
const filter = new Filter();

/**
 *  Checks if a user has enough guild privileges to execute bot commands
 *  @param {Permissions} permissions Permissions of the sender.
 *  @return {boolean} The user has sufficient privileges.
 */
function authorize(permissions) {
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
 *  Deletes messages containing profanity that are older than a given message
 *  @param {Message} message The message where cleaning begins.
 */
async function clean(message) {
  try {
    message.channel.messages.fetch({limit: 100, before: message.id})
      .then(messages => {
        if (messages.last()) clean(messages.last());
        return messages.filter(m => filter.isProfane(m.content));
      })
      .then(profaneMessages => profaneMessages.forEach(pm => pm.delete()));
  }
  catch (err) {
    console.log(`routines.js: clean() - ${err}`);
  }
}

/**
 *  Checks if a message is a command in a guild text channel
 *  @param {Message} message The message to validate.
 *  @return {boolean} The message is valid.
 */
function validate(message) {
  try {
    const command = message.content === "!clean";
    const textChannel = message.channel.type === "text";
    return command && textChannel;
  }
  catch (err) {
    console.log(`routines.js: validate() - ${err}`);
    return false;
  }
}

