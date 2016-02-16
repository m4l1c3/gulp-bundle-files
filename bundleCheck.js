'use strict';
var fs = require('fs'),
	path = require('path'),
	Bundle = require('./Bundle').Bundle;

var bundleCheck = function(bundles) {
	var missing_bundle_items = [];
	var items = bundles;
	for(var i in items) {
		if (items.hasOwnProperty(i) && !fs.existsSync(path.join(__dirname, items[i]))) {
			missing_bundle_items.push(new Bundle(i, items));
		}
	}
	if(!missing_bundle_items.length) {
		return true;
	} else {
		return missing_bundle_items;
	}
};

exports.BundleCheck = bundleCheck;
