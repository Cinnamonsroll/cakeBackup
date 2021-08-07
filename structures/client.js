let { Client } = require("discord.js"),
  Database = require("./Database"),
  Cache = require("./Cache"),
  CakeMessage = require("./Classes/Message.js"),
  MessageHandler = require("./MessageHandler");
module.exports = class CakeClient extends Client {
  constructor(options) {
    super(options.options);
    this.commands = [];
    this.events = [];
    this.responses = {};
    this.token ??= options.token;
    this.db = new Database(this);
    this.cache = new Cache(this);
    this.messages = new MessageHandler(this);
  }
  async getMessage(message) {
    let channel = this.cache.channels.get(message.channelId),
      guild = this.cache.guilds.get(message.guildId);
    if (!channel)
      channel = this.cache.channels.set(
        message.channelId,
        await this.channels.fetch(message.channelId)
      );
    if (!guild)
      guild = this.cache.guilds.set(
        message.guildIdId,
        await this.guilds.fetch(message.guildId)
      );
    const m = { guild, author: message.author, ...message.toJSON() };
    message = new CakeMessage(this, m, { channel, guild });
    await message.getCommandData(message.content || "");
    return message;
  }
  isCommand(query) {
    return this.commands.find(
      (x) => x.name === query || (x.aliases && x.aliases.includes(query))
    );
  }
  start() {
    return this.login(this.token);
  }
};
