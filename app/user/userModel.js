// app/user/userModel
'use strict';

const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SALT_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 6,
    LOCKOUT_TIME = 60 * 50 * 1000; // 1 hour

var UserSchema = new Schema({

  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  displayName: {
    type: String,
    unique: "Username already exists",
    required: 'Please provide a username.',
    trim: true
  },
  username: {
    type: String,
    unique: 'Username already exists',
    required: 'Please provide a username.',
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryCode: {
    type: String,
    unique: true,
    default: shortid.generate
  },

  twitterAccount: {type : Schema.Types.ObjectId, ref : 'Social'},

  loginAttempts: { type: Number, required: true, default: 0},

  lockUntil: {type: Number}
});

// hook to hash password before saving document
UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  user.password = user.generateHash(user.password);

  return next();

});

// enum for failed login
UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    WRONG_PASSWORD: 1,
    MAX_ATTEMPTS: 2
}

// same as for saving
UserSchema.pre('findOneAndUpdate', function () {
  const password = generateHash(this.getUpdate().$set.password);

  if (!password) {
    return;
  }

  this.findOneAndUpdate({}, {password: password, email: email});
});

// validate password
UserSchema.methods.validatePassword = function (requestPassword) {
  return bcrypt.compareSync(requestPassword, this.password);
};

// method to hash password
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR), null);
};

// generate hash or return false if no pw provided
function generateHash(password) {
  if (!password) {
    return false;
  }
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR), null);
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
