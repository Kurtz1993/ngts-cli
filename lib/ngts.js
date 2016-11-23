#!/usr/bin/env node

const program = require('commander');
const version = require('../package.json').version;

program
  .version(version)
  .command("project", "Creates an AngularJS base project using TypeScript.")
  .command("component", "Creates an AngularJS component.")
  .command("controller", "Creates an AngularJS controller.")
  .command("directive", "Creates an AngularJS directive.")
  .command("module", "Creates an AngularJS module.")
  .command("service", "Creates an AngularJS service.")
  .parse(process.argv);