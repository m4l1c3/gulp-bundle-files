'use strict';

var concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	path = require('path'),
	config = require('./package.json'),
	gulp = require('gulp'),
	PluginError = gutil.PluginError;

exports.gulpTaskFactory = function(gulpTask, options) {
	return gulp.task(gulpTask, function () {
		var isJs = gulpTask.endsWith('.js'),
			isCss = !isJs;

		try {
			return gulp.src(options.files[gulpTask])
				.pipe(
					gulpif(
						options.concat !== undefined && options.concat.active && isJs,
						function() {
							return concat(gulpTask);
						}
					)
				)
				.pipe(
					gulpif(
						options.uglify !== undefined && options.uglify.active && isJs,
						function() {
							return uglify(options.uglify.config);
						}
					)
				)
				.pipe(
					gulpif(
						options.less !== undefined && options.less.active && isCss,
						function() {
							return less(options.less.config);
						}
					)
				)
				.pipe(
					gulpif(
						options.autoprefixer !== undefined && options.autoprefixer.active && isCss,
						function() {
							return autoprefixer(options.autoprefixer.config);
						}
					)
				)
				.pipe(gulp.dest(path.join(options.destinationFolder, 'js')));
		} catch (ex) {
			gutil.log(gutil.colors.red('Error creating bundle: ' + gulpTask));
			throw new PluginError(config.name, 'Error creating bundle.');
		}
	});
};