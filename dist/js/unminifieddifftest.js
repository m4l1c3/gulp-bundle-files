'use strict';

var path = require('path'),
    fs = require('fs');

var fixtures = function() {
    var self = this;
    self.data = [];

    this.init = function() {
        var files = fs.readdirSync(self.getPath());
        for(var i in files) {
            var key = (files.hasOwnProperty(i)) ? files[i].substring(0, files[i].indexOf('.')) : '';
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
                new TypeError('The "path" argument must be of type string')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpeHR1cmVzLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImpzL3Rlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpLFxuXHRmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbnZhciBmaXh0dXJlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdHNlbGYuZGF0YSA9IFtdO1xuXG5cdHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKHNlbGYuZ2V0UGF0aCgpKTtcblx0XHRmb3IodmFyIGkgaW4gZmlsZXMpIHtcblx0XHRcdHZhciBrZXkgPSAoZmlsZXMuaGFzT3duUHJvcGVydHkoaSkpID8gZmlsZXNbaV0uc3Vic3RyaW5nKDAsIGZpbGVzW2ldLmluZGV4T2YoJy4nKSkgOiAnJztcblx0XHRcdHNlbGYuZGF0YVtrZXldID0gZmlsZXNbaV07XG5cdFx0fVxuXHR9O1xuXHR0aGlzLmdldFBhdGggPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJyk7XG5cdH07XG5cdHRoaXMuZ2V0ID0gZnVuY3Rpb24oZmlsZSkge1xuXHRcdHJldHVybiByZXF1aXJlKHBhdGguam9pbihzZWxmLmdldFBhdGgoKSwgc2VsZi5kYXRhW2ZpbGVdKSk7XG5cdH07XG5cdHNlbGYuaW5pdCgpO1xufTtcblxuZXhwb3J0cy5maXh0dXJlcyA9IGZpeHR1cmVzOyIsInZhciBidW5kbGUgPSByZXF1aXJlKCcuLi8nKSxcblx0QnVuZGxlID0gcmVxdWlyZSgnLi4vQnVuZGxlLmpzJykuQnVuZGxlLFxuXHRidW5kbGVDaGVja2VyID0gcmVxdWlyZSgnLi4vQnVuZGxlQ2hlY2suanMnKS5CdW5kbGVDaGVjayxcblx0c2hvdWxkID0gcmVxdWlyZSgnc2hvdWxkJyksXG5cdGd1dGlsID0gcmVxdWlyZSgnZ3VscC11dGlsJyksXG5cdFBsdWdpbkVycm9yID0gZ3V0aWwuUGx1Z2luRXJyb3IsXG5cdGNvbmZpZyA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLFxuXHRmaXh0dXJlcyA9IHJlcXVpcmUoJy4vZml4dHVyZXMnKS5maXh0dXJlcyxcblx0Z3VscFRhc2tGYWN0b3J5ID0gcmVxdWlyZSgnLi4vR3VscFRhc2tGYWN0b3J5JykuZ3VscFRhc2tGYWN0b3J5LFxuXHRjcCA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKSxcblx0anVuayA9IHJlcXVpcmUoJ2p1bmsnKSxcblx0QnVuZGxlVGVzdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdEJ1bmRsZSA9IHJlcXVpcmUoJy4uL0J1bmRsZScpLkJ1bmRsZSxcblx0XHRcdGd1dGlsID0gcmVxdWlyZSgnZ3VscC11dGlsJyksXG5cdFx0XHRQbHVnaW5FcnJvciA9IGd1dGlsLlBsdWdpbkVycm9yO1xuXHRcdHNlbGYuaXNWYWxpZCA9IHRydWU7XG5cblx0XHRzZWxmLmJ1bmRsZSA9IG5ldyBCdW5kbGUoMCwgWzAsICdibGFoYmxhaGJsYWguanMnXSk7XG5cblx0XHRpZiAoc2VsZi5idW5kbGUuZ2V0TmFtZSgpID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHNlbGYuaXNWYWxpZCA9IGZhbHNlO1xuXHRcdFx0dGhyb3cgbmV3IFBsdWdpbkVycm9yKGNvbmZpZy5uYW1lLCAnQnVuZGxlIHRlc3QgaGFzIGZhaWxlZCwgbWlzc2luZyBuYW1lJyk7XG5cdFx0fVxuXG5cdFx0aWYoc2VsZi5idW5kbGUuaXNMYXN0KCkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0c2VsZi5pc1ZhbGlkID0gZmFsc2U7XG5cdFx0XHR0aHJvdyBuZXcgUGx1Z2luRXJyb3IoY29uZmlnLm5hbWUsICdCdW5kbGUgdGVzdCBoYXMgZmFpbGVkIG1pc3NpbmcgaXNMYXN0Jyk7XG5cdFx0fVxuXHR9LFxuXHRidW5kbGVUZXN0ID0gbmV3IEJ1bmRsZVRlc3QoKSxcblx0ZnMgPSByZXF1aXJlKCdmcycpLFxuXHRwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXHRyZXF1aXJlKCdtb2NoYScpO1xuXG5kZXNjcmliZSgnZ3VscC1idW5kbGUtZmlsZXMnLCBmdW5jdGlvbigpIHtcblxuXHQvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRGdW5jdGlvblxuXHR2YXIgZml4dHVyZSA9IG5ldyBmaXh0dXJlcygpO1xuXG5cdGRlc2NyaWJlKCdidW5kbGUoKScsIGZ1bmN0aW9uKCkge1xuXHRcdGl0KCdzaG91bGQgdGhyb3csIE5vIHVnbGlmeSBzZXR0aW5ncycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRndWxwVGFza0ZhY3RvcnkoJ3VnbGlmeScsIGZpeHR1cmUuZ2V0KCdiYWQtdWdsaWZ5JykpO1xuXHRcdFx0fSkuc2hvdWxkLnRocm93KFxuXHRcdFx0XHRuZXcgUGx1Z2luRXJyb3IoY29uZmlnLm5hbWUsICdObyB1Z2xpZnkgc2V0dGluZ3MnKVxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdGl0KCdzaG91bGQgcGFzcywgdXBvbiBjcmVhdGlvbiBidW5kbGVUZXN0IHdpbGwgcmV0dXJuIHRydWUgaWYgYWxsIGlzIHdlbGwnLCBmdW5jdGlvbigpIHtcblx0XHRcdGJ1bmRsZVRlc3QuaXNWYWxpZC5zaG91bGQuZXF1YWwodHJ1ZSk7XG5cdFx0fSk7XG5cblx0XHRpdCgnc2hvdWxkIHBhc3MsIHVwb24gY3JlYXRpb24gYSBidW5kbGUgc2hvdWxkIGhhdmUgZ2V0TmFtZSBhcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZ2V0TmFtZVR5cGUgPSB0eXBlb2YgYnVuZGxlVGVzdC5idW5kbGUuZ2V0TmFtZTtcblx0XHRcdGdldE5hbWVUeXBlLnNob3VsZC5lcXVhbCgnZnVuY3Rpb24nKTtcblx0XHR9KTtcblxuXHRcdGl0KCdzaG91bGQgcGFzcywgdXBvbiBjcmVhdGlvbiBhIGJ1bmRsZSBzaG91bGQgaGF2ZSBnZXROYW1lIGFzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpc0xhc3RUeXBlID0gdHlwZW9mIGJ1bmRsZVRlc3QuYnVuZGxlLmlzTGFzdDtcblx0XHRcdGlzTGFzdFR5cGUuc2hvdWxkLmVxdWFsKCdmdW5jdGlvbicpO1xuXHRcdH0pO1xuXG5cdFx0aXQoJ3Nob3VsZCBwYXNzLCBnZXROYW1lIHNob3VsZCByZXR1cm4gJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRidW5kbGVUZXN0LmJ1bmRsZS5nZXROYW1lKCkuc2hvdWxkLmVxdWFsKDApO1xuXHRcdH0pO1xuXG5cdFx0aXQoJ3Nob3VsZCBwYXNzLCBpc0xhc3Qgc2hvdWxkIHJldHVybiB0cnVlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRidW5kbGVUZXN0LmJ1bmRsZS5pc0xhc3QoKS5zaG91bGQuZXF1YWwodHJ1ZSk7XG5cdFx0fSk7XG5cblx0XHRpdCgnc2hvdWxkIHRocm93LCBmaXh0dXJlIHdpdGggYmFkIGZpbGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdChmdW5jdGlvbigpIHtcblx0XHRcdFx0Zml4dHVyZS5nZXQoJ2JhZy11Z2xpZnknKTtcblx0XHRcdH0pLnNob3VsZC50aHJvdyhcblx0XHRcdFx0bmV3IFR5cGVFcnJvcignUGF0aCBtdXN0IGJlIGEgc3RyaW5nLiBSZWNlaXZlZCB1bmRlZmluZWQnKVxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdGl0KCdzaG91bGQgdGhyb3csIGJ1bmRsZSBjaGVja2VyIGRvZXNuXFwndCB3b3JrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBidW5kbGVzID0gZml4dHVyZS5nZXQoJ2J1bmRsZXMnKTtcblx0XHRcdFx0YnVuZGxlQ2hlY2tlcihPYmplY3Qua2V5cyhidW5kbGVzLmZpbGVzKSwgYnVuZGxlcy5maWxlcywgdHJ1ZSk7XG5cdFx0XHR9KS5zaG91bGQudGhyb3coXG5cdFx0XHRcdG5ldyBQbHVnaW5FcnJvcihjb25maWcubmFtZSwgJ0J1bmRsZSBjaGVjayBpcyBub3Qgd29ya2luZycpXG5cdFx0XHQpO1xuXHRcdH0pO1xuXG5cdFx0aXQoJ3Nob3VsZCB0aHJvdywgTm8gY29uY2F0IHNldHRpbmdzJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGd1bHBUYXNrRmFjdG9yeSgnY29uY2F0JywgZml4dHVyZS5nZXQoJ2JhZC1jb25jYXQnKSk7XG5cdFx0XHR9KS5zaG91bGQudGhyb3coXG5cdFx0XHRcdG5ldyBQbHVnaW5FcnJvcihjb25maWcubmFtZSwgJ05vIGNvbmNhdCBzZXR0aW5ncycpXG5cdFx0XHQpO1xuXHRcdH0pO1xuXG5cdFx0aXQoJ3Nob3VsZCB0aHJvdywgd2hlbiBkZXN0aW5hdGlvbiBmb2xkZXIgaXMgbWlzc2luZycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRidW5kbGUoZml4dHVyZS5nZXQoJ25vLW9wdGlvbnMnKSk7XG5cdFx0XHR9KS5zaG91bGQudGhyb3coXG5cdFx0XHRcdG5ldyBQbHVnaW5FcnJvcihjb25maWcubmFtZSwgJ01pc3NpbmcgZGVzdGluYXRpb25Gb2xkZXIgZ3VscC1idW5kbGUtZmlsZXMnKVxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdGl0KCdzaG91bGQgdGhyb3csIGJ1bmRsZSBkb2VzIG5vdCBoYXZlIGFueSBpdGVtcycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRCdW5kbGUoMCwgZml4dHVyZS5nZXQoJ25vLWl0ZW1zJykpO1xuXHRcdFx0fSkuc2hvdWxkLnRocm93KFxuXHRcdFx0XHRuZXcgUGx1Z2luRXJyb3IoY29uZmlnLm5hbWUsICdObyBpdGVtcyBwYXNzZWQgaW50byBidW5kbGUnKVxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdGl0KCdzaG91bGQgdGhyb3csIHdoZW4gZmlsZXMgaXMgbm90IGFycmF5IG9yIG9iamVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRidW5kbGUoZml4dHVyZS5nZXQoJ2luY29ycmVjdC1mb3JtYXQtb2YtZmlsZXMnKSk7XG5cdFx0XHR9KS5zaG91bGQudGhyb3coXG5cdFx0XHRcdG5ldyBQbHVnaW5FcnJvcihjb25maWcubmFtZSwgJ0ZpbGUgaW5wdXQgaW4gd3JvbmcgZm9ybWF0LCBwbGVhc2UgdXNlIGFuIGFycmF5IG9yIG9iamVjdC4nKVxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdGl0KCdzaG91bGQgdGhyb3csIHdoZW4gb3B0aW9ucy5maWxlcyBoYXMgbm8gYnVuZGxlcycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRidW5kbGUoZml4dHVyZS5nZXQoJ25vLWJ1bmRsZXMnKSk7XG5cdFx0XHR9KS5zaG91bGQudGhyb3coXG5cdFx0XHRcdG5ldyBQbHVnaW5FcnJvcihjb25maWcubmFtZSwgJ05vIGZpbGUgaW5wdXQgc3RvcmVkIGluIG9wdGlvbnMuZmlsZXMuJylcblx0XHRcdCk7XG5cdFx0fSk7XG5cblx0XHRpdCgnc2hvdWxkIHRocm93LCB3aGVuIGJ1bmRsZSBpcyBtaXNzaW5nIGZpbGVzJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGJ1bmRsZShmaXh0dXJlLmdldCgnZnVsbC1vcHRpb25zJyksIHRydWUpO1xuXHRcdFx0fSkuc2hvdWxkLnRocm93KFxuXHRcdFx0XHRuZXcgUGx1Z2luRXJyb3IoY29uZmlnLm5hbWUsICdFcnJvciBjcmVhdGluZyBidW5kbGUsIGJ1bmRsZXMgYXJlIG1pc3NpbmcgZmlsZXMuJylcblx0XHRcdCk7XG5cdFx0fSk7XG5cblx0XHRpdCgnc2hvdWxkIHRocm93LCB3aGVuIHVuYWJsZSB0byBjcmVhdGUgYnVuZGxlLCBtaXNzaW5nIGJ1bmRsZSBuYW1lJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGJ1bmRsZShmaXh0dXJlLmdldCgnbm8tYnVuZGxlLW5hbWUnKSk7XG5cdFx0XHR9KS5zaG91bGQudGhyb3coXG5cdFx0XHRcdG5ldyBQbHVnaW5FcnJvcihjb25maWcubmFtZSwgJ0Vycm9yIGNyZWF0aW5nIGJ1bmRsZTogbm8gYnVuZGxlIG5hbWUnKVxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdGl0KCdzaG91bGQgdGhyb3csIHdoZW4gdW5hYmxlIHRvIGZpbmQgaXRlbXMgZm9yIGEgYnVuZGxlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGJ1bmRsZShmaXh0dXJlLmdldCgnbm8tYnVuZGxlLWNvbnRlbnRzJykpO1xuXHRcdFx0fSkuc2hvdWxkLnRocm93KFxuXHRcdFx0XHRuZXcgUGx1Z2luRXJyb3IoY29uZmlnLm5hbWUsICdObyBmaWxlcyBpbnNpZGUgbmFtZWQgYnVuZGxlJylcblx0XHRcdCk7XG5cdFx0fSk7XG5cblx0XHRpdCgnc2hvdWxkIHBhc3MsIGd1bHAgc2hvdWxkIHJ1biB3aXRoIHNhbXBsZSBjb25maWcgYW5kIHJlc3VsdCBpbiAyIGJ1aWx0IEpTIGZpbGVzJywgZnVuY3Rpb24oZG9uZSkge1xuXHRcdFx0dGhpcy50aW1lb3V0KDE1MDAwKTtcblx0XHRcdGNwLmV4ZWMoJ2d1bHAgYnVuZGxlJywgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyb3IpIHtcblx0XHRcdFx0aWYoZXJyb3IgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGZzLnJlYWRkaXIocGF0aC5qb2luKF9fZGlybmFtZSwgJy8uLi9kaXN0L2pzJyksIGZ1bmN0aW9uKGVyciwgZmlsZXMpIHtcblx0XHRcdFx0XHRcdGlmKGVycikge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBlcnI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmaWxlcyA9IGZpbGVzLmZpbHRlcihqdW5rLm5vdCk7XG5cblx0XHRcdFx0XHRcdGlmKGZpbGVzLmxlbmd0aCA9PSAzKSB7XG5cdFx0XHRcdFx0XHRcdGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcblx0XHRcdFx0XHRcdFx0XHRpZighZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oJy4uL2Rpc3QvJywgZWxlbWVudCkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkb25lKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHBhc3MsIGd1bHAgc2hvdWxkIHJ1biB3aXRoIHNhbXBsZSBjb25maWcgYW5kIHJlc3VsdCBpbiAyIGJ1aWx0IEpTIGZpbGVzJywgZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0KDE1MDAwKTtcbiAgICAgICAgICAgIGNwLmV4ZWMoJ2d1bHAgYnVuZGxlIC0tbW9kZSBwcm9kdWN0aW9uJywgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZihlcnJvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLnJlYWRkaXIocGF0aC5qb2luKF9fZGlybmFtZSwgJy8uLi9kaXN0L2pzJyksIGZ1bmN0aW9uKGVyciwgZmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzID0gZmlsZXMuZmlsdGVyKGp1bmsubm90KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZmlsZXMubGVuZ3RoID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFmcy5leGlzdHNTeW5jKHBhdGguam9pbignLi4vZGlzdC8nLCBlbGVtZW50KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cdFx0aXQoJ3Nob3VsZCBwYXNzLCBndWxwIHNob3VsZCBydW4gd2l0aCBzYW1wbGUgY29uZmlnIGFuZCByZXN1bHQgaW4gMSBidWlsdCBDU1MgZmlsZXMnLCBmdW5jdGlvbihkb25lKSB7XG5cdFx0XHR0aGlzLnRpbWVvdXQoMTUwMDApO1xuXHRcdFx0Y3AuZXhlYygnZ3VscCBidW5kbGUnLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnJvcikge1xuXHRcdFx0XHRpZihlcnJvciA9PSBudWxsKSB7XG5cdFx0XHRcdFx0ZnMucmVhZGRpcihwYXRoLmpvaW4oX19kaXJuYW1lLCAnLy4uL2Rpc3QvY3NzJyksIGZ1bmN0aW9uKGVyciwgZmlsZXMpIHtcblx0XHRcdFx0XHRcdGlmKGVycikge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBlcnI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmaWxlcyA9IGZpbGVzLmZpbHRlcihqdW5rLm5vdCk7XG5cblx0XHRcdFx0XHRcdGlmKGZpbGVzLmxlbmd0aCA9PSAyKSB7XG5cdFx0XHRcdFx0XHRcdGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcblx0XHRcdFx0XHRcdFx0XHRpZighZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oJy4uL2Rpc3QvJywgZWxlbWVudCkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkb25lKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
