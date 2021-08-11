(async () => {
  let { readdirSync } = require("fs"),
    client = require("../../index.js");
  for (let contextMenu of readdirSync("./contextMenus")) {
    let command = require("../../contextMenus/" + contextMenu);
    for (let [id, guild] of client.guilds.cache) {
      await client.interactionCommands
        .get(client, id)
        .then((res) => res.json())
        .then(async (x) => {
          if (x.length) {
            for (let command of x) {
              await client.interactionCommands.delete(client, command.id, id);
            }
          }
        });
      await client.interactionCommands
        .create(
          client,
          {
            type: 3,
            name: command.name,
          },
          id
        )
        .then((r) => r.json());
    }
    client.contextMenus.push(command);
  }
})();
