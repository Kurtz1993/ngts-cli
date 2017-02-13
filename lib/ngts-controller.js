#!/usr/bin/env node

const program = require("commander");
const utils = require("./utils");
const chalk = require("chalk");

program
    .usage("<controller-name>")
    .arguments("<controller-name>")
    .action(function (controllerName) {
        cmdControllerName = controllerName;
    })
    .parse(process.argv);

if (typeof cmdControllerName === "undefined") {
    console.log(chalk.bold.red("You must specify a name for the controller."));
    process.exit(1);
}

cmdControllerName = utils.camelCase(cmdControllerName);

var vals = {
    decoratorPath: utils.getDecoratorPath(),
    pName: utils.pascalCase(cmdControllerName)
};

var templates = utils.readTemplate("module", "_name.controller.ts");
templates = utils.compileTemplates(templates, vals, cmdControllerName);

utils.writeFiles(templates);