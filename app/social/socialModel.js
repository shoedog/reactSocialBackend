// app/social/socialModel.js
'use strict';

const mongoose = require('mongoose');

var socialSchema = new mongoose.Schema({

  provider: {
    type: String
  },
  token: {
    type: String
  },
  secret: {
    type: String
  },
  handle: {
    type: String
  }

});

const socialModel = mongoose.model('Social', socialSchema);

module.exports = socialModel;
