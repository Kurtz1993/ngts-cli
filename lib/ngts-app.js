#!/usr/bin/env node

const program = require("commander");
const utils = require("./utils");
const path = require("path");
const chalk = require("chalk");
var rootPath = "";

function writeFolders(folderPath, folders) {
    const fs = require("fs");

    var folders = folders || folderPath.split(path.sep);
    var childFolders = folderPath.replace(rootPath, "");
    childFolders = childFolders.split(path.sep);
    childFolders = childFolders.slice(0, childFolders.length -1);

    try {
        var contents = fs.readdirSync(folderPath);
    } catch (e) {
        if (e.code === "ENOENT") {
            if (rootPath !== folderPath) {
                writeFolders(path.join(rootPath, childFolders.join("/")), childFolders);
            }
            console.log(chalk.green("Creating directory: ") + chalk.bold.white(folderPath));
            fs.mkdirSync(folderPath);
        }
    }
}

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
    console.log(chalk.bold.red("You must specify an app name."));
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
    noBower: !program.useBower
};

var appTpls = utils.readTemplates("app");
var srcTpls = utils.readTemplates("app/src");
var wwwrootTpls = utils.readTemplates("app/wwwroot");
var decoratorTpls = utils.readTemplates("app/src/decorators");
var servicesTpls = utils.readTemplates("app/src/services");
var stylesTpls = utils.readTemplates("app/src/styles");

appTpls = utils.compileTemplates(appTpls, vals, cmdAppName);
srcTpls = utils.compileTemplates(srcTpls, vals, cmdAppName);
wwwrootTpls = utils.compileTemplates(wwwrootTpls, vals, cmdAppName);
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

utils.writeFiles(appTpls, vals.hAppName.concat("/"));
rootPath = utils.getRootPath(cmdAppName);
writeFolders(path.join(rootPath, program.out));
writeFolders(path.join(rootPath, program.src, "decorators"));
writeFolders(path.join(rootPath, program.src, "services"));
writeFolders(path.join(rootPath, program.src, "styles"));

var sourcePath = path.join(rootPath, program.src);

utils.writeFile(sourcePath.concat("/"), srcTpls);
utils.writeFile(rootPath.concat("/" + program.out), wwwrootTpls);
utils.writeFile(sourcePath.concat("/decorators"), decoratorTpls);
utils.writeFile(sourcePath.concat("/services"), servicesTpls);
utils.writeFile(sourcePath.concat("/styles"), stylesTpls);