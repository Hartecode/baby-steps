// 'use strict';
// global.DATABASE_URL = 'mongodb://localhost/test-baby-steps';
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const jwt = require('jsonwebtoken');

// const {app, runServer, closeServer} = require('../server');
// const {Baby} = require('../users');
// const {JWT_SECRET} = require('../config');

// const expect = chai.expect;

// // This let's us make HTTP requests
// // in our tests.
// // see: https://github.com/chaijs/chai-http
// chai.use(chaiHttp);

// describe('User Baby endpoint', function() {
//   const username = 'exampleUser';
//   const firstName = 'Example';
//   const middleName = 'ExampleMiddle'
//   const lastName = 'ExampleLast';
//   const dateOfBirth ='2017-01-01';
//   const birthCity = 'New Example';
//   const birthWeight = '7lb';
//   const birthLength = '20in';
//   const userID = '7468712482197329';

//   const usernameB = 'exampleUserB';
//   const passwordB = 'examplePassB';
//   const firstNameB = 'ExampleB';
//   const lastNameB = 'UserB';
//   const emailB = 'exampleB@example.com';

//   before(function() {
//     return runServer();
//   });

//   after(function() {
//     return closeServer();
//   });

//   beforeEach(function() {});

//   afterEach(function() {
//     return Baby.remove({});
//   });

//   describe('/api/user/baby', function() {

//     describe('POST', function() {
//       it('Should create a new baby', function() {
//         const token = jwt.sign(
//           {
//             firstName,
//             middleName,
//             lastName,
//             dateOfBirth,
//             birthCity,
//             birthWeight,
//             birthLength,
//             userID
//           },
//           JWT_SECRET,
//           {
//             algorithm: 'HS256',
//             subject: username,
//             expiresIn: '7d'
//           }
//         );

//         return chai
//           .request(app)
//           .post('/api/users/baby/:id')
//           .send({
//             firstName,
//             middleName,
//             lastName,
//             dateOfBirth,
//             birthCity,
//             birthWeight,
//             birthLength,
//             userID
//           })
//           .set('Authorization', `Bearer ${token}`)
//           .then(res => {
//             expect(res).to.have.status(201);
//             expect(res.body).to.be.an('object');
//             expect(res.body).to.have.keys(
//               'id',
//               'firstName',
//               'middleName',
//               'lastName',
//               'dateOfBirth',
//               'birthCity',
//               'birthWeight',
//               'birthLength',
//               'userID'
//             );
//             expect(res.body.firstName).to.equal(firstName);
//             expect(res.body.lastName).to.equal(lastName);
//           });
//       });
//     });

//     describe('GET', function() {
//       // it('Should reject requests with no credentials', function() {
//       //   return chai
//       //     .request(app)
//       //     .get(`/api/user/baby/${userID}`)
//       //     .then(() =>
//       //       expect.fail(null, null, 'Request should not succeed')
//       //     )
//       //     .catch(err => {
//       //       if (err instanceof chai.AssertionError) {
//       //         throw err;
//       //       }

//       //       const res = err.response;
//       //       expect(res).to.have.status(401);
//       //     });
//       // });

//       it('Should reject requests with an invalid token', function() {
//         // const token = jwt.sign(
//         //   {
//         //     firstName,
//         //     middleName,
//         //     lastName,
//         //     dateOfBirth,
//         //     birthCity,
//         //     birthWeight,
//         //     birthLength,
//         //     userID
//         //   },
//         //   'wrongSecret',
//         //   {
//         //     algorithm: 'HS256',
//         //     expiresIn: '7d'
//         //   }
//         // );

//         return chai
//           .request(app)
//           .get(`/api/user/baby/${userID}`)
//           .set('Authorization', `Bearer ${token}`)
//           .then(() =>
//             expect.fail(null, null, 'Request should not succeed')
//           )
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(401);
//           });
//       });
//       it('Should reject requests with an expired token', function() {
//         const token = jwt.sign(
//           {
//             firstName,
//             middleName,
//             lastName,
//             dateOfBirth,
//             birthCity,
//             birthWeight,
//             birthLength,
//             userID,
//             exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
//           },
//           JWT_SECRET,
//           {
//             algorithm: 'HS256',
//             subject: username
//           }
//         );

//         return chai
//           .request(app)
//           .get(`/api/user/baby/${userID}`)
//           .set('authorization', `Bearer ${token}`)
//           .then(() =>
//             expect.fail(null, null, 'Request should not succeed')
//           )
//           .catch(err => {
//             if (err instanceof chai.AssertionError) {
//               throw err;
//             }

//             const res = err.response;
//             expect(res).to.have.status(401);
//           });
//       });

//       it('Should send protected data', function() {
//         const token = jwt.sign(
//           {
//             firstName,
//             middleName,
//             lastName,
//             dateOfBirth,
//             birthCity,
//             birthWeight,
//             birthLength,
//             userID
//           },
//           JWT_SECRET,
//           {
//             algorithm: 'HS256',
//             subject: username,
//             expiresIn: '7d'
//           }
//         );

//         return chai
//           .request(app)
//           .get(`/api/user/baby/${userID}`)
//           .set('authorization', `Bearer ${token}`)
//           .then(res => {
//             expect(res).to.have.status(200);
//             expect(res.body).to.be.an('object');
//             expect(res.body.data).to.equal('rosebud');
//           });
//       });

//     });
    
//   });
// });