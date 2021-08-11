require("module-alias/register");
const client = require("@structures/client.js"),
  Client = new client({
    token: require("./config.json").token,
    options: { intents: 32767, restTimeOffset: 60 },
  }),
  { readdirSync } = require("fs");

Client.start().then(() => {
  module.exports = Client;
  for (let loader of readdirSync("./structures/Loaders"))
    require(`./structures/Loaders/${loader}`);
});
