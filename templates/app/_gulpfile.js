const gulp = require("gulp");
const templateCache = require("gulp-angular-templatecache");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const webpack = require("webpack-stream");
const webpackConf = require("./<%= srcFolder %>/webpack.config");

// Gulp configuration file.
const config = require("./gulpfile.config")();

/**
 * Builds TypeScript sources.
 * @param {boolean} watch Specifies if the build should occur in watch mode.
 */
function buildTypescript(watch) {
    return function() {
        webpackConf.watch = watch;
        return gulp
            .src("./<%= srcFolder %>/<%= appName %>.ts")
            .pipe(webpack(webpackConf))
            .pipe(gulp.dest(config.ts.dest));
    }
}

// Concatenate all vendor components into a single file.
gulp.task("bundle-vendors", function() {
    return gulp
        .src(config.vendor.src)
        .pipe(concat("vendors.js"))
        .pipe(gulp.dest(config.vendor.destPath));
});

gulp.task("sass", function() {
    return gulp.src(config.scss.entry)
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(gulp.dest(config.scss.destPath));
});

gulp.task("bundle-tpls", function() {
    return gulp.src(config.html.src)
        .pipe(templateCache({ module: "<%= appName %>.tpls", standalone: true, filename: "<%= appName %>.tpls.js" }))
        .pipe(gulp.dest(config.html.dest));
});

// Watches for changes in application"s files
gulp.task("watch", ["bundle-vendors", "build-ui"], function(done) {
    gulp.watch(config.scss.src, ["css"]);
    gulp.watch(config.html.src, ["bundle-tpls"]);
    buildTypescript(true)();
});

// Watches for changes in application"s files except for ts/js files.
gulp.task("watch-ui", ["build-ui"], function() {
    gulp.watch(config.scss.src, ["css"]);
    gulp.watch(config.html.src, ["bundle-tpls"]);
});

// Bundle all the application files.
gulp.task("build", ["bundle-ts", "bundle-vendors", "build-ui"]);
// Bundle all TS app files.
gulp.task("bundle-ts", buildTypescript(false));
// Bundle HTML and SCSS files.
gulp.task("build-ui", ["sass", "bundle-tpls"]);