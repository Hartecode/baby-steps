'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
const {Baby} = require('./models');
const {Milestone} = require('../milesotnes');

const router = express.Router();

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

// const jsonParser = bodyParser.json();
router.use(bodyParser.json());

//adding a new baby
router.post('/baby/:id', jwtAuth, (req, res) => {
  const requiredFields = ['firstName', 'middleName','lastName', 'dateOfBirth', 'birthCity','birthWeight', 'birthLength', 'userID'];
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
  let firstName = req.body['firstName'];
  let middleName = req.body['middleName'];
  let lastName = req.body['lastName'];
  let dateOfBirth = req.body.dateOfBirth;
  let birthCity = req.body.birthCity;
  let birthWeight = req.body.birthWeight;
  let birthLength = req.body.birthLength;

  firstName = firstName.trim();
  middleName = middleName.trim();
  lastName = lastName.trim();
  dateOfBirth = dateOfBirth.trim();
  birthCity = birthCity.trim();
  birthLength = birthLength.trim();
  birthWeight = birthWeight.trim();
  userID = userID.trim();

  return Baby.create({
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        birthCity,
        birthWeight,
        birthLength,
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

//update the selcted baby by its id
router.put('/baby/:id', jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const requiredFields = ['id','firstName', 'middleName','lastName', 'dateOfBirth', 'birthCity','birthWeight', 'birthLength'];


  requiredFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Baby
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(() => {
      console.log(`Updating user \`${req.params.id}\``);
      res.status(204).end();
    })
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//get the full list of babies
router.get('/baby',  (req, res) => {
  return Baby.find()
    .then(babys => res.json(babys.map(baby => baby.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
});

//get babys by userid
router.get('/baby/:id', jwtAuth, (req, res) => {
  const user = req.params.id;
  Baby
    .find({ 
      userID: user
    })
    .then(babys => res.json(babys.map(baby => baby.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
});

//get the individal baby by id
router.get('/baby/single/:id', jwtAuth, (req, res) => {
  const id = req.params.id;
  Baby
    .findById(req.params.id)
    .then(baby => res.json(baby.serialize()))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
});

//delete the user's baby from the database
//code works but might want to add the abillity to delete the milesotnes associated with the baby ***
router.delete('/baby/:id', jwtAuth,(req, res) => {
  console.log(req.params.id);

  const babysId = req.params.id;

  
  Milestone
    .remove({ 
        babyID: babysId
    })
    .then(() => {
      console.log(`You have deleted all milestones related to babyID: ${babysId}`);
      Baby
      .findByIdAndRemove(babysId)
      .then(() => {
        console.log(`You have deleted user baby id:${babysId}`);
        res.status(204).end();
      })
      .catch(err => res.status(500).json({ message: `Internal server error: ${err}` }));
    })
    .catch(err => res.status(500).json({ message: `Internal server error: ${err}` }));
});
