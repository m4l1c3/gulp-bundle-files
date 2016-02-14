'use strict';

var concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	gulpif = require('gulp-if'),
	gulp = require('gulp');

exports.gulpTaskFactory = function(gulpTask, options) {
	return gulp.task(gulpTask, function () {
		var isJs = taskName.endsWith('.js'),
			isCss = !isJs;

		if (isJs) {
			try {
				return gulp.src(options.files[gulpTask])
					.pipe(
						gulpif(
							options.concat !== undefined
							&& options.concat.active
							&& isJs,
							concat(taskName)
						)
					)
					.pipe(
						gulpif(
							options.uglify !== undefined
							&& options.uglify.active
							&& isJs,
							uglify(options.uglify.config)
						)
					)
					.pipe(gulp.dest(path.join(options.destinationFolder, 'js')));
			} catch (ex) {
				throw new PluginError(config.name, "Error creating JS bundle: " + options.files[taskName]);
			}
		}
		else if (isCss) {
			return gulp.src(options.files[taskName])
				.pipe(
					gulpif(
						options.less !== undefined
						&& options.less.active
						&& isCss,
						less(options.less.config)
					)
				)
				.pipe(gulp.dest(path.join(options.destinationFolder, 'css')));
		}
	});
};