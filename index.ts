import { NappJS, NappJSModule } from 'nappjs';

const CoreDataGraphql = require("js-core-data-graphql");
const { expressPlayground } = require("graphql-playground-middleware");
const bodyParser = require("body-parser");

const GRAPHQL_API_PATH = process.env.GRAPHQL_API_PATH || "/graphql";

export default class NappJSGraphqlAPI extends NappJSModule {
  async postRegister(napp: NappJS) {
    napp.locals.api.use(bodyParser.json());

    napp.locals.api.post(
      GRAPHQL_API_PATH,
      CoreDataGraphql.graphql(napp.locals.database)
    );
    napp.locals.api.get(
      GRAPHQL_API_PATH,
      expressPlayground({ endpoint: GRAPHQL_API_PATH })
    );
  }
}