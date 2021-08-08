let fetch = require("node-fetch");
module.exports = async (channel, messageId, headers, emoji) => {
  let parseEmoji = (emoji) => {
    if (emoji.match(/^[0-9]+$/)) return `unknown:${emoji}`;
    return encodeURIComponent(emoji);
  };
  return await fetch(
    `https://discord.com/api/v9/channels/${channel}/messages/${messageId}/reactions/${parseEmoji(emoji)}/@me`,
    { method: "PUT", headers }
  );
};
