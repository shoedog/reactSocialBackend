'use strict';

const Hapi = require('hapi');
const boomDecorators = require('hapi-boom-decorators');

// Create server instance.
const server = new Hapi.Server({ debug: { request: ['error'] } });

const db = require('./database');
const auth = require('./auth');


// Keeping cors open since we have front end on separate server.
server.connection({
  port: 8080,
  routes: { cors: true }
});

if (process.env.NODE_ENV === 'test') {
	server.database = db;
}

const plugins = [];

// Register routes.
plugins.push({
	register: require('./auth/authRoutes')
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
