const assert = require("assert");
const supertest = require("supertest");
const path = require("path");

const napp = require("nappjs").NewNappJS();

let test = null;

const token = require("./get-token");

describe("permissions", () => {
  before(async () => {
    napp.addPlugin("nappjs-graphql-api", path.join(__dirname, "../index"));
    await napp.load();
    let api = napp.getService("nappjs-api");
    test = supertest(api.app);
  });

  after(() => {
    return napp.stop();
  });

  it("should fetch person with jwt token", () => {
    return test
      .post(`/graphql?access_token=${token}`)
      .send({
        query:
          "query{people{items{firstname lastname secret1 secret2 friends { firstname lastname secret1 secret2}}}}"
      })
      .expect(200)
      .expect(res => {
        assert.ok(res.body.data.people);

        let people = res.body.data.people;
        assert.equal(people.items.length, 1);

        let person = people.items[0];
        assert.equal(person.firstname, "John");
        assert.equal(person.lastname, "Doe");
        assert.equal(person.secret1, null);
        assert.equal(person.secret2, "foo");

        let friend = person.friends[0];
        assert.equal(friend.firstname, "John2");
        assert.equal(friend.lastname, "Doe2");
        assert.equal(friend.secret1, null);
        assert.equal(friend.secret2, null);
      });
  });
});
