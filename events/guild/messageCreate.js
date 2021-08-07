let Event = require("@structures/Event.js");
new Event()
  .setMeta({
    name: "messageCreate",
  })
  .run(async (client, message) => {
    message = await client.getMessage(message);
    if (
      !message.data.guild ||
      message.author.bot ||
      message.data.channel.type === "dm"
    )
      return;
    if (message.command) await message.command.run({ message, client });
  });
