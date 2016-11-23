#!/usr/bin/env node

const program = require("commander");
const utils = require("./utils");
const cwd = process.cwd();

program
    .usage("<service-name>")
    .arguments("<service-name>")
    .action(function (serviceName) {
        cmdServiceName = serviceName;
    })
    .parse(process.argv);

if (typeof cmdServiceName === "undefined") {
    console.log("You must specify a name for the service.");
    process.exit(1);
}

cmdServiceName = utils.camelCase(cmdServiceName);

var vals = {
    decoratorPath: utils.getDecoratorPath(),
    pName: utils.pascalCase(cmdServiceName),
};

var templates = utils.compileTemplates(utils.readTemplates("service"), vals, cmdServiceName, true);

utils.writeFiles(templates);