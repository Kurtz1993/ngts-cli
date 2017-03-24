const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const findRoot = require('find-root');

/**
 * Receives a camel or pascal cased string, hyphenates it and makes it lowercase.
 * E.g.  myString -> my-string,   MyString -> my-string
 * @param {string} str The string to hyphenate.
 * @returns A hyphenated string in lowercase.
 */
function hyphenate(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Transforms a camelCased string into PascalCase.
 * @param {string} str A camelCased string.
 * @returns A PascalCased string.
 */
function pascalCase(str) {
    return str.slice(0, 1).toUpperCase() + str.substr(1);
}

/**
 * Checks if a string is in hyphenated format.
 * @param {string} str A string to check.
 * @returns True if the string is in hyphenated-syntax.
 */
function isHyphenated(str) {
    return /(-)+/g.test(str);
}

/**
 * Gets the package.json file.
 * @param {string} dir Relative folder in which to look for the package.json.
 * @returns A package.json object.
 */
function getRootPath(dir) {
    var dir = dir ? path.sep.concat(dir) : '';
    var root = findRoot(process.cwd().concat(dir));
    return root;
}

/**
 * Gets the application name.
 * @returns A string with the application name in hyphenated syntax.
 */
function getAppName() {
    return require(path.join(getRootPath(), 'package.json')).name;
}

/**
 * Gets the decorator path relative to src folder.
 * @param {string} [relativePath] An optional relative path to use for calculating decorator path.
 * @returns A relative to src folder path string for the decorator. The relative path must end with a /.
 */
function getDecoratorPath(relativePath) {
    relativePath = relativePath || '';
    var hasTrailingSlash = relativePath.substring(relativePath.length - 1) === '/';
    var rootPath = getRootPath();
    var srcPath = path.join(process.cwd().replace(rootPath, ''), relativePath);
    var paths = srcPath.split(path.sep).slice(2);
    var decoratorPath = '';

    if (paths.length === 0) {
        decoratorPath = './';
    } else if (paths.length === 1) {
        decoratorPath = '../';
    }
    else {
        if (hasTrailingSlash) paths.pop();

        paths.forEach(function () {
            decoratorPath = decoratorPath.concat('../');
        });
        // for (var i = 0; i < paths.length - 1; i++) {
        // }
    }
    decoratorPath = decoratorPath.concat('decorators/decorators');

    return decoratorPath;
}

/**
 * Gets the path relative to src folder.
 * @param {string} [p] An optional path to use for calculating decorator path.
 * @returns A relative to src folder path string.
 */
function getRelativePath(p) {
    var rootPath = getRootPath();
    var srcPath = process.cwd().replace(rootPath, '');
    var paths = srcPath.split(path.sep).slice(2);
    var relativePath = '';

    if (paths.length > 0) {
        paths.forEach(function (p) {
            relativePath = relativePath.concat(p).concat('/');
        });
    }

    return relativePath;
}

/**
 * Reads all templates inside a template folder.
 * @param {string} relPath Relative path from the templates folder.
 * @returns An object with the name of the template as a key and the content as the value.
 */
function readTemplates(relPath) {
    var fullPath = path.join(__dirname, '..', 'templates', relPath);
    var files = fs.readdirSync(fullPath);
    var tpls = {};

    files.forEach(function (file) {
        var filePath = path.join(fullPath, file);
        var stat = fs.statSync(filePath);
        if (!stat.isDirectory()) {
            var content = fs.readFileSync(filePath, 'utf8');
            tpls[file] = content;
        }
    });

    return tpls;
}

/**
 * Reads a specific template inside a template folder.
 * @param {string} relPath Relative path from the templates folder.
 * @param {string} templateName Template name to look for.
 * @returns An object with the name of the template as a key and the content as the value.
 */
function readTemplate(relPath, templateName) {
    var filePath = path.join(__dirname, '..', 'templates', relPath, templateName);

    var content = fs.readFileSync(filePath, 'utf8');
    var template = {};
    template[templateName] = content;

    return template;
}

/**
 * Compiles the templates with the given data.
 * @param {Object} templates An object containing the template name as the key and content as value.
 * @param {Object} values Any values needed for the templates.
 * @param {string} name Hyphenated name that the files will have.
 * @param {boolean} [isService] If is service template names will be PascalCased.
 * @returns The compiled templates object.
 */
function compileTemplates(templates, values, name, isService) {
    var tpls = {};
    for (var key in templates) {
        var tpl = _.template(templates[key]);
        if (isService) {
            if (key.toLowerCase().indexOf('iname') > -1) {
                key = 'I' + pascalCase(name) + 'Service.ts';
            }
        }

        key = key.replace('name', hyphenate(name));
        key = key.replace('_', '');
        tpls[key] = tpl(values);
    }

    return tpls;
}

/**
 * Writes the template files in the specified folder.
 * @param {Object} templates An object containing the template name as the key and content as value.
 * @param {string} [dir] The name of the folder that will hold the file.
 */
function writeFiles(templates, dir) {
    dir = dir || '';
    var folders = dir.split('/');

    if (folders.length === 1) {
        writeFile(process.cwd(), templates);
        return;
    }

    folders.splice(folders.length - 1);

    folders.forEach(function (folderName) {
        var folder = path.join(process.cwd(), folderName);
        try {
            var stat = fs.statSync(folder);
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.log(chalk.green('Creating directory: ') + chalk.bold.white(folderName));
                fs.mkdirSync(folder);
            }
        }
        writeFile(folder, templates);
    });

}

