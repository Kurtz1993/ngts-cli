#!/usr/bin/env node

var program = require('commander');

program
    .option("-f, --force", "Force shit")
    .parse(process.argv);

console.log(program.force ? "Hello forced" : "Hello");