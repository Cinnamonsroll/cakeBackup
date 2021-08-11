const { Message, Util } = require("discord.js"),
  fetch = require("node-fetch");
module.exports = class CakeMessage extends Message {
  constructor(client, data, messageData) {
    super(client, data);
    this.headers = {
      Authorization: `Bot ${client.token}`,
      "Content-Type": "application/json"
    };
    for (let [K, V] of Object.entries(messageData)) {
      if (!this.data) this.data = {};
      this.data[K] = V;
    }
  }
  async getCommandData(content) {
    this.prefix = await this.client.db.guilds.getPrefix(this.data.guild.id);
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
    let i = 0,
      parsedButtons = Array(options.buttons ? options.buttons.length : 0);
    for (let button of options.buttons || []) {
      let styles = { green: 3, red: 4, blue: 1, grey: 2 };
      parsedButtons[i] = {
        type: 2,
        style: styles[button.style],
        label: button.text,
        custom_id: button.id,
        emoji: button.emoji ? Util.parseEmoji(button.emoji) : undefined,
        disabled: !!button.clickable,
        callback: button.callback,
        check: button.check,
        fail: button.fail
      };
      let bucket = `${this.data.channel.id}:${parsedButtons[i].custom_id}`;
      this.client.cache.buttons.set(
        bucket,
        setTimeout(async interaction => {
          if (!interaction) return;
          if (
            !button.check(
              interaction.member ? interaction.member.user : interaction.user
            )
          )
            return await button.fail(interaction);
          return await button.callback(interaction, () => {
            clearTimeout(this.client.cache.buttons.get(bucket));
            delete this.client.cache.buttons.get(bucket);
          });
        }, 900000)
      );
      i++;
    }
    let message = await this.client.messages
      .add(this.data.channel.id, this.headers, {
        content: content,
        allowed_mentions: {
          replied_user: false,
          parse: []
        },
        components: parsedButtons
          ? Array.from(
              {
                length: Math.ceil(parsedButtons.length / 5)
              },
              (a, r) => parsedButtons.slice(r * 5, r * 5 + 5)
            ).map(x => ({ type: 1, components: x }))
          : options.components || [],
        ...options
      })
      .then(res => res.json());
    message = new this.constructor(this.client, message, {
      channel: this.data.channel,
      guild: this.data.guild
    });
    await message.getCommandData(message.content || "");
    return message;
  }
  async edit(content, options = {}) {
    let message = await this.client.messages
      .edit(this.data.channel.id, this.id, this.headers, {
        content: content,
        allowed_mentions: {
          replied_user: false,
          parse: []
        },
        ...options
      })
      .then(res => res.json());
    message = new this.constructor(this.client, message, {
      channel: this.data.channel,
      guild: this.data.guild
    });
    await message.getCommandData(message.content || "");
    return message;
  }
  createCollector(options = {}) {
    let Collector = require("@structures/collector.js"),
      collector = new Collector({
        client: this.client,
        filter: options.filter,
        time: options.time
      });
    this.client.cache.collectors.set(this.id, {
      collector,
      messsge: this
    });
    return collector;
  }
};
