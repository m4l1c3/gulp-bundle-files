test-cov: istanbul

istanbul:
	   istanbul cover --hook-run-in-context node_modules/mocha/bin/mocha tests

coveralls:
	   cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
