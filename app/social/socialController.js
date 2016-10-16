// app/social/socialController.js
'use strict';
const Twit = require('twit');

let T = new Twit({
  consumer_key: 'HBTuDkqYixOZeZIP3Uupj6gMB', // assigned to app name cs419_moonwalk
  consumer_secret: 'V11loaak55rQAtzPsyHq4HULEfbGwEzR1ZBQidvJAS5A9xqZn5', // Don't push to public repo!!
  access_token: null,
  access_token_secret: null,
  timeout_ms: 60*1000
});


// Will add prototypes to this.
function socialController () {
}

UserController.prototype = {
  list,
  connectTwitter
};

module.exports = UserController;

// [POST] /connect/twitter
// function connectTwitter (req, res) {
//
// }

// [GET] /social
// function list (req, res) {
//   T.access_token = req.auth.credentials.token;
//   T.access_token_secret = req.auth.credentials.secret;
//
//   const stream = T.stream('statuses/home_timeline');
//
//   stream.on('tweet', function(tweet) {
//     console.log(tweet);
//   })
//
//   let context = null;
//
//   T.get('statuses/home_timeline', function(err, data, response) {
//     context = data;
//   });
//
//   res(data);
// }
