let { readdirSync } = require("fs"),
  client = require("../../index.js");
for (let folder of readdirSync("./events/")) {
  for (let file of readdirSync(`./events/${folder}`)) {
    console.log("Loading event: " + file);
    require(`../../events/${folder}/${file}`);
  }
}
for (let event of client.events) {
  client[event.type](event.name, event.run.bind(null, client));
}
