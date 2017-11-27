module.exports = config => {
  const api = require("./lib/api");
  const database = require("./lib/database");
  const middlewares = require("./lib/middlewares");
  const seeds = require("./lib/seeds");
  const scripts = require("./lib/scripts");

  return {
    api,
    database,
    middlewares,
    seeds,
    scripts
  };
};
