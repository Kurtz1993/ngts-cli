#!/usr/bin/env node

const program = require("commander");
const _ = require("lodash");
const utils = require("./utils");
var dest = "";

program
    .usage("<module-name> [options]")
    .arguments("<module-name>")
    .action(function (moduleName) {
        cmdModuleName = moduleName;
    })
    .option("-a, --ctrl-alias <alias>", "Sets an alias for the controller. Defaults to vm.")
    .option("-m, --module-only", "Creates only the module.ts file.")
    .parse(process.argv);

if (typeof cmdModuleName === "undefined") {
    console.log("You must specify a name for the module.");
    process.exit(1);
}

program.ctrlAlias = program.ctrlAlias || "vm";

cmdModuleName = utils.camelCase(cmdModuleName);

dest = utils.hyphenate(cmdModuleName.concat("/"));

var vals = {
    appName: utils.camelCase(utils.getAppName()),
    name: cmdModuleName,
    pName: utils.pascalCase(cmdModuleName),
    hName: utils.hyphenate(cmdModuleName),
    ctrlAlias: program.ctrlAlias,
    decoratorPath: utils.getDecoratorPath(dest),
    tplPath: utils.getRelativePath(),
    moduleOnly: program.moduleOnly || false
};

if (program.moduleOnly) {
    var tpls = utils.readTemplate("module", "_name.ts");
} else {
    var tpls = utils.readTemplates("module");
}

tpls = utils.compileTemplates(tpls, vals, cmdModuleName);

utils.writeFiles(tpls, dest);