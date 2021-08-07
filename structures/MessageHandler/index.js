let Add = require("./Add.js"), Edit = require("./Edit.js")
module.exports = class MessageHandler {
  constructor() {
    this.add = Add;
    this.edit = Edit
  }
};
