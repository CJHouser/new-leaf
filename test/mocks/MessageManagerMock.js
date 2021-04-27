const { Collection } = require("discord.js");

class MessageManagerMock {
  constructor() {
    this.hi = -1;
    this.coll = new Collection();
  }

  async fetch(options) {
    let lo = this.hi - options.limit > 0 ? this.hi - options.limit : 0;
    let result = new Collection(Array.from(this.coll).slice(lo, this.hi));
    this.hi = lo;
    return result;
  }
}

module.exports = MessageManagerMock;
