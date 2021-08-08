let fetch = require("node-fetch");
module.exports = async (channel, headers, body) => {
  return await fetch(
    `https://discord.com/api/v9/channels/${channel}/messages`,
    { method: "POST", headers, body: JSON.stringify(body) }
  )
};
