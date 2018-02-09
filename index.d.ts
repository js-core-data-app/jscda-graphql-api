import { NappJS, NappJSService } from "nappjs";
import NappJSApi from "nappjs-api";
import { GraphQLSchema } from "graphql";
export default class NappJSGraphqlAPI extends NappJSService {
    static dependencies: string[];
    private api;
    schemas: GraphQLSchema[];
    private mergedSchema;
    constructor(api: NappJSApi);
    load(napp: NappJS): Promise<void>;
    addSchema(schema: GraphQLSchema): Promise<void>;
    private getMergedSchema();
    private gatherSchemas();
    private getSchemaFromFiles(schemaPath, scriptPath);
}
