var gulp = require('gulp'),
    gulpBundleFiles = require('./index.js'),
    eslint = require('gulp-eslint'),
    mocha = require('gulp-mocha'),
    bundles = require('./sample-options.json');

gulp.task('lint', function() {
    return gulp.src(['**/*.js', '!node_modules/**', '!coverage/**', '!dist/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('mocha', ['lint'], function() {
    return gulp.src('tests/main.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('bundle', function() {
    return gulp.src(bundles)
        .pipe(gulpBundleFiles(bundles))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch(['tests/fixtures.js', 'tests/main.js', '*.js'], ['mocha']);
});

gulp.task('default', ['mocha']);