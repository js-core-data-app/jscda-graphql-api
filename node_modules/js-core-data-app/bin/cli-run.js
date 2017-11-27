#! /usr/bin/env node
const program = require("commander");

const database = require("../lib/database");
const scripts = require("../lib/scripts");

const _run = async type => {
  console.log("running script database...");
  try {
    await scripts.run(database, type);
  } catch (e) {
    console.log("failed to run database", e);
  } finally {
    console.log("draining database connections...");
    database.closeAllConnections();
  }
};

program
  .arguments("<script>")
  .action(_run)
  .parse(process.argv);
