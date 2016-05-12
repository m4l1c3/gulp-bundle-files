var bundle = require('../'),
	Bundle = require('../Bundle.js').Bundle,
	bundleChecker = require('../BundleCheck.js').BundleCheck,
	should = require('should'),
	gutil = require('gulp-util'),
	PluginError = gutil.PluginError,
	config = require('../package.json'),
	fixtures = require('./fixtures').fixtures,
	gulpTaskFactory = require('../GulpTaskFactory').gulpTaskFactory,
	cp = require('child_process'),
	junk = require('junk'),
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
	bundleTest = new BundleTest(),
	fs = require('fs'),
	path = require('path');
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

		it('should pass, getName should return ', function() {
			bundleTest.bundle.getName().should.equal(0);
		});

		it('should pass, isLast should return true', function() {
			bundleTest.bundle.isLast().should.equal(true);
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
				var bundles = fixture.get('bundles');
				bundleChecker(Object.keys(bundles.files), bundles.files, true);
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
				bundle(fixture.get('full-options'), true);
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

		it('should pass, gulp should run with sample config and result in 2 built JS files', function(done) {
			this.timeout(15000);
			cp.exec('gulp bundle', function(error, stdout, stderror) {
				if(error == null) {
					fs.readdir(path.join(__dirname, '/../dist/js'), function(err, files) {
						if(err) {
							throw err;
						}
						files = files.filter(junk.not);

						if(files.length == 3) {
							files.forEach(function(element, index) {
								if(!fs.existsSync(path.join('../dist/', element))) {
									return false;
								}
							});
						}
					});
				}
				done();
			});
		});

        it('should pass, gulp should run with sample config and result in 2 built JS files', function(done) {
            this.timeout(15000);
            cp.exec('gulp bundle --mode production', function(error, stdout, stderror) {
                if(error == null) {
                    fs.readdir(path.join(__dirname, '/../dist/js'), function(err, files) {
                        if(err) {
                            throw err;
                        }
                        files = files.filter(junk.not);

                        if(files.length == 3) {
                            files.forEach(function(element, index) {
                                if(!fs.existsSync(path.join('../dist/', element))) {
                                    return false;
                                }
                            });
                        }
                    });
                }
                done();
            });
        });

		it('should pass, gulp should run with sample config and result in 1 built CSS files', function(done) {
			this.timeout(15000);
			cp.exec('gulp bundle', function(error, stdout, stderror) {
				if(error == null) {
					fs.readdir(path.join(__dirname, '/../dist/css'), function(err, files) {
						if(err) {
							throw err;
						}
						files = files.filter(junk.not);

						if(files.length == 2) {
							files.forEach(function(element, index) {
								if(!fs.existsSync(path.join('../dist/', element))) {
									return false;
								}
							});
						}
					});
				}
				done();
			});
		});
	});
});
