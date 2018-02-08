import { NappJS, NappJSService } from "nappjs";
import NappJSApi from "nappjs-api";

import * as path from "path";
import * as fs from "fs";
import { graphqlExpress } from "apollo-server-express";
import expressPlayground from "graphql-playground-middleware-express";
import * as bodyParser from "body-parser";
import * as express from "express";
import { buildSchema, GraphQLSchema } from "graphql";
import {
  addResolveFunctionsToSchema,
  mergeSchemas,
  makeRemoteExecutableSchema,
  introspectSchema
} from "graphql-tools";
import { GraphiQLData } from "apollo-server-module-graphiql";
import { createApolloFetch } from "apollo-fetch";

const GRAPHQL_API_PATH = process.env.GRAPHQL_API_PATH || "/graphql";
const GRAPHIQL_API_PATH = process.env.GRAPHQL_API_PATH;
const GRAPHQL_SCHEMA_PATH = process.env.GRAPHQL_SCHEMA_PATH || "graphql";

export default class NappJSGraphqlAPI extends NappJSService {
  static dependencies = ["nappjs-api"];

  private api: NappJSApi;
  public schemas: GraphQLSchema[] = [];

  constructor(api: NappJSApi) {
    super();
    this.api = api;
  }

  async load(napp: NappJS) {
    const app = this.api.app;
    app.use(bodyParser.json());

    await this.gatherSchemas();
    let schema = await this.getMergedSchema();

    app.post(GRAPHQL_API_PATH, graphqlExpress({ schema }));
    app.get(
      GRAPHQL_API_PATH,
      expressPlayground({ endpoint: GRAPHIQL_API_PATH || GRAPHQL_API_PATH })
    );
  }

  public addSchema(schema: GraphQLSchema) {
    this.schemas.push(schema);
  }

  private async getMergedSchema(): Promise<GraphQLSchema> {
    let schema = mergeSchemas({
      schemas: this.schemas
    });
    return schema;
  }

  private async gatherSchemas(): Promise<void> {
    let ls = fs.readdirSync(GRAPHQL_SCHEMA_PATH);
    let content: { [key: string]: boolean } = {};
    for (let item of ls) {
      let base = item.replace(path.extname(item), "");
      content[base] = true;
    }

    for (let key in content) {
      let schemaFilename = path.join(GRAPHQL_SCHEMA_PATH, `${key}.graphql`);
      let scriptFilename = path.join(GRAPHQL_SCHEMA_PATH, `${key}.js`);
      let schema = await this.getSchemaFromFiles(
        schemaFilename,
        scriptFilename
      );
      if (schema !== null) this.addSchema(schema);
    }
  }

  private async getSchemaFromFiles(
    schemaPath: string,
    scriptPath: string
  ): Promise<GraphQLSchema | null> {
    let schema: GraphQLSchema = null;

    if (fs.existsSync(schemaPath)) {
      schema = buildSchema(fs.readFileSync(schemaPath, "utf-8"));
    }

    let resolversModule = require(path.resolve(scriptPath));
    let resolvers = await Promise.resolve(resolversModule());

    if (typeof resolvers === "string") {
      const fetcher = createApolloFetch({ uri: resolvers });
      return makeRemoteExecutableSchema({
        schema: schema || (await introspectSchema(fetcher)),
        fetcher
      });
    } else {
      addResolveFunctionsToSchema(schema, resolvers);
    }

    return schema;
  }
}
