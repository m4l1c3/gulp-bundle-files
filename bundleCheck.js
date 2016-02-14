'use strict';
var fs = require('fs'),
	path = require('path');

var bundleCheck = function(bundles) {
	var missing_bundle_items = [];
	var items = bundles;
	for(var i in items) {
		if (!fs.existsSync(path.join(__dirname, items[i]))) {
			var currentBundle = function(i) {
				var self = this;
				self.index = i;
				self.name = items[self.index];

				self.isLast = function() {
					if (parseInt(self.index) === items.length - 1) {
						return true;
					} else if (self.index === self.name) {
						return true;
					} else {
						return false;
					}
				};

				self.getName = function() {
					return self.name;
				};

				return self;
			};
			missing_bundle_items.push(new currentBundle(i));
		}
	}
	if(!missing_bundle_items.length) {
		return true;
	} else {
		return missing_bundle_items;
	}
};

exports.BundleCheck = bundleCheck;
