let Command = require("@structures/Command.js");
new Command()
  .setMeta({
    name: "eval",
    description: "Evals code",
    category: "owner",
    aliases: ["e"],
  })
  .beforeRun(({ message, client }) => message.data.isOwner)
  .onCancel(
    async ({ message, client }) =>
      await message.editOrReply("Owner command only")
  )
  .addArg({
    question: "Is this code async?",
    type: "option",
    key: "async",
    options: ["yes", "no"],
  })
  .addArg({
    question: "What code do you want to eval?",
    type: "code",
    key: "evalCode",
    joined: true,
    time: 60000,
  })
  .addOption({
    name: "d",
    type: "number",
  })
  .run(async ({ message, client, evalCode, options: { d }, async }) => {
    const AsyncFunction = Object.getPrototypeOf(
      async function () {}
    ).constructor;
    let { inspect } = require("util"),
      { Type } = require("@sapphire/type"),
      { performance } = require("perf_hooks");
    try {
      let time = performance.now();
      let evaled =
        async && async === "yes"
          ? await new AsyncFunction("context", eval(evalCode))
          : eval(evalCode);
      if (evaled && evaled instanceof Promise && async !== "yes")
        evaled = await evaled;
      let type = new Type(evaled).toString();
      if (typeof evaled !== "string")
        evaled = inspect(evaled, {
          depth: d || 0,
        });
      evaled = evaled
        .replace(/`/g, `\`${String.fromCharCode(8203)}`)
        .replace(/@/g, `@${String.fromCharCode(8203)}`);

      let stringTools = new (require("string-toolkit"))(),
        page = 0;
      let evalEmbeds = stringTools.toChunks(evaled, 2000).map((thing) => ({
        color: Number("0x" + client.color.slice(1)),
        description: `\`\`\`js\n${thing}\`\`\``,
        fields: [
          { name: "Type of", value: `\`\`\`js\n${type}\`\`\`` },
          {
            name: "Time",
            value: `\`\`\`css\n${performance.now() - time}ms\`\`\``,
          },
        ],
      }));
      let buttons = [
        {
          style: "red",
          id: "delete",
          emoji: "<:cutie_trash:848216792845516861>",
          check: (m) => m.id === message.author.id,
          fail: () => {
            return;
          },
          callback: async (interaction) => {
            interaction.delete();
          },
        },
      ];
      if (evalEmbeds.length > 1) {
        for (let buttonObject of [
          {
            style: "blue",
            id: "backward",
            emoji: "<:cutie_backward:848237448269135924>",
            check: (m) => m.id === message.author.id,
            fail: () => {
              return;
            },
            callback: async (interaction) => {
              if (!page) page = evalEmbeds.length - 1;
              else page--;
              interaction.edit({
                embed: evalEmbeds[page],
              });
            },
          },
          {
            style: "blue",
            id: "stop",
            emoji: "<:cutie_stop:848633645123371038>",
            check: (m) => m.id === message.author.id,
            fail: () => {
              return;
            },
            callback: async (interaction) => {
              let styles = { DANGER: 4, PRIMARY: 1 };
              interaction.edit({
                embed: evalEmbeds[page],
                components: interaction.message.components.map((c) => ({
                  type: 1,
                  components: c.components.map((m) => ({
                    ...m,
                    type: 2,
                    custom_id: m.customId,
                    style: styles[m.style],
                    disabled: true,
                  })),
                })),
              });
            },
          },
          {
            style: "blue",
            id: "forward",
            emoji: "<:cutie_forward:848237230363246612>",
            check: (m) => m.id === message.author.id,
            fail: () => {
              return;
            },
            callback: async (interaction) => {
              if (page === evalEmbeds.length - 1) page = 0;
              else page++;
              interaction.edit({
                embed: evalEmbeds[page],
              });
            },
          },
        ]) {
          buttons.push(buttonObject);
        }
      }
      await message.editOrReply("", {
        embed: evalEmbeds[page],
        buttons,
      });
    } catch (err) {
      return await message.editOrReply("", {
        embed: {
          color: Number("0x" + client.color.slice(1)),
          title: "Error",
          description: `\`\`\`js\n ${err.message.replace(
            /(require(\s+)stack(:)([\s\S]*))?/gim,
            ""
          )}\`\`\``,
        },
        reply: message.id,
      });
    }
  });
