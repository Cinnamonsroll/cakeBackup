let EventEmitter = require("events").EventEmitter;
module.exports = class buttonCollector extends EventEmitter {
  constructor(client, filter, time) {
    super();
    this.filter = filter;
    this.client = client;
    this.time = time;
  }
  end(reason = "") {
      this.emit("end", reason)
  }
};
