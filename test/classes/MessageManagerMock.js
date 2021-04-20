const { Collection, RichPresenceAssets } = require("discord.js");

class MessageManagerMock {
  constructor() {
    this.last = 0;
    this.coll = new Collection();
  }

  async fetch(options) {
    let array = [];
    let iter = this.coll.entries();
    let result = iter.next();
    while (!result.done && options.limit-- > 0) {
      array.push(result.value);
      result = iter.next();
    }
    if (this.last >= this.coll.size) this.last = 0
    return new Collection(array);
  }
}

module.exports = MessageManagerMock;
