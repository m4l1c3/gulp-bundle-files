# Gulp Bundle Files

[![Build Status](https://travis-ci.org/m4l1c3/gulp-bundle-files.png)](https://travis-ci.org/m4l1c3/gulp-bundle-files) [![Coverage Status](https://coveralls.io/repos/github/m4l1c3/gulp-bundle-files/badge.svg?branch=master)](https://coveralls.io/github/m4l1c3/gulp-bundle-files?branch=master) [![npm version](https://img.shields.io/npm/v/gulp-bundle-files.svg)](https://www.npmjs.com/package/gulp-bundle-files) [![Downloads][downloads-image]][npm-url] [![Deps](https://david-dm.org/m4l1c3/gulp-bundle-files.png)](https://david-dm.org/m4l1c3/gulp-bundle-files) [![bitHound Code](https://www.bithound.io/github/m4l1c3/gulp-bundle-files/badges/code.svg)](https://www.bithound.io/github/m4l1c3/gulp-bundle-files) [![Windows Build status](https://ci.appveyor.com/api/projects/status/3fn5b9siy52v37lr?svg=true&passingText=Windows%20Build%20OK)](https://ci.appveyor.com/project/m4l1c3/gulp-bundle-files) [![Code Climate](https://codeclimate.com/github/m4l1c3/gulp-bundle-files/badges/gpa.svg)](https://codeclimate.com/github/m4l1c3/gulp-bundle-files) [![Coverity Scan Build Status](https://scan.coverity.com/projects/m4l1c3-gulp-bundle-files/badge.svg)](https://scan.coverity.com/projects/m4l1c3-gulp-bundle-files) [![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/m4l1c3/gulp-bundle-files.svg)](http://isitmaintained.com/project/m4l1c3/gulp-bundle-files "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/m4l1c3/gulp-bundle-files.svg)](http://isitmaintained.com/project/m4l1c3/gulp-bundle-files "Percentage of issues still open") [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A wrapper for gulp-concat that performs additional runtime configuration checks along with creating a separate task/stream for all the pieces you're attempting to build.  Utilizing a JSON based configuration, the module will combine/concat and uglify bundles of javascript.  In addition to processing javascript gulp-bundle-files will also combine/concat, autoprefix, and minify css.

## How it works

By defining your "bundles" in a properly formatted JSON configuration file and passing your config to gulp-bundle-files you'll be dynamically creating a task for every bundle.  Each of these tasks is appended into gulp's run sequence.  Basically the task you define for gulp-bundle-files adds a gulp.task for every bundle defined in your application's configuration, then all the dynamic tasks get run once the plugin finishes.  Each of these tasks will be added into gulps sequence in the order your 'default' task defines, using the plugin will just insert these tasks wherever it gets called in your build order.

## Usage

```js
var gulp = require('gulp'),
    gulpBundleFiles = require('gulp-bundle-files'),
    bundles = require('./sample-options.json');

gulp.task('bundle', function() {
    gulpBundleFiles(bundles);
});

gulp.task('default', ['bundle']);
```

## Configuration Syntax

The plugin assumes your task for bundling is named "bundle" if you have a different name, just specify it in the config.  This prevents the dynamic tasks from being called in the wrong contexts when using gulp watch.

```json
{
  "parentTaskName": "bundle",
  "concat": {
    "active": true,
    "config": {}
  },
  "uglify": {
    "active": false,
    "config": {}
  },
  "sourcemap": {
    "active": true,
    "config": {}
  },
  "destinationFolder": "dist",
  "newLine": ";",
  "files": {
    "js/test.js": [
      "tests/fixtures.js",
      "tests/main.js"
    ],
    "js/test2.js": [
      "tests/fixtures.js",
      "tests/main.js"
    ],
    "css/test.css": [
      "tests/css/test.css",
      "tests/css/test2.css"
    ]
  }
}
```

## Options

### Concat

Used to specify whether or not concat is active along with the configuration for concat, the config's format should match the options outlined here: https://github.com/contra/gulp-concat

### Uglify

Used to specify whether or not uglify is active along with the configuration for uglify, the config's format should match the options outlined here: https://github.com/terinjokes/gulp-uglify

### Sourcemap

User to specify whether or not sourcemaps is active along with the configuration for sourcemaps, the config's format should match the options outlined here: https://github.com/floridoo/gulp-sourcemaps

### Destination Folder

This option specifies the location where your completed bundles are going to be written to, it's relative to the current working directory, in most cases this would be your project's directory

### Files

This option is used to configure what bundles you're going to be creating with Gulp.  These end up being key/value paired object literals whose value is an array of files the bundle will contain.
In this case the key will be the file containing all of the value's parts, or the built file.

### Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

[downloads-image]: https://img.shields.io/npm/dm/gulp-bundle-files.svg
[npm-url]: https://www.npmjs.com/package/gulp-bundle-files
