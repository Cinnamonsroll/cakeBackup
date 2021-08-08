module.exports = class Command {
  constructor() {
    this.client = require("../index.js");
    this.args = [];
    this.middleware = [
      async ({ client, message }) => {
        if ((await client.db.user.get(message.author.id).then(x => x.blacklists[0]?.type.toLowerCase())) === "blacklisting") {
          await message.editOrReply("Oof");
          return true;
        }
        return false;
      },
    ];
  }
  middleware(callback) {
    this.middleware.push(callback);
    return this;
  }
  setMeta(data) {
    for (let [K, V] of Object.entries(data)) this[K] = V;
    return this;
  }
  addSubcommand(mainCommand, subCommand) {
    if(!this.client.subcommands[mainCommand]) this.client.subcommands[mainCommand] = []
    this.client.subcommands[mainCommand].push(this.client.subcommandsArray.find(x => x.parent === mainCommand))
    return this;
  }
  addArg(argData) {
    this.args.push(argData);
    return this;
  }
  beforeRun(callback) {
    this.beforeRun = callback;
    return this;
  }

  onCancel(callback) {
    this.onCancel = callback;
    return this;
  }

  run(callback) {
    this.run = callback;
    if(!!!this.subcommand) this.client.commands.push(this)
    else this.client.subcommandsArray.push(this)
  }
};
