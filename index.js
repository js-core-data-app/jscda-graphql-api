"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var nappjs_1 = require("nappjs");
var path = require("path");
var fs = require("fs");
var apollo_server_express_1 = require("apollo-server-express");
var graphql_playground_middleware_express_1 = require("graphql-playground-middleware-express");
var bodyParser = require("body-parser");
var graphql_1 = require("graphql");
var graphql_tools_1 = require("graphql-tools");
var apollo_fetch_nappjs_1 = require("apollo-fetch-nappjs");
var GRAPHQL_API_PATH = process.env.GRAPHQL_API_PATH || "/graphql";
var GRAPHIQL_API_PATH = process.env.GRAPHQL_API_PATH;
var GRAPHQL_SCHEMA_PATH = path.resolve(process.env.GRAPHQL_SCHEMA_PATH || "graphql");
var NappJSGraphqlAPI = (function (_super) {
    __extends(NappJSGraphqlAPI, _super);
    function NappJSGraphqlAPI(api) {
        var _this = _super.call(this) || this;
        _this.schemas = [];
        _this.mergedSchema = null;
        _this.api = api;
        return _this;
    }
    NappJSGraphqlAPI.prototype.load = function (napp) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var app, coredata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = this.api.app;
                        app.use(bodyParser.json());
                        try {
                            coredata = napp.getService("nappjs-core-data");
                            app.use(coredata.database.middleware());
                        }
                        catch (e) { }
                        return [4, this.gatherSchemas()];
                    case 1:
                        _a.sent();
                        app.post(GRAPHQL_API_PATH, apollo_server_express_1.graphqlExpress(function (req) {
                            return { schema: _this.mergedSchema, context: req };
                        }));
                        app.get(GRAPHQL_API_PATH, graphql_playground_middleware_express_1.default({ endpoint: GRAPHIQL_API_PATH || GRAPHQL_API_PATH }));
                        return [2];
                }
            });
        });
    };
    NappJSGraphqlAPI.prototype.addSchema = function (schema) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.schemas.push(schema);
                        _a = this;
                        return [4, this.getMergedSchema()];
                    case 1:
                        _a.mergedSchema = _b.sent();
                        return [2];
                }
            });
        });
    };
    NappJSGraphqlAPI.prototype.getMergedSchema = function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                schema = graphql_tools_1.mergeSchemas({
                    schemas: this.schemas
                });
                return [2, schema];
            });
        });
    };
    NappJSGraphqlAPI.prototype.gatherSchemas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ls, content, _i, ls_1, item, base, _a, _b, _c, key, schemaFilename, scriptFilename, schema;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!fs.existsSync(GRAPHQL_SCHEMA_PATH)) {
                            console.log("folder with graphql schemas not found (path: " + GRAPHQL_SCHEMA_PATH + ")");
                            return [2];
                        }
                        ls = fs.readdirSync(GRAPHQL_SCHEMA_PATH);
                        content = {};
                        for (_i = 0, ls_1 = ls; _i < ls_1.length; _i++) {
                            item = ls_1[_i];
                            base = item.replace(path.extname(item), "");
                            content[base] = true;
                        }
                        _a = [];
                        for (_b in content)
                            _a.push(_b);
                        _c = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_c < _a.length)) return [3, 5];
                        key = _a[_c];
                        schemaFilename = path.join(GRAPHQL_SCHEMA_PATH, key + ".graphql");
                        scriptFilename = path.join(GRAPHQL_SCHEMA_PATH, key + ".js");
                        return [4, this.getSchemaFromFiles(schemaFilename, scriptFilename)];
                    case 2:
                        schema = _d.sent();
                        if (!(schema !== null)) return [3, 4];
                        return [4, this.addSchema(schema)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _c++;
                        return [3, 1];
                    case 5: return [2];
                }
            });
        });
    };
    NappJSGraphqlAPI.prototype.getSchemaFromFiles = function (schemaPath, scriptPath) {
        return __awaiter(this, void 0, void 0, function () {
            var schema, resolversModule, resolvers, fetcher, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        schema = null;
                        if (fs.existsSync(schemaPath)) {
                            schema = graphql_1.buildSchema(fs.readFileSync(schemaPath, "utf-8"));
                        }
                        resolversModule = require(scriptPath);
                        return [4, Promise.resolve(resolversModule())];
                    case 1:
                        resolvers = _d.sent();
                        if (!(typeof resolvers === "string")) return [3, 4];
                        fetcher = apollo_fetch_nappjs_1.createApolloFetch({ uri: resolvers });
                        _a = graphql_tools_1.makeRemoteExecutableSchema;
                        _b = {};
                        _c = schema;
                        if (_c) return [3, 3];
                        return [4, graphql_tools_1.introspectSchema(fetcher)];
                    case 2:
                        _c = (_d.sent());
                        _d.label = 3;
                    case 3: return [2, _a.apply(void 0, [(_b.schema = _c,
                                _b.fetcher = fetcher,
                                _b)])];
                    case 4:
                        graphql_tools_1.addResolveFunctionsToSchema(schema, resolvers);
                        _d.label = 5;
                    case 5: return [2, schema];
                }
            });
        });
    };
    NappJSGraphqlAPI.dependencies = ["nappjs-api"];
    return NappJSGraphqlAPI;
}(nappjs_1.NappJSService));
exports.default = NappJSGraphqlAPI;
//# sourceMappingURL=index.js.map