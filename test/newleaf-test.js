const assert = require('assert');
const routines = require("../src/routines.js");
const Cleaner = require("../src/Cleaner.js")

describe("routines.authorize()", () => {
  let permissions = {
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
      assert.strictEqual(routines.authorize(permissions), false);
    });
    it("should return false for MANAGE_MESSAGES, but no READ_MESSAGE_HISTORY", () => {
      permissions.bitfield = 0b010;
      assert.strictEqual(routines.authorize(permissions), false);
    });
    it("should return false for READ_MESSAGE_HISTORY, but no MANAGE_MESSAGES", () => {
      permissions.bitfield = 0b001;
      assert.strictEqual(routines.authorize(permissions), false);
    });
    it("should return true for administrators", () => {
      permissions.bitfield = 0b100;
      assert.strictEqual(routines.authorize(permissions), true);
    });
    it("should return true for MANAGE_MESSAGES and READ_MESSAGE_HISTORY", () => {
      permissions.bitfield = 0b011;
      assert.strictEqual(routines.authorize(permissions), true);
    });
  });
  describe("# Bad object", () => {
    it("should return false for null", () => {
      permissions = null;
      assert.strictEqual(routines.authorize(permissions), false);
    });
    it("should return false for undefined", () => {
      permissions = undefined;
      assert.strictEqual(routines.authorize(permissions), false);
    });
    it("should return false for empty object", () => {
      permissions = {};
      assert.strictEqual(routines.authorize(permissions), false);
    });
  });
});

describe("routines.validate()", () => {
  describe("# Validation", () => {
    it("should return false for messages received on non-textchannels", () => {
      const message = {channel: {type: "not-text"}, content: "!clean"};
      assert.strictEqual(routines.validate(message), false);
    });
    it("should return false for invalid command messages", () => {
      const message = {channel: {type: "text"}, content: "not-!clean"};
      assert.strictEqual(routines.validate(message), false);
    });
    it("should return true for valid command messages received on a text channel", () => {
      const message = {channel: {type: "text"}, content: "!clean"};
      assert.strictEqual(routines.validate(message), true);
    });
  });
  describe("# Bad object", () => {
    it("should return false for null", () => {
      const message = null;
      assert.strictEqual(routines.validate(message), false);
    });
    it("should return false for undefined", () => {
      const message = undefined;
      assert.strictEqual(routines.validate(message), false);
    });
    it("should return false for empty object", () => {
      const message = {};
      assert.strictEqual(routines.validate(message), false);
    });
  });

  // Discord API trims surrounding whitespace
  describe("$ Whitespace in command message", () => {
    it("should return false for leading whitespace",  () => {
      const message = {channel: {type: "text"}, content: " !clean"};
      assert.strictEqual(routines.validate(message), false);
    });
    it("should return false for trailing whitespace",  () => {
      const message = {channel: {type: "text"}, content: "!clean "};
      assert.strictEqual(routines.validate(message), false);
    });
  });
});
