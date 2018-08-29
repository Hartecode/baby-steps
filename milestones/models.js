'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const milestonesSchema = mongoose.Schema({
    title: String,
    description: String,
    date: String,
    image: String,
    babyID: String
});



milestonesSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title || '',
    description: this.description || '',
    date: this.date || '',
    image: this.image || '',
    babyID: this.babyID
  }
}

const Milestone = mongoose.model('Milestone', milestonesSchema);

module.exports = {Milestone};
