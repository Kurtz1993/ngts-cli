const gulp = require('gulp');
const templateCache = require('gulp-angular-templatecache');
const sass = require('gulp-sass');

// Gulp configuration file.
const config = require('./gulpfile.config')();

gulp.task('sass', function() {
    return gulp.src(config.scss.entry)
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest(config.scss.destPath));
});

gulp.task('bundle-tpls', function() {
    return gulp.src(config.html.src)
        .pipe(templateCache({ module: '<%= appName %>.tpls', standalone: true, filename: '<%= hAppName %>.tpls.js' }))
        .pipe(gulp.dest(config.html.dest));
});

// Watches for changes in application's files
gulp.task('watch', ['build-ui'], function(done) {
    gulp.watch(config.scss.src, ['css']);
    gulp.watch(config.html.src, ['bundle-tpls']);
});

// Bundle HTML and SCSS files.
gulp.task('build-ui', ['sass', 'bundle-tpls']);