const assert = require("assert");
const supertest = require("supertest");
const path = require("path");

const napp = require("nappjs").NewNappJS();

let test = null;

describe("api", () => {
  before(async () => {
    napp.addPlugin("test", path.join(__dirname, "../index"));
    await napp.load();
    await require("./seed-data")(napp.locals.database);
    test = supertest(napp.locals.api);
  });

  after(() => {
    return napp.locals.database.closeAllConnections();
  });

  it("should fetch graphiql", () => {
    return test
      .get("/graphql")
      .set("Accept", "text/html")
      .expect(res => {
        assert.ok(res.text);
      })
      .expect(200);
  });

  it("should fetch person", () => {
    return test
      .post("/graphql")
      .send({ query: "query{people{firstname lastname}}" })
      .expect(200)
      .expect(res => {
        assert.ok(res.body.data.people);

        let people = res.body.data.people;
        assert.equal(people.length, 1);

        let person = people[0];
        assert.equal(person.firstname, "John");
        assert.equal(person.lastname, "Doe");
      });
  });
});
