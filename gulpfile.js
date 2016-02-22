var gulp = require('gulp'),
    gulpBundleFiles = require('./index.js'),
    eslint = require('gulp-eslint'),
    bundles = require('./sample-options.json');

gulp.task('lint', function() {
    return gulp.src('**/*.js', '!node_modules/**')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('bundle', function() {
    return gulpBundleFiles(bundles);
});

gulp.task('default', ['bundle']);