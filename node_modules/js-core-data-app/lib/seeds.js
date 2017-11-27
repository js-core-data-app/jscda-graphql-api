const fs = require("fs");
const path = require("path");
const inflection = require("inflection");

const seedPath = path.resolve(process.env.SEEDS_PATH || "./seeds");

const importSeed = async (db, seed) => {
  return db.seed.run(path.join(seedPath, seed));
};

module.exports = {
  run: importSeed
};
