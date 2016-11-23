#!/usr/bin/env node

const program = require("commander");
const _ = require("lodash");
const utils = require("./utils");
const cwd = process.cwd();

program
    .usage("<service-name> [options]")
    .arguments("<service-name>")
    .action(function (serviceName) {
        cmdServiceName = serviceName;
    })
    .parse(process.argv);

if (typeof cmdServiceName === "undefined") {
    console.log("You must specify a name for the service.");
    process.exit(1);
}

cmdServiceName = (utils.isHyphenated(cmdServiceName)) ? cmdServiceName.toLowerCase() : cmdServiceName;

var vals = {
    decoratorPath: utils.getDecoratorPath(),
    pName: utils.pascalCase(_.camelCase(cmdServiceName)),
};

var templates = utils.compileTemplates(utils.readTemplates("service"), vals, _.camelCase(cmdServiceName), true);

utils.writeFiles(templates, cwd);