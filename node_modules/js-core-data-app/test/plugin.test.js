const assert = require("assert");
const supertest = require("supertest");
const express = require("express");

const app = require("../index")();
const api = express();
api.use("/", app.api.middleware(app.database));

const test = supertest(api);

describe("plugin", () => {
  beforeEach(() => {
    return require("./seed-data")(app.database);
  });
  after(() => {
    return app.database.closeAllConnections();
  });

  it("should fetch endpoint", () => {
    return test
      .get("/plugin-test")
      .expect(200)
      .expect(res => {
        assert.equal(res.text, "hello world from plugin");
      });
  });
});
