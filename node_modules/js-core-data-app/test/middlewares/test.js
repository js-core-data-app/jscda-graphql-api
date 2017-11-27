const Router = require("express").Router;

module.exports = () => {
  const test = new Router();

  test.get("/test", (req, res, next) => {
    res.send("hello world");
  });

  test.get("/context-test", (req, res, next) => {
    req.context
      .getObjects("Company")
      .then(data => {
        res.send(data);
      })
      .catch(next);
  });

  test.get("/me", async (req, res, next) => {
    try {
      const payload = await req.jwt.payload();
      res.send(payload);
    } catch (e) {
      next(e);
    }
  });

  return test;
};
