module.exports = async () => {
  return {
    Query: {
      hello: () => "world"
    },
    Mutation: {
      createSomething: () => {
        return { name: "blah" };
      }
    }
  };
};
