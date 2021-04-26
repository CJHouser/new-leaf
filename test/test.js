const MessageMock = require("./mocks/MessageMock.js");
const ChannelMock = require("./mocks/ChannelMock.js");
const Cleaner = require("../src/classes/Cleaner.js");

let assert = require("assert");

// Retrieves messages marked as deleted
function getDeleted(chan) {
  return chan.messages.coll.filter(m => m.deleted);
}

// Populate a mock channel with messages containing a set number of profanity
const historySize = 111;
const profaneDistribution = 10;
const numberOfProfaneMessages = Math.ceil(historySize / profaneDistribution);
let channel = new ChannelMock();
{
  let message = new MessageMock("!clean", channel);
  channel.messages.coll.set(message.id, message);
}
for (let i = 0; i < historySize; i++) {
  let content = (i % profaneDistribution == 0) ? "fuck " + i : "test " + i;
  let message = new MessageMock(content, channel);
  channel.messages.coll.set(message.id, message);
}
const cleaner = new Cleaner(channel.messages.coll.first());

// Reset the static IDs tied to each class before each test
beforeEach(() => {
  channel.messages.lastIndex = 0;
  channel.messages.coll.map(m => m.deleted = false);
});
