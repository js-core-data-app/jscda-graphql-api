const fs = require("fs");
const path = require("path");
const inflection = require("inflection");

const scriptsPath = path.resolve(process.env.SCRIPTS_PATH || "./scripts");
const pluginsPath = path.resolve(process.env.PLUGINS_PATH || "./plugins");

const runScript = async (db, script) => {
  let scriptPath = path.join(scriptsPath, script + ".js");
  if (!fs.existsSync(scriptPath) && script.indexOf("/") !== -1) {
    const [plugin, scriptName] = script.split("/");
    scriptPath = path.join(pluginsPath, plugin, "scripts", scriptName + ".js");
  }
  if (!fs.existsSync(scriptPath)) throw new Error(`script ${script} not found`);
  return Promise.resolve(require(scriptPath)(db));
};

module.exports = {
  run: runScript
};
