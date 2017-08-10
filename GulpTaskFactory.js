'use strict';

var concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	path = require('path'),
	config = require('./package.json'),
	gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
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
		return gulp.task(gulpTask, function(done) {
				gulp.src(options.files[gulpTask])
                    .pipe(
                        gulpif(
                            !options.isProductionBuild && options.sourcemap !== undefined && options.sourcemap.active,
                            sourcemaps.init()
                        )
                    )
                    .pipe(
						gulpif(
							options.concat.active,
							concat(gulpTask, {newLine: (options.newLine !== undefined ? options.newLine : ';')})
						)
					)
                    .pipe(
                        gulpif(
                            !options.isProductionBuild && options.sourcemap !== undefined && options.sourcemap.active,
                            sourcemaps.write()
                        )
                    )
					.pipe(
						gulpif(
						    isJs && options.isProductionBuild && options.uglify.active,
							uglify(options.uglify.config)
						)
					)
					.pipe(gulp.dest(options.destinationFolder));
					done();
			}
		);
	};
	return task(gulpTask, options);
};
