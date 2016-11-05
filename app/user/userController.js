// app/user/userController.js
'use strict';

const jwt = require('jsonwebtoken');

function UserController (db) {
  this.database = db;
  this.model = db.User;
}

UserController.prototype = {
  list,
  read,
  create,
  login,
  update,
  destroy
};


module.exports = UserController;

// [GET] /user
function list (req, res) {
  this.model.findAsync({})
  .then((users) => {
    res(users);
  })
  .catch((err) => {
    res.badImplementation(err.message);
  });
}

// [GET] /user/{username}
function read (req, res) {
  console.log(req.auth.credentials);
  this.model.findOneAsync({username: req.params.username.toLowerCase()})
  .then((user) => {
    if (!user) {
      res("no user found");
      return;
    }
    res(user);
  })
  .catch((err) => {
    res.badImplementation(err.message);
  });
}


// [POST] /user
function create (req, res) {
  console.log(req.payload.username);
  req.payload.displayName = req.payload.username; // displayName keeps the uppercase chars
  this.model.createAsync(req.payload)
  .then((user) => {
    const token = getToken(user._id);
    user.password = null;

    res({
      token: token,
      user: user
    }).code(201);
  })
  .catch((err) => {
    if (err.code === 11000 || err.code === 11001) {
        res.forbidden("username already taken.");
    } else {
      res.forbidden(getErrorMessageFrom(err)); // http 403
    }
  });
}

// [POST] /user/login
function login (request, reply) {
  const credentials = request.payload;

  this.model.findOneAsync({username: credentials.username})
  .then((user) => {

      // Do not specify which was incorrect (more secure this way)
      if (!user) {
        return reply.unauthorized('Username or password invalid.');
      }

      if (!user.validatePassword(credentials.password)) {
        return reply.unauthorized('Email or password invalid.');
      }

      const token = getToken(user.id);
      user.password = null;

      reply({
        token: token,
        user: user
      });
  })
  .catch((err) => {
    reply.badImplementation(err.message);
  });
}

// [PUT] /user
function update (request, reply) {
  const id = request.params.id;
  const payload = request.payload;

  this.model.findOneAndUpdateAsync({_id: id}, {$set: payload}, {new: true})
  .then((user) => {
    user.password = null;
    reply(user);
  })
  .catch((err) => {
    reply.badImplementation(err.message);
  });
}

// [DELETE] /user
function destroy (request, reply) {
  const id = request.params.id;

  this.model.removeAsync({_id: id})
  .then(() => {
    reply("user removed.");
  })
  .catch((err) => {
    reply.badImplementation(err.message);
  });
}

function getToken (id) {
  const secretKey = process.env.JWT || 'stubJWT';

  return jwt.sign({
    id: id
  }, secretKey, {expiresIn: '18h'});
}
