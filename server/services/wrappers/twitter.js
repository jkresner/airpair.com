
var wrapper = {

  init() {
    var Twit = require('twit')
    wrapper.api = new Twit(config.auth.twitter)
  },

  postTweet(content, cb) {
    if (config.env != 'production') return cb(null, 'faked')
    wrapper.api.post('statuses/update', {status:content}, (e, r, resp) => {
        if (e) {
          $log(e.message.red, e.twitterReply.white)
          cb(e)
        }
        else
        {
          $log(`TWEET @${r.user.screen_name} ${r.text}`.cyan,
            `https://twitter.com/airpair/status/${r.id_str}`.white)
          cb(null, r.id)
        }
      }
    )
  }

}

module.exports = wrapper
