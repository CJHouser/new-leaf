module.exports = {authorize, clean, validate};

const Filter = require("bad-words");
let filter = new Filter();

/**
 * Check if a user has enough guild privileges to execute bot commands
 * @param {Permissions} permissions Permissions of the sender.
 * @return {boolean} The user has sufficient privileges.
 */
function authorize(permissions) {
  try {
    if (!permissions || Object.keys(permissions).length === 0) return false;
    const admin = permissions.has("ADMINISTRATOR");
    const manage_messages = permissions.has("MANAGE_MESSAGES", false);
    const read_message_history = permissions.has("READ_MESSAGE_HISTORY", false);
    return admin || (manage_messages && read_message_history); 
  }
  catch (err) {
    console.log(err);
  }
}
/**
 * Keeps a count of the number of batches running. Only supports one cleanup at
 * a time, globally. Probably need to make a class for some kind of
 * "handleRequest" objects. Or find a better way of doing this altogether.
*/
var count = 0;
/**
 * Remove messages from a text channel that are older than a given message and
 * contain profanity
 * @param {Message} precedingMsg The message directly preceding the next batch.
 */
async function clean(precedingMsg) {
  if (!precedingMsg || Object.keys(precedingMsg).length === 0) return null;
  try {
    count++;
    const messages = await precedingMsg.channel.messages.fetch(
      {limit: 100, before: precedingMsg.id}
    );
    clean(messages.last());
    messages.filter(m => filter.isProfane(m.content)).forEach(m => m.delete());
    if (--count == 0) {
      console.log("Finished");
      precedingMsg.channel.send("Finished");
    }
  }
  catch (err) {
    console.log(err);
  }
}

/**
 * Check if a message is a command in a guild text channel
 * @param {Message} message The message to validate.
 * @return {boolean} The message is valid.
 */
function validate(message) {
  try {
    if (!message || Object.keys(message).length === 0) return false;
    const command = message.content === "!clean";
    const textChannel = message.channel.type === "text";
    return command && textChannel;
  }
  catch (err) {
    console.log(err);
  }
}
