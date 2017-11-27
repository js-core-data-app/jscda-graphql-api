const assert = require("assert");
const supertest = require("supertest");
const express = require("express");

const app = require("js-core-data-app")();
const graphqlApi = require("../");
const api = express();
api.use(graphqlApi(app.database));

const test = supertest(api);

describe("api", () => {
  beforeEach(() => {
    return require("./seed-data")(app.database);
  });
  after(() => {
    return app.database.closeAllConnections();
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
      .send({ query: "query{getPeople{firstname lastname}}" })
      .expect(200)
      .expect(res => {
        assert.ok(res.body.data.getPeople);

        let people = res.body.data.getPeople;
        assert.equal(people.length, 1);

        let person = people[0];
        assert.equal(person.firstname, "John");
        assert.equal(person.lastname, "Doe");
      });
  });
});
