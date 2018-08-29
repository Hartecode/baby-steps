'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const multer  = require('multer');
const path = require('path');

///multers disk storage settings
const storage = multer.diskStorage({ 
	//indicates where the images would be stored
    destination: './public/uploads/photos/',
    filename: (req, file, next) => {
        const dateTimeStamp = Date.now();
        const babyID = req.params.id;
        const userID = req.user.id;
        next(null, `${file.fieldname}-${dateTimeStamp}-${userID}-${babyID}${path.extname(file.originalname)}`);
    }
});

//multer settings
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, next) => {
        let ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return next(new Error('Only images are allowed'));
        }
        next(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
}).single('babypic');


const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
const { Milestone } = require('./models');

const router = express.Router();

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

// **used middleware to parese all inbound json***
router.use(bodyParser.json());


//middleware to make sure post was sent correctly
const postCheck = (req, res) => {
	console.log(req.body);
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
};

//add a new milestone
router.post('/:id', jwtAuth, (req, res) => {
	console.log(req);
	postCheck(req, res);
	

	let {title = '', description = '', date = '', babyID = ''} = req.body;
	console.log(title)
	title = title.trim();
	description = description.trim();
	date = date.trim();
	babyID = babyID.trim();
	let image = null;
	if (req.file != undefined) {
		image = `uploads/photos/${req.file.filename}`;
	}
	console.log(req.body);

	return Milestone.create({
		title,
		description,
		date,
		image: image,
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
router.put('/:id', jwtAuth, (req, res) =>{
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
router.get('/', (req, res) => {
  return Milestone.find()
    .then(miles => res.json(miles.map(mile => mile.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
});

//get baby by userid
router.get('/:id', jwtAuth, (req, res) => {
  const baby = req.params.id;
  Milestone
    .find({ 
      babyID: baby
    })
    .then(miles => res.json(miles.map(mile => mile.serialize())))
    .catch(err => res.status(500).json({message: `Internal server error : ${err}`}));
});

//delete the miles's baby from the database by using the id of the milestone
router.delete('/:id', jwtAuth, (req, res) => {
  console.log(req.params.id);
  Milestone
    .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`You have deleted post id:${req.params.id}`);
        res.status(204).end();
      })
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = { router };