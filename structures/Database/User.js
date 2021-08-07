let { Schema, model } = require("mongoose");
const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  blacklists: { type: Array, required: true },
});
let userModel = model("users", userSchema);
module.exports = class User {
  constructor() {
    this.cache = {};
  }
  async get(id) {
    const fromCache = this.cache[id];
    if (fromCache) return fromCache;
    const fromDB = await userModel.findOne({ userId: id }).lean();
    if (fromDB) {
      this.cache[id] = fromDB;
      return fromDB;
    }
    return {
      userId: id,
      blacklists: [],
    };
  }
  async set(id, doc) {
    await userModel.updateOne({ userId: id }, doc, { upsert: true }).lean();
  }
  async create(data) {
    await userModel.create({ data }).lean();
    await this.get(data.userId);
    return this;
  }
};
