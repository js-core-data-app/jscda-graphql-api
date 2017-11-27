#! /usr/bin/env node
const program = require("commander");

const database = require("../lib/database");

const migrate = async () => {
  console.log("migating/syncing database...");
  try {
    await database.syncSchema({
      automigration: true,
      ignoreMissingVersion: true
    });
    console.log("database migrated to", database.modelVersion);
  } catch (e) {
    console.log("failed to migrate database", e);
  } finally {
    console.log("draining database connections...");
    database.closeAllConnections();
  }
};

migrate();
