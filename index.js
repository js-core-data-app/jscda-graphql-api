const CoreDataGraphql = require("js-core-data-graphql");
const { expressPlayground } = require("graphql-playground-middleware");
const bodyParser = require("body-parser");

const GRAPHQL_API_PATH = process.env.GRAPHQL_API_PATH || "/graphql";

module.exports = app => {
  app.use(bodyParser.json());

  app.post(GRAPHQL_API_PATH, CoreDataGraphql.graphql(app.locals.database));
  app.get(GRAPHQL_API_PATH, expressPlayground({ endpoint: GRAPHQL_API_PATH }));
};
