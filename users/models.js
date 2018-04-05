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
  firstName: String,
  middleName: String,
  lastName: String,
  dateOfBirth: String,
  birthCity: String,
  birthWeight: String,
  birthLength: String,
  userID: String
});

const milestonesSchema = mongoose.Schema({
    title: String,
    description: String,
    date: String,
    babyID: String
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
    firstName: this.firstName || '',
    middleName: this.middleName || '',
    lastName: this.lastName || '',
    dateOfBirth: this.dateOfBirth || '',
    birthCity: this.birthCity || '',
    birthWeight: this.birthWeight || '',
    birthLength: this.birthLength || '',
    userID: this.userID
  };
};

milestonesSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title || '',
    description: this.description || '',
    date: this.date || '',
    babyID: this.babyID
  }
}


const User = mongoose.model('User', UserSchema);
const Baby = mongoose.model('Baby', babySchema);
const Milestone = mongoose.model('Milestone', milestonesSchema);

module.exports = {User, Baby, Milestone};

