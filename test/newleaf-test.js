const assert = require('assert');
const routines = require("../routines.js");

describe("routines.clean()", () => {
  describe("# Bad object argument", () => {
    it("should return null for null message", async () => {
      const message= null;
      assert.equal(await routines.clean(message), null);
    });
    it("should return null for undefined message", async () => {
      const message= undefined;
      assert.equal(await routines.clean(message), null);
    });
    it("should return null for empty object message", async () => {
      const message= {};
      assert.equal(await routines.clean(message), null);
    });
  });
});

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
      assert.equal(routines.authorize(permissions), false);
    });
    it("should return false for MANAGE_MESSAGES, but no READ_MESSAGE_HISTORY", () => {
      permissions.bitfield = 0b010;
      assert.equal(routines.authorize(permissions), false);
    });
    it("should return false for READ_MESSAGE_HISTORY, but no MANAGE_MESSAGES", () => {
      permissions.bitfield = 0b001;
      assert.equal(routines.authorize(permissions), false);
    });
    it("should return true for administrators", () => {
      permissions.bitfield = 0b100;
      assert.equal(routines.authorize(permissions), true);
    });
    it("should return true for MANAGE_MESSAGES and READ_MESSAGE_HISTORY", () => {
      permissions.bitfield = 0b011;
      assert.equal(routines.authorize(permissions), true);
    });
  });
  describe("# Bad object argument", () => {
    it("should return false for null argument", () => {
      permissions = null;
      assert.equal(routines.authorize(permissions), false);
    });
    it("should return false forundefined argument", () => {
      permissions = undefined;
      assert.equal(routines.authorize(permissions), false);
    });
    it("should return false for empty argument", () => {
      permissions = {};
      assert.equal(routines.authorize(permissions), false);
    });
  });
});

describe("routines.validate()", () => {
  describe("# Validation", () => {
    it("should return false for messages received on non-textchannels", () => {
      const message = {channel: {type: "not-text"}, content: "!clean"};
      assert.equal(routines.validate(message), false);
    });
    it("should return false for invalid command messages", () => {
      const message = {channel: {type: "text"}, content: "not-!clean"};
      assert.equal(routines.validate(message), false);
    });
    it("should return true for valid command messages received on a text channel", () => {
      const message = {channel: {type: "text"}, content: "!clean"};
      assert.equal(routines.validate(message), true);
    });
  });
  describe("# Bad object argument", () => {
    it("should return false for null arguments", () => {
      const message = null;
      assert.equal(routines.validate(message), false);
    });
    it("should return false for undefined arguments", () => {
      const message = undefined;
      assert.equal(routines.validate(message), false);
    });
    it("should return false for empty object argument", () => {
      const message = {};
      assert.equal(routines.validate(message), false);
    });
  });
  // Discord API trims surrounding whitespace
  describe("$ Whitespace in command message", () => {
    it("should return false for leading whitespace",  () => {
      const message = {channel: {type: "text"}, content: " !clean"};
      assert.equal(routines.validate(message), false);
    });
    it("should return false for trailing whitespace",  () => {
      const message = {channel: {type: "text"}, content: "!clean "};
      assert.equal(routines.validate(message), false);
    });
  });
});

