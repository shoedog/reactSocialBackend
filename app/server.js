'use strict';

const fs = require('fs');
const Hapi = require('hapi');
const boomDecorators = require('hapi-boom-decorators');

// initiate server
const server = new Hapi.Server();

// get our config files
const socialKeys = require('../config/social');
const db = require('./database');
const auth = require('./auth');
const oauth = require('./oauth');
//const logs = require('./logs');


// set up host and port
server.connection({
  port: 5000,
  routes: { cors: true }
});

// register database
if (process.env.NODE_ENV === 'test') {
	server.database = db;
}

// register plugins
const plugins = [];

// other plugins
plugins.push({register: oauth, options: {socialKeys: socialKeys}});
plugins.push({register: auth});
//plugins.push({register: logs});
plugins.push({register: boomDecorators});

// register routes
plugins.push({
	register: require('./user/userRoutes'),
	options: {database: db}
});

plugins.push({
	register: require('./oauth/authRoutes')
});

plugins.push({
  register: require('./social/socialRoutes'),
  options: {database: db, socialKeys: socialKeys}
});


// Use this auth strategy by default.
server.auth.default('jwt');

// up and running
server.register(plugins, (err) => {
	if (err) {
		throw err;
	}

	if (!module.parent) {
		server.start((err) => {
			if (err) {
				throw err;
			}

			server.log('info', 'the magic happens at: ' + server.info.url);
		});
	}
});

module.exports = server;
