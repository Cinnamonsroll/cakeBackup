module.exports = async function argSystem(
  client,
  context,
  args,
  commandargs,
  message
) {
  let validateType = async (currentArg, type) => {
    if (!/^(command|string|user|date|option|code)/gim.test(type))
      throw new TypeError("Invalid type");
    switch (type.toLowerCase()) {
      case "string":
        return currentArg;
      case "command":
        return client.resolveCommand(currentArg);
      case "user":
        return await client.getUser(message, currentArg, true);
      case "date":
        return client.fixDate(currentArg);
      case "option":
        return currentArg;
      case "code":
        return currentArg.replace(/`{3}(\w+)?/g, "").replace(/(-\w+(\s+)(.*))/gi, "")
    }
  };
  let question = async (time, question) => {
    await message.editOrReply(question);
    let filter = (response) => response.author.id === message.author.id;
    let awaitQuestion = await message.data.channel.awaitMessages({
      filter,
      max: 1,
      time,
      errors: ["time"],
    });
    let content =
      awaitQuestion && awaitQuestion.first()
        ? awaitQuestion.first().content
        : undefined;
    if (content.toLowerCase() === "cancel" || !content) return "cancelled";
    return content;
  };
  if (commandargs.length) {
    let i = 0;
    for (let arg of commandargs) {
      if (
        (!args[i] && !arg.default) ||
        (arg.type === "option" && !arg.options.includes(args[i]?.toLowerCase()))
      ) {
        let argData = await question(arg.time || 30000, arg.question);
        if (argData === "cancelled")
          return await message.editOrReply("Command cancelled");
        if (
          arg.type === "option" &&
          !arg.options.includes(argData.toLowerCase())
        ) {
          await message.editOrReply(
            "Invalid option, valid options are " +
              arg.options.map((x) => `\`${x}\``).join(", ")
          );
          return false;
        }
        context[arg.key] = await validateType(argData, arg.type);
      } else if (!args[i] && arg.default) {
        context[arg.key] = arg.default(message);
      } else {
        if (
          arg.type === "option" &&
          !arg.options.includes(args[i].toLowerCase())
        ) {
          await message.editOrReply(
            "Invalid option, valid options are " +
              arg.options.map((x) => `\`${x}\``).join(", ")
          );
          return false;
        }
        context[arg.key] = await validateType(
          arg.joined ? args.slice(i).join(" ") : args[i],
          arg.type
        );
      }
      i++;
    }
  }
  return context;
};
