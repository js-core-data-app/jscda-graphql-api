import {
  GraphQLSchema,
  getNamedType,
  GraphQLField,
  GraphQLObjectType,
  ResponsePath
} from "graphql";
import { mergeSchemas } from "graphql-tools";

type FieldIteratorFn = (
  fieldDef: GraphQLField<any, any>,
  typeName: string,
  fieldName: string
) => void;

function forEachField(schema: GraphQLSchema, fn: FieldIteratorFn): void {
  const typeMap = schema.getTypeMap();
  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];
    if (
      !getNamedType(type).name.startsWith("__") &&
      type instanceof GraphQLObjectType
    ) {
      const fields = type.getFields();
      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        fn(field, typeName, fieldName);
      });
    }
  });
}

const getFullPath = (path: ResponsePath): string => {
  let parts: string[] = [];

  let currentPath = path;
  do {
    if (typeof currentPath.key === "string") {
      parts.unshift(currentPath.key);
    }
    currentPath = currentPath.prev;
  } while (currentPath);

  return parts.join(":");
};

const fieldResolver = (jwt, prev, typeName, fieldName) => {
  return async (parent, args, req, info) => {
    let path = getFullPath(info.path);
    let typePath = `${typeName}:${fieldName}`;

    let pathPrefix = getPermissionsPathPrefix();
    if (pathPrefix) {
      path = pathPrefix + ":" + path;
      typePath = pathPrefix + ":" + typePath;
    }

    let allowed = await jwt.checkJWTPermissions(req, path);
    let typeAllowed = await jwt.checkJWTPermissions(req, typePath);

    if (allowed && typeAllowed) {
      return prev(parent, args, req, info);
    }
    return null;
  };
};

const getPermissionsPathPrefix = () => {
  return process.env.PERMISSIONS_PATH_PREFIX || process.env.KONTENA_STACK_NAME;
};

export const addPermissions = (schema: GraphQLSchema, jwt) => {
  forEachField(schema, (field, typeName, fieldName) => {
    if (field.resolve) {
      const prev = field.resolve;
      field.resolve = fieldResolver(jwt, prev, typeName, fieldName);
    }
  });
};
