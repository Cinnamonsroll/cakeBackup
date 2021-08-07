let fetch = require("node-fetch");
module.exports = async (channel, messageId, headers, body) => {
  return await fetch(
    `https://discord.com/api/v9/channels/${channel}/messages/${messageId}`,
    { method: "PATCH", headers, body: JSON.stringify(body) }
  );
};
