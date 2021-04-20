const MessageMock = require("./classes/MessageMock.js");
const ChannelMock = require("./classes/ChannelMock.js");
const Cleaner = require("../src/classes/Cleaner.js");

var assert = require("assert");

const channel = new ChannelMock();
for (let i = 0; i < 100; i++) {
  if (i % 10 == 0) {
    var message = new MessageMock("fuck " + i, channel);
  }
  else {
    var message = new MessageMock("test " + i, channel);
  }
  channel.messages.coll.set(message.id, message);
}
const cleaner = new Cleaner(message);
cleaner.start();