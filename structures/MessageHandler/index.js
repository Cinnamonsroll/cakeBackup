let Add = require("./Add.js"), Edit = require("./Edit.js"), React = require("./React.js")
module.exports = class MessageHandler {
  constructor() {
    this.add = Add;
    this.edit = Edit
    this.react = React
  }
};
