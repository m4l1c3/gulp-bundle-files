'use strict';

var config = require('./package.json'),
	gutil = require('gulp-util'),
	gulpTaskFactory = require('./gulpTaskFactory').gulpTaskFactory,
	bundleCheck = require('./bundleCheck').BundleCheck,
	PluginError = gutil.PluginError;

module.exports  = function(options) {

	var bundles,
		Tasks = [],
		handleInvalidPackages = function (invalidPackages) {
			gutil.log('Files missing from bundles: ');
			for (var i in invalidPackages) {
				gutil.log(gutil.colors.gray('-- ' + invalidPackages[i].getName()));
				gutil.beep();
			}
			throw new PluginError(config.name, 'Error creating bundle, bundles are missing files.');
		};

	options = options || {};

	if(options.destinationFolder === undefined || options.destinationFolder.length < 1) {
		throw new PluginError(config.name, 'Missing destinationFolder gulp-bundle-files');
	}
	if ('object' !== typeof options.files) {
		throw new PluginError(config.name, 'File input in wrong format, please use an array or object.');
	}

	bundles = Object.keys(options.files);

	if (!bundles.length) {
		throw new PluginError(config.name, 'No file input stored in options.files.');
	} else {
		//taskName from the current bundle, this ends up being the destination file's name

		var validPackages = bundleCheck(bundles, options.files);
		if (validPackages !== true) {
			handleInvalidPackages(validPackages);
		} else {
			bundles.forEach(function (taskName) {
				if (taskName === '') {
					throw new PluginError(config.name, 'Error creating bundle: no bundle name');
				}
				if (!options.files[taskName].length) {
					throw new PluginError(config.name, 'No files inside named bundle');
				}

				Tasks.push(
					new gulpTaskFactory(taskName, options)
				);
			});
		}
		return Tasks;
	}
};