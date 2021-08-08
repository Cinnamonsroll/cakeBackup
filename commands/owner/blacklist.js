let Command = require("@structures/Command.js");
new Command()
  .setMeta({
    name: "blacklist",
    description: "Blacklists a user",
    category: "owner",
    aliases: ["bl"],
  })
  .beforeRun(({ message, client }) => message.data.isOwner)
  .onCancel(
    async ({ message, client }) =>
      await message.editOrReply("Owner command only")
  )
  .addArg({
    key: "userToBlacklist",
    type: "user",
    question: "Which user would you like to blacklist?",
  })
  .addArg({
    key: "reason",
    type: "string",
    question: "Why do you want to blacklist this user?",
  })
  .addArg({
    key: "type",
    type: "string",
    question: "Are you blacklisting or unblacklisting this user?",
  })
  .addSubcommand("blacklist", "history")
  .run(async ({ message, client, userToBlacklist, reason, type }) => {
    if (
      !userToBlacklist ||
      client.config.owners.includes(userToBlacklist.id) ||
      userToBlacklist.bot
    )
      return await message.editOrReply("This user can not be blacklisted");
    let userDB = await client.db.user.get(userToBlacklist.id);
    await client.db.user.addBlacklist(userToBlacklist.id, {
      reason,
      type,
    });
    let types = {
        blacklisting: "blacklisted",
        unblacklisting: "unblacklisted"
    }
    return await message.editOrReply(`User has been ${types[type.toLowerCase()]}`)
  });
