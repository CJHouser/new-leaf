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

module.exports = {authorize, validate};
