const fs = require("fs");
const path = require("path");
const findNodeModules = require("find-node-modules");

console.log("loading plugins");
const pluginsPath = path.resolve(process.env.PLUGINS_PATH || "./plugins/");

var plugins = {};
let files = [];
if (fs.existsSync(pluginsPath)) {
  files = fs.readdirSync(pluginsPath);
}

// search plugins with by prefix in local/global node_modules
let nodeModulesPaths = findNodeModules();
if (process.env.LOAD_GLOBAL_PLUGINS) {
  nodeModulesPaths.push(require("global-modules"));
}
for (let pluginsPath of nodeModulesPaths) {
  let matches = fs.readdirSync(pluginsPath).filter(name => {
    return name.indexOf("jscda-") === 0;
  });
  for (let match of matches) {
    files.push(match);
  }
}

if (files.length === 0) {
  console.log("no plugins found");
}

files.forEach(file => {
  console.log("plugin", file);
  const pluginPath = path.join(pluginsPath, file);
  plugins[file] = require(pluginPath);
});

module.exports = plugins;
