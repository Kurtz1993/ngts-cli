#!/usr/bin/env node

const program = require('commander');
const version = require('../package.json').version;

program
  .version(version)
  .command("hello", "Say hello!")
  .parse(process.argv);