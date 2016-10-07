'use strict';

const Promise = require('bluebird');
const jwt = require('hapi-auth-jwt2');
const db = require('./database');

exports.register = (server, options, next) => {
  server.register(jwt, registerAuth);

  // register authentication strategy
  function registerAuth (err) {

    if (err) { return next(err); }

    // get key and set validate function, algorithm
    server.auth.strategy('jwt', 'jwt', {
      key: process.env.JWT || 'stubJWT',
      validateFunc: validate,
      verifyOptions: {algorithms: [ 'HS256']}
    });

    // set this strategy to default
    server.auth.default('jwt');

    // move on down middleware stack
    return next();
  }

  // validation function for strategy
  function validate (decoded, request, next) {

    // get the user model
    const User = db.User;

    // find user and validate
    return new Promise((resolve) => {
      User.findAsync({_id: decoded.id})
      .then((user) => {
        if (!user) {
          return next(null, false);
        }

        return next(null, true);
      });
    });
  }
};

exports.register.attributes = {
  name: 'auth-jwt',
  version: '1.0.0'
};
