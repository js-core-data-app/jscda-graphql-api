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
      .send({ query: `query{ hello params(foo:"blah") context }` })
      .expect(200)
      .expect(res => {
        assert.equal(res.body.data.hello, "world");
        assert.equal(res.body.data.params, "blah");
        assert.equal(res.body.data.context, "/graphql");
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

  // it("should fetch external", () => {
  //   return test
  //     .post("/graphql")
  //     .send({
  //       query: `query ($sort: [SurveySortType!], $filter: SurveyFilterType) {
  //         surveys(sort: $sort, filter: $filter) {
  //           items {
  //             id
  //             name
  //           }
  //           count
  //         }
  //       }`
  //     })
  //     .expect(200)
  //     .expect(res => {
  //       assert.ok(res.body.data.surveys.items);
  //     });
  // });
});
