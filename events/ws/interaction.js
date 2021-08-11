let Event = require("@structures/Event.js"),
  argSystem = require("@structures/args.js"),
  { Util } = require("discord.js");
new Event()
  .setMeta({
    name: "interactionCreate",
    type: "on",
  })
  .run(async (client, interaction) => {
    if (interaction.componentType === "BUTTON") {
      let collector = client.cache.collectors.get(interaction.message.id),
        buttonHandler = client.cache.buttons.get(
          `${interaction.channelId}:${interaction.customId}`
        );

      if (collector) {
        setTimeout(() => {
          client.cache.collectors.delete(interaction.message.id);
          collector.collector.emit("end", "");
        }, collector.collector.client.time);
        if (!collector.collector.client.filter(interaction, interaction.member))
          return;
        collector.collector.emit("collect", interaction, interaction.member);
      } else if (buttonHandler) {
        await buttonHandler._onTimeout({
          edit: (ops = {}) => {
            client.api
              .channels(interaction.channelId)
              .messages(interaction.message.id)
              .patch({
                data: {
                  content: "",
                  embeds: [ops.embed],
                  components: ops.components || interaction.message.components,
                },
              });
            client.api
              .interactions(interaction.id)
              [interaction.token].callback.post({ data: { type: 6 } });
          },
          delete: () => {
            client.api
              .channels(interaction.channelId)
              .messages(interaction.message.id)
              .delete();
          },
          ...interaction,
        });
      }
    } else if (interaction.type && interaction.type === "APPLICATION_COMMAND") {
      let command = client.contextMenus.find(
        (x) => x.name === interaction.commandName
      );
      if (command) {
        if (
          command.owner &&
          !client.config.owners.includes(interaction.user.id)
        )
          return;
        else
          command.run(client, {
            message: await client.api
              .channels(interaction.channelId)
              .messages(interaction.targetId)
              .get(),
            followUp: async (content, options) => {
              let i = 0,
                parsedButtons = Array(
                  options.buttons ? options.buttons.length : 0
                );
              for (let button of options.buttons || []) {
                let styles = { green: 3, red: 4, blue: 1, grey: 2 };
                parsedButtons[i] = {
                  type: 2,
                  style: styles[button.style],
                  label: button.text,
                  custom_id: button.id,
                  emoji: button.emoji
                    ? Util.parseEmoji(button.emoji)
                    : undefined,
                  disabled: !!button.clickable,
                  callback: button.callback,
                  check: button.check,
                  fail: button.fail,
                };
                let bucket = `${interaction.channelId}:${parsedButtons[i].custom_id}`;
                client.cache.buttons.set(
                  bucket,
                  setTimeout(async (interaction) => {
                    if (!interaction) return;
                    if (
                      !button.check(
                        interaction.member
                          ? interaction.member.user
                          : interaction.user
                      )
                    )
                      return await button.fail(interaction);
                    return await button.callback(interaction, () => {
                      clearTimeout(client.cache.buttons.get(bucket));
                      delete client.cache.buttons.get(bucket);
                    });
                  }, 900000)
                );
                i++;
              }
              client.api
                .interactions(interaction.id)
                [interaction.token].callback.post({
                  data: {
                    type: 4,
                    data: {
                      content,
                      embeds: [options.embed],
                      components: parsedButtons
                        ? Array.from(
                            {
                              length: Math.ceil(parsedButtons.length / 5),
                            },
                            (a, r) => parsedButtons.slice(r * 5, r * 5 + 5)
                          ).map((x) => ({ type: 1, components: x }))
                        : options.components || [],
                    },
                  },
                });
            },
            ...interaction,
          });
      }
    }
  });
