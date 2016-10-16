// app/social/socialController.js
'use strict';
const Twit = require('twit');


// Will add prototypes to this.
function socialController (db, socialKeys) {
  this.userModel = db.User;
  this.socialModel = db.Social;
}

socialController.prototype = {
  connect,
  connectTwitter
};

module.exports = socialController;

// [GET] /social/connect
function connect (req, res) {

  res.redirect('/social/connect/twitter?id='+ req.query.id)
}

// [GET] /social/connect/twitter
function connectTwitter (req, res) {
  // Once we've made it here, we have all we need.
  var id = req.auth.credentials.query.id;
  //console.log(id);
  this.userModel.findOne({_id: id}).populate('twitterAccount')
  .execAsync()
  .then((user) => {
    if (!user) {
      res("no user found");
      return;
    }

    if (user.twitterAccount) {
      res("You have already connected a twitter account.")
    }

    // Create a new social account mongo object
    let s = new this.socialModel();
    s.provider = req.auth.credentials.provider;
    s.token = req.auth.credentials.token;
    s.secret = req.auth.credentials.secret;
    s.handle = req.auth.credentials.username;

    // Save new object
    s.save((err, social) => {
      if (err) {
        res.badImplementation(err.message);
      }

      // Once succesfully saved, push it to user document.
      user.twitterAccount = social._id;

      // Save user.
      user.save((err, user) => {
        if (err) {
          res.badImplementation(err.message);
        }

        // Return so we can view.
        res(user);
      })

    })

  })
  .catch((err) => {
    res.badImplementation(err.message);
  });

}
