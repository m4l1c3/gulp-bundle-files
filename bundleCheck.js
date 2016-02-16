'use strict';
var fs = require('fs'),
	path = require('path'),
	Bundle = require('./Bundle').Bundle,
	gutil = require('gulp-util'),
	config = require('./package.json'),
	PluginError = gutil.PluginError;

var bundleCheck = function(bundles, test) {
	var missing_bundle_items = [],
		items = bundles,
		bundleIsValid = true;
	for(var i in items) {
		if (items.hasOwnProperty(i) && !fs.existsSync(path.join(__dirname, items[i]))) {
			bundleIsValid = false;
			missing_bundle_items.push(new Bundle(i, items));
		}
	}

	if(test && !bundleIsValid) {
		bundleIsValid = true;
	}

	if(missing_bundle_items.length && bundleIsValid) {
		throw new PluginError(config.name, 'Bundle check is not working');
	}

	if(!missing_bundle_items.length) {
		return true;
	}
	return missing_bundle_items;
};

exports.BundleCheck = bundleCheck;
