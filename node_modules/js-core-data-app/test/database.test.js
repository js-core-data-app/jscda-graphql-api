const assert = require("assert");
const database = require("../index")().database;

describe("database", () => {
  beforeEach(() => {
    return require("./seed-data")(database);
  });
  after(() => {
    return database.closeAllConnections();
  });

  it("should have correct model selected", () => {
    assert.equal(database.model.version, "v0.0.2");
  });
  describe("context", () => {
    it("should allow creating object", () => {
      let context = database.createContext();

      context.create("Person", { firstname: "Jane", lastname: "Siri" });

      return context.saveAndDestroy();
    });

    it("should allow fetching object", async () => {
      let context = database.createContext();

      let person = await context.getObjectWithId("Person", 1);
      assert.equal(person.firstname, "John");
      assert.equal(person.lastname, "Doe");

      let company = await person.getCompany();
      assert.equal(company.name, "Test company");

      return context.saveAndDestroy();
    });

    it("should allow updating object", async () => {
      let context = database.createContext();

      let person = await context.getObjectWithId("Person", 1);
      person.firstname = "Johny";

      return context.saveAndDestroy();
    });

    it("should allow deleting object", async () => {
      let context = database.createContext();

      let person = await context.getObjectWithId("Person", 1);
      context.deleteObject(person);

      return context.saveAndDestroy();
    });
  });
});
