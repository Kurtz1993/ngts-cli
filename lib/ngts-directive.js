#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const utils = require('./utils');
const chalk = require('chalk');
var dest = '';

program
    .usage('<directive-name> [options]')
    .arguments('<directive-name>')
    .action(function (directiveName) {
        cmdDirectiveName = directiveName;
    })
    .option('-r, --restrict <restriction>', 'Restrict the directive as attribute, element, class or comment. [A, E, C, M]. Could be multiple values like AE.')
    .option('-a, --ctrl-alias <alias>', 'Alias for the controller inside the directive. Defaults to $ctrl.')
    .option('-t, --template', 'Generate a template along with the directive.')
    .option('-s, --scss', 'Generate a SCSS stylesheet along with the directive.')
    .parse(process.argv);

if (typeof cmdDirectiveName === 'undefined') {
    console.log(chalk.bold.red('You must specify a name for the directive.'));
    process.exit(1);
}

program.ctrlAlias = program.ctrlAlias || '$ctrl';

cmdDirectiveName = utils.camelCase(cmdDirectiveName);

dest = utils.hyphenate(cmdDirectiveName).concat('/');

var vals = {
    restrict: !!program.restrict,
    restriction: program.restrict,
    pName: utils.pascalCase(cmdDirectiveName),
    ctrlAlias: program.ctrlAlias,
    hName: utils.hyphenate(cmdDirectiveName),
    decoratorPath: utils.getDecoratorPath(dest),
    tplPath: utils.getRelativePath(),
    hasTemplate: !!program.template
};

var tpls = utils.readTemplates('directive');
var ctrlTpl = utils.readTemplate('module', '_name.controller.ts');

tpls = utils.extend(tpls, ctrlTpl);

if (program.template || (!!program.restrict && program.restrict.indexOf('E') > -1)) {
    var htmlTpl = utils.readTemplate('module', '_name.tpl.html');

    tpls = utils.extend(tpls, htmlTpl);
}

if (program.scss && program.template) {
    var scssTpl = utils.readTemplate('module', '_name.scss');

    tpls = utils.extend(tpls, scssTpl);
}

tpls = utils.compileTemplates(tpls, vals, cmdDirectiveName);

utils.writeFiles(tpls, dest);
utils.registerItem(cmdDirectiveName, false);