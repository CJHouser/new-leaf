class MessageMock {
  static nextMessageID = 0;

  constructor(content, channel, member) {
    this.content = content;
    this.channel = channel;
    this.id = MessageMock.nextMessageID++;
    this.deleted = false;
    this.member = member;
    this.lastReply = null;
  }

  async delete() {
    this.deleted = true;
  }
  
  async reply(content) {
    this.lastReply = content;
  }
}

module.exports = MessageMock;
