module.exports = class Guilds {
    constructor() {}
    get(id) {
      const fromCache = this[id];
      if (fromCache) return fromCache;
      return this[id];
    }
    set(id, guild) {
      this[id] = guild;
      return this[id]
    }
  };
  