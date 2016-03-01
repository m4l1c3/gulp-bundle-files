var gutil = require('gulp-util'),
	config = require('./package.json'),
	PluginError = gutil.PluginError;

var HandleInvalidPackages = function (invalidPackages, test) {
	test = test || false;
	gutil.log('Files missing from bundles: ');
	for (var i in invalidPackages) {
		if (invalidPackages.hasOwnProperty(i)) {
			gutil.log(gutil.colors.gray('-- ' + invalidPackages[i].getName()));
			/* istanbul ignore if */
			if(!test) {
				gutil.beep();
			}
		}

	}
	throw new PluginError(config.name, 'Error creating bundle, bundles are missing files.');
};

exports.HandleInvalidPackages = HandleInvalidPackages;