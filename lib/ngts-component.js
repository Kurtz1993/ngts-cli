#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const utils = require('./utils');
const chalk = require('chalk');
var dest = '';

program
    .usage('<component-name> [options]')
    .arguments('<component-name>')
    .action(function (componentName) {
        cmdComponentName = componentName;
    })
    .option('-a, --ctrl-alias <alias>', 'Alias for the controller inside the component. Defaults to $ctrl.')
    .option('--no-stylesheet', 'Specifies if the stylesheet should not be generated.')
    .parse(process.argv);

if (typeof cmdComponentName === 'undefined') {
    console.log(chalk.bold.red('You must specify a name for the component.'));
    process.exit(1);
}

program.ctrlAlias = program.ctrlAlias || '$ctrl';

cmdComponentName = utils.camelCase(cmdComponentName);

dest = utils.hyphenate(cmdComponentName).concat('/');

var vals = {
    pName: utils.pascalCase(cmdComponentName),
    ctrlAlias: program.ctrlAlias,
    hName: utils.hyphenate(cmdComponentName),
    decoratorPath: utils.getDecoratorPath(dest),
    tplPath: utils.getRelativePath()
};

var tpls = utils.readTemplates('component');
var ctrlTpl = utils.readTemplate('module', '_name.controller.ts');
var htmlTpl = utils.readTemplate('module', '_name.tpl.html');

tpls = utils.extend(tpls, ctrlTpl, htmlTpl);

if (!program.noStylesheet) {
    var scssTpl = utils.readTemplate('module', '_name.scss');

    tpls = utils.extend(tpls, scssTpl);
}

tpls = utils.compileTemplates(tpls, vals, cmdComponentName);

utils.writeFiles(tpls, dest);