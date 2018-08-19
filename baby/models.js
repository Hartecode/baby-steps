'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

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

const Baby = mongoose.model('Baby', babySchema);

module.exports = {Baby};
