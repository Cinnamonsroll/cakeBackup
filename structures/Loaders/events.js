let { readdirSync } = require("fs"),
  client = require("../../index.js");
for (let folder of readdirSync("./events/")) {
  for (let file of readdirSync(`./events/${folder}`)) {
    console.log("Loading: " + file);
    require(`../../events/${folder}/${file}`);
  }
}
for (let event of client.events) {
  client.on(event.name, event.run.bind(null, client));
}
