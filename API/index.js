let API = require("@structures/API.js"),
  path = require("path");
new API({
  routesPath: path.resolve(__dirname, "routes"),
});
