import { NappJS, NappJSService } from "nappjs";
import NappJSApi from "nappjs-api";
import { GraphQLSchema } from "graphql";
export default class NappJSGraphqlAPI extends NappJSService {
    static dependencies: string[];
    api: NappJSApi;
    constructor(api: NappJSApi);
    load(napp: NappJS): Promise<void>;
    gatherSchema(): Promise<GraphQLSchema>;
    getSchemaFromFiles(schemaPath: string, scriptPath: string): Promise<GraphQLSchema | null>;
}
