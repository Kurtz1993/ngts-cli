module.exports = function () {
    var outputPath = './<%= outFolder %>/';
    var src = './<%= srcFolder %>/';

    var config = {
        templates: src + '**/*.tpl.html',
        scss: {
            entry: src + 'styles/<%= hAppName %>.scss',
            src: [src + '**/*.scss'],
            destPath: outputPath + 'css'
        },
        html: {
            src: [src + '**/**.html'],
            dest: outputPath + 'js'
        }
    };

    return config;
};