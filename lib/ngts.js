const program = require('commander');
const version = require('../package.json').version;

program
  .version(version);

module.exports = program;