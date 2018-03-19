'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User, Baby} = require('./models');

const router = express.Router();

// const jsonParser = bodyParser.json();
router.use(bodyParser.json());

// Post to register a new user
router.post('/', (req, res) => {
  const requiredFields = ['username', 'password', 'email'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName', 'email'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );

  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = '', email = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName,
        email
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

//adding a new baby
router.post('/baby/:id', (req, res) => {
  const requiredFields = ['baby', 'userId'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  let {firstName = '', middleName = '', lastName = '', dateOfBirth = '', sex = '', birthCity = '', birthWeight = '', birthLength = '', userId} = req.body;

  firstName = firstName.trim();
  middleName = middleName.trim();
  lastName = lastName.trim();
  dateOfBirth = dateOfBirth.trim();
  sex = sex.trim();
  birthCity = birthCity.trim();
  birthLength = birthLength.trim();
  birthWeight = birthWeight.trim();

  return Baby.create({
        baby: {
          name: {
            firstName,
            middleName,
            lastName
          },
          dateOfBirth,
          sex,
          Parents: {
            mother: {
              firstName,
              middleName,
              lastName
            },
            father: {
              firstName,
              middleName,
              lastName
            }
          },
          birthCity,
          birthWeight,
          birthLength
        },
        userId
    })
    .then(baby => {
      return res.status(201).json(baby.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: `Internal server error: ${err}`});
    });
});

//update the user***not working
router.put('/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const requiredFields = ['username', 'password','firstName', 'lastName', 'email', 'id'];


  requiredFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  User
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(() => {
      console.log(`Updating user \`${req.params.id}\``);
      res.status(204).end();
    })
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//get all the user
router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//get user by id
router.get('/:id', (req, res) => {
  User
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//get the full list of babies
router.get('/baby', (req, res) => {
  return Baby.find()
    .then(babys => res.json(babys.map(baby => baby.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//delete the user from the database
router.delete('/:id', (req, res) => {
  console.log(req.params.id);
  User
    .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`You have deleted post id:${req.params.id}`);
        res.status(204).end();
      })
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


module.exports = {router};
