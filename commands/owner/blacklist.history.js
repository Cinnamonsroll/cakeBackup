let Command = require("@structures/Command.js");
new Command()
  .setMeta({
    name: "history",
    description: "Gets a users blacklist history",
    aliases: ["past"],
    subcommand: true,
    parent: "blacklist",
  })
  .beforeRun(({ message, client }) => message.data.isOwner)
  .onCancel(
    async ({ message, client }) =>
      await message.editOrReply("Owner command only")
  )
  .addArg({
    key: "historyUser",
    type: "user",
    question: "Which users history would you like to view?",
  })
  .run(async ({ message, client, historyUser }) => {
    let userDB = await client.db.user.get(historyUser.id);
    return await message.editOrReply("", {
      embeds: [
        {
          author: {
            name: `${historyUser.user.username}`,
            url: `https://discord.com/users/${historyUser.id}`,
            icon_url: historyUser.user.displayAvatarURL(),
          },
          title: "Blacklist history",
          description: `${
            userDB.blacklists.length
              ? userDB.blacklists
                  .map(
                    (x, i) =>
                      `**${i + 1}.** ${x.reason}\n ╚⇒ ${x.type}`
                  )
                  .join("\n")
              : "No blacklist data"
          }`,
          color: Number("0x" + client.color.slice(1)),
        },
      ],
    });
  });
