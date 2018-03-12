'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  authorizeUser: {
    user: {
      firstName: String,
      lastName: String
    },
    relationship: String,
    email: String,
    password: String
  },
  babys: [String]
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
    Parents: {
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
    birthLength: String,
    milestones: [String]
  }
});

const milestonesSchema = mongoose.Schema({
        title: String,
        description: String,
        date: String
});

userSchema.virtual('userNameString').get(function(){
  return `${this.authorizeUser.user.firstName} ${this.authorizeUser.user.lastName}`.trim();
});

userSchema.virtual('babyNameString').get(function(){
  return `${this.babys.baby.name.firstName} ${this.babys.baby.name.middleName} ${this.babys.baby.name.lastName}`.trim();
});

userSchema.virtual('motherNameString').get(function(){
  return `${this.babys.baby.Parents.mother.firstName} ${this.babys.baby.Parents.mother.middleName} ${this.babys.baby.Parents.mother.lastName}`.trim();
});

userSchema.virtual('fatherNameString').get(function(){
  return `${this.babys.baby.Parents.father.firstName} ${this.babys.baby.Parents.father.middleName} ${this.babys.baby.Parents.father.lastName}`.trim();
});


userSchema.methods.serialize = function() {
  return {
    id: this._id,
    authorizeUser: {
      user: this.userNameString,
      relationship: this.relationship,
      email: this.email,
      password: this.password
    },
    babys: [this.babys]
  };
};

//need to fix the code below***
// babySchema.methods.serialize = function() {
//   return {
//     id: this._id,
//     baby: {
//       name:this.babyNameString,
//       dateOfBirth: this.dateOfBirth,
//       sex: this.sex,
//       parents: {
//         mother: this.motherNameString,
//         father: this.fatherNameString
//       },
//       birthCity: this.birthCity,
//       birthWeight: this.birthWeight,
//       birthLength: this.birthLength,
//       milestones: [this.milestones]
//     };
// };


milestonesSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    date: this.date
  };
};



//this conects to the collection which will be used
const UserInfo = mongoose.model('users', userSchema);

module.exports = {UserInfo};
