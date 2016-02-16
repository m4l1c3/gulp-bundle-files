'use strict';

var concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	path = require('path'),
	config = require('./package.json'),
	gulp = require('gulp');

exports.gulpTaskFactory = function(gulpTask, options) {
	return gulp.task(gulpTask, function () {
		var isJs = gulpTask.endsWith('.js'),
			isCss = !isJs;

		if (isJs) {
			try {
				return gulp.src(options.files[gulpTask])
					.pipe(
						gulpif(
							options.concat !== undefined && options.concat.active && isJs,
							concat(gulpTask)
						)
					)
					.pipe(
						gulpif(
							options.uglify !== undefined && options.uglify.active && isJs,
							uglify(options.uglify.config)
						)
					)
					.pipe(gulp.dest(path.join(options.destinationFolder, 'js')));
			} catch (ex) {
				gutil.log(gutil.colors.red('Error creating Javascript bundle: ' + gulpTask));
				throw new PluginError(config.name, 'Error creating Javascript bundle.');
			}
		}
		else if (isCss) {
			try {
				return gulp.src(options.files[gulpTask])
					.pipe(
						gulpif(
							options.less !== undefined && options.less.active && isCss,
							less(options.less.config)
						)
					)
					.pipe(gulp.dest(path.join(options.destinationFolder, 'css')));
			} catch (ex) {
				gutil.log(gutil.colors.red('Error creating CSS bundle: ' + gulpTask));
				throw new PluginError(config.name, 'Error creating CSS bundle.');
			}
		}
	});
};