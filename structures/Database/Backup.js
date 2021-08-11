let { Schema, model } = require("mongoose");
const backupSchema = new Schema({
  code: { type: String, required: true },
  originalServer: { type: String, required: true },
  private: { type: Boolean, required: true },
  data: {
    type: Object,
    default: { channels: [], roles: [], emojis: [], bans: [], members: [] },
  },
  name: { type: String, required: true },
  icon: { type: String, required: false },
  settings: { type: Object, required: true },
  owner: { type: String, required: true },
  previousStates: { type: Array, default: [] },
  parent: { type: Boolean, default: true },
  date: { type: Date, required: true },
})
let backupModel = model("backups", backupSchema);
module.exports = class Backups {
  constructor() {
    this.cache = {};
  }
  create(data) {
    return new backupModel(data);
  }
  async find(code) {
    return await backupModel.findOne({ code });
  }
  async get(query) {
    return await backupModel.findOne(query);
  }
  async createUniqueId(length) {
    let createId = (len) => {
        let string =
          "abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
            ""
          );
        return Array.from(
          { length: len || 6 },
          (_, i) => string[~~(Math.random() * string.length)]
        ).join("");
      },
      getId = async () => {
        const id = createId(length);
        return {
          id,
          exists: await this.find(id),
        };
      };
    let id = await getId();
    while (id.exists) id = await getId();
    return id.id;
  }
};
