'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');


const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
const {User, Baby, Milestone} = require('./models');

const router = express.Router();

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

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
router.post('/baby/:id', jwtAuth, (req, res) => {
  const requiredFields = ['baby', 'userID'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const user = req.params.id;

  if(req.body.userID != user) {
    return res.status(500).json({
      code: 400,
      reason: 'ValidationError',
      message: 'id must match endpoint',
      location: 'userID'
    });
  }

  let userID = req.body.userID;
  let firstName = req.body['baby']['name']['firstName'];
  let middleName = req.body['baby']['name']['middleName'];
  let lastName = req.body['baby']['name']['lastName'];
  let dateOfBirth = req.body.baby.dateOfBirth;
  let sex = req.body.baby.sex;
  let motherFirstName = req.body['baby']['parents']['mother']['motherFirstName'];
  let motherMiddleName = req.body['baby']['parents']['mother']['motherMiddleName'];
  let motherLastName = req.body['baby']['parents']['mother']['motherLastName'];
  let fatherFirstName = req.body['baby']['parents']['father']['fatherFirstName'];
  let fatherMiddleName = req.body['baby']['parents']['father']['fatherMiddleName'];
  let fatherLastName = req.body['baby']['parents']['father']['fatherLastName'];
  let birthCity = req.body.baby.birthCity;
  let birthWeight = req.body.baby.birthWeight;
  let birthLength = req.body.baby.birthLength;

  firstName = firstName.trim();
  middleName = middleName.trim();
  lastName = lastName.trim();
  dateOfBirth = dateOfBirth.trim();
  sex = sex.trim();
  birthCity = birthCity.trim();
  birthLength = birthLength.trim();
  birthWeight = birthWeight.trim();
  userID = userID.trim();

  return Baby.create({
        baby: {
          name: {
            firstName,
            middleName,
            lastName
          },
          dateOfBirth,
          sex,
          parents: {
            mother: {
              motherFirstName,
              motherMiddleName,
              motherLastName
            },
            father: {
              fatherFirstName,
              fatherMiddleName,
              fatherLastName
            }
          },
          birthCity,
          birthWeight,
          birthLength
        },
        userID
    })
    .then(babys => {
      console.log(babys);
      return res.status(201).json(babys.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      console.log(err);
      res.status(500).json({code: 500, message: `Internal server error: ${err}`});
    });
});

//add a new milestone
router.post('/milestone/:id', (req, res) => {
  const requiredFields = ['title', 'description', 'date', 'babyID'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const baby = req.params.id;

  if(req.body.babyID != baby) {
    return res.status(500).json({
      code: 400,
      reason: 'ValidationError',
      message: 'id must match endpoint',
      location: 'babyID'
    });
  }

  let {title = '', description = '', date = '', babyID = ''} = req.body;

  title = title.trim();
  description = description.trim();
  date = date.trim();
  babyID = babyID.trim();


  return Milestone.create({
    title,
    description,
    date,
    babyID
  })
  .then(mile => res.status(201).json(mile.serialize()))
  .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      console.log(err);
      res.status(500).json({code: 500, message: `Internal server error: ${err}`});
    });

});

//update the user***not working
// router.put('/:id', (req, res) => {
//   // ensure that the id in the request path and the one in request body match
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     const message = (
//       `Request path id (${req.params.id}) and request body id ` +
//       `(${req.body.id}) must match`);
//     console.error(message);
//     return res.status(400).json({ message: message });
//   }

//   const toUpdate = {};
//   const requiredFields = ['username', 'password','firstName', 'lastName', 'email', 'id'];


//   requiredFields.forEach(field => {
//     if (field in req.body) {
//       toUpdate[field] = req.body[field];
//     }
//   });

//   User
//     // all key/value pairs in toUpdate will be updated -- that's what `$set` does
//     .findByIdAndUpdate(req.params.id, { $set: toUpdate })
//     .then(() => {
//       console.log(`Updating user \`${req.params.id}\``);
//       res.status(204).end();
//     })
//     .catch(err => res.status(500).json({ message: 'Internal server error' }));
// });

//get all the user
router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error: ${err}`}));
});

//get the full list of babies
router.get('/baby',  (req, res) => {
  return Baby.find()
    .then(babys => res.json(babys.map(baby => baby.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
});

//get baby by userid
router.get('/baby/:id', jwtAuth, (req, res) => {
  const user = req.params.id;
  Baby
    .find({ 
      userID: user
    })
    .then(babys => res.json(babys.map(baby => baby.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
});

//get the full list of milestones
router.get('/milestone', (req, res) => {
  return Milestone.find()
    .then(miles => res.json(miles.map(mile => mile.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
});

//get baby by userid
router.get('/milestone/:id', (req, res) => {
  const baby = req.params.id;
  Milestone
    .find({ 
      babyID: baby
    })
    .then(miles => res.json(miles.map(mile => mile.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
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
      res.status(500).json({ message: `Internal server error: ${err}` });
    });
});


//delete the user's baby from the database
//code works but might want to add the abillity to delete the milesotnes associated with the baby ***
router.delete('/baby/:id', (req, res) => {
  console.log(req.params.id);

  const babysId = req.params.id;

  Baby
    .findByIdAndRemove(babysId)
    .then(() => {
      console.log(`You have deleted user baby id:${babysId}`);
      res.status(204).end();
    })
    .catch(err => res.status(500).json({ message: `Internal server error: ${err}` }));

    // .then(() => {
    //   Milestone
    //   .findAllAndRemove({ 
    //     babyID: babysId
    //   });
    // })
  
});

//delete the miles's baby from the database by using the id of the milestone
router.delete('/milestone/:id', (req, res) => {
  console.log(req.params.id);
  Milestone
    .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`You have deleted post id:${req.params.id}`);
        res.status(204).end();
      })
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
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
