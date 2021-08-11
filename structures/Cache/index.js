let Channels = require("./Channels.js"), Guilds = require("./Guilds.js"), Messages = require("./Messages.js"), Collectors = require("./Collector.js"), Buttons = require("./Buttons.js")
module.exports = class Cache {
  constructor() {
    this.channels = new Channels();
    this.guilds = new Guilds()
    this.messages = new Messages()
    this.collectors = new Collectors()
    this.buttons = new Buttons()
  }
};
