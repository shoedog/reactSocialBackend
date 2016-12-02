// app/social/socialController.js
'use strict';
const Twit = require('twit');
const sentiment = require('sentiment');


// Will add prototypes to this.
function socialController (db, socialKeys) {
  this.userModel = db.User;
  this.socialModel = db.Social;
  this.socialKeys = socialKeys;
}

socialController.prototype = {
  connect,
  connectTwitter,
  removeTwitter,
  list,
  read,
  post,
  favorite,
  unfavorite,
  retweet,
  unretweet,
  searchStream,
  searchStreamSentiment
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
    consumer_key: 'HBTuDkqYixOZeZIP3Uupj6gMB',
    consumer_secret: 'V11loaak55rQAtzPsyHq4HULEfbGwEzR1ZBQidvJAS5A9xqZn5',
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

  if (!req.auth.credentials.token) {
    list(req, res);
  }

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

// [POST] /social/post
function post (req, res) {
  if (!req.auth.credentials.token) {
    res.badImplementation("No connected twitter account found.");
  }

  var T = new Twit({
    consumer_key: this.socialKeys.twitter.moonwalkId,
    consumer_secret: this.socialKeys.twitter.moonwalkSecret,
    access_token: req.auth.credentials.token,
    access_token_secret: req.auth.credentials.secret,
    timeout_ms: 60*1000,
  });

  console.log(req.auth.credentials.token);
  console.log(req.auth.credentials.secret);

  T.post('statuses/update', { status: req.payload.text }, function(err, data, response) {
    console.log(data, response);
    if (err) {
      res(err.message);
    }
    res(response.statusCode);
  });
}

// [POST] /social/favorite/{id}
function favorite (req, res) {
  if (!req.auth.credentials.token) {
    res.badImplementation("No connected twitter account found.");
  }

  var T = new Twit({
    consumer_key: this.socialKeys.twitter.moonwalkId,
    consumer_secret: this.socialKeys.twitter.moonwalkSecret,
    access_token: req.auth.credentials.token,
    access_token_secret: req.auth.credentials.secret,
    timeout_ms: 60*1000,
  });

  console.log(req.auth.credentials.token);
  console.log(req.auth.credentials.secret);
  console.log(req.params.tweetId);

  T.post('favorites/create', { id: req.params.tweetId }, function(err, data, response) {
    // console.log(data, response);
    if (err) {
      res(err.message);
    }
    res(response.statusCode);
  });
}

// [POST] /social/unfavorite/{id}
function unfavorite (req, res) {
  if (!req.auth.credentials.token) {
    res.badImplementation("No connected twitter account found.");
  }

  var T = new Twit({
    consumer_key: this.socialKeys.twitter.moonwalkId,
    consumer_secret: this.socialKeys.twitter.moonwalkSecret,
    access_token: req.auth.credentials.token,
    access_token_secret: req.auth.credentials.secret,
    timeout_ms: 60*1000,
  });

  console.log(req.auth.credentials.token);
  console.log(req.auth.credentials.secret);
  console.log(req.params.tweetId);

  T.post('favorites/destroy', { id: req.params.tweetId }, function(err, data, response) {
    // console.log(data, response);
    if (err) {
      res(err.message);
    }
    res(response.statusCode);
  });
}

// [POST] /social/retweet/{id}
function retweet (req, res) {
  if (!req.auth.credentials.token) {
    res.badImplementation("No connected twitter account found.");
  }

  var T = new Twit({
    consumer_key: this.socialKeys.twitter.moonwalkId,
    consumer_secret: this.socialKeys.twitter.moonwalkSecret,
    access_token: req.auth.credentials.token,
    access_token_secret: req.auth.credentials.secret,
    timeout_ms: 60*1000,
  });

  console.log(req.auth.credentials.token);
  console.log(req.auth.credentials.secret);
  console.log(req.params.tweetId);

  T.post(`statuses/retweet/${req.params.tweetId}`, function(err, data, response) {
    // console.log(data, response);
    if (err) {
      res(err.message);
    }
    res(response.statusCode);
  });
}

// [POST] /social/unretweet/{id}
function unretweet (req, res) {
  if (!req.auth.credentials.token) {
    res.badImplementation("No connected twitter account found.");
  }

  var T = new Twit({
    consumer_key: this.socialKeys.twitter.moonwalkId,
    consumer_secret: this.socialKeys.twitter.moonwalkSecret,
    access_token: req.auth.credentials.token,
    access_token_secret: req.auth.credentials.secret,
    timeout_ms: 60*1000,
  });

  console.log(req.auth.credentials.token);
  console.log(req.auth.credentials.secret);
  console.log(req.params.tweetId);

  T.post(`statuses/unretweet/${req.params.tweetId}`, function(err, data, response) {
    // console.log(data, response);
    if (err) {
      res(err.message);
    }
    res(response.statusCode);
  });
}

// [POST] /social/remove/twitter/{id?}
function removeTwitter (req, res) {
  const id =  req.query.id;
  this.userModel.findOne({_id: id}).populate('twitterAccount')
  .execAsync()
  .then((user) => {
    if (!user) {
      res("Error, no user");
    }

    if (user.twitterAccount) {
      this.socialModel.findOne({_id: user.twitterAccount._id})
      .remove()
      .execAsync()
      .then((success) => {
        // remove twitter reference from user doc
        user.twitterAccount = {};
        // update user document
        user.save((err, user) => {
          if (err) {
            res.badImplementation(err.message);
          }

          // Return so we can view.
          res(user);
        });
      })
      .catch((err) => {
        res({error: err})
      })
    } else {
      res({error: "no twitter account"})
    }

  });
}

// [GET] /social/connect/twitter/{id?}
function connectTwitter (req, res) {
  // Once we've made it here, we have all we need.
  var id = req.auth.credentials.query.id;
  console.log(req.auth.credentials);
  this.userModel.findOne({_id: id}).populate('twitterAccount')
  .execAsync()
  .then((user) => {
    if (!user) {
      res("no user found");
    }

    if (user.twitterAccount) {
      res("You have already connected a twitter account.").redirect(`http://localhost:3000/profile?twitter=${user.twitterAccount.handle}`)
    }

    // Create a new social account mongo object
    let s = new this.socialModel();
    s.provider = req.auth.credentials.provider;
    s.token = req.auth.credentials.token;
    s.secret = req.auth.credentials.secret;
    s.handle = req.auth.credentials.profile.username;
    s.pic = req.auth.credentials.profile.raw.profile_image_url;

    // Save new object
    s.save((err, social) => {
      if (err) {
        res.badImplementation(err.message);
      }

      // Once succesfully saved, push it to user document.
      user.twitterAccount = social._id;
      user.profilePic = req.auth.credentials.profile.raw.profile_image_url;

      // Save user.
      user.save((err, user) => {
        if (err) {
          res.badImplementation(err.message);
        }

        // Return so we can view.
        res(user).redirect(`http://localhost:3000/profile?twitter=${req.auth.credentials.profile.username}`)
      })

    })

  })
  .catch((err) => {
    res.badImplementation(err.message);
  });

}

// [GET] /social/sentiment/{keyword}
function searchStreamSentiment (req, res) {

  console.log(req.params.keyword);

  const T = new Twit({
    consumer_key: 'HBTuDkqYixOZeZIP3Uupj6gMB',
    consumer_secret: 'V11loaak55rQAtzPsyHq4HULEfbGwEzR1ZBQidvJAS5A9xqZn5',
    access_token: '4303311795-NbBXdTQD8jT6bvGn3j5xCUjISl7Wg635QSfYETC',
    access_token_secret: 'N86Rt7iISco9pQ2JydEKvzTgxdCW07lJQRgSqPET6S4vb',
    timeout_ms: 60*1000,
  });

  let stream = T.stream('statuses/filter', { track: req.params.keyword });
  let tweets = [];
  let totalScore = 0;
  let minScore = 0;
  let highScore = 0;

  function stop () {
    stream.stop();
  };

  stream.on('tweet', function (tweet) {

    const score = sentiment(tweet.text);
    console.log(score.score);
    totalScore += score.score;
    if (score.score > highScore) {
      highScore = score.score;
    }

    if (score.score < minScore) {
      minScore = score.score;
    }

    if (tweet.lang == 'en') {
      tweets.push(JSON.stringify(tweet));
    }
    if (tweets.length == 20) {
      stop();
      console.log("overall sentiment: ", totalScore);
      const payload = { overall: totalScore, polar: Math.abs(highScore - minScore), tweets: tweets };
      res(payload);
    }
  });
}

// [GET] /social/stream/{keyword}
function searchStream (req, res) {

  console.log(req.params.keyword);

  const T = new Twit({
    consumer_key: 'HBTuDkqYixOZeZIP3Uupj6gMB',
    consumer_secret: 'V11loaak55rQAtzPsyHq4HULEfbGwEzR1ZBQidvJAS5A9xqZn5',
    access_token: '4303311795-NbBXdTQD8jT6bvGn3j5xCUjISl7Wg635QSfYETC',
    access_token_secret: 'N86Rt7iISco9pQ2JydEKvzTgxdCW07lJQRgSqPET6S4vb',
    timeout_ms: 60*1000,
  });

  let stream = T.stream('statuses/filter', { track: req.params.keyword });
  let tweets = [];

  function stop () {
    stream.stop();
  };

  stream.on('tweet', function (tweet) {

    if (tweet.lang == 'en') {
      tweets.push(JSON.stringify(tweet));
    }
    if (tweets.length == 20) {
      stop();
      
      const payload = {  tweets: tweets };
      res(payload);
    }
  });
}
