// app/user/userSchema.js
'use strict';

const Joi = require('joi');

const UserValidator = {
  list,
  read,
  create,
  login,
  update,
  destroy
}

module.exports = UserValidator;

function list () {
  return {};
}

function read () {
  return {
    params: {
      username: Joi
        .string()
        .alphanum()
        .required()
    }
  };
}

function create () {
  return {
    payload: {
      username: Joi
        .string()
        .min(1)
        .max(20)
        .trim()
        .required(),
      email: Joi
        .string()
        .email(),
      password: Joi
        .string()
        .min(6)
        .max(50)
        .trim()
        .required()
    }
  };
}

function login () {
  return {
    payload: {
      username: Joi
        .string()
        .required(),
      password: Joi
        .string()
        .trim()
        .required()
    }
  };
}

function update () {
  return {
    params: {
      id: Joi
        .string()
        .alphanum()
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i, '_id')
        .required()
    },
    payload: {
      name: Joi
        .string()
        .min(1)
        .max(30)
        .trim()
        .optional(),
      username: Joi
        .string()
        .min(1)
        .max(20)
        .trim()
        .optional(),
      email: Joi
        .string()
        .email()
        .optional(),
      password: Joi
        .string()
        .min(6)
        .max(50)
        .trim()
        .optional()
    }
  };
}

function destroy () {
  return {
    params: {
      id: Joi
        .string()
        .alphanum()
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i, '_id')
        .required()
    }
  };
}
