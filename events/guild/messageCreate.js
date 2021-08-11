let Event = require("@structures/Event.js"),
  argSystem = require("@structures/args.js");
new Event()
  .setMeta({
    name: "messageCreate",
    type: "on",
  })
  .run(async (client, message) => {
    message = await client.getMessage(message);
    if (
      !message.data.guild ||
      message.author.bot ||
      message.data.channel.type === "dm"
    )
      return;
    client.cache.messages.set(message.data.channel.id, message.id, message);
    if (message.command) {
      for (let middleware of message.command.middleware) {
        if (await middleware({ message, client }))
          return await middleware({ message, client });
      }
      let subcommand =
        client.subcommands[message.command.name] &&
        message.commandData.args[0] &&
        client.subcommands[message.command.name].find(
          (x) => x.name === message.commandData.args[0]
        )
          ? client.subcommands[message.command.name].find(
              (x) => x.name === message.commandData.args[0]
            )
          : undefined;
      let whichCommand = subcommand || message.command;
      let ctx = { message, client };
      ctx = await argSystem(
        client,
        ctx,
        subcommand
          ? message.commandData.args.slice(1)
          : message.commandData.args,
        whichCommand.args || [],
        message
      );
      if (!ctx) return;
      if (
        whichCommand.beforeRun &&
        typeof whichCommand.beforeRun === "function" &&
        !whichCommand.beforeRun(ctx)
      )
        return await whichCommand.onCancel(ctx);
      function parse(string) {
        if (!string || typeof string !== "string")
          throw new TypeError("Invalid string");
        let matches = string.match(/(\-(\w+))/gi),
          options = {};
        if (!matches) return {};
        for (let match of matches) {
          let index = string.split(" ").indexOf(match);
          options[match.substr(1)] = string.split(" ")[index + 1];
        }
        return options;
      }
      if (whichCommand.options.length) {
        let parsed = parse(message.content);
        ctx.options = {};
        for (let commandOption of whichCommand.options) {
          ctx.options[commandOption.name] =
            commandOption.type === "number" && parsed[commandOption.name]
              ? parseInt(parsed[commandOption.name])
              : parsed[commandOption.name];
        }
      }
      await whichCommand.run(ctx);
    }
  });
