'use strict';

var concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	path = require('path'),
	config = require('./package.json'),
	gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
    argv = require('yargs').argv,
    isProductionBuild = argv.mode === 'production',
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

		if (options.autoprefixer !== undefined && options.autoprefixer.active && options.autoprefixer.config === undefined) {
			throw new PluginError(config.name, 'No autoprefixer settings')
		}

		if (options.less !== undefined && options.less.active && options.less.config === undefined) {
			throw new PluginError(config.name, 'No less settings')
		}

		if (options.sass !== undefined && options.sass.active && options.sass.config === undefined) {
			throw new PluginError(config.name, 'No sass settings')
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
						    options.uglify.active && isJs && (isProductionBuild),
							uglify(options.uglify.config)
						)
					)
                    .pipe(
                        gulpif(
                            options.less.active && !isJs && gulpTask.indexOf('.less') > 0,
                            less(options.less.config)
                        )
                    )
                    .pipe(
                        gulpif(
                            options.sass.active && !isJs && gulpTask.indexOf('.scss') > 0,
                            sass(options.sass.config)
                        )
                    )
					.pipe(
						gulpif(
							options.cssnano.active && !isJs && (isProductionBuild),
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
