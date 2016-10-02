// app/database.js
'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

const db = {}

// Connect to mongo
const dbConfig = require('../config/database.js');
mongoose.connect(dbConfig.url);

db['database'] = mongoose.connection;
db['database'].on('connected', onDatabaseConnect);
db['database'].on('disconnected', onDatabaseDisconnect);
db['database'].on('error', onDatabaseError);

module.exports = db;

function onDatabaseConnect () {
  console.log('Database connected!');
}

function onDatabaseDisconnect () {
  console.log('Lost connection to database.');
}

function onDatabaseError (err) {
  console.log('Error connecting to database: ' + err);
}

// which db to use
function getDatabaseURI () {
  return process.env.NODE_ENV === 'test' ? process.env.DB_TEST_URI : process.env.DB_URI;
}
