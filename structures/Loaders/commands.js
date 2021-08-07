let { readdirSync } = require("fs")
for (let folder of readdirSync("./commands/")) {
  for (let file of readdirSync(`./commands/${folder}`)) {
    console.log("Loading: " + file)
    require(`../../commands/${folder}/${file}`)
  }
}