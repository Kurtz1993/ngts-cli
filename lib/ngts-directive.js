#!/usr/bin/env node

const program = require("commander");
const _ = require("lodash");
const path = require("path");
const utils = require("./utils");
var dest = "";

program
    .usage("<directive-name> [options]")
    .arguments("<directive-name>")
    .action(function (directiveName) {
        cmdDirectiveName = directiveName;
    })
    .option("-r, --restrict <restriction>", "Restrict the directive as attribute, element, class or comment. [A, E, C, M]. Could be multiple values like AE.")
    .option("-a, --ctrl-alias <alias>", "Alias for the controller inside the directive. Defaults to $ctrl.")
    .option("-t, --template", "Generate a template along with the directive.")
    .option("-s, --stylesheet", "Generate a stylesheet along with the directive.")
    .parse(process.argv);

if (typeof cmdDirectiveName === "undefined") {
    console.log("You must specify a name for the directive.");
    process.exit(1);
}

program.ctrlAlias = program.ctrlAlias || "$ctrl";

cmdDirectiveName = _.camelCase(cmdDirectiveName);

//dest = path.join(process.cwd(), utils.hyphenate(cmdDirectiveName));

var vals = {
    restrict: !!program.restrict,
    restriction: program.restrict,
    pName: utils.pascalCase(cmdDirectiveName),
    name: cmdDirectiveName,
    ctrlAlias: program.ctrlAlias,
    hName: utils.hyphenate(cmdDirectiveName),
    decoratorPath: utils.getDecoratorPath()
};

var tpls = utils.compileTemplates(utils.readTemplates("directive"), vals, cmdDirectiveName);
var ctrlTpl = utils.compileTemplates(utils.readTemplate("module", "_name.controller.ts"), vals, cmdDirectiveName);

tpls = _.extend(tpls, ctrlTpl);

if (program.template || (!!program.restrict && program.restrict.indexOf('E') > -1)) {
    var htmlTpl = utils.compileTemplates(utils.readTemplate("module", "_name.tpl.html"), vals, cmdDirectiveName);

    tpls = _.extend(tpls, htmlTpl);
}

if (program.stylesheet) {
    var scssTpl = utils.compileTemplates(utils.readTemplate("module", "_name.scss"), vals, cmdDirectiveName);

    tpls = _.extend(tpls, scssTpl);
}

utils.writeFiles(tpls, dest);