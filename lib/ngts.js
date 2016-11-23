#!/usr/bin/env node

const program = require("commander");
const version = require("../package.json").version;

program
  .version(version)
  .usage("<command> [options]")
  .command("app", "Creates an AngularJS base app using TypeScript.")
  .command("component", "Creates an AngularJS component.")
  .command("controller", "Creates an AngularJS controller.")
  .command("directive", "Creates an AngularJS directive bound to a controller.")
  //.command("module", "Creates an AngularJS module.")
  .command("service", "Creates an AngularJS service.")
  .parse(process.argv);