'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const passport = require('passport');
const multer  = require('multer');
const path = require('path');

///multers disk storage settings
const storage = multer.diskStorage({ 
	//indicates where the images would be stored
    destination: './public/uploads/photos/',
    filename: (req, file, next) => {
        const dateTimeStamp = Date.now();
        const milestoneId = req.params.id;
        //the user id is in the jwtauth middleware.  jwtauth needs to be in order to find the user id
        const userID = req.user.id;
        next(null, `${dateTimeStamp}-${userID}-${milestoneId}${path.extname(file.originalname)}`);
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
	const requiredFields = ['title', 'description', 'date', 'type', 'babyID'];
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

	if (req.body.babyID != baby) {
		return res.status(500).json({
			code: 400,
			reason: 'ValidationError',
			message: 'id must match endpoint',
			location: 'babyID'
		});
	}
};

// uploads a imahe and savs the image name to the selected milestone 
const uploadNewImage = (req, res, milestone) => {
	upload(req, res, (err) => {
		if (err) {
			res.json({err: err});
		} else {
			if (req.file == undefined) {
				res.json({ msg: 'Error: No File Selected'})
			} else {
				milestone.image = req.file.filename;

				milestone.save(function (err, updatedMilestone) {
				    if (err) return handleError(err);
					res.send(updatedMilestone);
					console.log('success');
					console.log(updatedMilestone);
				});
			}
		}
	});
}

//this function finds and removes images from the fielsysten
const removeImgFromSystem = (milestone) => {
	fs.unlink(`./public/uploads/photos/${milestone.image}`, (err) => {
	    if (err) return res.status(404).json({ ErrorMsg: 'Unable to locate the image', SystemErrorMsg: err });

	    console.log('Image deleted!');
	});

}

// add a photo to a milestone
router.post('/upload/img/:id', jwtAuth, (req, res) => {
	const milestoneId = req.params.id;

	Milestone
		.findById(milestoneId)
		.then( (milestone) => {
			if (milestone.image === '' || milestone.image === null || milestone.image === undefined) {
				uploadNewImage(req, res, milestone);
			} else {
				console.log(milestone);
				res.status(417).json({
					ErrorMsg: 'Image already posted. To update please send a put request',
					imageCurrentName: milestone.image
				});
			}
		})
		.catch( err =>  res.status(404).json({ ErrorMsg: 'The ID is incorrect', SystemErrorMsg: err }));
});


//add a new milestone
router.post('/:id', jwtAuth, (req, res) => {
	//run check to make stue there is no errors;
	postCheck(req, res);

	let {title = '', description = '', date = '', type = '', babyID = ''} = req.body;
	
	title = title.trim();
	description = description.trim();
	date = date.trim();
	type = type.trim();
	babyID = babyID.trim();

	return Milestone.create({
		title,
		description,
		date,
		type,
		babyID
	})
	.then(mile => res.status(201).json(mile.serialize()))
	.catch(err => {
    	// Forward validation errors on to the client, otherwise give a 500
    	// error because something unexpected has happened
		if (err.reason === 'ValidationError') return res.status(err.code).json(err);

    	console.log(err);
    	res.status(500).json({code: 500, message: `Internal server error: ${err}`});
    });

});

//this will date the image by removing the old image and then adding a new one
router.put('/upload/img/:id', jwtAuth, (req, res) => {
	const milestoneId = req.params.id;

	Milestone
		.findById(milestoneId)
		.then(milestone => {
			//the image is deleted from the fie system
			removeImgFromSystem(milestone);
			//upload the imge and added the name to the milestone
			uploadNewImage(req, res, milestone);
		})
		.catch( err => res.status(404).json({ErrorMsg: 'The ID is incorrect', SystemErrorMsg: err}));	
});

//update the selected milestone post
router.put('/:id', jwtAuth, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (
			`Request path id (${req.params.id}) and request body id ` +
			`(${req.body.id}) must match`);
    	console.error(message);
    	return res.status(400).json({ message: message });
 	}

	const toUpdate = {};
	const requiredFields = ['id', 'date','title', 'type', 'description'];


	requiredFields.forEach(field => {
    	if (field in req.body) {
      		toUpdate[field] = req.body[field];
    	}
  	});

	Milestone
	    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
	    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
	    .then(() => {
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
router.delete('/:id', jwtAuth, (req, res, next) => {
	const milestoneId = req.params.id;

	Milestone
		.findById(milestoneId)
		.then( milestone => {
			const milestonePost = milestone;
			// console.log(milestonePost);
			milestone
				.remove()
				.then( post => {
					if (post) {
						if (milestonePost.image !== '' || milestonePost.image !== null || milestonePost.image !== undefined) {
							removeImgFromSystem(milestonePost);
						}
						res.status(204).end();
					} else {
						next();
					}
				})
				.catch(next);
		})
		.catch(err =>  res.status(404).json({ ErrorMsg: 'The ID is incorrect' }));
});

module.exports = { router };