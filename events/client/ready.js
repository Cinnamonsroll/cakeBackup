let Event = require("@structures/Event.js");
new Event()
  .setMeta({
    name: "ready"
  })
  .run(async (client) => {
    console.log("Client has started")
  });
