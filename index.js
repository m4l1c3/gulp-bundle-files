'use strict';

var config = require('./package.json'),
	gutil = require('gulp-util'),
	GulpTaskFactory = require('./GulpTaskFactory').gulpTaskFactory,
	BundleCheck = require('./BundleCheck').BundleCheck,
	PluginError = gutil.PluginError,
    argv = require('yargs').argv,
    isProductionBuild = argv.mode === 'production',
	HandleInvalidPackages = require('./InvalidPackage').HandleInvalidPackages;

module.exports  = function(options, test) {
	test = test || false;

	var bundles,
		gulp = require('gulp');


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
		var validPackages = BundleCheck(bundles, options.files);

		//if no valid packages, handle showing user's the errors
		if (validPackages !== true) {
			HandleInvalidPackages(validPackages, test);
		} else {
			//taskName from the current bundle, this ends up being the destination file's name
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
                    options.isProductionBuild = (isProductionBuild) ? true : false;
                    GulpTaskFactory(taskName, options);
					gulp.seq.push(taskName);
				}
			});
		}
	}
};