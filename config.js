'use strict';

//connects to the database baby-steps
exports.DATABASE_URL = 'mongodb://localhost/baby-steps' || process.env.DATABASE_URL || global.DATABASE_URL;

// //connects to the testing database
exports.TEST_DATABASE_URL = 
	// process.env.TEST_DATABASE_URL || 
	'mongodb://localhost/test-baby-steps';

exports.PORT =  8080 || process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
