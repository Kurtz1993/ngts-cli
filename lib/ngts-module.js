#!/usr/bin/env node

const program = require("commander");
const _ = require("lodash");
const utils = require("./utils");
const chalk = require("chalk");
var dest = "";

program
    .usage("<module-name> [options]")
    .arguments("<module-name>")
    .action(function (moduleName) {
        cmdModuleName = moduleName;
    })
    .option("-a, --ctrl-alias <alias>", "Sets an alias for the controller. Defaults to vm.")
    .option("-m, --module-only", "Creates only the module.ts file.")
    .option("-v, --view-name", "Defines the ui-view name to use for the template. Defaults to content")
    .parse(process.argv);

if (typeof cmdModuleName === "undefined") {
    console.log(chalk.bold.red("You must specify a name for the module."));
    process.exit(1);
}

program.ctrlAlias = program.ctrlAlias || "vm";
program.viewName = program.viewName || "content";

cmdModuleName = utils.camelCase(cmdModuleName);

dest = utils.hyphenate(cmdModuleName).concat("/");

var vals = {
    appName: utils.camelCase(utils.getAppName()),
    pName: utils.pascalCase(cmdModuleName),
    hName: utils.hyphenate(cmdModuleName),
    ctrlAlias: program.ctrlAlias,
    decoratorPath: utils.getDecoratorPath(dest),
    tplPath: utils.getRelativePath(),
    moduleOnly: program.moduleOnly || false,
    viewName: program.viewName
};

if (program.moduleOnly) {
    var tpls = utils.readTemplate("module", "_name.ts");
} else {
    var tpls = utils.readTemplates("module");
}

tpls = utils.compileTemplates(tpls, vals, cmdModuleName);

utils.writeFiles(tpls, dest);