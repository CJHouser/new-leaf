const assert = require('assert');
const routines = require("../routines.js");

describe("routines.clean()", () => {
  describe("# Bad object argument", () => {
    it("should return null for null MessageManager", async () => {
      const messageID = "text";
      const messageManMock = null;
      assert.equal(await routines.clean(messageManMock), null);
    });
    it("should return null for undefined MessageManager", async () => {
      const messageID = "text";
      const messageManMock = undefined;
      assert.equal(await routines.clean(messageManMock), null);
    });
    it("should return null for empty object MessageManager", async () => {
      const messageID = "text";
      const messageManMock = {};
      assert.equal(await routines.clean(messageManMock), null);
    });
  });
});

describe("routines.authorize()", () => {
  let permissionsMock = {
    bitfield: 0b000,
    has: function (str, flag) {
      switch (str) {
        case "ADMINISTRATOR":
          return (this.bitfield & 0b100) != 0;
        case "MANAGE_MESSAGES":
          return (this.bitfield & 0b010) != 0;
        case "READ_MESSAGE_HISTORY":
          return (this.bitfield & 0b001) != 0;
        default:
          return false;
      }
    }
  };
  describe("# Authentication", () => {
    it("should return false non-privileged", () => {
      assert.equal(routines.authorize(permissionsMock), false);
    });
    it("should return false for MANAGE_MESSAGES, but no READ_MESSAGE_HISTORY", () => {
      permissionsMock.bitfield = 0b010;
      assert.equal(routines.authorize(permissionsMock), false);
    });
    it("should return false for READ_MESSAGE_HISTORY, but no MANAGE_MESSAGES", () => {
      permissionsMock.bitfield = 0b001;
      assert.equal(routines.authorize(permissionsMock), false);
    });
    it("should return true for administrators", () => {
      permissionsMock.bitfield = 0b100;
      assert.equal(routines.authorize(permissionsMock), true);
    });
    it("should return true for MANAGE_MESSAGES and READ_MESSAGE_HISTORY", () => {
      permissionsMock.bitfield = 0b011;
      assert.equal(routines.authorize(permissionsMock), true);
    });
  });
  describe("# Bad object argument", () => {
    it("should return false for null argument", () => {
      permissionsMock = null;
      assert.equal(routines.authorize(permissionsMock), false);
    });
    it("should return false forundefined argument", () => {
      permissionsMock = undefined;
      assert.equal(routines.authorize(permissionsMock), false);
    });
    it("should return false for empty argument", () => {
      permissionsMock = {};
      assert.equal(routines.authorize(permissionsMock), false);
    });
  });
});

describe("routines.validate()", () => {
  describe("# Validation", () => {
    it("should return false for messages received on non-textchannels", () => {
      const messageMock = {channel: {type: "not-text"}, content: "!clean"};
      assert.equal(routines.validate(messageMock), false);
    });
    it("should return false for invalid command messages", () => {
      const messageMock = {channel: {type: "text"}, content: "not-!clean"};
      assert.equal(routines.validate(messageMock), false);
    });
    it("should return true for valid command messages received on a text channel", () => {
      const messageMock = {channel: {type: "text"}, content: "!clean"};
      assert.equal(routines.validate(messageMock), true);
    });
  });
  describe("# Bad object argument", () => {
    it("should return false for null arguments", () => {
      const messageMock = null;
      assert.equal(routines.validate(messageMock), false);
    });
    it("should return false for undefined arguments", () => {
      const messageMock = undefined;
      assert.equal(routines.validate(messageMock), false);
    });
    it("should return false for empty object argument", () => {
      const messageMock = {};
      assert.equal(routines.validate(messageMock), false);
    });
  });
  // Discord API trims surrounding whitespace
  describe("$ Whitespace in command message", () => {
    it("should return false for leading whitespace",  () => {
      const messageMock = {channel: {type: "text"}, content: " !clean"};
      assert.equal(routines.validate(messageMock), false);
    });
    it("should return false for trailing whitespace",  () => {
      const messageMock = {channel: {type: "text"}, content: "!clean "};
      assert.equal(routines.validate(messageMock), false);
    });
  });
});

