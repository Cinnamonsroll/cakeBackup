let Event = require("@structures/Event.js");
new Event()
  .setMeta({
    name: "ready",
    type: "once",
  })
  .run(async (client) => {
    console.log("Client has started");
  });
