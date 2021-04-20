const MessageManagerMock = require("./MessageManagerMock.js");

class ChannelMock {
  static nextChannelID = 0;

  constructor() {
    this.messages = new MessageManagerMock();
    this.id = ChannelMock.nextChannelID++;
  }
}

module.exports = ChannelMock;
