let mongoose = require("mongoose"), User = require("./User.js"), Guilds = require("./Guilds.js")
module.exports = class Database {
  constructor() {
    this.user = new User();
    this.guilds = new Guilds()
    mongoose
      .connect(require("../../config.json").mongo ?? "", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => console.log("Connected to MongoDB"))
      .catch(console.log);
  }
};
