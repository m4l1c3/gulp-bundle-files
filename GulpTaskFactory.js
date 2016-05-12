'use strict';

var concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	path = require('path'),
	config = require('./package.json'),
	gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	PluginError = gutil.PluginError;

exports.gulpTaskFactory = function(gulpTask, options) {
	var task = function (gulpTask, options) {
		var isJs = gulpTask.indexOf('.js') > 0;

		if (options.concat !== undefined && options.concat.active && options.concat.config === undefined) {
			throw new PluginError(config.name, 'No concat settings');
		}

		if (options.uglify !== undefined && options.uglify.config === undefined) {
			throw new PluginError(config.name, 'No uglify settings');
		}

		/* istanbul ignore next */
		return gulp.task(gulpTask, function() {
				gulp.src(options.files[gulpTask])
					.pipe(
						gulpif(
							options.concat.active,
							concat(gulpTask)
						)
					)
					.pipe(
						gulpif(
						    isJs && options.isProductionBuild,
							uglify(options.uglify.config)
						)
					)
					.pipe(
						gulpif(
							options.cssnano.active && !isJs,
							cssnano(options.cssnano.config)
						)
					)
					.pipe(
						gulpif(
							options.autoprefixer.active && !isJs,
							autoprefixer(options.autoprefixer.config)
						)
					)
					.pipe(gulp.dest(options.destinationFolder));
			}
		);
	};
	return task(gulpTask, options);
};
