var bundle = require('../'),
	should = require('should'),
	assert = require('stream-assert'),
	//test = require('./test-stream'),
	gutil = require('gulp-util'),
	PluginError = gutil.PluginError,
	gulp = require('gulp'),
	config = require('../package.json'),
	fixtures = require('./fixtures').fixtures;
	require('mocha');



//var newBundlePath = __dirname,
//	newBundleConfig = 'options.json',
	//newBundle = path.join(newBundlePath, newBundleConfig);

describe('gulp-bundle-files', function() {
	//before(function(done) {
	//	fs.writeFile(newBundle, gutil.log('Creating bundle complete: ' + done, done));
	//});
	//
	//after(function(done) {
	//	fs.unlink(newBundle, done);
	//});

	//noinspection JSUnresolvedFunction
	var fixture = new fixtures();

	describe('bundle()', function() {
		it('should throw, when destination folder is missing', function() {
			(function() {
				bundle(fixture.get('no-options'));
			}).should.throw(
				new PluginError(config.name, 'Missing destinationFolder gulp-bundle-files')
			);
		});

		it('should throw, when files is not array or object', function() {
			(function() {
				bundle(fixture.get('incorrect-format-of-files'));
			}).should.throw(
				new PluginError(config.name, 'File input in wrong format, please use an array or object.')
			);
		});

		it('should throw, when options.files has no bundles', function() {
			(function() {
				bundle(fixture.get('no-bundles'));
			}).should.throw(
				new PluginError(config.name, 'No file input stored in options.files.')
			);
		});

		it('should throw, when bundle is missing files', function() {
			(function() {
				bundle(fixture.get('full-options'));
			}).should.throw(
				new PluginError(config.name, 'Error creating bundle, bundles are missing files.')
			);
		});

		it('should throw, when unable to create bundle, missing bundle name', function() {
			(function() {
				bundle(fixture.get('no-bundle-name'));
			}).should.throw(
				new PluginError(config.name, 'Error creating bundle: no bundle name')
			);
		});

		it('should throw, when unable to find items for a bundle', function() {
			(function() {
				bundle(fixture.get('no-bundle-contents'));
			}).should.throw(
				new PluginError(config.name, 'No files inside named bundle')
			);
		});
	});
});
