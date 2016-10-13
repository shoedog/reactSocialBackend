'use strict';

const fs = require('fs');
const Hapi = require('hapi');
const boomDecorators = require('hapi-boom-decorators');

// initiate server
const server = new Hapi.Server();

// get our config files
const db = require('./database');
const auth = require('./auth');
const oauth = require('./oauth');
//const logs = require('./logs');


// set up host and port
server.connection({
  host: 'localhost',
  port: 5000,
  routes: { cors: true }
});

// register database
if (process.env.NODE_ENV === 'test') {
	server.database = db;
}

// register routes
const plugins = [];

plugins.push({
	register: require('./user/userRoutes'),
	options: {database: db}
});

plugins.push({
	register: require('./oauth/authRoutes')
});

// other plugins
plugins.push({register: oauth});
plugins.push({register: auth});
//plugins.push({register: logs});
plugins.push({register: boomDecorators});

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
