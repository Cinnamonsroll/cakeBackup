module.exports = class Channels {
  constructor() {}
  get(channelId, messageId) {
    const fromCache = this[channelId]?.[messageId];
    if (fromCache) return fromCache;
    return this[channelId];
  }
  set(channelId, messageId, message) {
    if (!this[channelId]) this[channelId] = {};
    this[channelId][messageId] = message;
    return this[channelId][messageId];
  }
};
