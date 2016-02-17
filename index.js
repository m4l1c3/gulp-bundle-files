'use strict';

var config = require('./package.json'),
	gutil = require('gulp-util'),
	gulpTaskFactory = require('./gulpTaskFactory'),
	bundleCheck = require('./bundleCheck').BundleCheck,
	PluginError = gutil.PluginError;

module.exports  = function(options) {

	var bundles,
		self = this;
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

		var validPackages = bundleCheck(bundles);
		if (validPackages !== true) {
			gutil.log('Files missing from bundles: ');
			for(var i in validPackages) {
				gutil.log(gutil.colors.red('ERROR ') + gutil.colors.gray('-- ') + validPackages[i].getName());
				gutil.beep();
			}
			throw new PluginError(config.name, 'Error creating bundle, bundles are missing files.');

		} else {
			bundles.forEach(function (taskName) {
				if (taskName === '') {
					throw new PluginError(config.name, 'Error creating bundle: no bundle name');
				}
				if (!options.files[taskName].length) {
					throw new PluginError(config.name, 'No files inside named bundle');
				}

				self.bundles.push(
					new gulpTaskFactory(taskName, options.files[taskName])
				);
			});
			return self.bundles;
		}
	}
};