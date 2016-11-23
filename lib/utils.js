const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const findRoot = require("find-root");

/**
 * Receives a camel or pascal cased string, hyphenates it and makes it lowercase.
 * E.g.  myString -> my-string,   MyString -> my-string
 * @param {string} str The string to hyphenate.
 * @returns A hyphenated string in lowercase.
 */
function hyphenate(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
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
 * @returns A package.json object.
 */
function getPkg() {
    var root = findRoot(process.cwd());
    return root;
}

/**
 * Gets the application name.
 * @returns A string with the application name in hyphenated syntax.
 */
function getAppName() {
    return require(path.join(getPkg(), "package.json")).name;
}

/**
 * Gets the decorator path relative to src folder.
 * @param {string} [path] An optional path to use for calculating decorator path.
 * @returns A relative to src folder path string for the decorator.
 */
function getDecoratorPath(path) {
    var rootPath = getPkg();
    var srcPath = process.cwd().replace(rootPath, "");
    var paths = srcPath.split("/").slice(2);
    var decoratorPath = "";
    if (paths.length === 0) {
        decoratorPath = "./decorators/decorators";
    } else {
        for (var i = 0; i < paths.length; i++) {
            decoratorPath = decoratorPath.concat("../");
        }
        decoratorPath = decoratorPath.concat("decorators/decorators");
    }

    return decoratorPath;
}

/**
 * Reads all templates inside a template folder.
 * @param {string} relPath Relative path from the templates folder.
 * @returns An object with the name of the template as a key and the content as the value.
 */
function readTemplates(relPath) {
    var fullPath = path.join(__dirname, "..", "templates", relPath);
    var files = fs.readdirSync(fullPath);
    var tpls = {};

    files.forEach(function (file) {
        var filePath = path.join(fullPath, file);
        var content = fs.readFileSync(filePath, "utf8");
        tpls[file] = content;
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
    var filePath = path.join(__dirname, "..", "templates", relPath, templateName);

    var content = fs.readFileSync(filePath, "utf8");
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
            if (key.indexOf("Iname") > -1) {
                key = "I" + pascalCase(name) + "Service.ts";
            }
        }

        key = key.replace("name", hyphenate(name));
        key = key.replace("_", "");
        tpls[key] = tpl(values);
    }

    return tpls;
}

/**
 * Writes the template files in the specified folder.
 * @param {Object} templates An object containing the template name as the key and content as value.
 * @param {string} folder Folder in which the files will be written.
 */
function writeFiles(templates, folder) {
    for (var tplName in templates) {
        fs.writeFileSync(path.join(folder, tplName), templates[tplName], "utf8");
    }
}

module.exports = {
    hyphenate: hyphenate,
    pascalCase: pascalCase,
    isHyphenated: isHyphenated,
    getAppName: getAppName,
    getDecoratorPath: getDecoratorPath,
    readTemplates: readTemplates,
    readTemplate: readTemplate,
    compileTemplates: compileTemplates,
    writeFiles: writeFiles
};