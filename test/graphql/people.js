module.exports = async () => {
  return {
    Query: {
      people: () => {
        return {
          items: [{ firstname: "John", lastname: "Doe" }]
        };
      }
    }
  };
};
