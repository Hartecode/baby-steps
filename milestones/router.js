'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');


const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
const { Milestone } = require('./models');

const router = express.Router();

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

// **used middleware to parese all inbound json***
router.use(bodyParser.json());

//add a new milestone
router.post('/milestone/:id', jwtAuth, (req, res) => {
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


//update the selected milestone post
router.put('/milestone/:id', jwtAuth, (req, res) =>{
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const requiredFields = ['id', 'date','title', 'description'];


  requiredFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Milestone
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(() => {
      console.log(`Updating user \`${req.params.id}\``);
      res.status(204).end();
    })
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


//get the full list of milestones
router.get('/milestone', (req, res) => {
  return Milestone.find()
    .then(miles => res.json(miles.map(mile => mile.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
});

//get baby by userid
router.get('/milestone/:id', jwtAuth, (req, res) => {
  const baby = req.params.id;
  Milestone
    .find({ 
      babyID: baby
    })
    .then(miles => res.json(miles.map(mile => mile.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
});

//delete the miles's baby from the database by using the id of the milestone
router.delete('/milestone/:id', jwtAuth, (req, res) => {
  console.log(req.params.id);
  Milestone
    .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`You have deleted post id:${req.params.id}`);
        res.status(204).end();
      })
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
});