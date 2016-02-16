'use strict';

var Bundle = function(i, items) {
	var self = this;
	self.index = i;
	self.name = items[self.index];

	self.isLast = function() {
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

	self.getName = function() {
		return self.name;
	};

	return self;
};

exports.Bundle = Bundle;