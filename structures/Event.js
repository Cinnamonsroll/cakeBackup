
module.exports = class Event {
  constructor() {
      this.client = require("../index.js")
  }
  setMeta(data) {
    for (let [K, V] of Object.entries(data)) this[K] = V;
    return this;
  }
  run(callback) {
    this.run = callback;
    this.client.events.push(this);
    return this;
  }
};
