const Router = require("express").Router;
const CoreDataGraphql = require("js-core-data-graphql");
const { expressPlayground } = require("graphql-playground-middleware");
const bodyParser = require("body-parser");

const GRAPHQL_URL = process.env.GRAPHQL_URL || "/graphql";

module.exports = database => {
  let app = new Router();

  app.use(bodyParser.json());

  app.post(GRAPHQL_URL, CoreDataGraphql.graphql(database));
  app.get(GRAPHQL_URL, expressPlayground({ endpoint: GRAPHQL_URL }));

  return app;
};
