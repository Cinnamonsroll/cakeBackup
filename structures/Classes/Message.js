const { Message } = require("discord.js"),
  fetch = require("node-fetch");
module.exports = class CakeMessage extends Message {
  constructor(client, data, messageData) {
    super(client, data);
    this.headers = {
      Authorization: `Bot ${client.token}`,
      "User-Agent": `DiscordBot`,
      "Content-Type": "application/json",
    };
    for (let [K, V] of Object.entries(messageData)) {
      if (!this.data) this.data = {};
      this.data[K] = V;
    }
  }
  async getCommandData(content) {
    this.prefix = await this.client.db.guilds
      .get(this.data.guild.id)
      .then((x) => x.prefix);
    let [command, ...args] = content
      .slice(this.prefix.length)
      .trim()
      .split(/ +/g);
    this.command =
      this.content.startsWith(this.prefix) && this.client.isCommand(command);
    this.commandData = { name: command, args };
    return this;
  }
  async editOrReply(content, options = {}) {
    let message = await fetch(
      `https://discord.com/api/v9/channels/${this.data.channel.id}/messages`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          content: content,
          embeds: options.embed ? [options.embed] : [],
          allowed_mentions: {
            replied_user: false,
            parse: [],
          },
        }),
      }
    ).then((r) => r.json());
  }
};