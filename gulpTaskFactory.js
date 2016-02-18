'use strict';

var concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	path = require('path'),
	config = require('./package.json'),
	gulp = require('gulp'),
	PluginError = gutil.PluginError;

exports.gulpTaskFactory = function(gulpTask, options) {
	var task = function (gulpTask, options) {
		var isJs = gulpTask.indexOf('.js') > 0;

		if (options.concat !== undefined && options.concat.active && options.concat.config === undefined) {
			throw new PluginError(config.name, 'No concat settings');
		}

		if (options.uglify !== undefined && options.uglify.active && options.uglify.config === undefined) {
			throw new PluginError(config.name, 'No uglify settings');
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
				.pipe(gulp.dest(path.join(options.destinationFolder, 'js')));
		} catch (ex) {
			gutil.log(gutil.colors.red('Error creating bundle: ' + gulpTask));
			throw new PluginError(config.name, 'Error creating bundle.');
		}
	};
	return task(gulpTask, options);
};