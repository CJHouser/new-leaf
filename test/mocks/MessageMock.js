class MessageMock {
  static nextMessageID = 0;

  constructor(content, channel) {
    this.content = content;
    this.channel = channel;
    this.id = MessageMock.nextMessageID++;
    this.deleted = false;
  }

  async delete() {
    this.deleted = true;
  }
}

module.exports = MessageMock;
