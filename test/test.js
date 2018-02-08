const assert = require("assert");
const supertest = require("supertest");
const path = require("path");

const napp = require("nappjs").NewNappJS();

let test = null;

describe("api", () => {
  before(async () => {
    napp.addPlugin("nappjs-graphql-api", path.join(__dirname, "../index"));
    await napp.load();
    let api = napp.getService("nappjs-api");
    test = supertest(api.app);
  });

  after(() => {
    return napp.stop();
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

  it("should fetch hello", () => {
    return test
      .post("/graphql")
      .send({ query: "query{ hello }" })
      .expect(200)
      .expect(res => {
        assert.equal(res.body.data.hello, "world");
      });
  });

  it("should fetch person", () => {
    return test
      .post("/graphql")
      .send({ query: "query{people{items{firstname lastname}}}" })
      .expect(200)
      .expect(res => {
        assert.ok(res.body.data.people);

        let people = res.body.data.people;
        assert.equal(people.items.length, 1);

        let person = people.items[0];
        assert.equal(person.firstname, "John");
        assert.equal(person.lastname, "Doe");
      });
  });

  it("should fetch universe", () => {
    return test
      .post("/graphql")
      .send({
        query: `query {
        viewer{
          latitude
          longitude
        }
      }`
      })
      .expect(200)
      .expect(res => {
        assert.ok(res.body.data.viewer.latitude);
        assert.ok(res.body.data.viewer.longitude);
      });
  });
});
