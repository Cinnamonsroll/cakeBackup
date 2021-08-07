module.exports = class Command {
  constructor() {
    this.client = require("../index.js")
  }
  setMeta(data) {
    for (let [K, V] of Object.entries(data)) this[K] = V;
    return this;
  }
  run(callback) {
    this.run = callback;
    this.client.commands.push(this);
    return this;
  }
};
