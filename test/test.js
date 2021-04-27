const MessageMock = require("./mocks/MessageMock.js");
const ChannelMock = require("./mocks/ChannelMock.js");
const Cleaner = require("../src/classes/Cleaner.js");
const MemberMock = require("./mocks/MemberMock.js");

let assert = require("assert");
const { authorize } = require("../src/commands/clean.js");

/**
 * Add messages to a channel.
 * @param {ChannelMock} channel Mock channel to which message is added.
 * @param {string} content Message content.
 */
function addMessage(channel, content) {
  let message = new MessageMock(content, channel, new MemberMock(false, false, false));
  channel.messages.coll.set(message.id, message);
  channel.messages.hi++;
}

/**
 * Populate a ChannelMock with a distribution of profane messages
 * @param {ChannelMock} channel Mock channel to which messages are added.
 * @param {int} historySize The number of messages in the channel.
 * @param {int} profaneInterval Set a profane message for every n messages.
 * @returns {int} The number of profane messages in the channel.
 */
function populateChannel(channel, historySize, profaneInterval) {
  for (let i = 0; i < historySize; i++) {
    let content = (i % profaneInterval == 0) ? "fuck " + i : "test " + i;
    addMessage(channel, content);
  }
  // The command message is the most recent and acts as the initial delimiter
  addMessage(channel, "!clean");
  return profaneInterval ? Math.ceil(historySize / profaneInterval) : 0;
}

/**
 * Get the messages that were mock deleted.
 * @param {ChannelMock} channel Mock channel containing the messages to fetch.
 * @returns {Collection} A Collection of deleted messages.
 */
function getDeleted(channel) { return channel.messages.coll.filter(m => m.deleted) }

/**
 * Returns the chronologically latest message.
 * @param {ChannelMock} channel Mock channel containing the message to fetch.
 * @returns The last message in the collection.
 */
function getLatest(channel) { return channel.messages.coll.last() }

/**
 * Mock setup for each test.
 * @param {int} historySize The number of messages in the channel.
 * @param {int} profaneInterval Set a profane message for every n messages.
 * @returns {Array} Cleaner object, Channel object, number of profane messages in the channel.
 */
function init(historySize, profaneInterval) {
  let channel = new ChannelMock();
  let profaneCount = populateChannel(channel, historySize, profaneInterval);
  let cleaner = new Cleaner(getLatest(channel));
  return [cleaner, channel, profaneCount];
}

describe("Cleaner.js: start()", () => {
  it("should run for a channel with no message history", async () => {
    let result = init(0, 0);
    await result[0].start();
    assert.strictEqual(getDeleted(result[1]).size, result[2]);
    assert(!getLatest(result[1]).deleted);
    assert.strictEqual(result[1].messages.coll.size, 1);
  });

  it("should run for a channel with fewer messages than the max fetch limit", async () => {
    let result = init(50, 3);
    await result[0].start();
  });

  it("should not fail if the message history size is the same as the max fetch limit", async ()=> {
    let result = init(100, 23);
    await result[0].start();
  });

  it("should correctly mark profane delimiter messages", async () => {
    let result = init(100, 1);
    await result[0].start();
    assert(result[1].messages.coll.first().deleted);
  });

  it("should work for channels with no profane messages", async () => {
    let result = init(50, 0);
    await result[0].start();
    assert.strictEqual(getDeleted(result[1]).size, 0);
  });

  it(`should find n messages containing profanity`, async () => {
    let result = init(200, 10);
    await result[0].start();
    assert.strictEqual(getDeleted(result[1]).size, result[2]);
  });

  // In case Discord.js Message.delete() behavior is changed in the future
  it("should not remove elements from the collection", async () => {
    let result = init(10, 0);
    const initialSize = result[1].messages.coll.size;
    await result[0].start()
    assert.strictEqual(initialSize, result[1].messages.coll.size);
  });
});

describe("#clean.js: authorize()", () => {
  let commandMessage = init(0, 0)[1].messages.coll.last();

  it("should reject unprivileged member", () => {
    commandMessage.member.setPermissions(false, false, false);
    assert(!authorize(commandMessage));
  });

  it("should reject privileged, but insufficient, member", () => {
    commandMessage.member.setPermissions(false, true, false);
    assert(!authorize(commandMessage));
    commandMessage.member.setPermissions(false, false, true);
    assert(!authorize(commandMessage));
  });

  it("should accept privileged and sufficient member", () => {
    commandMessage.member.setPermissions(false, true, true);
    assert(authorize(commandMessage));
  });

  it("should accept admin member", () => {
    commandMessage.member.setPermissions(true, false, false);
    assert(authorize(commandMessage));
  });
});