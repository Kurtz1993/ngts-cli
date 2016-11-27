module.exports = function () {
    var outputPath = "./<%= outFolder %>/";
    var src = "./<%= srcFolder %>/";

    var config = {
        vendor: {
            destPath: outputPath + "js",
            src: []
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