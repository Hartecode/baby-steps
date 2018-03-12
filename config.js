
'use strict';
//connects to the database baby-steps
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/baby-steps';

//connects to the testing database
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-baby-steps';

exports.PORT = process.env.PORT || 8080;