module.exports = class Buttons {
    constructor() {}
    get(id) {
      const fromCache = this[id];
      if (fromCache) return fromCache;
      return this[id];
    }
    set(id, data) {
      this[id] = data;
      return this[id];
    }
    delete(id) {
      this[id] = undefined;
      return this;
    }
  };
  