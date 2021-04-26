const { Collection } = require("discord.js");

class MessageManagerMock {
  constructor() {
    this.lastIndex = 0;
    this.coll = new Collection();
  }

  async fetch(options) {
    this.lastIndex += options.limit;
    return new Collection(Array.from(this.coll).slice(this.lastIndex - options.limit, this.lastIndex));
  }
}

module.exports = MessageManagerMock;
