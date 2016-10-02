'use strict';

const Promise = require('bluebird');
const db = require('../database');
const bell = require('bell');

exports.register = (server, options, next) => {

  // Call our function to register strategies.
  server.register(bell, registerAuth);

  function registerAuth (err) {
    if (err) { return next(err); }

    server.auth.strategy('twitter', 'bell', {
      provider: 'twitter',
      password: 'moonwalk_encryption_secret_password',
      clientId: 'HBTuDkqYixOZeZIP3Uupj6gMB', // assigned to app name cs419_moonwalk
      clientSecret: 'V11loaak55rQAtzPsyHq4HULEfbGwEzR1ZBQidvJAS5A9xqZn5', // if we ever make this repo public, DELETE THIS
      isSecure: false // So we can test without https
    });
    server.auth.default('twitter');

    return (next);
  }

}

exports.register.attributes = {
  name: 'auth',
  version: '1.0.0'
};
