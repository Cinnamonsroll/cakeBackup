let { Schema, model } = require("mongoose");
const guildSchema = new Schema({
  guildID: { type: String, required: true, unique: true },
  prefix: { type: String, required: true, default: "?" },
});
let guildModel = model("guilds", guildSchema);
module.exports = class Guilds {
  constructor() {
    this.cache = {};
  }
  async get(id) {
    const fromCache = this.cache[id];
    if (fromCache) return fromCache;
    const fromDB = await guildModel.findOne({ guildID: id }).lean();
    if (fromDB) {
      this.cache[id] = fromDB;
      return fromDB;
    }
    return {
      guildId: id,
      prefix: "c~",
    };
  }
  async set(id, doc) {
    this.cache[id] = doc;
    await guildModel.updateOne({ guildId: id }, doc, { upsert: true }).lean();
    return this;
  }
  async getPrefix(id) {
    const guildData = await this.get(id);
    return guildData.prefix;
  }
  async create(data) {
    await guildModel.create({ data }).lean();
    await this.get(data.guildId);
    return this;
  }
};
