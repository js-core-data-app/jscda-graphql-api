const Router = require("express").Router;

module.exports = () => {
  const test = new Router();

  test.get("/plugin-test", (req, res, next) => {
    res.send("hello world from plugin");
  });

  return test;
};
