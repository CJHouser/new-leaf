class MessageMock {
  static nextMessageID = 0;

  constructor(content, channel, member) {
    this.content = content;
    this.channel = channel;
    this.id = MessageMock.nextMessageID++;
    this.deleted = false;
    this.member = member;
  }

  async delete() {
    this.deleted = true;
  }
}

module.exports = MessageMock;
