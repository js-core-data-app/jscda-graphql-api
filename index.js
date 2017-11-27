const Router = require("express").Router;
const CoreDataGraphql = require("js-core-data-graphql");
const { expressPlayground } = require("graphql-playground-middleware");
const bodyParser = require("body-parser");

const GRAPHQL_API_PATH = process.env.GRAPHQL_URL || "/graphql";

module.exports = database => {
  let app = new Router();

  app.use(bodyParser.json());

  app.post(GRAPHQL_API_PATH, CoreDataGraphql.graphql(database));
  app.get(GRAPHQL_API_PATH, expressPlayground({ endpoint: GRAPHQL_API_PATH }));

  return app;
};
