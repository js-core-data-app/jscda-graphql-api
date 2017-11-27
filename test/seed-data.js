module.exports = async database => {
  await database.syncSchema({ force: true });

  let context = database.createContext();

  let p = context.create("Person", {
    firstname: "John",
    lastname: "Doe",
    birthdate: "2017-01-01T00:00:00Z"
  });
  let c = context.create("Company", { name: "Test company" });

  p.setCompany(c);

  return context.saveAndDestroy();
};
