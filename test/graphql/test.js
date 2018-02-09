module.exports = async () => {
  return {
    Query: {
      hello: () => "world",
      params: (_, args) => {
        return args.foo;
      },
      context: (_, args, ctx) => {
        return ctx.url;
      }
    },
    Mutation: {
      createSomething: () => {
        return { name: "blah" };
      }
    }
  };
};
