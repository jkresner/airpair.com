var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var youtube = google.youtube('v3');

var auth = new OAuth2Client(config.auth.google.clientID, config.auth.google.clientSecret);
var refreshToken = config.auth.google.refreshTokens[config.youtube.email];


//see details at https://github.com/google/google-api-nodejs-client/blob/master/apis/youtube/v3.js
auth.setCredentials({ refresh_token: refreshToken});

var callFns = {
  getVideoInfo(id, cb) {
    youtube.videos.list({auth, id, part:"snippet"}, function(err, results){
      if (results && results.items){
        var info = results.items[0].snippet;
      }
      cb(err, info);
    })
  }
}

module.exports = callFns;
