test-cov: istanbul

istanbul:
	   istanbul cover _mocha tests

coveralls:
	   cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
