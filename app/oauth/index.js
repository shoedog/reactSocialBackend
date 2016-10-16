// app/oauth/index.js
'use strict';

const Promise = require('bluebird');
const db = require('../database');
const bell = require('bell');

exports.register = (server, options, next) => {

  console.log(options);

  // Call our function to register strategies.
  server.register(bell, registerAuth);

  function registerAuth (err) {
    if (err) { return next(err); }

    server.auth.strategy('twitter', 'bell', {
      provider: 'twitter',
      password: 'moonwalk_encryption_secret_password',
      clientId: options.socialKeys.twitter.moonwalkId,
      clientSecret: options.socialKeys.twitter.moonwalkSecret,
      isSecure: false // So we can test without https
    });

    return next();
  }

}

exports.register.attributes = {
  name: 'twitter',
  version: '1.0.0'
};
