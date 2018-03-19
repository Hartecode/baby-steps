'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  email: {
    type: String, 
    required: true,
    unique: true
  }
});

const babySchema = mongoose.Schema({
  baby: {
    name: {
      firstName: String,
      middleName: String,
      lastName: String
    },
    dateOfBirth: String,
    sex: String,
    parents: {
      mother: {
        firstName: String,
        middleName: String,
        lastName: String
      },
      father: {
        firstName: String,
        middleName: String,
        lastName: String
      }
    },
    birthCity: String,
    birthWeight: String,
    birthLength: String
  },
  userID: String
});

const milestonesSchema = mongoose.Schema({
        title: String,
        description: String,
        date: String
});



//validates the password
UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

//applying hashes to password
UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};


// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    email: this.email
  };
};

babySchema.methods.serialize = function() {
  return {
    id: this._id,
    baby: {
      name: {
        firstName: this.baby.name.firstName || '',
        middleName: this.baby.name.middleName || '',
        lastName: this.baby.name.lastName || ''
      },
      dateOfBirth: this.baby.dateOfBirth || '',
      sex: this.baby.sex || '',
      parents: {
        mother: {
          firstName: this.baby.parents.mother.firstName || '',
          middleName: this.baby.parents.mother.middleName || '',
          lastName: this.baby.parents.mother.lastName || ''
        },
        father: {
          firstName: this.baby.parents.father.firstName || '',
          middleName: this.baby.parents.father.middleName || '',
          lastName: this.baby.parents.father.lastName || ''
        }
      },
      birthCity: this.baby.birthCity || '',
      birthWeight: this.baby.birthWeight || '',
      birthLength: this.baby.birthLength || ''
    },
    userID: this.userID
  };
};



const User = mongoose.model('User', UserSchema);
const Baby = mongoose.model('Baby', babySchema);
const Milestone = mongoose.model('Milestone', milestonesSchema);

module.exports = {User, Baby, Milestone};

