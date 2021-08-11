module.exports = {
  name: "eval",
  owner: true,
  run: (client, interaction) => {
    if (!interaction.message.content) return;
    client.commands
      .find(
        (x) => x.name === "eval" || (x.aliases && x.aliases.includes("eval"))
      )
      .run({
        message: interaction.message,
        client,
        options: { d: 0 },
        evalCode: interaction.message.content
          .replace(/`{3}(\w+)?/g, "")
          .replace(/(-\w+(\s+)(.*))/gi, ""),
        isInteraction: true,
        interaction,
      });
  },
};
