'use strict';

var config = require('./package.json'),
	gutil = require('gulp-util'),
	PluginError = gutil.PluginError;

var Bundle = function(i, items) {
	if(!items.length) {
		throw new PluginError(config.name, 'No items passed into bundle');
	}
	var self = this;
	self.index = i;
	self.name = items[self.index];

	self.isLast = function() {
		return !((items.length - 1 !== parseInt(self.index)) && (self.index !== self.name));
	};

	self.getName = function() {
		return self.name;
	};

	return self;
};

exports.Bundle = Bundle;