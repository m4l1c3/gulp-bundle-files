'use strict';
var fs = require('fs'),
	path = require('path'),
	Bundle = require('./Bundle').Bundle,
	gutil = require('gulp-util'),
	config = require('./package.json'),
	PluginError = gutil.PluginError;

var bundleCheck = function(bundleNames, allBundles, test) {
	var missing_bundle_items = [],
		items = bundleNames,
		bundleIsValid = true;

	for(var i in items) {
		if (items.hasOwnProperty(i)) {
			for(var o in allBundles[items[i]]) {
				if(allBundles[items[i]].hasOwnProperty(o)) {
					if (!fs.existsSync(path.join('./', allBundles[items[i]][o]))) {
						bundleIsValid = false;
						missing_bundle_items.push(new Bundle(o, allBundles[items[i]]));
					}
				}
			}
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
