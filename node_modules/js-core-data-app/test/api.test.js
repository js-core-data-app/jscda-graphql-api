const assert = require("assert");
const supertest = require("supertest");
const express = require("express");

const app = require("../index")();
const api = express();
api.use("/", app.api.middleware(app.database));

const test = supertest(api);

describe.skip("api", () => {
  // it.only("should start running", done => {
  //   api.listen(8000, () => {
  //     console.log("listening 8000");
  //   });
  // });

  beforeEach(() => {
    return require("./seed-data")(app.database);
  });
  after(() => {
    return app.database.closeAllConnections();
  });

  describe("rest", () => {
    it("should fetch entities", () => {
      return test
        .get("/people")
        .expect(206)
        .expect(res => {
          assert.equal(res.body.length, 1);

          let person = res.body[0];
          assert.equal(person.firstname, "John");
          assert.equal(person.lastname, "Doe");
        });
    });
    it("should fetch entity detail", () => {
      return test
        .get("/people/1")
        .expect(200)
        .expect(res => {
          let person = res.body;
          assert.equal(person.firstname, "John");
          assert.equal(person.lastname, "Doe");
        });
    });
  });

  describe("graphql", () => {
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
});
