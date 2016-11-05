// app/social/socialController.js
'use strict';
const Twit = require('twit');


// Will add prototypes to this.
function socialController (db, socialKeys) {
  this.userModel = db.User;
  this.socialModel = db.Social;
  this.socialKeys = socialKeys;
}

socialController.prototype = {
  connect,
  connectTwitter,
  list,
  read
};

module.exports = socialController;

// [GET] /social/connect
function connect (req, res) {

  // TODO: update this to work with JWT not with query params
  res.redirect('/social/connect/twitter?id='+ req.query.id)
}

// [GET] /social/feed
function list (req, res) {

  const T = new Twit({
    consumer_key: this.socialKeys.twitter.moonwalkId,
    consumer_secret: this.socialKeys.twitter.moonwalkSecret,
    access_token: '4303311795-NbBXdTQD8jT6bvGn3j5xCUjISl7Wg635QSfYETC',
    access_token_secret: 'N86Rt7iISco9pQ2JydEKvzTgxdCW07lJQRgSqPET6S4vb',
    timeout_ms: 60*1000,
  });

  let stream = T.stream('statuses/sample')

  let tweets = [];

  function stop () {
    stream.stop();
  };

  stream.on('tweet', function (tweet) {
    if (tweet.lang == 'en') {
      tweets.push(JSON.stringify(tweet));
    }
    if (tweets.length == 35) {
      stop();
      res(tweets);
    }
  });


}

// [GET] /social/feed/{id?}
function read (req, res) {

  var T = new Twit({
    consumer_key: this.socialKeys.twitter.moonwalkId,
    consumer_secret: this.socialKeys.twitter.moonwalkSecret,
    access_token: req.auth.credentials.token,
    access_token_secret: req.auth.credentials.secret,
    timeout_ms: 60*1000,
  });

  console.log(req.auth.credentials.token);
  console.log(req.auth.credentials.secret);

  T.get('/statuses/home_timeline', (err, data, response) => {
    if (err) {
      res.badImplementation(err);
    }

    res(data);
  });

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
