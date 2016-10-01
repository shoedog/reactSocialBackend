'use strict';

const Hapi = require('hapi');
const boomDecorators = require('hapi-boom-decorators');

// Create server instance.
const server = new Hapi.Server();

const db = require('./database');
const auth = require('./auth');

server.connection({
  port: 8080,
  routes: { cors: true }
});

if (process.env.NODE_ENV === 'test') {
	server.database = db;
}

const plugins = [];

// Register user routes.
plugins.push({
	register: require('./user/userRoutes'),
	options: {database: db}
});

plugins.push({register: auth});
plugins.push({register: boomDecorators});

// If no parent, start server.
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
