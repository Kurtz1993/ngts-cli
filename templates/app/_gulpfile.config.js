module.exports = function () {
    var outputPath = "./<%= outFolder %>/";
    var src = "./<%= srcFolder %>/";

    var config = {
        vendor: {
            destPath: outputPath + "js",
            src: [
                "node_modules/angular/angular.js",
                "node_modules/angular-ui-router/release/angular-ui-router.js"
            ]
        },
        templates: src + "**/*.tpl.html",
        scss: {
            entry: src + "styles/<%= hAppName %>.scss",
            src: [src + "**/*.scss"],
            destPath: outputPath + "css"
        },
        ts: {
            src: [src + "**/*.ts"],
            dest: outputPath + "js"
        },
        html: {
            src: [src + "**/**.html"],
            dest: outputPath + "js"
        }
    };

    return config;
};