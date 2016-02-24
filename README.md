#Gulp Bundle Files 
[![Build Status](https://travis-ci.org/m4l1c3/gulp-bundle-files.png)](https://travis-ci.org/m4l1c3/gulp-bundle-files) [![Coverage Status](https://coveralls.io/repos/github/m4l1c3/gulp-bundle-files/badge.svg?branch=master)](https://coveralls.io/github/m4l1c3/gulp-bundle-files?branch=master) [![npm version](https://img.shields.io/npm/v/gulp-bundle-files.svg)](https://www.npmjs.com/package/gulp-bundle-files) [![Downloads][downloads-image]][npm-url] [![Deps](https://david-dm.org/m4l1c3/gulp-bundle-files.png)](https://david-dm.org/m4l1c3/gulp-bundle-files) [![bitHound Code](https://www.bithound.io/github/m4l1c3/gulp-bundle-files/badges/code.svg)](https://www.bithound.io/github/m4l1c3/gulp-bundle-files)

A wrapper for gulp-concat that performs additional runtime configuration checks along with creating a separate task/stream for all the pieces you're attempting to build.  Utilizing a JSON based configuration, the module will combine/concat and uglify bundles of javascript or css into user defined files for deployment.

## Usage

```js
var gulpBundleFiles = require('gulp-bundle=files'),
    options = require('path/to/your/config.json');

gulp.task('scripts', function() {
  return gulp.src('')
    .pipe(gulpBundleFiles(options));
});
```

## Configuration Syntax

```json
{
  "concat": {
    "active": true,
    "config": {}
  },
  "uglify": {
    "active": false,
    "config": {}
  },
  "destinationFolder": "dist",
  "files": {
    "test.js": [
      "tests/fixtures.js",
      "tests/main.js"
    ],
    "test2.js": [
      "tests/fixtures.js",
      "tests/main.js"
    ]
  }
}
```

# Options

## Concat
Used to specify whether or not concat is active along with the configuration for concat, the config's format should match the options outlined here: https://github.com/contra/gulp-concat

## Uglify
Used to specify whether or not uglify is active along with the configuration for uglify, the config's format should match the options outlined here: https://github.com/terinjokes/gulp-uglify

## Destination Folder
This option specifies the location where your completed bundles are going to be written to, it's relative to the current working directory, in most cases this would be your project's directory

## Files
This option is used to configure what bundles you're going to be creating with Gulp.  These end up being key/value paired object literals whose value is an array of files the bundle will contain.
In this case the key will be the file containing all of the value's parts, or the built file.

#Contributing
Please see [Contributing](https://github.com/m4l1c3/gulp-bundle-files/blob/master/CONTRIBUTING.md) before coding.

#Issues
Please file any issues you might find here on github.


[downloads-image]: https://img.shields.io/npm/dm/gulp-bundle-files.svg
[npm-url]: https://www.npmjs.com/package/gulp-bundle-files
