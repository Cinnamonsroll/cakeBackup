let Event = require("@structures/Event.js"),
  argSystem = require("@structures/args.js");
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
                data: { content: "", embeds: [ops.embed], components: ops.components || interaction.message.components },
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
    }
  });
