let { readdirSync } = require("fs")
for (let folder of readdirSync("./commands/")) {
  for (let file of readdirSync(`./commands/${folder}`)) {
    console.log("Loading command: " + file)
    require(`../../commands/${folder}/${file}`)
  }
}