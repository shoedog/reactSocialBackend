// app/user/socialSchema.js
'use strict';

const Joi = require('joi');

const SocialValidator = {
  post
}

module.exports = SocialValidator;

function post () {
  return {
    payload: {
      text: Joi
        .string()
        .min(1)
        .max(140)
        .trim()
        .required(),
    }
  };
}
