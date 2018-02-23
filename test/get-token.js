const jwt = require("jsonwebtoken");

const payload = {
  user: {
    username: "admin@example.com",
    firstname: "John",
    lastname: "Doe"
  },
  permissions:
    "allow|*\ndeny|Person:secret1\ndeny|people:items:friends:secret2",
  iat: 1511923424
};

const token = jwt.sign(payload, "JWT_SECRET", { algorithm: "HS256" });

process.env.JWT_SECRET = "JWT_SECRET";

module.exports = token;
