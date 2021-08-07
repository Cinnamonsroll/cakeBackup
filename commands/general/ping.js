let Command = require("@structures/Command.js");
new Command()
  .setMeta({
    name: "ping",
    description: "Sends the bots ping",
    category: "general",
    aliases: ["pong"],
  })
  .run(async ({ message, client }) => {
   let m = await message.editOrReply("ping?")
   await m.edit(`Pong! \`${client.ws.ping}ms\``)
  });
