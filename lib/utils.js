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
 */
function registerItem(name, isComponent) {
    var suffix = isComponent ? 'Component' : 'Directive';
    var itemName = {
        pascal: pascalCase(name + suffix),
        kebab: hyphenate(name),
        camel: name
    };
    var files = fs.readdirSync(process.cwd());
    var moduleFile, moduleFileName;

    files.forEach(function (file, index) {
        if (file.indexOf('module.ts') > -1) {
            moduleFile = files[index];
            moduleFileName = files[index];
        }
    });

    if (moduleFile) {
        moduleFile = path.join(process.cwd(), moduleFile);
        var content = fs.readFileSync(moduleFile, 'utf8');
        if (content.indexOf(itemName.pascal) > -1) {
            console.log(chalk.yellow(itemName.pascal + chalk.white(' has already been registered in ' + chalk.cyan.bold(moduleFileName) + '!')));
            return;
        }
        var sentences = content.split(/\n/g);

        var registrationIndex;
        var lastImportIndex;
        for (var i = 0; i < sentences.length; i++) {
            if (sentences[i].indexOf('import') > -1) {
                lastImportIndex = i + 1;
            }

            if (sentences[i].indexOf(')') > -1) {
                registrationIndex = i + 2;
                break;
            }
        }

        var importString = 'import { ' + itemName.pascal + " } from './" + itemName.kebab + "/" + itemName.kebab + "." + _.camelCase(suffix) + "';";
        var registrationString = "    ." + _.camelCase(suffix) + "('" + itemName.camel + "', " + itemName.pascal + ")";

        sentences.splice(lastImportIndex, 0, importString);
        sentences.splice(registrationIndex, 0, registrationString);

        fs.writeFileSync(moduleFile, sentences.join('\n'), 'utf8');
        console.log(chalk.blue("Updated file: " + moduleFileName));
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