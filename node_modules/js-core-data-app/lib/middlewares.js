const fs = require("fs");
const path = require("path");

console.log("loading middlewares");
const middlewaresPath = path.resolve(
  process.env.MIDDLEWARES_PATH || "./middlewares/"
);

var middlewares = {};
let files = [];
if (fs.existsSync(middlewaresPath)) {
  files = fs.readdirSync(middlewaresPath);
}

if (files.length === 0) {
  console.log("no middlewares found");
}

files.forEach(file => {
  console.log("middleware", file);
  const middlewarePath = path.join(middlewaresPath, file);
  middlewares[file] = require(middlewarePath);
});

module.exports = middlewares;
