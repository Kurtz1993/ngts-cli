#!/usr/bin/env node

var program = require('commander');

function out(val) {
    return val;
}

program
    .usage("<appName> [options]")
    .arguments("<appName>")
    .action(function (appName) {
        cmdAppName = appName;
    })
    .option("-o, --out <output-folder>", "Specifies the output (build) folder of the project.", out)
    .option("--use-bower", "Enables Bower usage in the project, otherwise it will use only NPM.")
    .parse(process.argv);

if (typeof cmdAppName === "undefined") {
    console.log("You must specify an app name.");
    process.exit(1);
}

console.log(cmdAppName);
console.log(program.useBower);
console.log(program.out);