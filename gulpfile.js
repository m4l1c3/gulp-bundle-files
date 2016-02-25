var gulp = require('gulp'),
    gulpBundleFiles = require('./index.js'),
    eslint = require('gulp-eslint'),
    bundles = require('./sample-options.json');

gulp.task('lint', function() {
    return gulp.src(['**/*.js', '!node_modules/**', '!coverage/**', '!dist/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('bundle', ['lint'], function() {
    gulpBundleFiles(bundles);
});

gulp.task('default', ['lint', 'bundle']);