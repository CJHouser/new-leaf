const MessageMock = require("./mocks/MessageMock.js");
const ChannelMock = require("./mocks/ChannelMock.js");
const Cleaner = require("../src/classes/Cleaner.js");
const MemberMock = require("./mocks/MemberMock.js");

let parse = require("minimist");
let assert = require("assert");
const { authorize, execute } = require("../src/commands/clean.js");

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
    let content = (i % profaneInterval == 0) ? "alpha " + i : "test " + i;
    addMessage(channel, content);
  }
  // The command message is the most recent and acts as the initial delimiter
  addMessage(channel, "!clean alpha");
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
  let cleaner = new Cleaner(getLatest(channel), {
    _: ["alpha"],
    quotes: false,
    q: false,
    blocks: false,
    b: false,
    links: false,
    l: false,
  });
  return [cleaner, channel, profaneCount];
}

describe("Cleaner.js: start()", () => {
  it("runs for a channel with no message history", async () => {
    let result = init(0, 0);
    await result[0].start();
    assert.strictEqual(getDeleted(result[1]).size, 0);
    assert(!getLatest(result[1]).deleted); // command message is not deleted
  });

  it("runs for a channel with fewer messages than the max fetch limit", async () => {
    let result = init(50, 3);
    await result[0].start();
    // Add a checked field to each message in order to verify?
  });

  it("runs if the message history size is the same as the max fetch limit", async ()=> {
    let result = init(100, 23);
    await result[0].start();
    // Add a checked boolean to each message in order to verify?
  });

  it(`deletes messages containing profanity`, async () => {
    let result = init(200, 10);
    await result[0].start();
    assert.strictEqual(getDeleted(result[1]).size, result[2]);
  });

  it("deletes profane delimiter messages", async () => {
    let result = init(100, 1);
    await result[0].start();
    assert(result[1].messages.coll.first().deleted);
  });
});

describe("#clean.js: authorize()", () => {
  let commandMessage = init(0, 0)[1].messages.coll.last();

  it("rejects unprivileged members", () => {
    commandMessage.member.setPermissions(false, false, false);
    assert(!authorize(commandMessage));
  });

  it("rejects privileged, but insufficient, members", () => {
    commandMessage.member.setPermissions(false, true, false);
    assert(!authorize(commandMessage));
    commandMessage.member.setPermissions(false, false, true);
    assert(!authorize(commandMessage));
  });

  it("accept privileged and sufficient members", () => {
    commandMessage.member.setPermissions(false, true, true);
    assert(authorize(commandMessage));
  });

  it("accept an admin members", () => {
    commandMessage.member.setPermissions(true, false, false);
    assert(authorize(commandMessage));
  });
});

describe("#clean.js: execute()", () => {
  let commandMessage = init(0, 0)[1].messages.coll.last();
  let argumentConfig = {
    boolean: ["append", "blocks", "links", "quotes"],
    alias: {a: "append", b: "blocks", l: "links", q: "quotes"}
  };

  it("reject commands with a mix of valid and invalid arguments", async () => {
    commandMessage.content = "!clean --quotes -z";
    let args = parse(commandMessage.content.split(' ').slice(1), argumentConfig);
    await execute(commandMessage, args);
    assert.strictEqual(commandMessage.lastReply, "Git gud.");
  });

  it("accept default clean", async () => {
    commandMessage.content = "!clean";
    let args = parse(commandMessage.content.split(' ').slice(1), argumentConfig);
    await execute(commandMessage, args);
    assert.strictEqual(commandMessage.lastReply, "Cleaning finished.");
  });

  it("accept any combination of valid arguments", async () => {
    commandMessage.content = "!clean -blq able baker charlie";
    let args = parse(commandMessage.content.split(' ').slice(1), argumentConfig);
    await execute(commandMessage, args);
    assert.strictEqual(commandMessage.lastReply, "Cleaning finished.");
  });
});
