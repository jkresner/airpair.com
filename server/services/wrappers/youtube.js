
var fetchVideoInfo = function(clientIndex, id, cb){
  // $("fetching video info with oauth index", clientIndex)
  wrapper.api.videos.list({auth:wrapper.oauthClients[clientIndex], id, part:"snippet"}, (e, r) => {
    // $log('videos.list', e, r)
    if (e || r.items.length == 0) {
      if (clientIndex < wrapper.oauthClients.length - 1) {
        //retry with the next client
        fetchVideoInfo(clientIndex+1, id, cb)
      } else {
        // $log("all oauth clients failed".red)
        if (!e && r.items.length == 0){
          cb("No YouTube video found", null)
        } else {
          cb(e, r)
        }
      }
    } else {
      cb(e, r.items[0])
    }
  });
}

var wrapper = {

  init() {
    wrapper.oauthClients        = []
    var google                  = require('googleapis')
    var OAuth2Client            = google.auth.OAuth2
    var {clientID,clientSecret} = config.auth.google

    for (var pair of config.youtube.refreshTokens.split('::'))
    {
      // var email = pair.split(":")[0];
      var refresh_token = pair.split(":")[1];
      var client = new OAuth2Client(clientID, clientSecret)
      client.setCredentials({ refresh_token })
      wrapper.oauthClients.push(client)
    }

    wrapper.api = google.youtube('v3')
  },

  getVideoInfo: function(id, cb) {
    fetchVideoInfo(0, id, cb)
  }

}

module.exports = wrapper
