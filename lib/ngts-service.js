#!/usr/bin/env node

var program = require('commander');
var _ = require("lodash");
var utils = require('./utils');

program
    .usage("<service-name> [options]")
    .arguments("<service-name>")
    .action(function (serviceName) {
        cmdServiceName = serviceName;
    })
    .parse(process.argv);

if (typeof cmdServiceName === "undefined") {
    console.log("You must specify a name in hyphenated-syntax.");
    process.exit(1);
}

if (!utils.isHyphenated(cmdServiceName)) {
    console.log("You must specify a name in hyphenated-syntax.");
    process.exit(1);
}

cmdServiceName = cmdServiceName.toLowerCase();
console.log(utils.getAppName())
//console.log(process.cwd());