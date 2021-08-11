let { Client } = require("discord.js"),
  Database = require("./Database"),
  Cache = require("./Cache"),
  CakeMessage = require("./Classes/Message.js"),
  MessageHandler = require("./MessageHandler"),
  interactionCommandsHandler = require("./interactionCommandsHandler.js");
module.exports = class CakeClient extends Client {
  constructor(options) {
    super(options.options);
    this.commands = [];
    this.events = [];
    this.contextMenus = [];
    this.subcommands = {};
    this.subcommandsArray = [];
    this.color = "#FFFEFB";
    this.interactionCommands = new interactionCommandsHandler();
    this.responses = {};
    this.token ??= options.token;
    this.db = new Database(this);
    this.config = require("../config.json");
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
    message = new CakeMessage(this, m, {
      channel,
      guild,
      isOwner: this.config.owners.includes(m.author.id),
    });
    await message.getCommandData(message.content || "");
    return message;
  }
  isCommand(query) {
    return this.commands.find(
      (x) => x.name === query || (x.aliases && x.aliases.includes(query))
    );
  }
  async getUser(message, query, author) {
    if (!query) return author ? message.member : undefined;
    message.data.guild.members.fetch({
      withPresences: true,
    });
    let joins = [
      ...message.data.guild.members.cache
        .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
        .values(),
    ];
    return (
      message.data.guild.members.cache.get(query.replace(/[<@​!?>]/g, "")) ||
      message.data.guild.members.cache.find((m) =>
        [m.user.username, m.displayName, m.user.tag].some((e) =>
          e.toLowerCase().includes(query.toLowerCase())
        )
      ) ||
      joins[parseInt(query) - 1] ||
      (author ? message.member : undefined)
    );
  }
  fixDate(str, sec = false) {
    const x = sec ? 1 : 1000;
    if (typeof str !== "string") return 0;
    const fixed = str.replace(/\s/g, "");
    const tail = +fixed.match(/-?\d+$/g) || 0;
    const parts = (fixed.match(/-?\d+[^-0-9]+/g) || []).map(
      (v) =>
        +v.replace(/[^-0-9]+/g, "") *
        ({ s: x, m: 60 * x, h: 3600 * x, d: 86400 * x }[
          v.replace(/[-0-9]+/g, "")
        ] || 0)
    );
    return [tail, ...parts].reduce((a, b) => a + b, 0);
  }
  start() {
    return this.login(this.token);
  }
};
