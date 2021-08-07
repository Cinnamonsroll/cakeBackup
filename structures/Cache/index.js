let Channels = require("./Channels.js"), Guilds = require("./Guilds.js")
module.exports = class Cache {
  constructor() {
    this.channels = new Channels();
    this.guilds = new Guilds()
  }
};
