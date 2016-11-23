#!/usr/bin/env node

const program = require('commander');
const version = require('../package.json').version;

program
  .version(version)
  .command("create", "Creates an AngularJS base project using TypeScript.")
  .parse(process.argv);