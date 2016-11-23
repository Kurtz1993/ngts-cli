const path = require('path');
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
 * @returns A package.json object.
 */
function getPkg() {
    var root = findRoot(process.cwd());
    return require(path.join(root, 'package.json'));
}

/**
 * Gets the application name.
 * @returns A string with the application name in hyphenated syntax.
 */
function getAppName() {
    return getPkg().name;
}

module.exports = {
    hyphenate: hyphenate,
    pascalCase: pascalCase,
    isHyphenated: isHyphenated,
    getAppName: getAppName
};