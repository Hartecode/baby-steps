const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const bodyParser = require('body-parser');


const {UserInfo} = require('./models');

router.use(bodyParser.json());

//get posts
router.get('/',(req, res) =>{
	UserInfo
		.find()
		.then(user => {
			res.json(users.map(user => user.serialize()));
		})
		.catch( err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error'});
		});
});

//can also request by ID
router.get('/:id', (req, res) => {
  UserInfo
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//add a new user 
router.post('/', (req, res) => {
	const requiredfeild = ['authorizeUser','babys'];
	//check if the right keys are in the request
	console.log(res.body);
	for(let i = 0; i < requiredfeild.lenght; i++){
		const feild = requiredfeild[i];
		if(!(feild in req.body)){
			const message = `Missing \`${feild}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	UserInfo
	    .create({
	      authorizeUser: {
          user: {
            firstName: req.body.authorizeUser.user.firstName,
            lastName: req.body.authorizeUser.user.lastName
          },
          relationship: req.body.authorizeUser.relationship,
          email: req.body.authorizeUser.email,
          password: req.body.authorizeUser.password
        },
	      babys: []
	    })
	    .then(post => res.status(201).json(post.serialize()))
	    .catch(err => {
	      console.error(err);
	      res.status(500).json({ message: 'Internal server error' });
    });
});

//this updates a blog item
// router.put('/:id', (req, res) => {
//   // ensure that the id in the request path and the one in request body match
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     const message = (
//       `Request path id (${req.params.id}) and request body id ` +
//       `(${req.body.id}) must match`);
//     console.error(message);
//     return res.status(400).json({ message: message });
//   }

//   // we only support a subset of fields being updateable.
//   // if the user sent over any of the updatableFields, we udpate those values
//   // in document
//   const toUpdate = {};
//   const requiredfeild = ['title','content', 'author', 'id'];

//   requiredfeild.forEach(field => {
//     if (field in req.body) {
//       toUpdate[field] = req.body[field];
//     }
//   });

//   BlogPosts
//     // all key/value pairs in toUpdate will be updated -- that's what `$set` does
//     .findByIdAndUpdate(req.params.id, { $set: toUpdate })
//     .then(() => {
//     	console.log(`Updating blog item \`${req.params.id}\``);
//     	res.status(204).end();
//     })
//     .catch(err => res.status(500).json({ message: 'Internal server error' }));
// });

//this will delete a selcted item
// router.delete('/:id', (req, res) => {
// 	console.log(req.params.id);
// 	BlogPosts
// 		.findByIdAndRemove(req.params.id)
//     	.then(() => {
//     		console.log(`You have deleted post id:${req.params.id}`);
//     		res.status(204).end();
//     	})
//     	.catch(err => res.status(500).json({ message: 'Internal server error' }));
// });


module.exports = router;