#! /usr/bin/env node
const program = require("commander");

program.version(require("../package.json").version);
//  .option('-p, --peppers', 'Add peppers')
//  .option('-P, --pineapple', 'Add pineapple')
//  .option('-b, --bbq-sauce', 'Add bbq sauce')
//  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')

program.command("start", "start application");
program.command("migrate", "migrate database");
program.command("seed", "seed database");
program.command("run", "run script");

program.parse(process.argv);
