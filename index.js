'use strict';

let server = require('./app/server');

// Launch server.
server.start((err) => {
  if (err) { throw err; }

  console.log('info', 'the magic happens at: ' + server.info.uri);
});
