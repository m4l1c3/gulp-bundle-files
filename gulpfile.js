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

gulp.task('prebundle', function(done) {
    gulpBundleFiles(bundles.preBundle, bundles); 
    done();
});

gulp.task('bundle', ['prebundle'], function(done) {
    gulpBundleFiles(bundles.files, bundles);
    done();
});



gulp.task('watch', function() {
    gulp.watch(['tests/fixtures.js', 'tests/main.js', '*.js'], ['mocha']);
});

gulp.task('default', ['mocha']);
gulp.task('testenvironment', ['bundle']);