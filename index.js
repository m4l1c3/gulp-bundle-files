'use strict';

var config = require('./package.json'),
	path = require('path'),
	gutil = require('gulp-util'),
	gulpTaskFactory = require('./gulpTaskFactory'),
	bundleCheck = require('./bundleCheck').BundleCheck,

	PluginError = gutil.PluginError;

module.exports  = function(options) {
	var options = options || {},
		bundles,
		self = this;

	if(options.destinationFolder === undefined || options.destinationFolder.length < 1) {
		throw new PluginError(config.name, 'Missing destinationFolder gulp-bundle-files');
	}
	if ("object" !== typeof options.files) {
		throw new PluginError(config.name, 'File input in wrong format, please use an array or object.');
	}

	bundles = Object.keys(options.files);


	if (!bundles.length) {
		throw new PluginError(config.name, 'No file input stored in options.files.')
	} else {
		//taskName from the current bundle, this ends up being the destination file's name

		var validPackages = bundleCheck(bundles);
		if (validPackages !== true) {
			gutil.log('Files missing from bundles: ');
			for(var i in validPackages) {
				var invalidPackage = validPackages[i];
				gutil.log('\t\t' + gutil.colors.red('ERROR ') + gutil.colors.gray('-- ') + invalidPackage.getName());
				gutil.beep();
				if(invalidPackage.isLast()) {
					throw new PluginError(config.name, 'Error creating bundle, bundles are missing files.');
				}
			}

		} else {
			bundles.forEach(function (taskName) {
				if (taskName === '') {
					throw new PluginError(config.name, 'Error creating bundle: no bundle name');
				} else {
					if (!options.files[taskName].length) {
						throw new PluginError(config.name, 'No files inside named bundle');
					}

					self.bundles.push(
						new gulpTaskFactory(path.basename(taskName), options.files[taskName])
					);
				}
			});
			return self.bundles;
		}
	}
	return bundles;
};