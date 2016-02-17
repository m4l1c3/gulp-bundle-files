var bundle = require('../'),
	Bundle = require('../Bundle.js').Bundle,
	bundleChecker = require('../bundleCheck.js').BundleCheck,
	should = require('should'),
	gutil = require('gulp-util'),
	PluginError = gutil.PluginError,
	config = require('../package.json'),
	fixtures = require('./fixtures').fixtures,
	gulpTaskFactory = require('../gulpTaskFactory').gulpTaskFactory,
	BundleTest = function() {
		var self = this,
			Bundle = require('../Bundle').Bundle,
			gutil = require('gulp-util'),
			PluginError = gutil.PluginError;
		self.isValid = true;

		self.bundle = new Bundle(0, [0, 'blahblahblah.js']);

		if (self.bundle.getName() === undefined) {
			self.isValid = false;
			throw new PluginError(config.name, 'Bundle test has failed, missing name');
		}

		if(self.bundle.isLast() === undefined) {
			self.isValid = false;
			throw new PluginError(config.name, 'Bundle test has failed missing isLast');
		}
	},
	bundleTest = new BundleTest();
	require('mocha');


describe('gulp-bundle-files', function() {

	//noinspection JSUnresolvedFunction
	var fixture = new fixtures();

	describe('bundle()', function() {
		it('should throw, No uglify settings', function() {
			(function() {
				gulpTaskFactory('uglify', fixture.get('bad-uglify'));
			}).should.throw(
				new PluginError(config.name, 'No uglify settings')
			);
		});

		it('should pass, upon creation bundleTest will return true if all is well', function() {
			bundleTest.isValid.should.equal(true);
		});

		it('should pass, upon creation a bundle should have getName as a function', function() {
			var getNameType = typeof bundleTest.bundle.getName;
			getNameType.should.equal('function');
		});

		it('should pass, upon creation a bundle should have getName as a function', function() {
			var isLastType = typeof bundleTest.bundle.isLast;
			isLastType.should.equal('function');
		});

		it('should throw, fixture with bad file', function() {
			(function() {
				fixture.get('bag-uglify');
			}).should.throw(
				new TypeError('Path must be a string. Received undefined')
			);
		});

		it('should throw, bundle checker doesn\'t work', function() {
			(function() {
				bundleChecker(fixture.get('bundles'), true);
			}).should.throw(
				new PluginError(config.name, 'Bundle check is not working')
			);
		});

		it('should throw, No concat settings', function() {
			(function() {
				gulpTaskFactory('concat', fixture.get('bad-concat'));
			}).should.throw(
				new PluginError(config.name, 'No concat settings')
			);
		});

		it('should throw, when destination folder is missing', function() {
			(function() {
				bundle(fixture.get('no-options'));
			}).should.throw(
				new PluginError(config.name, 'Missing destinationFolder gulp-bundle-files')
			);
		});

		it('should throw, bundle does not have any items', function() {
			(function() {
				Bundle(0, fixture.get('no-items'));
			}).should.throw(
				new PluginError(config.name, 'No items passed into bundle')
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
