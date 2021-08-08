let { LoadRoutes: loadRoutes } = require("@jpbberry/load-routes"),
  express = require("express");
module.exports = class API {
  constructor({routesPath} = {}) {
    this.app = express();
    this.app.set("trust-proxy", true);

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    loadRoutes(this.app, routesPath, this);
    this.app.listen(3000, () => {
      console.log("Starting on port", 3000);
    });
  }
};
