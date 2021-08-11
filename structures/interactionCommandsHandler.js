let fetch = require("node-fetch");
module.exports = class interactionCommandsHandler {
  constructor() {}
  async get(client, guildID) {
    return await fetch(
      `https://discord.com/api/v9/applications/${client.user.id}/guilds/${guildID}/commands`,
      {
        method: "GET",
        headers: {
          Authorization: `Bot ${client.token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }
  async delete(client, id, guildID) {
    return await fetch(
      `https://discord.com/api/v9/applications/${client.user.id}/guilds/${id}/commands/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bot ${client.token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }
  async create(client, body, id) {
    return await fetch(
      `https://discord.com/api/v9/applications/${client.user.id}/guilds/${id}/commands`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bot ${client.token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }
};
