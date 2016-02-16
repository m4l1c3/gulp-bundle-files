'use strict';
var fs = require('fs'),
	path = require('path');

var currentBundle = function(i, items) {
	var self = this;
	self.index = i;
	self.name = items[self.index];

	self.isLast = function() {
		var self = this;
		self.index = i;
		self.name = items[self.index];

		self.isLast = function() {
			if ((parseInt(self.index) !== items.length - 1) && (self.index !== self.name)) {
				return false;
			}
			return true;
		};

		self.getName = function() {
			return self.name;
		};

		return self;
	};

	self.getName = function() {
		return self.name;
	};

	return self;
};

var bundleCheck = function(bundles) {
	var missing_bundle_items = [];
	var items = bundles;
	for(var i in items) {
		if (!fs.existsSync(path.join(__dirname, items[i]))) {
			missing_bundle_items.push(new currentBundle(i, items));
		}
	}
	if(!missing_bundle_items.length) {
		return true;
	} else {
		return missing_bundle_items;
	}
};

exports.BundleCheck = bundleCheck;
