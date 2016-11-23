#!/usr/bin/env node

const program = require("commander");
const _ = require("lodash");
const path = require("path");
const utils = require("./utils");
var dest = "";

program
    .usage("<component-name> [options]")
    .arguments("<component-name>")
    .action(function (componentName) {
        cmdComponentName = componentName;
    })
    .option("-a, --ctrl-alias <alias>", "Alias for the controller inside the component. Defaults to $ctrl.")
    .option("--no-stylesheet", "Specifies if the stylesheet should not be generated.")
    .parse(process.argv);

if (typeof cmdComponentName === "undefined") {
    console.log("You must specify a name for the component.");
    process.exit(1);
}

program.ctrlAlias = program.ctrlAlias || "$ctrl";

cmdComponentName = _.camelCase(cmdComponentName);

//dest = path.join(process.cwd(), utils.hyphenate(cmdComponentName));

var vals = {
    pName: utils.pascalCase(cmdComponentName),
    name: cmdComponentName,
    ctrlAlias: program.ctrlAlias,
    hName: utils.hyphenate(cmdComponentName),
    decoratorPath: utils.getDecoratorPath(),
    tplPath: utils.getRelativePath()
};

var tpls = utils.readTemplates("component");
var ctrlTpl = utils.readTemplate("module", "_name.controller.ts");
var htmlTpl = utils.readTemplate("module", "_name.tpl.html");

tpls = _.extend(tpls, ctrlTpl, htmlTpl);

if (!program.noStylesheet) {
    var scssTpl = utils.readTemplate("module", "_name.scss");

    tpls = _.extend(tpls, scssTpl);
}

tpls = utils.compileTemplates(tpls, vals, cmdComponentName);

utils.writeFiles(tpls, dest);