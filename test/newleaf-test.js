const assert = require('assert');
const routines = require("../routines.js");

describe("routines.validate()", () => {
  describe("# Object property validation", () => {
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

describe("routines.clean()", () => {
  describe("# Bad object argument", () => {
    it("should return null for null arguments", async () => {
      const messageMock = null;
      assert.equal(await routines.clean(messageMock), null);
    });
    it("should return null for undefined arguments", async () => {
      const messageMock = undefined;
      assert.equal(await routines.clean(messageMock), null);
    });
    it("should return null for empty object argument", async () => {
      const messageMock = {};
      assert.equal(await routines.clean(messageMock), null);
    });
  });
});
