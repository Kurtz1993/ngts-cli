/**
 * Receives a camel or pascal cased string, hyphenates it and makes it lowercase.
 * E.g.  myString -> my-string,   MyString -> my-string
 * @param {string} str The string to hyphenate.
 * @returns A hyphenated string in lowercase.
 */
function hyphenate (str) {
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

module.exports = {
    hyphenate: hyphenate,
    pascalCase: pascalCase
};