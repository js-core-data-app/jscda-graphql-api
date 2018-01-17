import { NappJS, NappJSService } from 'nappjs';
import NappJSApi from 'nappjs-api';
import NappJSCoreData from 'nappjs-core-data';

const CoreDataGraphql = require("js-core-data-graphql");
const { expressPlayground } = require("graphql-playground-middleware");
const bodyParser = require("body-parser");

const GRAPHQL_API_PATH = process.env.GRAPHQL_API_PATH || "/graphql";

export default class NappJSGraphqlAPI extends NappJSService {

  static dependencies = ["nappjs-core-data", "nappjs-api"];

  coredata: NappJSCoreData;
  api: NappJSApi;

  constructor(coredata: NappJSCoreData, api: NappJSApi) {
    super()
    this.coredata = coredata
    this.api = api
  }

  async load(napp: NappJS) {
    this.api.app.use(bodyParser.json());

    this.api.app.post(
      GRAPHQL_API_PATH,
      CoreDataGraphql.graphql(this.coredata.database)
    );
    this.api.app.get(
      GRAPHQL_API_PATH,
      expressPlayground({ endpoint: GRAPHQL_API_PATH })
    );
  }
}