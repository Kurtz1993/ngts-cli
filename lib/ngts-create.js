#!/usr/bin/env node

var program = require('commander');
var _ = require("lodash");

function out(val) {
    return val || "wwwroot";
}

function src(val) {
    return val || "src";
}

program
    .usage("<appName> [options]")
    .arguments("<appName>")
    .action(function (appName) {
        cmdAppName = appName;
    })
    .option("-o, --out <output-folder>", "Specifies the output (build) folder of the project. Defaults to wwwroot", out)
    .option("-s, --src <src-folder>", "Specifies the name of the folder that will hold all source files. Defaults to src.", src)
    .option("--use-bower", "Enables Bower usage in the project, otherwise it will use only NPM.")
    .parse(process.argv);

if (typeof cmdAppName === "undefined") {
    console.log("You must specify an app name.");
    process.exit(1);
}

var camel = _.camelCase("mySuperDuperLongProjectWithAliensAndCats");
console.log(camel);
var pascal = camel.slice(0, 1).toUpperCase() + camel.substr(1);
console.log(pascal);
var hyphen = camel.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
console.log(hyphen);

program.out = program.out || "wwwroot";
program.src = program.src || "src";
program.useBower = program.useBower || false;

console.log(program.useBower);
console.log(program.out);
console.log(program.src);