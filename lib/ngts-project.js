#!/usr/bin/env node

var program = require('commander');
var _ = require("lodash");
var utils = require('./utils');

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

program.out = program.out || "wwwroot";
program.src = program.src || "src";
program.useBower = program.useBower || false;