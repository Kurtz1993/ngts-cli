#!/usr/bin/env node

const program = require("commander");
const utils = require("./utils");

program
    .usage("<appName> [options]")
    .arguments("<app-name>")
    .action(function (appName) {
        cmdAppName = appName;
    })
    .option("-o, --out <output-folder>", "Specifies the output (build) folder of the project. Defaults to wwwroot")
    .option("-s, --src <src-folder>", "Specifies the name of the folder that will hold all source files. Defaults to src.")
    //.option("--use-bower", "Enables Bower usage in the project, otherwise it will use only NPM.")
    .parse(process.argv);

if (typeof cmdAppName === "undefined") {
    console.log("You must specify an app name.");
    process.exit(1);
}

cmdAppName = utils.camelCase(cmdAppName);
program.out = utils.camelCase(program.out) || "wwwroot";
program.src = utils.camelCase(program.src) || "src";
program.useBower = program.useBower || false;

var vals = {
    hAppName: utils.hyphenate(cmdAppName),
    pAppName: utils.pascalCase(cmdAppName),
    srcFolder: utils.hyphenate(program.src),
    appName: cmdAppName,
    outFolder: program.out,
    noBower: program.useBower
};

var appTpls = utils.readTemplates("app");
var srcTpls = utils.readTemplates("app/src");
var decoratorTpls = utils.readTemplates("app/src/decorators");
var servicesTpls = utils.readTemplates("app/src/services");
var stylesTpls = utils.readTemplates("app/src/styles");

appTpls = utils.compileTemplates(appTpls, vals, cmdAppName);
srcTpls = utils.compileTemplates(srcTpls, vals, cmdAppName);
decoratorTpls = utils.compileTemplates(decoratorTpls, null, cmdAppName);
stylesTpls = utils.compileTemplates(stylesTpls, vals, cmdAppName);

var servicesCompiledTpls = {};
for (var i in servicesTpls) {
    if (i === "_base.service.ts") {
        servicesCompiledTpls[i.replace("_", "")] = servicesTpls[i];
    } else {
        var tpl = {};
        tpl[i.replace("_", "")] = servicesTpls[i];
        servicesTpls = utils.extend(servicesCompiledTpls, utils.compileTemplates(tpl, vals, cmdAppName));
    }
}

/*utils.writeFiles(appTpls);
utils.writeFiles(srcTpls, program.src.concat("/"));*/
utils.writeFiles(decoratorTpls, program.src.concat("/decorators/"));
console.log(decoratorTpls)