/**
 * Writes the templates in the specified folder.
 * @param {string} folder The folder in which the templates will be written.
 * @param {Object} templates An object containing the template name as the key and content as value.
 */
function writeFile(folder, templates) {
    for (var tplName in templates) {
        var file = path.join(folder, tplName);
        try {
            var stat = fs.statSync(file);
            console.log(chalk.red('You already have a file named: ') + chalk.bold.white(tplName));
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                fs.writeFileSync(file, templates[tplName], 'utf8');
                console.log(chalk.green('Created file: ' + chalk.bold.white(tplName)));
            }
        }
    }
}

/**
 * Registers the specified item in the parent module.
 * @param {string} name Name of the item in camelCase.
 * @param {boolean} isComponent If true, component will be registered. Otherwise it will be a directive.
 * @param {boolean} includeStylesheet If true, also registers the .scss file into the parent module's .scss file.
 */
function registerItem(name, isComponent, includeStylesheet) {
    var suffix = isComponent ? 'Component' : 'Directive';
    var itemName = {
        pascal: pascalCase(name),
        kebab: hyphenate(name),
        camel: name
    };

    var files = fs.readdirSync(process.cwd());
    var moduleFile, moduleFileName;
    var stylesheet = searchParentStylesheet(files);

    files.forEach(function (file) {
        if (file.indexOf('module.ts') > -1) {
            moduleFile = file;
            moduleFileName = file;
        }
    });

    if (moduleFile) {
        moduleFile = path.join(process.cwd(), moduleFile);
        var content = fs.readFileSync(moduleFile, 'utf8');
        if (content.indexOf(itemName.pascal + suffix) > -1) {
            console.log(
                chalk.yellow(itemName.pascal +
                    chalk.white(' has already been registered in ' +
                        chalk.cyan.bold(moduleFileName) + '!')));
        } else {
            var sentences = content.split(/\n/g);

            var itemRegistrationIndex;
            var controllerRegistrationIndex;
            var lastControllerImportIndex;
            var lastItemImportIndex;
            var hasAngularImport;
            var hasConfig;

            for (var i = 0; i < sentences.length; i++) {
                hasAngularImport = !hasAngularImport ?
                    (sentences[i].indexOf('import * as angular') > -1 ? 1 : 0)
                    : hasAngularImport;
                hasConfig = !hasConfig ?
                    (sentences[i].indexOf('Config }') > -1 ? 2 : 0)
                    : hasConfig;

                if (sentences[i].indexOf('Controller }') > -1) {
                    lastControllerImportIndex = i + 1;
                }

                if (sentences[i].indexOf(suffix + ' }') > -1) {
                    lastItemImportIndex = i + 2;
                }

                if (sentences[i].indexOf('.' + _.camelCase(suffix) + '(') > -1) {
                    itemRegistrationIndex = i + 3;
                }

                if (sentences[i].indexOf('.controller(') > -1) {
                    controllerRegistrationIndex = i + 2;
                    break;
                }
            }

            lastControllerImportIndex = lastControllerImportIndex || 0 + hasAngularImport + hasConfig;
            lastItemImportIndex = lastItemImportIndex || 1 + hasAngularImport + hasConfig;
            controllerRegistrationIndex = controllerRegistrationIndex || 2 + 2 + hasAngularImport + hasConfig;
            itemRegistrationIndex = itemRegistrationIndex || 3 + 2 + hasAngularImport + hasConfig;

            var importItemString = 'import { ' + itemName.pascal + suffix + " } from './" + itemName.kebab + '/' + itemName.kebab + '.' + _.camelCase(suffix) + "';";
            var importControllerString = 'import { ' + itemName.pascal + "Controller } from './" + itemName.kebab + '/' + itemName.kebab + ".controller';";
            var registrationItemString = '    .' + _.camelCase(suffix) + "('" + itemName.camel + "', " + itemName.pascal + suffix + ')';
            var registrationControllerString = "    .controller('" + itemName.pascal + "Controller'," + itemName.pascal + 'Controller)';

            sentences.splice(lastControllerImportIndex, 0, importControllerString);
            sentences.splice(lastItemImportIndex, 0, importItemString);
            sentences.splice(itemRegistrationIndex, 0, registrationItemString, registrationControllerString);

            fs.writeFileSync(moduleFile, sentences.join('\n'), 'utf8');
            console.log(chalk.blue('Updated file: ' + moduleFileName));
        }
    }

    if (includeStylesheet && stylesheet) {
        var importScssString = "@import './" + itemName.kebab + '/' + itemName.kebab + ".scss';";
        var scss = fs.readFileSync(path.join(process.cwd(), stylesheet), 'utf8');

        if (scss.indexOf(itemName.kebab + '.scss') > -1) {
            console.log(chalk.yellow(itemName.kebab + '.scss')
                + chalk.white(' has already been registered in '
                    + chalk.cyan.bold(stylesheet) + '!'));
        } else {
            var lines = scss.split(/\n/g);
            var lastScssImportIndex = 0;
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].indexOf('@import') > -1) {
                    lastScssImportIndex = i + 1;
                }
            }
            lines.splice(lastScssImportIndex, 0, importScssString);
            scss = lines.join('\n');
            fs.writeFileSync(path.join(process.cwd(), stylesheet), scss, 'utf8');
            console.log(chalk.blue('Updated file: ' + stylesheet));
        }
    }

    /**
     * Searches for the parent stylesheet.
     * @param {string[]} files An array containing all the file names of the parent module.
     */
    function searchParentStylesheet(files) {
        var result;

        for (var i = 0; i < files.length; i++) {
            if (files[i].indexOf('.scss') > -1) {
                result = files[i];
                break;
            }
        }

        return result;
    }
}

module.exports = {
    hyphenate: hyphenate,
    pascalCase: pascalCase,
    camelCase: _.camelCase,
    isHyphenated: isHyphenated,
    getAppName: getAppName,
    getDecoratorPath: getDecoratorPath,
    getRelativePath: getRelativePath,
    getRootPath: getRootPath,
    readTemplates: readTemplates,
    readTemplate: readTemplate,
    compileTemplates: compileTemplates,
    writeFiles: writeFiles,
    writeFile: writeFile,
    extend: _.extend,
    registerItem: registerItem
};