/**
 * Check if a user has enough guild privileges to execute bot commands
 * @param {Permissions} permissions Permissions of the sender.
 * @return {boolean} The user has sufficient privileges.
 */
function authorize(permissions) {
  if (badObject(permissions)) return false;
  const admin = permissions.has("ADMINISTRATOR");
  const manage_messages = permissions.has("MANAGE_MESSAGES", false);
  const read_message_history = permissions.has("READ_MESSAGE_HISTORY", false);
  return admin || (manage_messages && read_message_history); 
}

/**
 * Check if a message is a command in a guild text channel
 * @param {Message} message The message to validate.
 * @return {boolean} The message is valid.
 */
function validate(message) {
  if (badObject(message)) return false;
  return message.channel.type === "text";
}

function badObject(object) {
  return !object || Object.keys(object).length === 0;
}

module.exports = {authorize, badObject, validate};
