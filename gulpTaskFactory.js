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
	var task = function (gulpTask, options) {
		var isJs = gulpTask.indexOf('.js') > 0,
			isCss = !isJs;

		if (options.concat !== undefined && options.concat.active && options.concat.config === undefined) {
			throw new PluginError(config.name, 'No concat settings');
		}

		if (options.uglify !== undefined && options.uglify.active && options.uglify.config === undefined) {
			throw new PluginError(config.name, 'No uglify settings');
		}

		if (options.less !== undefined && options.less.active && options.less.config === undefined) {
			throw new PluginError(config.name, 'No less settings');
		}

		if (options.autoprefixer !== undefined && options.autoprefixer.active && options.autoprefixer.config === undefined) {
			throw new PluginError(config.name, 'No autoprefixer settings');
		}

		try {
			return gulp.src(options.files[gulpTask])
				.pipe(
					gulpif(
						options.concat.active && isJs,
						function () {
							return concat(gulpTask);
						}
					)
				)
				.pipe(
					gulpif(
						options.uglify.active && isJs,
						function () {
							return uglify(options.uglify.config);
						}
					)
				)
				.pipe(
					gulpif(
						options.less !== undefined && options.less.active && isCss,
						function () {
							return less(options.less.config);
						}
					)
				)
				.pipe(
					gulpif(
						options.autoprefixer !== undefined && options.autoprefixer.active && isCss,
						function () {
							return autoprefixer(options.autoprefixer.config);
						}
					)
				)
				.pipe(gulp.dest(path.join(options.destinationFolder, 'js')));
		} catch (ex) {
			gutil.log(gutil.colors.red('Error creating bundle: ' + gulpTask));
			throw new PluginError(config.name, 'Error creating bundle.');
		}
	};

	var GulpTask = task(gulpTask, options);
	return task;
};