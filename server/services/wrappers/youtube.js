var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var youtube = google.youtube('v3');
var _ = require("lodash");

var oauthClients = [];
_.values(config.auth.google.refreshTokens).forEach(function(token){
    var client = new OAuth2Client(config.auth.google.clientID, config.auth.google.clientSecret);
    client.setCredentials({ refresh_token: token})
    oauthClients.push(client);
});

//see details at https://github.com/google/google-api-nodejs-client/blob/master/apis/youtube/v3.js
var fetchVideoInfo = function(clientIndex, id, callback){
  // console.log("fetching video info with oauth index", clientIndex)
  youtube.videos.list({auth:oauthClients[clientIndex], id, part:"snippet"}, function(err, result){
    if (err || result.items.length == 0){
      if(clientIndex < oauthClients.length - 1){
        clientIndex += 1;
        fetchVideoInfo(clientIndex, id, callback);
      } else{
        console.error("all oauth clients failed");
        if (!err && result.items.length == 0){
          callback("No YouTube video found", null);
        } else {
          callback(err, result);
        }
      }
    } else {
      callback(err, result.items[0]);
    }
  });
}

var callFns = {
  getVideoInfo: function(id, cb) {
    fetchVideoInfo(0, id, cb)
  }
};

module.exports = callFns;
