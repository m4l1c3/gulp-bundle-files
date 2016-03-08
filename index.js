'use strict';

var config = require('./package.json'),
	gutil = require('gulp-util'),
	GulpTaskFactory = require('./GulpTaskFactory').gulpTaskFactory,
	BundleCheck = require('./BundleCheck').BundleCheck,
	PluginError = gutil.PluginError,
	through = require('through2'),
	HandleInvalidPackages = require('./InvalidPackage').HandleInvalidPackages;

module.exports = function(options, test) {
	test = test || false;

	var bundles,
		gulp = require('gulp');

	function prefixStream(prefixText) {
		var stream = through();
		stream.write(prefixText);
		return stream;
	}

	options = options || {};
	options.parentTaskName = options.parentTaskName || 'bundle';

	if(options.destinationFolder === undefined || options.destinationFolder.length < 1) {
		throw new PluginError(config.name, 'Missing destinationFolder gulp-bundle-files');
	}
	if ('object' !== typeof options.files) {
		throw new PluginError(config.name, 'File input in wrong format, please use an array or object.');
	}

	//setup an array of all the destination
	//filenames to be used as the task/bundle name
	bundles = Object.keys(options.files);

	if (!bundles.length) {
		throw new PluginError(config.name, 'No file input stored in options.files.');
	} else {
		var validPackages = BundleCheck(bundles, options.files),
			option = new Buffer(JSON.stringify(options));

		//if no valid packages, handle showing user's the errors
		if (validPackages !== true) {
			HandleInvalidPackages(validPackages, test);
		} else {
			bundles.forEach(function (taskName) {
				if (taskName === '') {
					throw new PluginError(config.name, 'Error creating bundle: no bundle name');
				}
				if (!options.files[taskName].length) {
					throw new PluginError(config.name, 'No files inside named bundle');
				}

				//parent task has been run, inject task into gulps task
				/* istanbul ignore if */
				if(gulp.seq.indexOf(options.parentTaskName) > -1) {
					GulpTaskFactory(taskName, options);
					gulp.seq.push(taskName);
				}
			});
			//return through.obj(function(file, enc, cb) {
			//	if(file.isNull()) {
			//		return cb(null, file);
			//	}
			//
			//	if(file.isBuffer()) {
			//		file.contents = Buffer.concat([options.files, file.contents]);
			//	}
			//
			//	if(file.isStream()) {
			//		file.contents = files.contents.pipe(prefixStream(options));
			//	}
			//
			//	cb(null, file);
			//});
			//taskName from the current bundle, this ends up being the destination file's name

		}
	}
};