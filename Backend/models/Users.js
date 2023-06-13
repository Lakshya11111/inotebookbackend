// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const userSchema = new mongoose.Schema({
//   name:{
//     type: String,
//     required: true
//   },
//   email:{
//     type: String,
//     required: true,
//     unique: true
//   },
//   password:{
//     type: String,
//     required: true
//   },
//   date:{
//     type: Date,
//     default: Date.now
//   }
// });
// module.exports = mongoose.model('users', UserSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
