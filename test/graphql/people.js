module.exports = async () => {
  return {
    Query: {
      people: () => {
        return {
          items: [
            {
              firstname: "John",
              lastname: "Doe",
              secret1: "blah",
              secret2: "foo",
              friends: [
                {
                  firstname: "John2",
                  lastname: "Doe2",
                  secret1: "blah2",
                  secret2: "foo2"
                }
              ]
            }
          ]
        };
      }
    }
  };
};
