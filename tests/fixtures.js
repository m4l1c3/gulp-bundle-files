'use strict';

var path = require('path'),
	fs = require('fs');

var fixtures = function() {
	var self = this;
	self.data = [];

	this.init = function() {
		var files = fs.readdirSync(self.getPath());
		for(var i in files) {
			var key = (files.hasOwnProperty(i)) ? files[i].substring(0, files[i].indexOf('.')) : "";
			self.data[key] = files[i];
		}
	};
	this.getPath = function() {
		return path.join(__dirname, 'fixtures');
	};
	this.get = function(file) {
		return require(path.join(self.getPath(), self.data[file]));
	};
	self.init();
};

exports.fixtures = fixtures;