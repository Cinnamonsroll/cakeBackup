module.exports = class Channels {
  constructor() {}
  get(id) {
    const fromCache = this[id];
    if (fromCache) return fromCache;
    return this[id];
  }
  set(id, channel) {
    this[id] = channel;
    return this[id]
  }
};
